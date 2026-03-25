import { z } from 'zod';

// Zod schema for real-time invoice validation
export const clienteSnapshotSchema = z.object({
  ragione_sociale: z.string().min(1, 'Ragione sociale obbligatoria'),
  partita_iva: z.string().optional().refine(
    v => !v || /^[0-9]{11}$/.test(v) || /^[A-Z]{2}[0-9A-Z]{2,28}$/.test(v),
    'Formato P.IVA non valido (11 cifre per IT, o formato UE)'
  ),
  codice_fiscale: z.string().optional().refine(
    v => !v || /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i.test(v) || /^[0-9]{11}$/.test(v),
    'Formato Codice Fiscale non valido'
  ),
  codice_sdi: z.string().optional(),
  pec: z.string().optional().refine(
    v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    'Formato PEC non valido'
  ),
  tipo_cliente: z.enum(['B2B', 'B2C', 'PA', 'Estero']),
}).refine(
  d => d.tipo_cliente !== 'B2B' || d.partita_iva || d.codice_fiscale,
  { message: 'P.IVA o Codice Fiscale obbligatorio per B2B', path: ['partita_iva'] }
).refine(
  d => d.tipo_cliente !== 'PA' || d.codice_sdi,
  { message: 'Codice SDI obbligatorio per PA', path: ['codice_sdi'] }
);

export const rigaDocumentoSchema = z.object({
  id: z.string(),
  numero_linea: z.number(),
  descrizione: z.string().min(1, 'Descrizione obbligatoria'),
  quantita: z.number().min(0.001, 'Quantità deve essere > 0'),
  prezzo_unitario: z.number().min(0, 'Prezzo deve essere ≥ 0'),
  aliquota_iva: z.string(),
  natura_iva: z.string().optional(),
  imponibile: z.number(),
}).refine(
  d => !(d.aliquota_iva === '0' && !d.natura_iva),
  { message: 'IVA 0% richiede natura IVA', path: ['natura_iva'] }
);

export const fatturaSchema = z.object({
  cliente: clienteSnapshotSchema.optional(),
  righe: z.array(rigaDocumentoSchema).min(1, 'Almeno una riga richiesta'),
  numero: z.string().min(1, 'Numero documento obbligatorio'),
  dataEmissione: z.date(),
  dataScadenza: z.date(),
  cig: z.string().optional(),
  tipoCliente: z.string().optional(),
}).refine(
  d => !(d.tipoCliente === 'PA' && (!d.cig || d.cig.trim() === '')),
  { message: 'CIG obbligatorio per Pubblica Amministrazione', path: ['cig'] }
).refine(
  d => d.dataScadenza >= d.dataEmissione,
  { message: 'Data scadenza deve essere ≥ data emissione', path: ['dataScadenza'] }
);

export interface ValidationError {
  campo: string;
  messaggio: string;
  sezione: 'cliente' | 'documento' | 'righe' | 'pagamento' | 'riferimenti';
}

export function validaFatturaRealtime(data: {
  cliente?: Record<string, unknown> | null;
  righe: Array<Record<string, unknown>>;
  numero: string;
  dataEmissione: Date;
  dataScadenza: Date;
  cig?: string;
  scadenze?: Array<{ importo: number }>;
  totaleDaPagare?: number;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  // Client validation
  if (!data.cliente) {
    errors.push({ campo: 'cliente', messaggio: 'Cliente non selezionato', sezione: 'cliente' });
  } else {
    const clienteResult = clienteSnapshotSchema.safeParse(data.cliente);
    if (!clienteResult.success) {
      for (const issue of clienteResult.error.issues) {
        errors.push({
          campo: `cliente.${issue.path.join('.')}`,
          messaggio: issue.message,
          sezione: 'cliente',
        });
      }
    }
  }

  // Rows validation
  if (data.righe.length === 0) {
    errors.push({ campo: 'righe', messaggio: 'Nessuna riga inserita', sezione: 'righe' });
  } else {
    data.righe.forEach((r, i) => {
      const result = rigaDocumentoSchema.safeParse(r);
      if (!result.success) {
        for (const issue of result.error.issues) {
          errors.push({
            campo: `riga_${i + 1}.${issue.path.join('.')}`,
            messaggio: `Riga ${i + 1}: ${issue.message}`,
            sezione: 'righe',
          });
        }
      }
    });
  }

  // Date validation
  if (data.dataScadenza < data.dataEmissione) {
    errors.push({ campo: 'dataScadenza', messaggio: 'Data scadenza precedente alla data emissione', sezione: 'documento' });
  }

  // PA CIG
  const tipoCliente = (data.cliente as any)?.tipo_cliente;
  if (tipoCliente === 'PA' && (!data.cig || data.cig.trim() === '')) {
    errors.push({ campo: 'cig', messaggio: 'CIG obbligatorio per PA', sezione: 'riferimenti' });
  }

  // Scadenze match
  if (data.scadenze && data.scadenze.length > 0 && data.totaleDaPagare) {
    const totScadenze = data.scadenze.reduce((s, r) => s + r.importo, 0);
    if (Math.abs(totScadenze - data.totaleDaPagare) > 0.01) {
      errors.push({
        campo: 'scadenze',
        messaggio: `Totale rate (€${totScadenze.toFixed(2)}) ≠ Totale (€${data.totaleDaPagare.toFixed(2)})`,
        sezione: 'pagamento',
      });
    }
  }

  return errors;
}
