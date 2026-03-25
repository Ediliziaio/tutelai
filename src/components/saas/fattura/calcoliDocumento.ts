import type { RigaDocumento, RiepilogoIVA, CodiceNaturaIVA, CodiceEsigibilitaIVA } from '@/types/fatturazione';

// ============================================================
// UTILITY
// ============================================================
export const round2 = (n: number) => Math.round(n * 100) / 100;

export function formatEuro(n: number) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n);
}

// ============================================================
// CALCOLO SINGOLA RIGA
// ============================================================
export function calcolaRiga(riga: Partial<RigaDocumento>): RigaDocumento {
  const quantita = riga.quantita ?? 1;
  const prezzo_unitario = riga.prezzo_unitario ?? 0;
  const sconto_percentuale = riga.sconto_percentuale ?? 0;
  const sconto_valore_input = riga.sconto_valore ?? 0;

  const lordo = prezzo_unitario * quantita;
  const sconto_eff = sconto_valore_input > 0
    ? sconto_valore_input
    : round2(lordo * sconto_percentuale / 100);

  const imponibile = round2(lordo - sconto_eff);
  const aliquota = parseFloat(riga.aliquota_iva || '22');
  const imposta = riga.natura_iva ? 0 : round2(imponibile * aliquota / 100);
  const totale_riga = round2(imponibile + imposta);

  return {
    id: riga.id || crypto.randomUUID(),
    numero_linea: riga.numero_linea ?? 1,
    tipo_cessione: riga.tipo_cessione,
    codice_articolo: riga.codice_articolo,
    codice_tipo: riga.codice_tipo,
    descrizione: riga.descrizione ?? '',
    quantita,
    unita_misura: riga.unita_misura ?? 'pz',
    prezzo_unitario,
    sconto_percentuale,
    sconto_valore: sconto_eff,
    prezzo_unitario_scontato: quantita > 0 ? round2(imponibile / quantita) : 0,
    imponibile,
    aliquota_iva: riga.aliquota_iva ?? '22',
    natura_iva: riga.natura_iva,
    imposta,
    totale_riga,
    ritenuta: riga.ritenuta ?? false,
    riferimento_amministrazione: riga.riferimento_amministrazione,
    note_riga: riga.note_riga,
  };
}

// ============================================================
// RIEPILOGO IVA PER ALIQUOTA
// ============================================================
export function calcolaRiepilogoIVA(
  righe: RigaDocumento[],
  scontoGlobaleRatio: number = 0,
  esigibilita: CodiceEsigibilitaIVA = 'I',
): RiepilogoIVA[] {
  const map = new Map<string, { aliquota: string; natura?: CodiceNaturaIVA; imponibile: number; imposta: number }>();

  for (const r of righe) {
    const key = `${r.aliquota_iva}_${r.natura_iva || ''}`;
    const existing = map.get(key);
    const imponibile_riga = r.imponibile * (1 - scontoGlobaleRatio);
    const imposta_riga = r.imposta * (1 - scontoGlobaleRatio);

    if (existing) {
      existing.imponibile += imponibile_riga;
      existing.imposta += imposta_riga;
    } else {
      map.set(key, {
        aliquota: r.aliquota_iva,
        natura: r.natura_iva,
        imponibile: imponibile_riga,
        imposta: imposta_riga,
      });
    }
  }

  return Array.from(map.values()).map(v => ({
    aliquota: v.aliquota,
    natura: v.natura,
    imponibile: round2(v.imponibile),
    imposta: round2(v.imposta),
    esigibilita,
  }));
}

// ============================================================
// BOLLO VIRTUALE OBBLIGATORIO
// ============================================================
export function isObbligatorioBollo(righe: RigaDocumento[]): boolean {
  const imponibileEsente = righe
    .filter(r => r.natura_iva && ['N1', 'N2', 'N2_1', 'N2_2', 'N3', 'N3_1', 'N3_2', 'N3_3', 'N3_4', 'N3_5', 'N3_6', 'N4'].includes(r.natura_iva))
    .reduce((s, r) => s + r.imponibile, 0);
  return imponibileEsente > 77.47;
}

// ============================================================
// INTERFACCE OPZIONI CALCOLO
// ============================================================
export interface OpzioniRitenuta {
  attiva: boolean;
  tipo: 'RT01' | 'RT02';
  aliquota: number;
  causale: string;
}

export interface OpzioniCassa {
  attiva: boolean;
  tipo: string;
  aliquota: number;
  aliquota_iva: string;
  soggetta_ritenuta: boolean;
}

export interface TotaliDocumento {
  subtotale: number;
  sconto_globale: number;
  cassa_importo: number;
  imponibile_totale: number;
  iva_totale: number;
  bollo: number;
  totale_documento: number;
  ritenuta_importo: number;
  totale_da_pagare: number;
  riepilogo_iva: RiepilogoIVA[];
}

