import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import type { RigaDocumento, ClienteSnapshot, CodiceTipoDocumento, CodiceMetodoPagamento, ScadenzaPagamento } from '@/types/fatturazione';
import { mockAnagraficaAzienda, getDocumentoById } from '@/data/mockDashboardData';
import { calcolaTotaliDocumento, isObbligatorioBollo, validaDocumento, creaRigaVuota, type OpzioniRitenuta, type OpzioniCassa } from '@/components/saas/fattura/calcoliDocumento';
import { validaFatturaRealtime, type ValidationError } from '@/lib/validators/fatturaValidator';
import { defaultDatiDDT, type DatiDDTState } from '@/components/saas/fattura/DatiDDT';
import { useIsMobile } from '@/hooks/use-mobile';

export function useEditorFatturaState() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const existing = id ? getDocumentoById(id) : null;
  const isMobile = useIsMobile();

  const tipoParam = searchParams.get('tipo');
  const daFatturaParam = searchParams.get('da_fattura');
  const daDocumentoParam = searchParams.get('da_documento');
  const fatturaOriginale = daFatturaParam ? getDocumentoById(daFatturaParam) : null;
  const documentoOrigine = daDocumentoParam ? getDocumentoById(daDocumentoParam) : null;
  const isNotaCredito = tipoParam === 'nota_credito' || existing?.tipo === 'nota_credito';
  const isNotaDebito = tipoParam === 'nota_debito';
  const isDDT = tipoParam === 'ddt';
  const isProforma = tipoParam === 'proforma';
  const isAutofattura = tipoParam === 'autofattura';
  const isConversione = tipoParam === 'converti_proforma' && !!documentoOrigine;

  const getInitialTipo = (): CodiceTipoDocumento => {
    if (isNotaCredito) return 'TD04';
    if (isNotaDebito) return 'TD05';
    if (isDDT) return 'TD24';
    if (isAutofattura) return 'TD16';
    if (existing?.tipo_documento_sdi) return existing.tipo_documento_sdi;
    return 'TD01';
  };

  const getInitialNumero = (): string => {
    if (existing?.numero) return existing.numero;
    if (isConversione && documentoOrigine) return `FT-${new Date().getFullYear()}-${String(mockAnagraficaAzienda.ultimo_numero_fattura + 1).padStart(4, '0')}`;
    if (isNotaCredito) return `NC-${new Date().getFullYear()}-0001`;
    if (isNotaDebito) return `ND-${new Date().getFullYear()}-0001`;
    if (isDDT) return `DDT-${new Date().getFullYear()}-0001`;
    if (isProforma) return `PRV-${new Date().getFullYear()}-0001`;
    if (isAutofattura) return `AF-${new Date().getFullYear()}-0001`;
    return `FT-${new Date().getFullYear()}-${String(mockAnagraficaAzienda.ultimo_numero_fattura + 1).padStart(4, '0')}`;
  };

  // ── Core state ──
  const [tipoDocumento, setTipoDocumento] = useState<CodiceTipoDocumento>(getInitialTipo());
  const [numero, setNumero] = useState(getInitialNumero());
  const [serie, setSerie] = useState(existing?.serie ?? 'A');
  const [dataEmissione, setDataEmissione] = useState<Date>(existing ? new Date(existing.data_emissione) : new Date());
  const [dataScadenza, setDataScadenza] = useState<Date>(existing?.data_scadenza ? new Date(existing.data_scadenza) : new Date(Date.now() + 30 * 86400000));
  const [clienteSnapshot, setClienteSnapshot] = useState<ClienteSnapshot | null>(
    documentoOrigine?.cliente_snapshot ?? fatturaOriginale?.cliente_snapshot ?? existing?.cliente_snapshot ?? null
  );
  const [righe, setRighe] = useState<RigaDocumento[]>(
    isConversione && documentoOrigine ? documentoOrigine.righe : existing?.righe ?? [creaRigaVuota(1)]
  );
  const [motivoCredito, setMotivoCredito] = useState('errore_fatturazione');
  const [datiDDT, setDatiDDT] = useState<DatiDDTState>(defaultDatiDDT);

  // ── Undo/Redo for righe ──
  const righeHistory = useRef<RigaDocumento[][]>([righe]);
  const righePointerRef = useRef(0);
  const [undoRedoVersion, setUndoRedoVersion] = useState(0);

  const canUndo = righePointerRef.current > 0;
  const canRedo = righePointerRef.current < righeHistory.current.length - 1;

  const setRigheWithHistory = useCallback((newRighe: RigaDocumento[]) => {
    righeHistory.current = righeHistory.current.slice(0, righePointerRef.current + 1);
    righeHistory.current.push(newRighe);
    if (righeHistory.current.length > 50) righeHistory.current.shift();
    righePointerRef.current = righeHistory.current.length - 1;
    setRighe(newRighe);
    setUndoRedoVersion(v => v + 1);
  }, []);

  const undoRighe = useCallback(() => {
    if (righePointerRef.current > 0) {
      righePointerRef.current--;
      setRighe(righeHistory.current[righePointerRef.current]);
      setUndoRedoVersion(v => v + 1);
    }
  }, []);

  const redoRighe = useCallback(() => {
    if (righePointerRef.current < righeHistory.current.length - 1) {
      righePointerRef.current++;
      setRighe(righeHistory.current[righePointerRef.current]);
      setUndoRedoVersion(v => v + 1);
    }
  }, []);

  // ── Proforma / Preventivo ──
  const [dataValidita, setDataValidita] = useState<Date | undefined>(isProforma ? new Date(Date.now() + 30 * 86400000) : undefined);
  const [disclaimerProforma, setDisclaimerProforma] = useState('Documento non fiscalmente valido ai fini IVA — D.P.R. 633/72');

  // ── Autofattura ──
  const [autofatturaTipo, setAutofatturaTipo] = useState<CodiceTipoDocumento>('TD17');
  const [fornitoreEstero, setFornitoreEstero] = useState({ denominazione: '', partita_iva: '', codice_paese: '', numero_fattura: '', data_fattura: '' });

  // ── Sconto globale ──
  const [scontoGlobalePerc, setScontoGlobalePerc] = useState(existing?.sconto_globale_percentuale ?? 0);
  const [scontoGlobaleValore, setScontoGlobaleValore] = useState(existing?.sconto_globale_valore ?? 0);

  // ── Opzioni fiscali ──
  const [bolloVirtuale, setBolloVirtuale] = useState(existing?.bollo_virtuale ?? false);
  const [ivaPerCassa, setIvaPerCassa] = useState(existing?.art_73_comma_3 ?? false);
  const [reverseCharge, setReverseCharge] = useState(existing?.art_21_comma_6_bis ?? false);
  const [splitPayment, setSplitPayment] = useState(clienteSnapshot?.tipo_cliente === 'PA');
  const [ritenuta, setRitenuta] = useState<OpzioniRitenuta>({
    attiva: existing?.ritenuta_acconto ?? false,
    tipo: existing?.ritenuta_tipo ?? 'RT01',
    aliquota: existing?.ritenuta_aliquota ?? 20,
    causale: existing?.ritenuta_causale ?? 'A',
  });
  const [cassa, setCassa] = useState<OpzioniCassa>({
    attiva: existing?.cassa_previdenziale ?? false,
    tipo: existing?.cassa_tipo ?? 'TC22',
    aliquota: existing?.cassa_aliquota ?? 4,
    aliquota_iva: existing?.cassa_aliquota_iva ?? '22',
    soggetta_ritenuta: existing?.cassa_ritenuta ?? false,
  });

  // ── Pagamento ──
  const [metodoPagamento, setMetodoPagamento] = useState<CodiceMetodoPagamento>(existing?.metodo_pagamento_codice ?? 'MP05');
  const [iban, setIban] = useState(existing?.iban_pagamento ?? mockAnagraficaAzienda.iban_principale ?? '');
  const [bic, setBic] = useState(mockAnagraficaAzienda.bic_swift ?? '');
  const [intestatario, setIntestatario] = useState(mockAnagraficaAzienda.intestatario_conto ?? '');
  const [nomeBanca, setNomeBanca] = useState(mockAnagraficaAzienda.nome_banca ?? '');
  const [scadenze, setScadenze] = useState<ScadenzaPagamento[]>(existing?.scadenze_pagamento ?? []);

  // ── Riferimenti ──
  const [cig, setCig] = useState(existing?.cig ?? '');
  const [cup, setCup] = useState(existing?.cup ?? '');
  const [codiceCommessa, setCodiceCommessa] = useState(existing?.codice_commessa_convenzione ?? '');
  const [noteDocumento, setNoteDocumento] = useState(
    fatturaOriginale ? `Nota di credito a storno della fattura n. ${fatturaOriginale.numero} del ${fatturaOriginale.data_emissione}` : existing?.note_documento ?? ''
  );
  const [noteInterne, setNoteInterne] = useState(existing?.note_interne ?? '');

  // ── UI state ──
  const [zoom, setZoom] = useState(0.7);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [mobileTab, setMobileTab] = useState<string>('editor');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  // ── Effects ──
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) { isInitialMount.current = false; return; }
    setIsDirty(true);
  }, [righe, clienteSnapshot, tipoDocumento, numero, dataEmissione, dataScadenza, scontoGlobalePerc, scontoGlobaleValore, bolloVirtuale, ritenuta, cassa, metodoPagamento, scadenze, noteDocumento]);

  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(() => {
      setIsSaving(true);
      setTimeout(() => { setIsSaving(false); setIsDirty(false); setLastSaved(new Date()); }, 600);
    }, 30000);
    return () => clearTimeout(timer);
  }, [isDirty]);

  useEffect(() => {
    if (isAutofattura) setTipoDocumento(autofatturaTipo);
  }, [autofatturaTipo, isAutofattura]);

  // ── Computed ──
  const esigibilita = splitPayment ? 'S' as const : ivaPerCassa ? 'D' as const : 'I' as const;
  const totali = useMemo(() => calcolaTotaliDocumento(righe, scontoGlobalePerc, scontoGlobaleValore, bolloVirtuale, ritenuta, cassa, esigibilita), [righe, scontoGlobalePerc, scontoGlobaleValore, bolloVirtuale, ritenuta, cassa, esigibilita]);
  const bolloObbligatorio = useMemo(() => isObbligatorioBollo(righe), [righe]);
  const errori = useMemo(() => validaDocumento({ cliente_snapshot: clienteSnapshot ?? undefined, righe, cig, scadenze_pagamento: scadenze, totale_da_pagare: totali.totale_da_pagare }), [clienteSnapshot, righe, cig, scadenze, totali.totale_da_pagare]);
  const ritenutaImponibile = useMemo(() => righe.filter(r => r.ritenuta).reduce((s, r) => s + r.imponibile, 0), [righe]);

  const validationErrors = useMemo<ValidationError[]>(() => validaFatturaRealtime({
    cliente: clienteSnapshot as unknown as Record<string, unknown> | null,
    righe: righe as unknown as Array<Record<string, unknown>>,
    numero, dataEmissione, dataScadenza,
    cig, scadenze, totaleDaPagare: totali.totale_da_pagare,
  }), [clienteSnapshot, righe, numero, dataEmissione, dataScadenza, cig, scadenze, totali.totale_da_pagare]);

  const isPA = clienteSnapshot?.tipo_cliente === 'PA';

  // Suppress lint warning for undoRedoVersion (used to force re-render)
  void undoRedoVersion;

  return {
    // URL-derived
    id, existing, isMobile,
    isNotaCredito, isNotaDebito, isDDT, isProforma, isAutofattura, isConversione,
    fatturaOriginale, documentoOrigine,
    // Core
    tipoDocumento, setTipoDocumento, numero, setNumero, serie, setSerie,
    dataEmissione, setDataEmissione, dataScadenza, setDataScadenza,
    clienteSnapshot, setClienteSnapshot,
    righe, setRigheWithHistory,
    motivoCredito, setMotivoCredito,
    datiDDT, setDatiDDT,
    // Undo/redo
    canUndo, canRedo, undoRighe, redoRighe,
    // Proforma
    dataValidita, setDataValidita, disclaimerProforma, setDisclaimerProforma,
    // Autofattura
    autofatturaTipo, setAutofatturaTipo, fornitoreEstero, setFornitoreEstero,
    // Sconto globale
    scontoGlobalePerc, setScontoGlobalePerc, scontoGlobaleValore, setScontoGlobaleValore,
    // Fiscal
    bolloVirtuale, setBolloVirtuale, ivaPerCassa, setIvaPerCassa,
    reverseCharge, setReverseCharge, splitPayment, setSplitPayment,
    ritenuta, setRitenuta, cassa, setCassa,
    // Payment
    metodoPagamento, setMetodoPagamento, iban, setIban, bic, setBic,
    intestatario, setIntestatario, nomeBanca, setNomeBanca, scadenze, setScadenze,
    // References
    cig, setCig, cup, setCup, codiceCommessa, setCodiceCommessa,
    noteDocumento, setNoteDocumento, noteInterne, setNoteInterne,
    // UI
    zoom, setZoom, isDirty, isSaving, lastSaved,
    mobileTab, setMobileTab, deleteDialogOpen, setDeleteDialogOpen,
    isPdfGenerating, setIsPdfGenerating,
    setIsSaving, setIsDirty, setLastSaved,
    // Computed
    esigibilita, totali, bolloObbligatorio, errori, ritenutaImponibile, validationErrors, isPA,
  };
}

export type EditorFatturaState = ReturnType<typeof useEditorFatturaState>;
