import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import {
  Search, FileText, Download, MoreHorizontal,
  ArrowRight, Send, Upload, X, CheckCircle, FileCode,
} from 'lucide-react';
import { EmptyState } from '@/components/saas/EmptyState';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import type { DocumentoFiscale } from '@/types/fatturazione';

function fmtCur(n: number) { return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n); }
function fmtDate(d: string) { try { return format(new Date(d), 'dd/MM/yyyy', { locale: it }); } catch { return d; } }

interface ParsedFatturaPA {
  tipo_documento: string;
  numero: string;
  data: string;
  fornitore: { denominazione: string; partita_iva: string; indirizzo: string; comune: string; provincia: string };
  righe: { numero_linea: number; descrizione: string; quantita: number; prezzo_unitario: number; aliquota_iva: string; imponibile: number }[];
  totale: number;
  pagamento: { metodo: string; data_scadenza: string; importo: number; iban: string };
}

function parseFatturaPARicevuta(xmlContent: string): ParsedFatturaPA | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlContent, 'application/xml');
    const get = (sel: string) => doc.querySelector(sel)?.textContent?.trim() || '';

    const righe = Array.from(doc.querySelectorAll('DettaglioLinee')).map(r => ({
      numero_linea: parseInt(r.querySelector('NumeroLinea')?.textContent || '1'),
      descrizione: r.querySelector('Descrizione')?.textContent || '',
      quantita: parseFloat(r.querySelector('Quantita')?.textContent || '1'),
      prezzo_unitario: parseFloat(r.querySelector('PrezzoUnitario')?.textContent || '0'),
      aliquota_iva: r.querySelector('AliquotaIVA')?.textContent || '22.00',
      imponibile: parseFloat(r.querySelector('PrezzoTotale')?.textContent || '0'),
    }));

    return {
      tipo_documento: get('TipoDocumento') || 'TD01',
      numero: get('Numero') || 'N/D',
      data: get('Data') || new Date().toISOString().slice(0, 10),
      fornitore: {
        denominazione: get('CedentePrestatore Denominazione') || get('CedentePrestatore Cognome'),
        partita_iva: get('CedentePrestatore IdCodice') || get('IdFiscaleIVA IdCodice'),
        indirizzo: get('CedentePrestatore Indirizzo'),
        comune: get('CedentePrestatore Comune'),
        provincia: get('CedentePrestatore Provincia'),
      },
      righe,
      totale: parseFloat(get('ImportoTotaleDocumento')) || righe.reduce((s, r) => s + r.imponibile, 0),
      pagamento: {
        metodo: get('ModalitaPagamento'),
        data_scadenza: get('DataScadenzaPagamento'),
        importo: parseFloat(get('ImportoPagamento') || '0'),
        iban: get('IBAN'),
      },
    };
  } catch {
    return null;
  }
}

