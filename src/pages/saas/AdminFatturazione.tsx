import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import {
  TrendingUp, Clock, AlertCircle, BarChart3, Search, Plus, Download,
  FileText, CheckCircle, Send, Copy, Trash2, MoreHorizontal, ArrowUpDown,
  ChevronLeft, ChevronRight, Banknote, RotateCcw,
} from 'lucide-react';
import { StatCard } from '@/components/saas/StatCard';
import { StatusBadge } from '@/components/saas/StatusBadge';
import { EmptyState } from '@/components/saas/EmptyState';
import { mockFatture, mockTenants, getTenantById } from '@/data/mockDashboardData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import type { StatoFattura } from '@/types/auth';

function fmtCur(n: number) { return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n); }
function fmtDate(d: string) { try { return format(new Date(d), 'dd/MM/yyyy', { locale: it }); } catch { return d; } }

type SortCol = 'numero' | 'data_emissione' | 'data_scadenza' | 'totale';

const AdminFatturazione = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statoFilter, setStatoFilter] = useState<string>('tutte');
  const [clienteFilter, setClienteFilter] = useState<string>('tutti');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortCol, setSortCol] = useState<SortCol>('data_emissione');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // KPIs
  const fatturateMese = mockFatture.filter(f => {
    const d = new Date(f.data_emissione);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear && ['pagata', 'inviata'].includes(f.stato);
  }).reduce((s, f) => s + f.totale, 0);

  const daIncassare = mockFatture.filter(f => f.stato === 'inviata' && new Date(f.data_scadenza) >= now).reduce((s, f) => s + f.totale, 0);
  const scaduto = mockFatture.filter(f => f.stato === 'scaduta').reduce((s, f) => s + f.totale, 0);
  const scaduteCount = mockFatture.filter(f => f.stato === 'scaduta').length;
  const fatturatoAnno = mockFatture.filter(f => new Date(f.data_emissione).getFullYear() === currentYear && f.stato === 'pagata').reduce((s, f) => s + f.totale, 0);
  const targetAnno = 120000;

  // Filter
  const filtered = useMemo(() => {
    let list = [...mockFatture];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(f => {
        const t = getTenantById(f.tenant_id);
        return f.numero.toLowerCase().includes(q) || t?.ragione_sociale.toLowerCase().includes(q);
      });
    }
    if (statoFilter !== 'tutte') list = list.filter(f => f.stato === statoFilter);
    if (clienteFilter !== 'tutti') list = list.filter(f => f.tenant_id === clienteFilter);
    list.sort((a, b) => {
      let cmp = 0;
      if (sortCol === 'totale') cmp = a.totale - b.totale;
      else cmp = (a[sortCol] ?? '').localeCompare(b[sortCol] ?? '');
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [search, statoFilter, clienteFilter, sortCol, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (col: SortCol) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('desc'); }
  };

  const toggleAll = () => {
    if (selected.size === paginated.length) setSelected(new Set());
    else setSelected(new Set(paginated.map(f => f.id)));
  };

  const scadenzaColor = (d: string, stato: string) => {
    if (stato === 'pagata' || stato === 'annullata' || stato === 'bozza') return '';
    const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
    if (diff < 0) return 'text-red-600 font-semibold';
    if (diff <= 7) return 'text-amber-600 font-semibold';
    return '';
  };

  const clientiUnici = [...new Set(mockFatture.map(f => f.tenant_id))].map(id => getTenantById(id)).filter(Boolean);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400 font-medium">Impresa Leggera › Fatturazione</p>
          <h1 className="text-2xl font-bold text-slate-900">Fatturazione</h1>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-sky-500 hover:bg-sky-600 rounded-full px-5">
                <Plus className="h-4 w-4 mr-1" /> Nuovo Documento
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/admin/fatturazione/nuova')}><FileText className="h-4 w-4 mr-2" /> Fattura</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/admin/fatturazione/nuova?tipo=proforma')}><FileText className="h-4 w-4 mr-2" /> Pro-forma / Preventivo</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/admin/fatturazione/nuova?tipo=nota_credito')}><RotateCcw className="h-4 w-4 mr-2" /> Nota di Credito</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/admin/fatturazione/nuova?tipo=nota_debito')}><FileText className="h-4 w-4 mr-2" /> Nota di Debito</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/admin/fatturazione/nuova?tipo=ddt')}><FileText className="h-4 w-4 mr-2" /> DDT</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/admin/fatturazione/nuova?tipo=autofattura')}><FileText className="h-4 w-4 mr-2" /> Autofattura (TD16-TD20)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Fatturato Mese" value={fmtCur(fatturateMese)} icon={TrendingUp} trend={{ value: 8, label: 'vs mese scorso' }} />
        <StatCard label="Da Incassare" value={fmtCur(daIncassare)} icon={Clock} />
        <StatCard label="Scaduto" value={fmtCur(scaduto)} icon={AlertCircle} />
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.06)] p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">Fatturato Anno</p>
            <p className="text-2xl font-bold font-subtitle tracking-tight text-slate-900">{fmtCur(fatturatoAnno)}</p>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
              <div className="bg-violet-500 h-2 rounded-full transition-all" style={{ width: `${Math.min((fatturatoAnno / targetAnno) * 100, 100)}%` }} />
            </div>
            <p className="text-xs text-slate-400">{Math.round((fatturatoAnno / targetAnno) * 100)}% del target {fmtCur(targetAnno)}</p>
          </div>
        </div>
      </div>

      {/* Filters + Tabs */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Cerca numero, cliente..." className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <Select value={clienteFilter} onValueChange={v => { setClienteFilter(v); setPage(1); }}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Tutti i clienti" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tutti">Tutti i clienti</SelectItem>
              {clientiUnici.map(c => c && <SelectItem key={c.id} value={c.id}>{c.ragione_sociale}</SelectItem>)}
            </SelectContent>
          </Select>
          {(search || clienteFilter !== 'tutti' || statoFilter !== 'tutte') && (
            <Button variant="ghost" size="sm" className="text-slate-400" onClick={() => { setSearch(''); setStatoFilter('tutte'); setClienteFilter('tutti'); }}>
              Reset filtri
            </Button>
          )}
          <div className="ml-auto">
            <Button variant="ghost" size="sm" onClick={() => toast({ title: 'Export CSV in arrivo', description: 'Funzionalità disponibile con Lovable Cloud' })}>
              <Download className="h-4 w-4 mr-1" /> Esporta
            </Button>
          </div>
        </div>
        <Tabs value={statoFilter} onValueChange={v => { setStatoFilter(v); setPage(1); }}>
          <TabsList>
            <TabsTrigger value="tutte">Tutte ({mockFatture.length})</TabsTrigger>
            <TabsTrigger value="inviata">Da Incassare ({mockFatture.filter(f => f.stato === 'inviata').length})</TabsTrigger>
            <TabsTrigger value="pagata">Pagate ({mockFatture.filter(f => f.stato === 'pagata').length})</TabsTrigger>
            <TabsTrigger value="scaduta">Scadute ({scaduteCount})</TabsTrigger>
            <TabsTrigger value="bozza">Bozze ({mockFatture.filter(f => f.stato === 'bozza').length})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState title="Nessuna fattura trovata" description="Modifica i filtri o crea una nuova fattura." icon={<FileText className="h-10 w-10 text-slate-300" />}>
          <Button onClick={() => navigate('/admin/fatturazione/nuova')}><Plus className="h-4 w-4 mr-1" /> Nuova Fattura</Button>
        </EmptyState>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          {selected.size > 0 && (
            <div className="flex items-center gap-3 px-4 py-2 bg-sky-50 border-b text-sm">
              <span className="font-medium text-sky-700">{selected.size} selezionate</span>
              <Button size="sm" variant="ghost" onClick={() => toast({ title: 'Invio multiplo', description: 'Funzionalità disponibile con Lovable Cloud' })}><Send className="h-3.5 w-3.5 mr-1" /> Invia tutte</Button>
              <Button size="sm" variant="ghost"><Download className="h-3.5 w-3.5 mr-1" /> Esporta</Button>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="pl-4 pr-2 py-3 w-10"><Checkbox checked={selected.size === paginated.length && paginated.length > 0} onCheckedChange={toggleAll} /></th>
                  <th className="px-3 py-3 text-left cursor-pointer select-none" onClick={() => toggleSort('numero')}>
                    <span className="flex items-center gap-1">Numero <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
                  <th className="px-3 py-3 text-left">Cliente</th>
                  <th className="px-3 py-3 text-left cursor-pointer select-none" onClick={() => toggleSort('data_emissione')}>
                    <span className="flex items-center gap-1">Emissione <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
                  <th className="px-3 py-3 text-left cursor-pointer select-none" onClick={() => toggleSort('data_scadenza')}>
                    <span className="flex items-center gap-1">Scadenza <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
                  <th className="px-3 py-3 text-right cursor-pointer select-none" onClick={() => toggleSort('totale')}>
                    <span className="flex items-center justify-end gap-1">Totale <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
                  <th className="px-3 py-3 text-center">Stato</th>
                  <th className="px-3 py-3 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(f => {
                  const tenant = getTenantById(f.tenant_id);
                  return (
                    <tr key={f.id} className="border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer transition-colors" onClick={() => navigate(`/admin/fatturazione/${f.id}/modifica`)}>
                      <td className="pl-4 pr-2 py-3" onClick={e => e.stopPropagation()}>
                        <Checkbox checked={selected.has(f.id)} onCheckedChange={() => setSelected(prev => { const n = new Set(prev); n.has(f.id) ? n.delete(f.id) : n.add(f.id); return n; })} />
                      </td>
                      <td className="px-3 py-3 font-mono text-xs font-semibold text-slate-700">{f.numero}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-sky-50 text-sky-700 text-[10px] font-bold">
                            {tenant?.ragione_sociale.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 text-xs">{tenant?.ragione_sociale}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{tenant?.partita_iva}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-slate-600 text-xs">{fmtDate(f.data_emissione)}</td>
                      <td className={`px-3 py-3 text-xs ${scadenzaColor(f.data_scadenza, f.stato)}`}>{fmtDate(f.data_scadenza)}</td>
                      <td className="px-3 py-3 text-right font-mono font-bold text-slate-900">{fmtCur(f.totale)}</td>
                      <td className="px-3 py-3 text-center"><StatusBadge status={f.stato as any} /></td>
                      <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/admin/fatturazione/${f.id}/modifica`)}><FileText className="h-4 w-4 mr-2" /> Apri</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast({ title: 'PDF scaricato' })}><Download className="h-4 w-4 mr-2" /> Scarica PDF</DropdownMenuItem>
                            {f.stato === 'inviata' && <DropdownMenuItem onClick={() => toast({ title: 'Fattura segnata come pagata' })}><CheckCircle className="h-4 w-4 mr-2" /> Segna pagata</DropdownMenuItem>}
                            {f.stato === 'inviata' && <DropdownMenuItem onClick={() => toast({ title: 'Registra incasso', description: 'Usa lo Scadenzario per registrare incassi' })}><Banknote className="h-4 w-4 mr-2" /> Registra incasso</DropdownMenuItem>}
                            {f.stato === 'bozza' && <DropdownMenuItem onClick={() => toast({ title: 'Fattura inviata' })}><Send className="h-4 w-4 mr-2" /> Invia</DropdownMenuItem>}
                            {['inviata', 'pagata'].includes(f.stato) && <DropdownMenuItem onClick={() => navigate(`/admin/fatturazione/nuova?tipo=nota_credito&da_fattura=${f.id}`)}><RotateCcw className="h-4 w-4 mr-2" /> Emetti nota di credito</DropdownMenuItem>}
                            {['inviata', 'pagata'].includes(f.stato) && <DropdownMenuItem onClick={() => navigate(`/admin/fatturazione/nuova?tipo=nota_debito`)}><FileText className="h-4 w-4 mr-2" /> Emetti nota di debito</DropdownMenuItem>}
                            <DropdownMenuItem onClick={() => toast({ title: 'Fattura duplicata' })}><Copy className="h-4 w-4 mr-2" /> Duplica</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600"><Trash2 className="h-4 w-4 mr-2" /> Elimina</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t bg-slate-50/30 text-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <span>Righe:</span>
              <Select value={String(perPage)} onValueChange={v => { setPerPage(Number(v)); setPage(1); }}>
                <SelectTrigger className="h-8 w-16"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="25">25</SelectItem><SelectItem value="50">50</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Pag. {page} di {totalPages || 1}</span>
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFatturazione;
