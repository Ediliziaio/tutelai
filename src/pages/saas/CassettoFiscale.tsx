import { useState } from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import {
  Send, CheckCircle, XCircle, AlertTriangle, Clock, FileText,
  Download, RefreshCw, ChevronDown, ChevronRight, Search,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { StatCard } from '@/components/saas/StatCard';
import { cn } from '@/lib/utils';
import type { SdiLogEntry } from '@/types/fatturazione';

// ── SDI Status config ──
const STATI_SDI: Record<string, { label: string; colorClass: string; icon: React.ComponentType<{ className?: string }> }> = {
  AT: { label: 'Trasmessa', colorClass: 'bg-primary/10 text-primary border-primary/20', icon: Send },
  RC: { label: 'Consegnata', colorClass: 'bg-secondary/10 text-secondary border-secondary/20', icon: CheckCircle },
  NS: { label: 'Scartata', colorClass: 'bg-destructive/10 text-destructive border-destructive/20', icon: XCircle },
  MC: { label: 'Mancata consegna', colorClass: 'bg-accent/10 text-accent border-accent/20', icon: AlertTriangle },
  EC: { label: 'Esito committente', colorClass: 'bg-violet-100 text-violet-700 border-violet-200', icon: FileText },
  DT: { label: 'Decorrenza termini', colorClass: 'bg-muted text-muted-foreground border-border', icon: Clock },
};

// ── Mock SDI Data ──
interface CassettoDoc {
  id: string;
  numero: string;
  data_emissione: string;
  cliente: string;
  importo: number;
  stato_sdi: string;
  sdi_id: string;
  ultima_notifica: string;
  log: SdiLogEntry[];
}

const mockCassettoDocs: CassettoDoc[] = [
  {
    id: 'df-001', numero: 'FT-2026-0011', data_emissione: '2026-03-01',
    cliente: 'Edil Bianchi S.r.l.', importo: 610,
    stato_sdi: 'RC', sdi_id: 'IT12345678901_00011', ultima_notifica: '2026-03-02T14:30:00Z',
    log: [
      { id: 'sl1', tenant_id: 'il', documento_id: 'df-001', evento: 'invio', sdi_id: 'IT12345678901_00011', tipo_notifica: 'AT', messaggio: 'Documento trasmesso a SDI', created_at: '2026-03-01T10:05:00Z' },
      { id: 'sl2', tenant_id: 'il', documento_id: 'df-001', evento: 'ricevuta_consegna', sdi_id: 'IT12345678901_00011', tipo_notifica: 'RC', messaggio: 'Fattura consegnata al destinatario', created_at: '2026-03-02T14:30:00Z' },
    ],
  },
  {
    id: 'df-002', numero: 'NC-2026-0001', data_emissione: '2026-02-28',
    cliente: 'Studio Tecnico Verdi', importo: 61,
    stato_sdi: 'RC', sdi_id: 'IT12345678901_NC001', ultima_notifica: '2026-03-01T09:15:00Z',
    log: [
      { id: 'sl3', tenant_id: 'il', documento_id: 'df-002', evento: 'invio', tipo_notifica: 'AT', messaggio: 'Nota di credito trasmessa a SDI', created_at: '2026-02-28T15:00:00Z' },
      { id: 'sl4', tenant_id: 'il', documento_id: 'df-002', evento: 'ricevuta_consegna', tipo_notifica: 'RC', messaggio: 'Consegnata al destinatario', created_at: '2026-03-01T09:15:00Z' },
    ],
  },
  {
    id: 'df-005', numero: 'FT-2026-0013', data_emissione: '2026-03-08',
    cliente: 'Costruzioni Rossi S.r.l.', importo: 1220,
    stato_sdi: 'AT', sdi_id: 'IT12345678901_00013', ultima_notifica: '2026-03-08T16:00:00Z',
    log: [
      { id: 'sl5', tenant_id: 'il', documento_id: 'df-005', evento: 'invio', tipo_notifica: 'AT', messaggio: 'Documento trasmesso, in attesa di consegna', created_at: '2026-03-08T16:00:00Z' },
    ],
  },
  {
    id: 'df-006', numero: 'FT-2026-0014', data_emissione: '2026-03-09',
    cliente: 'Impiantistica Neri', importo: 450,
    stato_sdi: 'NS', sdi_id: 'IT12345678901_00014', ultima_notifica: '2026-03-09T18:00:00Z',
    log: [
      { id: 'sl6', tenant_id: 'il', documento_id: 'df-006', evento: 'invio', tipo_notifica: 'AT', messaggio: 'Documento trasmesso a SDI', created_at: '2026-03-09T14:00:00Z' },
      { id: 'sl7', tenant_id: 'il', documento_id: 'df-006', evento: 'scarto', tipo_notifica: 'NS', messaggio: 'Scartato: codice destinatario non valido', errori: [{ codice: '00311', descrizione: 'Codice Destinatario non attivo' }], created_at: '2026-03-09T18:00:00Z' },
    ],
  },
  {
    id: 'df-007', numero: 'FT-2026-0015', data_emissione: '2026-03-10',
    cliente: 'Comune di Bergamo', importo: 1537.20,
    stato_sdi: 'EC', sdi_id: 'IT12345678901_00015', ultima_notifica: '2026-03-12T10:00:00Z',
    log: [
      { id: 'sl8', tenant_id: 'il', documento_id: 'df-007', evento: 'invio', tipo_notifica: 'AT', messaggio: 'Documento trasmesso a SDI', created_at: '2026-03-10T09:30:00Z' },
      { id: 'sl9', tenant_id: 'il', documento_id: 'df-007', evento: 'ricevuta_consegna', tipo_notifica: 'RC', messaggio: 'Consegnata alla PA', created_at: '2026-03-10T15:00:00Z' },
      { id: 'sl10', tenant_id: 'il', documento_id: 'df-007', evento: 'notifica_esito', tipo_notifica: 'EC', messaggio: 'Esito committente: accettata', created_at: '2026-03-12T10:00:00Z' },
    ],
  },
  {
    id: 'df-008', numero: 'FT-2026-0016', data_emissione: '2026-02-20',
    cliente: 'Arredo Design Lux S.r.l.', importo: 780,
    stato_sdi: 'MC', sdi_id: 'IT12345678901_00016', ultima_notifica: '2026-02-22T08:00:00Z',
    log: [
      { id: 'sl11', tenant_id: 'il', documento_id: 'df-008', evento: 'invio', tipo_notifica: 'AT', messaggio: 'Documento trasmesso a SDI', created_at: '2026-02-20T11:00:00Z' },
      { id: 'sl12', tenant_id: 'il', documento_id: 'df-008', evento: 'ricevuta_consegna', tipo_notifica: 'MC', messaggio: 'Mancata consegna: casella PEC piena. Documento reso disponibile nel cassetto fiscale.', created_at: '2026-02-22T08:00:00Z' },
    ],
  },
];

const formatEuro = (n: number) => n.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const SdiBadge = ({ stato }: { stato: string }) => {
  const config = STATI_SDI[stato];
  if (!config) return <Badge variant="outline">{stato}</Badge>;
  const Icon = config.icon;
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold', config.colorClass)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
};

const CassettoFiscale = ({ readOnly = false }: { readOnly?: boolean }) => {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = mockCassettoDocs.filter(d =>
    d.numero.toLowerCase().includes(search.toLowerCase()) ||
    d.cliente.toLowerCase().includes(search.toLowerCase()) ||
    d.sdi_id.toLowerCase().includes(search.toLowerCase())
  );

  const kpis = {
    trasmesse: mockCassettoDocs.filter(d => d.stato_sdi === 'AT').length,
    consegnate: mockCassettoDocs.filter(d => ['RC', 'EC', 'DT'].includes(d.stato_sdi)).length,
    scartate: mockCassettoDocs.filter(d => d.stato_sdi === 'NS').length,
    inAttesa: mockCassettoDocs.filter(d => d.stato_sdi === 'MC').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-subtitle text-foreground">Cassetto Fiscale SDI</h1>
          <p className="text-sm text-muted-foreground">Monitoraggio trasmissioni e notifiche Sistema di Interscambio</p>
        </div>
        {!readOnly && (
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" /> Aggiorna
          </Button>
        )}
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Trasmesse" value={kpis.trasmesse} icon={Send} />
        <StatCard label="Consegnate" value={kpis.consegnate} icon={CheckCircle} />
        <StatCard label="Scartate" value={kpis.scartate} icon={XCircle} />
        <StatCard label="In attesa" value={kpis.inAttesa} icon={AlertTriangle} />
      </div>

      {/* Search + Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <CardTitle className="text-lg">Documenti trasmessi</CardTitle>
            <div className="relative sm:ml-auto sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca numero, cliente, ID SDI..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead>Numero</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Importo</TableHead>
                <TableHead>Stato SDI</TableHead>
                <TableHead className="hidden lg:table-cell">ID Trasmissione</TableHead>
                <TableHead className="hidden md:table-cell">Ultima notifica</TableHead>
                {!readOnly && <TableHead className="text-right">Azioni</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(doc => {
                const isExpanded = expandedId === doc.id;
                return (
                  <TableRow key={doc.id} className="group">
                    <TableCell>
                      <button onClick={() => setExpandedId(isExpanded ? null : doc.id)} className="text-muted-foreground hover:text-foreground">
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>
                    </TableCell>
                    <TableCell className="font-mono text-xs font-semibold">{doc.numero}</TableCell>
                    <TableCell className="text-sm">{format(new Date(doc.data_emissione), 'dd/MM/yyyy')}</TableCell>
                    <TableCell className="text-sm font-medium">{doc.cliente}</TableCell>
                    <TableCell className="text-right font-mono text-sm">€ {formatEuro(doc.importo)}</TableCell>
                    <TableCell><SdiBadge stato={doc.stato_sdi} /></TableCell>
                    <TableCell className="hidden lg:table-cell font-mono text-xs text-muted-foreground">{doc.sdi_id}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                      {format(new Date(doc.ultima_notifica), 'dd/MM HH:mm', { locale: it })}
                    </TableCell>
                    {!readOnly && (
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="icon" className="h-7 w-7" title="Scarica XML">
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          {doc.stato_sdi === 'NS' && (
                            <Button variant="ghost" size="icon" className="h-7 w-7" title="Reinvia">
                              <RefreshCw className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
              {/* Expanded log rows */}
              {filtered.map(doc => {
                if (expandedId !== doc.id) return null;
                return (
                  <TableRow key={`${doc.id}-log`}>
                    <TableCell colSpan={9} className="bg-muted/30 p-0">
                      <div className="px-8 py-4">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Timeline SDI</h4>
                        <div className="space-y-3">
                          {doc.log.map((entry, i) => {
                            const sdiConfig = entry.tipo_notifica ? STATI_SDI[entry.tipo_notifica] : null;
                            return (
                              <div key={entry.id} className="flex gap-3 items-start">
                                <div className="flex flex-col items-center">
                                  <div className={cn(
                                    'h-6 w-6 rounded-full flex items-center justify-center shrink-0',
                                    entry.tipo_notifica === 'NS' ? 'bg-destructive/10' :
                                    entry.tipo_notifica === 'RC' ? 'bg-secondary/10' :
                                    entry.tipo_notifica === 'EC' ? 'bg-violet-100' :
                                    'bg-primary/10'
                                  )}>
                                    {sdiConfig ? <sdiConfig.icon className="h-3 w-3" /> : <Send className="h-3 w-3 text-primary" />}
                                  </div>
                                  {i < doc.log.length - 1 && <div className="w-px h-4 bg-border" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold">{sdiConfig?.label || entry.evento}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {format(new Date(entry.created_at), 'dd/MM/yyyy HH:mm', { locale: it })}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-0.5">{entry.messaggio}</p>
                                  {entry.errori?.map((err, j) => (
                                    <p key={j} className="text-xs text-destructive mt-1">
                                      Errore {err.codice}: {err.descrizione}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CassettoFiscale;
