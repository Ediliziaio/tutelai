import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import {
  ArrowLeft, Save, Send, ZoomIn, ZoomOut, Printer, CheckCircle, Loader2, MoreHorizontal, Copy, Trash2, FileCode, Link2, CalendarIcon, Download, Undo2, Redo2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

import type { CodiceTipoDocumento } from '@/types/fatturazione';
import { TIPI_DOCUMENTO_FATTURAPA } from '@/types/fatturazione';
import { mockAnagraficaAzienda } from '@/data/mockDashboardData';
import { ClienteSelector } from '@/components/saas/fattura/ClienteSelector';
import { DatiDocumento } from '@/components/saas/fattura/DatiDocumento';
import { RigheEditor } from '@/components/saas/fattura/RigheEditor';
import { OpzioniFiscali } from '@/components/saas/fattura/OpzioniFiscali';
import { PagamentoScadenze } from '@/components/saas/fattura/PagamentoScadenze';
import { RiferimentiAllegati } from '@/components/saas/fattura/RiferimentiAllegati';
import { TotaliSidebar } from '@/components/saas/fattura/TotaliSidebar';
import { FatturaPreviewEnterprise } from '@/components/saas/fattura/FatturaPreviewEnterprise';
import { NotaCreditoBanner } from '@/components/saas/NotaCreditoBanner';
import { DatiDDT } from '@/components/saas/fattura/DatiDDT';
import { ValidationIndicator } from '@/components/saas/fattura/ValidationIndicator';

import { useEditorFatturaState } from '@/hooks/useEditorFatturaState';
import { useEditorFatturaActions } from '@/hooks/useEditorFatturaActions';
import { useEditorKeyboardShortcuts } from '@/hooks/useEditorKeyboardShortcuts';

const AUTOFATTURA_TYPES: { code: CodiceTipoDocumento; label: string; desc: string }[] = [
  { code: 'TD16', label: 'TD16 — Reverse charge interno', desc: 'Integrazione IVA per subappalto edile, cessioni fabbricati, ecc.' },
  { code: 'TD17', label: 'TD17 — Acquisto servizi UE/extra-UE', desc: 'Servizi da fornitore estero — integrazione IVA italiana.' },
  { code: 'TD18', label: 'TD18 — Acquisto beni intracomunitari', desc: 'Beni acquistati da fornitore UE — integrazione IVA.' },
  { code: 'TD19', label: 'TD19 — Acquisto beni art. 17 c.2', desc: 'Beni da fornitore non residente — reverse charge.' },
  { code: 'TD20', label: 'TD20 — Regolarizzazione', desc: 'Regolarizzazione fatture art. 6 c.8 D.Lgs 471/97.' },
];

const EditorFattura = () => {
  const s = useEditorFatturaState();
  const actions = useEditorFatturaActions(s);
  useEditorKeyboardShortcuts({
    handleSaveRef: actions.handleSaveRef,
    undoRighe: s.undoRighe,
    redoRighe: s.redoRighe,
  });

  // Preview component (shared between desktop and mobile)
  const previewContent = (
    <div className="p-8" id="fattura-preview">
      <FatturaPreviewEnterprise
        azienda={mockAnagraficaAzienda}
        tipoDocumento={s.tipoDocumento}
        numero={s.numero}
        dataEmissione={format(s.dataEmissione, 'yyyy-MM-dd')}
        dataScadenza={format(s.dataScadenza, 'yyyy-MM-dd')}
        clienteSnapshot={s.clienteSnapshot}
        righe={s.righe}
        totali={s.totali}
        bolloVirtuale={s.bolloVirtuale}
        ritenutaAttiva={s.ritenuta.attiva}
        ritenutaAliquota={s.ritenuta.aliquota}
        cassaAttiva={s.cassa.attiva}
        cassaImporto={s.totali.cassa_importo}
        metodoPagamento={s.metodoPagamento === 'MP05' ? s.metodoPagamento : undefined}
        iban={s.metodoPagamento === 'MP05' ? s.iban : undefined}
        intestatarioConto={s.intestatario}
        nomeBanca={s.nomeBanca}
        noteDocumento={s.noteDocumento}
        scadenze={s.scadenze}
        isDDT={s.isDDT || s.tipoDocumento === 'TD24' || s.tipoDocumento === 'TD25'}
      />
    </div>
  );

  // Editor form content (shared between desktop and mobile)
  const editorContent = (
    <div className="space-y-4">
      {/* NC Banner */}
      {s.isNotaCredito && s.fatturaOriginale && (
        <NotaCreditoBanner
          fatturaOriginale={s.fatturaOriginale}
          motivoCredito={s.motivoCredito}
          onMotivoChange={s.setMotivoCredito}
          onStornoTotale={actions.handleStornoTotale}
          onStornoParziale={actions.handleStornoParziale}
        />
      )}

      {/* Proforma conversion banner */}
      {s.isConversione && s.documentoOrigine && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <FileCode className="text-primary mt-0.5 shrink-0" size={18} />
            <div>
              <p className="font-semibold text-primary text-sm">Conversione Pro-forma → Fattura</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Creazione fattura dal preventivo <strong>{s.documentoOrigine.numero}</strong> del {s.documentoOrigine.data_emissione}.
                Righe e cliente copiati automaticamente.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Proforma info banner + fields */}
      {s.isProforma && !s.isConversione && (
        <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-xl p-4 space-y-4">
          <div className="flex items-start gap-3">
            <FileCode className="text-violet-600 mt-0.5 shrink-0" size={18} />
            <div>
              <p className="font-semibold text-violet-800 dark:text-violet-300 text-sm">Pro-forma / Preventivo</p>
              <p className="text-xs text-violet-700 dark:text-violet-400 mt-0.5">
                Questo documento non ha valore fiscale. Può essere convertito in fattura dopo l'accettazione del cliente.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Valido fino al</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-8 text-xs", !s.dataValidita && "text-muted-foreground")}>
                    <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                    {s.dataValidita ? format(s.dataValidita, 'dd/MM/yyyy') : 'Seleziona data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={s.dataValidita} onSelect={s.setDataValidita} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="text-xs">Link accettazione</Label>
              <Button
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs"
                onClick={() => toast({ title: 'Link generato', description: `https://app.example.com/preventivo/${s.numero}?token=${Math.random().toString(36).slice(2, 10)}` })}
              >
                <Link2 className="h-3.5 w-3.5 mr-1" /> Genera link accettazione
              </Button>
            </div>
          </div>
          <div>
            <Label className="text-xs">Disclaimer</Label>
            <Textarea
              value={s.disclaimerProforma}
              onChange={e => s.setDisclaimerProforma(e.target.value)}
              className="text-xs h-16 mt-1"
              rows={2}
            />
          </div>
        </div>
      )}

      {/* Autofattura wizard */}
      {s.isAutofattura && (
        <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-xl p-4 space-y-4">
          <div className="flex items-start gap-3">
            <FileCode className="text-orange-600 mt-0.5 shrink-0" size={18} />
            <div>
              <p className="font-semibold text-orange-800 dark:text-orange-300 text-sm">Autofattura / Integrazione</p>
              <p className="text-xs text-orange-700 dark:text-orange-400 mt-0.5">
                Seleziona il tipo di autofattura e inserisci i dati del fornitore estero.
              </p>
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold mb-2 block">Tipo Autofattura</Label>
            <RadioGroup value={s.autofatturaTipo} onValueChange={v => s.setAutofatturaTipo(v as CodiceTipoDocumento)} className="space-y-2">
              {AUTOFATTURA_TYPES.map(t => (
                <label key={t.code} className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                  s.autofatturaTipo === t.code ? "border-orange-400 bg-orange-100/50 dark:bg-orange-900/20" : "border-border hover:border-orange-300"
                )}>
                  <RadioGroupItem value={t.code} className="mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">{t.label}</p>
                    <p className="text-[10px] text-muted-foreground">{t.desc}</p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="text-xs font-semibold mb-2 block">Dati Fornitore Estero</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="col-span-full">
                <Label className="text-[10px] text-muted-foreground">Denominazione</Label>
                <Input value={s.fornitoreEstero.denominazione} onChange={e => s.setFornitoreEstero(p => ({ ...p, denominazione: e.target.value }))} className="h-8 text-xs" placeholder="Es. Acme Services GmbH" />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">P.IVA / VAT Number</Label>
                <Input value={s.fornitoreEstero.partita_iva} onChange={e => s.setFornitoreEstero(p => ({ ...p, partita_iva: e.target.value }))} className="h-8 text-xs font-mono" placeholder="DE123456789" />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">Codice Paese (ISO)</Label>
                <Input value={s.fornitoreEstero.codice_paese} onChange={e => s.setFornitoreEstero(p => ({ ...p, codice_paese: e.target.value.toUpperCase() }))} className="h-8 text-xs font-mono uppercase" placeholder="DE" maxLength={2} />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">N° Fattura Fornitore</Label>
                <Input value={s.fornitoreEstero.numero_fattura} onChange={e => s.setFornitoreEstero(p => ({ ...p, numero_fattura: e.target.value }))} className="h-8 text-xs font-mono" placeholder="INV-2026-001" />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">Data Fattura Fornitore</Label>
                <Input type="date" value={s.fornitoreEstero.data_fattura} onChange={e => s.setFornitoreEstero(p => ({ ...p, data_fattura: e.target.value }))} className="h-8 text-xs" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1 — Cliente */}
      <ClienteSelector
        clienteSnapshot={s.clienteSnapshot}
        onSelect={actions.handleSelectCliente}
        onClear={() => { s.setClienteSnapshot(null); s.setSplitPayment(false); }}
      />

      {/* 2 — Dati Documento */}
      <DatiDocumento
        tipoDocumento={s.tipoDocumento} numero={s.numero} serie={s.serie}
        dataEmissione={s.dataEmissione} dataScadenza={s.dataScadenza}
        onChangeTipo={s.setTipoDocumento} onChangeNumero={s.setNumero} onChangeSerie={s.setSerie}
        onChangeDataEmissione={d => { s.setDataEmissione(d); s.setDataScadenza(new Date(d.getTime() + 30 * 86400000)); }}
        onChangeDataScadenza={s.setDataScadenza}
      />

      {/* 3 — Righe */}
      <RigheEditor righe={s.righe} onChange={s.setRigheWithHistory} />

      {/* 3b — DDT fields */}
      {(s.isDDT || s.tipoDocumento === 'TD24' || s.tipoDocumento === 'TD25') && (
        <DatiDDT dati={s.datiDDT} onChange={s.setDatiDDT} />
      )}

      {/* 4 — Sconto globale */}
      <div className="bg-muted/50 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Sconto Globale</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Sconto %</Label>
            <Input type="number" value={s.scontoGlobalePerc} onChange={e => { s.setScontoGlobalePerc(Number(e.target.value)); s.setScontoGlobaleValore(0); }} className="h-8 text-xs" min={0} max={100} />
          </div>
          <div>
            <Label className="text-xs">Sconto €</Label>
            <Input type="number" value={s.scontoGlobaleValore} onChange={e => { s.setScontoGlobaleValore(Number(e.target.value)); s.setScontoGlobalePerc(0); }} className="h-8 text-xs" min={0} />
          </div>
        </div>
      </div>

      {/* 5 — Opzioni Fiscali */}
      <OpzioniFiscali
        bolloVirtuale={s.bolloVirtuale} bolloObbligatorio={s.bolloObbligatorio} onBolloChange={s.setBolloVirtuale}
        ivaPerCassa={s.ivaPerCassa} onIvaPerCassaChange={s.setIvaPerCassa}
        reverseCharge={s.reverseCharge} onReverseChargeChange={s.setReverseCharge}
        splitPayment={s.splitPayment} onSplitPaymentChange={s.setSplitPayment} showSplitPayment={s.isPA}
        ritenuta={s.ritenuta} onRitenutaChange={s.setRitenuta}
        ritenutaImporto={s.totali.ritenuta_importo} ritenutaImponibile={s.ritenutaImponibile}
        cassa={s.cassa} onCassaChange={s.setCassa}
      />

      {/* 6 — Pagamento */}
      <PagamentoScadenze
        metodoPagamento={s.metodoPagamento} onMetodoChange={s.setMetodoPagamento}
        iban={s.iban} onIbanChange={s.setIban} bic={s.bic} onBicChange={s.setBic}
        intestatario={s.intestatario} onIntestatarioChange={s.setIntestatario}
        nomeBanca={s.nomeBanca} onNomeBancaChange={s.setNomeBanca}
        scadenze={s.scadenze} onScadenzeChange={s.setScadenze}
        totaleDaPagare={s.totali.totale_da_pagare} dataEmissione={s.dataEmissione}
      />

      {/* 7 — Riferimenti */}
      <RiferimentiAllegati
        showPA={s.isPA} cig={s.cig} onCigChange={s.setCig} cup={s.cup} onCupChange={s.setCup}
        codiceCommessa={s.codiceCommessa} onCodiceCommessaChange={s.setCodiceCommessa}
        noteDocumento={s.noteDocumento} onNoteDocumentoChange={s.setNoteDocumento}
        noteInterne={s.noteInterne} onNoteInterneChange={s.setNoteInterne}
      />

      {/* 8 — Totali sticky */}
      <TotaliSidebar totali={s.totali} ritenuta={s.ritenuta} cassaAttiva={s.cassa.attiva} bolloVirtuale={s.bolloVirtuale} errori={s.errori} />
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -m-4 lg:-m-6">
      {/* ── TOPBAR ── */}
      <div className="h-14 bg-background border-b border-border flex items-center justify-between px-4 lg:px-6 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => actions.navigate('/admin/fatturazione')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-5 w-px bg-border" />
          <Badge variant="secondary" className="text-xs">
            {s.isProforma ? 'PRO-FORMA' : TIPI_DOCUMENTO_FATTURAPA[s.tipoDocumento]?.split(' ')[0] || 'Fattura'}
          </Badge>
          <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold">
            {s.numero}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ValidationIndicator errors={s.validationErrors} />

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground mr-2">
            {s.isSaving ? (
              <><Loader2 className="h-3 w-3 animate-spin" /> Salvataggio...</>
            ) : s.lastSaved ? (
              <><CheckCircle className="h-3 w-3 text-secondary" /> Salvata {format(s.lastSaved, 'HH:mm', { locale: it })}</>
            ) : s.isDirty ? (
              <><div className="h-2 w-2 rounded-full bg-accent" /> Modifiche non salvate</>
            ) : null}
          </div>

          <div className="hidden sm:flex items-center gap-0.5">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={s.undoRighe} disabled={!s.canUndo} title="Annulla (Ctrl+Z)">
              <Undo2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={s.redoRighe} disabled={!s.canRedo} title="Ripristina (Ctrl+Y)">
              <Redo2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Button variant="ghost" size="sm" onClick={() => actions.handleSave(false)}>
            <Save className="h-4 w-4 mr-1" /> <span className="hidden sm:inline">Salva bozza</span>
          </Button>
          <Button className="bg-primary hover:bg-primary/90" size="sm" onClick={() => actions.handleSave(true)}>
            <Send className="h-4 w-4 mr-1" /> {s.isProforma ? 'Salva preventivo' : 'Emetti'}
          </Button>
          {s.isProforma && (
            <Button variant="outline" size="sm" className="hidden sm:flex" onClick={() => actions.navigate(`/admin/fatturazione/nuova?tipo=converti_proforma&da_documento=${s.existing?.id || 'new'}`)}>
              Converti in fattura
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={actions.handleDuplicaDocumento}><Copy className="h-3.5 w-3.5 mr-2" /> Duplica</DropdownMenuItem>
              <DropdownMenuItem onClick={actions.handleExportXML}><FileCode className="h-3.5 w-3.5 mr-2" /> Esporta XML</DropdownMenuItem>
              <DropdownMenuItem onClick={actions.handleDownloadPDF} disabled={s.isPdfGenerating}>
                <Download className="h-3.5 w-3.5 mr-2" /> {s.isPdfGenerating ? 'Generazione...' : 'Scarica PDF'}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => s.setDeleteDialogOpen(true)}>
                <Trash2 className="h-3.5 w-3.5 mr-2" /> Elimina
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ── BODY ── */}
      {s.isMobile ? (
        <Tabs value={s.mobileTab} onValueChange={s.setMobileTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="mx-4 mt-2 shrink-0">
            <TabsTrigger value="editor" className="flex-1">Editor</TabsTrigger>
            <TabsTrigger value="preview" className="flex-1">Anteprima</TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="flex-1 overflow-y-auto p-4">
            {editorContent}
          </TabsContent>
          <TabsContent value="preview" className="flex-1 overflow-auto p-4 bg-muted">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden mx-auto" style={{ maxWidth: '210mm' }}>
              {previewContent}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 lg:w-1/2 overflow-y-auto p-4 lg:p-6 bg-background lg:border-r border-border">
            {editorContent}
          </div>

          <div className="hidden lg:flex flex-col flex-1 bg-muted min-w-0">
            <div className="flex items-center gap-2 px-4 py-2 bg-background border-b border-border shrink-0">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Anteprima</span>
              <div className="ml-auto flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => s.setZoom(z => Math.max(0.4, z - 0.1))}>
                  <ZoomOut className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs text-muted-foreground w-10 text-center leading-7">{Math.round(s.zoom * 100)}%</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => s.setZoom(z => Math.min(1, z + 0.1))}>
                  <ZoomIn className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={actions.handlePrint} title="Stampa">
                  <Printer className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={actions.handleDownloadPDF} disabled={s.isPdfGenerating} title="Scarica PDF">
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6 flex justify-center">
              <div className="bg-white shadow-xl rounded-lg overflow-hidden" style={{ transform: `scale(${s.zoom})`, transformOrigin: 'top center', width: '210mm', minHeight: '297mm' }}>
                {previewContent}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={s.deleteDialogOpen} onOpenChange={s.setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare il documento?</AlertDialogTitle>
            <AlertDialogDescription>
              Il documento <strong>{s.numero}</strong> verrà eliminato definitivamente. Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction onClick={actions.handleEliminaDocumento} className="bg-destructive hover:bg-destructive/90">
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditorFattura;