const INITIAL_FATTURE: DocumentoFiscale[] = [
  {
    id: 'fp-001', tenant_id: 'impresa-leggera', tipo: 'fattura_passiva' as any,
    tipo_documento_sdi: 'TD01', numero: 'FORN-2026-0112', numero_progressivo: 112, anno: 2026,
    data_emissione: '2026-02-15', data_scadenza: '2026-03-17',
    anagrafica_id: 'an-005',
    cliente_snapshot: {
      ragione_sociale: 'TechSupply S.p.A.', partita_iva: '55667788990', codice_fiscale: '55667788990',
      codice_sdi: 'W7YVJK9', indirizzo_via: 'Via dell\'Industria 100', indirizzo_cap: '10121',
      indirizzo_comune: 'Torino', indirizzo_provincia: 'TO', indirizzo_nazione: 'IT', tipo_cliente: 'B2B',
    },
    stato: 'registrata' as any,
    righe: [{ id: 'fp1-r1', numero_linea: 1, descrizione: 'Licenza software gestionale', quantita: 1, unita_misura: 'pz' as any, prezzo_unitario: 1200, imponibile: 1200, aliquota_iva: '22', imposta: 264, totale_riga: 1464 }],
    riepilogo_iva: [{ aliquota: '22', imponibile: 1200, imposta: 264, esigibilita: 'I' as any }],
    subtotale: 1200, imponibile_totale: 1200, iva_totale: 264, totale_documento: 1464, totale_da_pagare: 1464,
    scadenze_pagamento: [{ numero_rata: 1, data_scadenza: '2026-03-17', importo: 1464, metodo_pagamento: 'MP05', pagato: false }],
    created_at: '2026-02-15T00:00:00Z', updated_at: '2026-02-15T00:00:00Z',
  },
  {
    id: 'fp-002', tenant_id: 'impresa-leggera', tipo: 'fattura_passiva' as any,
    tipo_documento_sdi: 'TD01', numero: 'FORN-2026-0089', numero_progressivo: 89, anno: 2026,
    data_emissione: '2026-01-28', data_scadenza: '2026-02-28',
    anagrafica_id: 'an-005',
    cliente_snapshot: {
      ragione_sociale: 'Cartoleria Moderna S.r.l.', partita_iva: '11223344556', codice_fiscale: '11223344556',
      codice_sdi: 'M5UXCR1', indirizzo_via: 'Via Mazzini 8', indirizzo_cap: '40126',
      indirizzo_comune: 'Bologna', indirizzo_provincia: 'BO', indirizzo_nazione: 'IT', tipo_cliente: 'B2B',
    },
    stato: 'pagata',
    importo_pagato: 305,
    pagato_at: '2026-02-25T00:00:00Z',
    righe: [{ id: 'fp2-r1', numero_linea: 1, descrizione: 'Materiale ufficio e cancelleria', quantita: 1, unita_misura: 'pz' as any, prezzo_unitario: 250, imponibile: 250, aliquota_iva: '22', imposta: 55, totale_riga: 305 }],
    riepilogo_iva: [{ aliquota: '22', imponibile: 250, imposta: 55, esigibilita: 'I' as any }],
    subtotale: 250, imponibile_totale: 250, iva_totale: 55, totale_documento: 305, totale_da_pagare: 305,
    scadenze_pagamento: [{ numero_rata: 1, data_scadenza: '2026-02-28', importo: 305, metodo_pagamento: 'MP05', pagato: true }],
    created_at: '2026-01-28T00:00:00Z', updated_at: '2026-02-25T00:00:00Z',
  },
  {
    id: 'fp-003', tenant_id: 'impresa-leggera', tipo: 'fattura_passiva' as any,
    tipo_documento_sdi: 'TD01', numero: 'FORN-2026-0201', numero_progressivo: 201, anno: 2026,
    data_emissione: '2026-03-05', data_scadenza: '2026-04-05',
    anagrafica_id: 'an-005',
    cliente_snapshot: {
      ragione_sociale: 'Hosting Italia S.r.l.', partita_iva: '99887766554', codice_fiscale: '99887766554',
      codice_sdi: 'T04ZHR3', indirizzo_via: 'Via Dante 22', indirizzo_cap: '10121',
      indirizzo_comune: 'Torino', indirizzo_provincia: 'TO', indirizzo_nazione: 'IT', tipo_cliente: 'B2B',
    },
    stato: 'registrata' as any,
    righe: [{ id: 'fp3-r1', numero_linea: 1, descrizione: 'Hosting dedicato annuale', quantita: 1, unita_misura: 'anno' as any, prezzo_unitario: 480, imponibile: 480, aliquota_iva: '22', imposta: 105.6, totale_riga: 585.6 }],
    riepilogo_iva: [{ aliquota: '22', imponibile: 480, imposta: 105.6, esigibilita: 'I' as any }],
    subtotale: 480, imponibile_totale: 480, iva_totale: 105.6, totale_documento: 585.6, totale_da_pagare: 585.6,
    scadenze_pagamento: [{ numero_rata: 1, data_scadenza: '2026-04-05', importo: 585.6, metodo_pagamento: 'MP05', pagato: false }],
    created_at: '2026-03-05T00:00:00Z', updated_at: '2026-03-05T00:00:00Z',
  },
];

