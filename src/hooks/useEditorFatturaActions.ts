import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import type { Anagrafica, ClienteSnapshot } from '@/types/fatturazione';
import { mockAnagraficaAzienda } from '@/data/mockDashboardData';
import { generateFatturaPAXML, type XMLDocumentData } from '@/lib/fatturaPA/generateXML';
import { creaRigaVuota } from '@/components/saas/fattura/calcoliDocumento';
import { generatePDF } from '@/lib/generatePDF';
import type { EditorFatturaState } from './useEditorFatturaState';

export function useEditorFatturaActions(s: EditorFatturaState) {
  const navigate = useNavigate();
  const handleSaveRef = useRef<(emit?: boolean) => void>();

  const handleStornoTotale = useCallback(() => {
    if (!s.fatturaOriginale) return;
    s.setRigheWithHistory(s.fatturaOriginale.righe.map((r, i) => ({
      ...r, id: `nc-${i}`,
      prezzo_unitario: Math.abs(r.prezzo_unitario),
      imponibile: Math.abs(r.imponibile),
      imposta: Math.abs(r.imposta),
      totale_riga: Math.abs(r.totale_riga),
    })));
    toast({ title: 'Storno totale applicato' });
  }, [s.fatturaOriginale, s.setRigheWithHistory]);

  const handleStornoParziale = useCallback(() => {
    s.setRigheWithHistory([creaRigaVuota(1)]);
    toast({ title: 'Storno parziale', description: 'Inserisci manualmente le righe da stornare.' });
  }, [s.setRigheWithHistory]);

  const handleSelectCliente = useCallback((_a: Anagrafica, snapshot: ClienteSnapshot) => {
    s.setClienteSnapshot(snapshot);
    if (snapshot.tipo_cliente === 'PA') s.setSplitPayment(true);
  }, [s.setClienteSnapshot, s.setSplitPayment]);

  const handleSave = useCallback((emit = false) => {
    if (emit && s.errori.length > 0) {
      toast({ title: 'Errori di validazione', description: s.errori.map(e => e.messaggio).join(', '), variant: 'destructive' });
      return;
    }
    s.setIsSaving(true);
    setTimeout(() => {
      s.setIsSaving(false); s.setIsDirty(false); s.setLastSaved(new Date());
      toast({ title: emit ? '✓ Fattura emessa!' : '✓ Bozza salvata', description: `Documento ${s.numero} ${emit ? 'emesso' : 'salvato'}` });
      if (emit) navigate('/admin/fatturazione');
    }, 500);
  }, [s.errori, s.numero, navigate, s.setIsSaving, s.setIsDirty, s.setLastSaved]);

  // Keep ref in sync for keyboard shortcuts
  handleSaveRef.current = handleSave;

  const handlePrint = useCallback(() => {
    const printWin = window.open('', '_blank');
    if (!printWin) return;
    const el = document.getElementById('fattura-preview');
    if (!el) return;
    printWin.document.write(`<html><head><title>${s.numero}</title><style>body{font-family:Inter,sans-serif;padding:40px;color:#1e293b}table{border-collapse:collapse;width:100%}th,td{padding:6px 8px;text-align:left;font-size:11px}th{border-bottom:1px solid #cbd5e1}td{border-bottom:1px solid #f1f5f9}.font-mono{font-family:monospace}@media print{body{padding:20px}}</style></head><body>${el.innerHTML}</body></html>`);
    printWin.document.close();
    printWin.print();
  }, [s.numero]);

  const handleDownloadPDF = useCallback(async () => {
    s.setIsPdfGenerating(true);
    try {
      await generatePDF('fattura-preview', `${s.numero}.pdf`);
      toast({ title: '✓ PDF scaricato' });
    } catch {
      toast({ title: 'Errore generazione PDF', variant: 'destructive' });
    } finally {
      s.setIsPdfGenerating(false);
    }
  }, [s.numero, s.setIsPdfGenerating]);

  const handleDuplicaDocumento = useCallback(() => {
    toast({ title: 'Documento duplicato', description: 'Aperto un nuovo documento con gli stessi dati.' });
  }, []);

  const handleEliminaDocumento = useCallback(() => {
    s.setDeleteDialogOpen(false);
    toast({ title: 'Documento eliminato' });
    navigate('/admin/fatturazione');
  }, [navigate, s.setDeleteDialogOpen]);

  const buildXMLData = useCallback((): XMLDocumentData | null => {
    if (!s.clienteSnapshot) return null;
    return {
      tipo_documento_sdi: s.tipoDocumento, numero: s.numero,
      numero_progressivo: mockAnagraficaAzienda.ultimo_numero_fattura + 1,
      data_emissione: format(s.dataEmissione, 'yyyy-MM-dd'), valuta: 'EUR',
      cliente_snapshot: s.clienteSnapshot,
      righe: s.righe, riepilogo_iva: s.totali.riepilogo_iva,
      totale_documento: s.totali.totale_documento,
      bollo_virtuale: s.bolloVirtuale, bollo_importo: s.bolloVirtuale ? 2 : 0,
      ritenuta_attiva: s.ritenuta.attiva, ritenuta_tipo: s.ritenuta.tipo,
      ritenuta_aliquota: s.ritenuta.aliquota,
      ritenuta_importo: s.totali.ritenuta_importo,
      ritenuta_causale: s.ritenuta.causale as any,
      cassa_attiva: s.cassa.attiva, cassa_tipo: s.cassa.tipo as any,
      cassa_aliquota: s.cassa.aliquota, cassa_importo: s.totali.cassa_importo,
      cassa_imponibile: s.totali.subtotale, cassa_aliquota_iva: s.cassa.aliquota_iva,
      cassa_ritenuta: s.cassa.soggetta_ritenuta,
      sconto_globale_valore: s.totali.sconto_globale,
      metodo_pagamento_codice: s.metodoPagamento,
      scadenze_pagamento: s.scadenze,
      iban_pagamento: s.metodoPagamento === 'MP05' ? s.iban : undefined,
      bic_pagamento: s.metodoPagamento === 'MP05' ? s.bic : undefined,
      nome_banca: s.metodoPagamento === 'MP05' ? s.nomeBanca : undefined,
      cig: s.cig || undefined, cup: s.cup || undefined,
    };
  }, [s.clienteSnapshot, s.tipoDocumento, s.numero, s.dataEmissione, s.righe, s.totali, s.bolloVirtuale, s.ritenuta, s.cassa, s.metodoPagamento, s.scadenze, s.iban, s.bic, s.nomeBanca, s.cig, s.cup]);

  const handleExportXML = useCallback(() => {
    const data = buildXMLData();
    if (!data) { toast({ title: 'Cliente mancante', variant: 'destructive' }); return; }
    const xml = generateFatturaPAXML(data, mockAnagraficaAzienda);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IT${mockAnagraficaAzienda.partita_iva}_${s.numero.replace(/-/g, '')}.xml`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: '✓ XML esportato' });
  }, [buildXMLData, s.numero]);

  return {
    handleSaveRef,
    handleStornoTotale,
    handleStornoParziale,
    handleSelectCliente,
    handleSave,
    handlePrint,
    handleDownloadPDF,
    handleDuplicaDocumento,
    handleEliminaDocumento,
    buildXMLData,
    handleExportXML,
    navigate,
  };
}