// ============================================================
// CALCOLO TOTALI DOCUMENTO
// ============================================================
export function calcolaTotaliDocumento(
  righe: RigaDocumento[],
  scontoGlobalePerc: number = 0,
  scontoGlobaleValore: number = 0,
  bolloVirtuale: boolean = false,
  ritenuta: OpzioniRitenuta | null = null,
  cassa: OpzioniCassa | null = null,
  esigibilita: CodiceEsigibilitaIVA = 'I',
): TotaliDocumento {
  const subtotale = righe.reduce((s, r) => s + r.imponibile, 0);

  const scontoGlobale = scontoGlobaleValore > 0
    ? scontoGlobaleValore
    : round2(subtotale * scontoGlobalePerc / 100);

  const imponibile_netto = subtotale - scontoGlobale;
  const scontoRatio = subtotale > 0 ? scontoGlobale / subtotale : 0;

  // Cassa previdenziale
  let importo_cassa = 0;
  let iva_cassa = 0;
  if (cassa?.attiva) {
    importo_cassa = round2(imponibile_netto * cassa.aliquota / 100);
    const aliqIvaCassa = parseFloat(cassa.aliquota_iva || '0');
    iva_cassa = round2(importo_cassa * aliqIvaCassa / 100);
  }

  const imponibile_con_cassa = imponibile_netto + importo_cassa;

  // Riepilogo IVA
  const riepilogo_iva = calcolaRiepilogoIVA(righe, scontoRatio, esigibilita);
  const iva_totale = round2(riepilogo_iva.reduce((s, r) => s + r.imposta, 0) + iva_cassa);

  let totale = round2(imponibile_con_cassa + iva_totale);

  // Bollo
  const bollo = bolloVirtuale ? 2.00 : 0;
  totale = round2(totale + bollo);

  // Ritenuta d'acconto
  let importo_ritenuta = 0;
  if (ritenuta?.attiva) {
    const imponibile_ritenuta = righe
      .filter(r => r.ritenuta)
      .reduce((s, r) => s + r.imponibile, 0) * (1 - scontoRatio);
    importo_ritenuta = round2(imponibile_ritenuta * ritenuta.aliquota / 100);
  }

  return {
    subtotale: round2(subtotale),
    sconto_globale: round2(scontoGlobale),
    cassa_importo: round2(importo_cassa),
    imponibile_totale: round2(imponibile_con_cassa),
    iva_totale,
    bollo,
    totale_documento: totale,
    ritenuta_importo: round2(importo_ritenuta),
    totale_da_pagare: round2(totale - importo_ritenuta),
    riepilogo_iva,
  };
}

// ============================================================
// VALIDAZIONE PRE-EMISSIONE
// ============================================================
export interface ErroreValidazione {
  campo: string;
  messaggio: string;
}

export function validaDocumento(doc: {
  cliente_snapshot?: { ragione_sociale?: string; tipo_cliente?: string };
  righe: RigaDocumento[];
  cig?: string;
  scadenze_pagamento?: Array<{ importo: number }>;
  totale_da_pagare?: number;
}): ErroreValidazione[] {
  const errors: ErroreValidazione[] = [];

  if (!doc.cliente_snapshot?.ragione_sociale) {
    errors.push({ campo: 'cliente', messaggio: 'Cliente non selezionato' });
  }

  if (doc.righe.length === 0) {
    errors.push({ campo: 'righe', messaggio: 'Nessuna riga inserita' });
  }

  for (const r of doc.righe) {
    if (!r.descrizione?.trim()) {
      errors.push({ campo: `riga_${r.numero_linea}`, messaggio: `Riga ${r.numero_linea}: descrizione mancante` });
    }
    if (r.aliquota_iva === '0' && !r.natura_iva) {
      errors.push({ campo: `riga_${r.numero_linea}_natura`, messaggio: `Riga ${r.numero_linea}: IVA 0% richiede natura IVA` });
    }
  }

  if (doc.cliente_snapshot?.tipo_cliente === 'PA' && !doc.cig) {
    errors.push({ campo: 'cig', messaggio: 'CIG obbligatorio per Pubblica Amministrazione' });
  }

  if (doc.scadenze_pagamento && doc.scadenze_pagamento.length > 0 && doc.totale_da_pagare) {
    const totScadenze = round2(doc.scadenze_pagamento.reduce((s, r) => s + r.importo, 0));
    if (Math.abs(totScadenze - doc.totale_da_pagare) > 0.01) {
      errors.push({ campo: 'scadenze', messaggio: `Totale rate (€${totScadenze.toFixed(2)}) ≠ Totale da pagare (€${doc.totale_da_pagare.toFixed(2)})` });
    }
  }

  return errors;
}

// ============================================================
// RIGA VUOTA
// ============================================================
export function creaRigaVuota(numero_linea: number): RigaDocumento {
  return calcolaRiga({
    id: crypto.randomUUID(),
    numero_linea,
    descrizione: '',
    quantita: 1,
    unita_misura: 'pz',
    prezzo_unitario: 0,
    aliquota_iva: '22',
  });
}