const FatturePassive = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('tutte');
  const [fatturePassive, setFatturePassive] = useState<DocumentoFiscale[]>(INITIAL_FATTURE);

  // XML import state
  const [importOpen, setImportOpen] = useState(false);
  const [parsedXML, setParsedXML] = useState<ParsedFatturaPA | null>(null);
  const [xmlError, setXmlError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setXmlError('');
    setParsedXML(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      const parsed = parseFatturaPARicevuta(content);
      if (!parsed || !parsed.fornitore.denominazione) {
        setXmlError('File XML non valido o non conforme al formato FatturaPA.');
        return;
      }
      setParsedXML(parsed);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (!parsedXML) return;
    const ivaRate = parsedXML.righe.length > 0 ? parseFloat(parsedXML.righe[0].aliquota_iva) / 100 : 0.22;
    const imponibile = parsedXML.righe.reduce((s, r) => s + r.imponibile, 0);
    const iva = imponibile * ivaRate;
    const newDoc: DocumentoFiscale = {
      id: `fp-import-${Date.now()}`,
      tenant_id: 'impresa-leggera',
      tipo: 'fattura_passiva' as any,
      tipo_documento_sdi: parsedXML.tipo_documento as any,
      numero: parsedXML.numero,
      numero_progressivo: 0,
      anno: new Date(parsedXML.data).getFullYear(),
      data_emissione: parsedXML.data,
      data_scadenza: parsedXML.pagamento.data_scadenza || undefined,
      anagrafica_id: '',
      cliente_snapshot: {
        ragione_sociale: parsedXML.fornitore.denominazione,
        partita_iva: parsedXML.fornitore.partita_iva,
        codice_fiscale: parsedXML.fornitore.partita_iva,
        codice_sdi: '',
        indirizzo_via: parsedXML.fornitore.indirizzo,
        indirizzo_cap: '',
        indirizzo_comune: parsedXML.fornitore.comune,
        indirizzo_provincia: parsedXML.fornitore.provincia,
        indirizzo_nazione: 'IT',
        tipo_cliente: 'B2B',
      },
      stato: 'registrata' as any,
      righe: parsedXML.righe.map((r, i) => ({
        id: `imp-${i}`,
        numero_linea: r.numero_linea,
        descrizione: r.descrizione,
        quantita: r.quantita,
        unita_misura: 'pz' as any,
        prezzo_unitario: r.prezzo_unitario,
        imponibile: r.imponibile,
        aliquota_iva: r.aliquota_iva,
        imposta: r.imponibile * ivaRate,
        totale_riga: r.imponibile * (1 + ivaRate),
      })),
      riepilogo_iva: [{ aliquota: String(ivaRate * 100), imponibile, imposta: iva, esigibilita: 'I' as any }],
      subtotale: imponibile,
      imponibile_totale: imponibile,
      iva_totale: iva,
      totale_documento: parsedXML.totale || imponibile + iva,
      totale_da_pagare: parsedXML.totale || imponibile + iva,
      scadenze_pagamento: parsedXML.pagamento.data_scadenza ? [{
        numero_rata: 1,
        data_scadenza: parsedXML.pagamento.data_scadenza,
        importo: parsedXML.pagamento.importo || parsedXML.totale,
        metodo_pagamento: (parsedXML.pagamento.metodo || 'MP05') as any,
        pagato: false,
      }] : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setFatturePassive(prev => [newDoc, ...prev]);
    setImportOpen(false);
    setParsedXML(null);
    toast({ title: '✓ Fattura importata', description: `Fattura ${parsedXML.numero} da ${parsedXML.fornitore.denominazione} registrata.` });
  };

  // KPIs
  const totalPassive = fatturePassive.reduce((s, f) => s + f.totale_documento, 0);
  const daPagare = fatturePassive.filter(f => f.stato !== 'pagata').reduce((s, f) => s + f.totale_da_pagare, 0);
  const ivaCredito = fatturePassive.reduce((s, f) => s + f.iva_totale, 0);

  const filtered = useMemo(() => {
    let list = [...fatturePassive];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(f => f.numero.toLowerCase().includes(q) || f.cliente_snapshot.ragione_sociale.toLowerCase().includes(q));
    }
    if (tab === 'da_pagare') list = list.filter(f => f.stato !== 'pagata');
    if (tab === 'pagate') list = list.filter(f => f.stato === 'pagata');
    return list;
  }, [search, tab, fatturePassive]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground font-medium">Impresa Leggera › Fatture Passive</p>
          <h1 className="text-2xl font-bold text-foreground">Fatture Passive (Acquisti)</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setImportOpen(true)} variant="outline" className="rounded-full px-5">
            <Upload className="h-4 w-4 mr-1" /> Importa XML
          </Button>
          <Button onClick={() => toast({ title: 'Import SDI', description: 'Importa fatture passive dal Cassetto Fiscale SDI' })} variant="outline" className="rounded-full px-5">
            <Download className="h-4 w-4 mr-1" /> Importa da SDI
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border shadow-sm p-5">
          <p className="text-xs font-medium text-muted-foreground">Totale Acquisti</p>
          <p className="text-xl font-bold font-mono text-foreground mt-1">{fmtCur(totalPassive)}</p>
        </div>
        <div className="bg-card rounded-xl border border-border shadow-sm p-5">
          <p className="text-xs font-medium text-muted-foreground">Da Pagare</p>
          <p className="text-xl font-bold font-mono text-destructive mt-1">{fmtCur(daPagare)}</p>
        </div>
        <div className="bg-card rounded-xl border border-border shadow-sm p-5">
          <p className="text-xs font-medium text-muted-foreground">IVA a Credito</p>
          <p className="text-xl font-bold font-mono text-secondary mt-1">{fmtCur(ivaCredito)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex gap-3 items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cerca numero, fornitore..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="tutte">Tutte ({fatturePassive.length})</TabsTrigger>
            <TabsTrigger value="da_pagare">Da Pagare ({fatturePassive.filter(f => f.stato !== 'pagata').length})</TabsTrigger>
            <TabsTrigger value="pagate">Pagate ({fatturePassive.filter(f => f.stato === 'pagata').length})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState title="Nessuna fattura passiva" description="Importa le fatture dal Cassetto Fiscale SDI o carica un XML." icon={<FileText className="h-10 w-10 text-muted-foreground" />} />
      ) : (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Numero</th>
                  <th className="px-3 py-3 text-left">Fornitore</th>
                  <th className="px-3 py-3 text-left">Data</th>
                  <th className="px-3 py-3 text-left">Scadenza</th>
                  <th className="px-3 py-3 text-right">Imponibile</th>
                  <th className="px-3 py-3 text-right">IVA</th>
                  <th className="px-3 py-3 text-right">Totale</th>
                  <th className="px-3 py-3 text-center">Stato</th>
                  <th className="px-3 py-3 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(f => (
                  <tr key={f.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">{f.numero}</td>
                    <td className="px-3 py-3">
                      <p className="font-medium text-card-foreground text-xs">{f.cliente_snapshot.ragione_sociale}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{f.cliente_snapshot.partita_iva}</p>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground text-xs">{fmtDate(f.data_emissione)}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{f.data_scadenza ? fmtDate(f.data_scadenza) : '—'}</td>
                    <td className="px-3 py-3 text-right font-mono text-muted-foreground text-xs">{fmtCur(f.imponibile_totale)}</td>
                    <td className="px-3 py-3 text-right font-mono text-secondary text-xs">{fmtCur(f.iva_totale)}</td>
                    <td className="px-3 py-3 text-right font-mono font-bold text-foreground">{fmtCur(f.totale_documento)}</td>
                    <td className="px-3 py-3 text-center">
                      <Badge variant={f.stato === 'pagata' ? 'default' : 'secondary'} className={f.stato === 'pagata' ? 'bg-secondary/20 text-secondary hover:bg-secondary/20' : 'bg-accent text-accent-foreground hover:bg-accent'}>
                        {f.stato === 'pagata' ? 'Pagata' : 'Da pagare'}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast({ title: 'Registra pagamento' })}><Send className="h-4 w-4 mr-2" /> Registra pagamento</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/admin/fatturazione/nuova?tipo=autofattura`)}><ArrowRight className="h-4 w-4 mr-2" /> Crea autofattura</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem><Download className="h-4 w-4 mr-2" /> Scarica XML</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* XML Import Dialog */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FileCode className="h-5 w-5" /> Importa Fattura XML</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs">File XML FatturaPA</Label>
              <Input ref={fileRef} type="file" accept=".xml" onChange={handleFileSelect} className="text-sm mt-1" />
            </div>
            {xmlError && (
              <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-xs flex items-center gap-2">
                <X className="h-4 w-4 shrink-0" /> {xmlError}
              </div>
            )}
            {parsedXML && (
              <div className="bg-muted rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-semibold text-foreground">Fattura parsata con successo</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-muted-foreground">Fornitore:</span> <span className="font-medium">{parsedXML.fornitore.denominazione}</span></div>
                  <div><span className="text-muted-foreground">P.IVA:</span> <span className="font-mono">{parsedXML.fornitore.partita_iva}</span></div>
                  <div><span className="text-muted-foreground">Numero:</span> <span className="font-mono">{parsedXML.numero}</span></div>
                  <div><span className="text-muted-foreground">Data:</span> <span>{parsedXML.data}</span></div>
                  <div><span className="text-muted-foreground">Totale:</span> <span className="font-bold">{fmtCur(parsedXML.totale)}</span></div>
                  <div><span className="text-muted-foreground">Righe:</span> <span>{parsedXML.righe.length}</span></div>
                </div>
                {parsedXML.righe.length > 0 && (
                  <div className="border-t border-border pt-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Dettaglio righe</p>
                    {parsedXML.righe.slice(0, 5).map((r, i) => (
                      <div key={i} className="flex justify-between text-xs py-0.5">
                        <span className="truncate flex-1">{r.descrizione}</span>
                        <span className="font-mono ml-2">{fmtCur(r.imponibile)}</span>
                      </div>
                    ))}
                    {parsedXML.righe.length > 5 && <p className="text-[10px] text-muted-foreground">... e altre {parsedXML.righe.length - 5} righe</p>}
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setImportOpen(false); setParsedXML(null); setXmlError(''); }}>Annulla</Button>
            <Button disabled={!parsedXML} onClick={handleConfirmImport}>
              <CheckCircle className="h-4 w-4 mr-1" /> Conferma importazione
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FatturePassive;
