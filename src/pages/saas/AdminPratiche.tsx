import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockPratiche, mockTenants, mockOperatori, timeAgo, daysUntil } from '@/data/mockDashboardData';
import { StatusBadge } from '@/components/saas/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, List, LayoutGrid, Filter, MoreHorizontal, Search, X, AlertTriangle, Clock, CheckCircle2, Pause, FileText, Zap, Phone, Building2, Mail, HelpCircle, ChevronDown, Eye, UserPlus, ArrowRight, Trash2, MessageSquare, Paperclip, ListChecks } from 'lucide-react';
import type { StatoPratica, TipoPratica, Priorita } from '@/types/auth';
import { mockCommentiPratica, mockAllegatiPratica, mockTaskPratica } from '@/data/mockDashboardData';

const tipoBadgeColors: Record<TipoPratica, string> = {
  fattura: 'bg-sky-100 text-sky-700',
  enea: 'bg-emerald-100 text-emerald-700',
  finanziamento: 'bg-amber-100 text-amber-700',
  call_center: 'bg-violet-100 text-violet-700',
  segreteria: 'bg-pink-100 text-pink-700',
  recupero_crediti: 'bg-red-100 text-red-700',
  altro: 'bg-slate-100 text-slate-600',
};

const tipoLabels: Record<TipoPratica, string> = {
  fattura: 'Fattura',
  enea: 'ENEA',
  finanziamento: 'Finanz.',
  call_center: 'Call Center',
  segreteria: 'Segreteria',
  recupero_crediti: 'Recupero',
  altro: 'Altro',
};

const tipoIcons: Record<TipoPratica, React.ElementType> = {
  fattura: FileText,
  enea: Building2,
  finanziamento: Zap,
  call_center: Phone,
  segreteria: Mail,
  recupero_crediti: AlertTriangle,
  altro: HelpCircle,
};

const prioritaDots: Record<Priorita, string> = {
  urgente: 'bg-red-500 animate-pulse',
  alta: 'bg-amber-500',
  normale: 'bg-sky-500',
  bassa: 'bg-slate-400',
};

const kanbanColumns: { stato: StatoPratica; label: string; color: string; borderColor: string }[] = [
  { stato: 'in_attesa', label: 'In Attesa', color: 'bg-amber-50', borderColor: 'border-amber-300' },
  { stato: 'in_corso', label: 'In Corso', color: 'bg-sky-50', borderColor: 'border-sky-300' },
  { stato: 'in_revisione', label: 'In Revisione', color: 'bg-violet-50', borderColor: 'border-violet-300' },
  { stato: 'completata', label: 'Completata', color: 'bg-emerald-50', borderColor: 'border-emerald-300' },
  { stato: 'annullata', label: 'Annullata', color: 'bg-slate-50', borderColor: 'border-slate-200' },
];

const AdminPratiche = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'lista' | 'kanban'>('lista');
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState('');
  const [filterTipo, setFilterTipo] = useState('tutti');
  const [filterStato, setFilterStato] = useState('tutti');
  const [filterPriorita, setFilterPriorita] = useState('tutti');
  const [filterOperatore, setFilterOperatore] = useState('tutti');
  const [filterCliente, setFilterCliente] = useState('tutti');
  const [soloUrgenti, setSoloUrgenti] = useState(false);
  const [soloScadute, setSoloScadute] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let result = [...mockPratiche];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.codice.toLowerCase().includes(q) || p.titolo.toLowerCase().includes(q) || mockTenants.find(t => t.id === p.tenant_id)?.ragione_sociale.toLowerCase().includes(q));
    }
    if (filterTipo !== 'tutti') result = result.filter(p => p.tipo === filterTipo);
    if (filterStato !== 'tutti') result = result.filter(p => p.stato === filterStato);
    if (filterPriorita !== 'tutti') result = result.filter(p => p.priorita === filterPriorita);
    if (filterOperatore !== 'tutti') result = result.filter(p => p.operatore_id === filterOperatore);
    if (filterCliente !== 'tutti') result = result.filter(p => p.tenant_id === filterCliente);
    if (soloUrgenti) result = result.filter(p => p.priorita === 'urgente');
    if (soloScadute) result = result.filter(p => p.stato === 'scaduta' || (p.scadenza && daysUntil(p.scadenza) < 0));
    return result;
  }, [search, filterTipo, filterStato, filterPriorita, filterOperatore, filterCliente, soloUrgenti, soloScadute]);

  const statsCounts = useMemo(() => ({
    in_attesa: mockPratiche.filter(p => p.stato === 'in_attesa').length,
    in_corso: mockPratiche.filter(p => p.stato === 'in_corso').length,
    completata: mockPratiche.filter(p => p.stato === 'completata').length,
    scaduta: mockPratiche.filter(p => p.stato === 'scaduta').length,
  }), []);

  const toggleSelect = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(s => s.length === filtered.length ? [] : filtered.map(p => p.id));

  const resetFilters = () => {
    setSearch(''); setFilterTipo('tutti'); setFilterStato('tutti'); setFilterPriorita('tutti');
    setFilterOperatore('tutti'); setFilterCliente('tutti'); setSoloUrgenti(false); setSoloScadute(false);
  };

  const getCommentCount = (id: string) => mockCommentiPratica.filter(c => c.pratica_id === id).length;
  const getAttachCount = (id: string) => mockAllegatiPratica.filter(a => a.pratica_id === id).length;
  const getTaskInfo = (id: string) => {
    const tasks = mockTaskPratica.filter(t => t.pratica_id === id);
    const done = tasks.filter(t => t.stato === 'completato').length;
    return { total: tasks.length, done };
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-subtitle text-slate-900">Pratiche</h1>
          <p className="text-sm text-slate-500">{mockPratiche.length} totali</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            <Button variant={view === 'lista' ? 'default' : 'ghost'} size="sm" onClick={() => setView('lista')} className="gap-1.5">
              <List className="h-4 w-4" /> Lista
            </Button>
            <Button variant={view === 'kanban' ? 'default' : 'ghost'} size="sm" onClick={() => setView('kanban')} className="gap-1.5">
              <LayoutGrid className="h-4 w-4" /> Kanban
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-1.5">
            <Filter className="h-4 w-4" /> Filtri
          </Button>
          <Button size="sm" onClick={() => navigate('/admin/pratiche/nuova')} className="gap-1.5">
            <Plus className="h-4 w-4" /> Crea Pratica
          </Button>
        </div>
      </div>

      {/* Stats mini */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'In Attesa', count: statsCounts.in_attesa, icon: Pause, color: 'text-amber-600 bg-amber-50' },
          { label: 'In Corso', count: statsCounts.in_corso, icon: Clock, color: 'text-sky-600 bg-sky-50' },
          { label: 'Completate', count: statsCounts.completata, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Scadute', count: statsCounts.scaduta, icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
        ].map(s => (
          <div key={s.label} className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${s.color}`}>
            <s.icon className="h-4 w-4" />
            <span className="text-sm font-medium">{s.label}</span>
            <span className="ml-auto font-bold font-mono text-lg">{s.count}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-slate-50 border rounded-xl p-4 mb-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="relative sm:col-span-2 lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Cerca codice, titolo, cliente..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="tutti">Tutti i tipi</SelectItem>
                <SelectItem value="fattura">Fattura</SelectItem>
                <SelectItem value="enea">ENEA</SelectItem>
                <SelectItem value="finanziamento">Finanziamento</SelectItem>
                <SelectItem value="call_center">Call Center</SelectItem>
                <SelectItem value="segreteria">Segreteria</SelectItem>
                <SelectItem value="recupero_crediti">Recupero Crediti</SelectItem>
                <SelectItem value="altro">Altro</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStato} onValueChange={setFilterStato}>
              <SelectTrigger><SelectValue placeholder="Stato" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="tutti">Tutti gli stati</SelectItem>
                <SelectItem value="bozza">Bozza</SelectItem>
                <SelectItem value="in_attesa">In Attesa</SelectItem>
                <SelectItem value="in_corso">In Corso</SelectItem>
                <SelectItem value="in_revisione">In Revisione</SelectItem>
                <SelectItem value="completata">Completata</SelectItem>
                <SelectItem value="scaduta">Scaduta</SelectItem>
                <SelectItem value="annullata">Annullata</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriorita} onValueChange={setFilterPriorita}>
              <SelectTrigger><SelectValue placeholder="Priorità" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="tutti">Tutte</SelectItem>
                <SelectItem value="urgente">Urgente</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="normale">Normale</SelectItem>
                <SelectItem value="bassa">Bassa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterOperatore} onValueChange={setFilterOperatore}>
              <SelectTrigger><SelectValue placeholder="Operatore" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="tutti">Tutti</SelectItem>
                {mockOperatori.map(o => <SelectItem key={o.id} value={o.id}>{o.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Select value={filterCliente} onValueChange={setFilterCliente}>
              <SelectTrigger className="w-[220px]"><SelectValue placeholder="Cliente" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="tutti">Tutti i clienti</SelectItem>
                {mockTenants.filter(t => t.stato === 'attivo').map(t => <SelectItem key={t.id} value={t.id}>{t.ragione_sociale}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant={soloUrgenti ? 'default' : 'outline'} size="sm" onClick={() => setSoloUrgenti(!soloUrgenti)} className="gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" /> Solo urgenti
            </Button>
            <Button variant={soloScadute ? 'destructive' : 'outline'} size="sm" onClick={() => setSoloScadute(!soloScadute)} className="gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Solo scadute
            </Button>
            <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1.5 text-slate-500">
              <X className="h-3.5 w-3.5" /> Reset
            </Button>
          </div>
        </div>
      )}

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="bg-sky-50 border border-sky-200 rounded-lg px-4 py-2 mb-4 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-sky-700">{selected.length} selezionate</span>
          <Button size="sm" variant="outline" className="gap-1.5"><UserPlus className="h-3.5 w-3.5" /> Assegna a</Button>
          <Button size="sm" variant="outline" className="gap-1.5"><ArrowRight className="h-3.5 w-3.5" /> Cambia stato</Button>
          <Button size="sm" variant="outline" className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /> Elimina</Button>
        </div>
      )}

      {/* Vista Lista */}
      {view === 'lista' && (
        <div className="bg-white border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"><Checkbox checked={selected.length === filtered.length && filtered.length > 0} onCheckedChange={toggleAll} /></TableHead>
                <TableHead className="w-8">P</TableHead>
                <TableHead>Codice</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="min-w-[200px]">Titolo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Operatore</TableHead>
                <TableHead>Scadenza</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(p => {
                const tenant = mockTenants.find(t => t.id === p.tenant_id);
                const op = mockOperatori.find(o => o.id === p.operatore_id);
                const days = p.scadenza ? daysUntil(p.scadenza) : null;
                const isUrgent = p.priorita === 'urgente';
                const comments = getCommentCount(p.id);
                const attachments = getAttachCount(p.id);
                const taskInfo = getTaskInfo(p.id);
                return (
                  <TableRow key={p.id} className={`cursor-pointer ${isUrgent ? 'bg-red-50/30 border-l-4 border-l-red-400' : ''}`} onClick={() => navigate(`/admin/pratiche/${p.id}`)}>
                    <TableCell onClick={e => e.stopPropagation()}>
                      <Checkbox checked={selected.includes(p.id)} onCheckedChange={() => toggleSelect(p.id)} />
                    </TableCell>
                    <TableCell><span className={`inline-block h-2.5 w-2.5 rounded-full ${prioritaDots[p.priorita]}`} /></TableCell>
                    <TableCell className="font-mono text-xs text-sky-600">{p.codice}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`text-[10px] ${tipoBadgeColors[p.tipo]}`}>{tipoLabels[p.tipo]}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm text-slate-800 truncate max-w-[220px]">{p.titolo}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {comments > 0 && <span className="text-[10px] text-slate-400 flex items-center gap-0.5"><MessageSquare className="h-3 w-3" />{comments}</span>}
                        {attachments > 0 && <span className="text-[10px] text-slate-400 flex items-center gap-0.5"><Paperclip className="h-3 w-3" />{attachments}</span>}
                        {taskInfo.total > 0 && <span className="text-[10px] text-slate-400 flex items-center gap-0.5"><ListChecks className="h-3 w-3" />{taskInfo.done}/{taskInfo.total}</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{tenant?.ragione_sociale ?? '—'}</TableCell>
                    <TableCell>
                      {op ? (
                        <div className="flex items-center gap-1.5">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold">{op.avatar_iniziali}</span>
                          <span className="text-xs text-slate-600">{op.nome.split(' ')[0]}</span>
                        </div>
                      ) : <span className="text-xs text-slate-400">—</span>}
                    </TableCell>
                    <TableCell>
                      {p.scadenza ? (
                        <span className={`text-xs font-mono ${days !== null && days < 0 ? 'text-red-600 font-bold' : days !== null && days <= 3 ? 'text-amber-600' : 'text-slate-600'}`}>
                          {new Date(p.scadenza).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}
                          {days !== null && days < 0 && <span className="block text-[10px]">scaduta</span>}
                        </span>
                      ) : <span className="text-xs text-slate-400">—</span>}
                    </TableCell>
                    <TableCell><StatusBadge status={p.stato as any} /></TableCell>
                    <TableCell onClick={e => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/admin/pratiche/${p.id}`)}><Eye className="h-4 w-4 mr-2" /> Dettaglio</DropdownMenuItem>
                          <DropdownMenuItem><UserPlus className="h-4 w-4 mr-2" /> Assegna</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600"><Trash2 className="h-4 w-4 mr-2" /> Elimina</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-400">Nessuna pratica trovata con i filtri applicati.</div>
          )}
        </div>
      )}

      {/* Vista Kanban */}
      {view === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map(col => {
            const cards = filtered.filter(p => p.stato === col.stato);
            return (
              <div key={col.stato} className={`flex-shrink-0 w-[280px] rounded-xl border ${col.borderColor} ${col.color}`}>
                <div className={`flex items-center justify-between px-3 py-2.5 border-b ${col.borderColor}`}>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-700">{col.label}</h3>
                    <span className="bg-white/80 text-xs font-mono rounded-full px-2 py-0.5 text-slate-600">{cards.length}</span>
                  </div>
                </div>
                <div className="p-2 space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {cards.map(p => {
                    const tenant = mockTenants.find(t => t.id === p.tenant_id);
                    const op = mockOperatori.find(o => o.id === p.operatore_id);
                    const comments = getCommentCount(p.id);
                    const attachments = getAttachCount(p.id);
                    const taskInfo = getTaskInfo(p.id);
                    const TipoIcon = tipoIcons[p.tipo];
                    return (
                      <div key={p.id} className="bg-white rounded-lg border border-slate-200 p-3 cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all" onClick={() => navigate(`/admin/pratiche/${p.id}`)}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`h-2 w-2 rounded-full ${prioritaDots[p.priorita]}`} />
                            <Badge variant="secondary" className={`text-[9px] px-1.5 py-0 ${tipoBadgeColors[p.tipo]}`}>{tipoLabels[p.tipo]}</Badge>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-5 w-5" onClick={e => e.stopPropagation()}><MoreHorizontal className="h-3 w-3" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem onClick={() => navigate(`/admin/pratiche/${p.id}`)}>Dettaglio</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {kanbanColumns.filter(c => c.stato !== col.stato).map(c => (
                                <DropdownMenuItem key={c.stato}>Sposta → {c.label}</DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-[10px] font-mono text-slate-400 mb-0.5">{p.codice}</p>
                        <p className="text-sm font-medium text-slate-800 line-clamp-2 mb-2">{p.titolo}</p>
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[8px] font-bold text-slate-500">
                            {tenant?.ragione_sociale.substring(0, 2).toUpperCase()}
                          </span>
                          <span className="text-[11px] text-slate-500 truncate">{tenant?.ragione_sociale}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {op && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-[8px] font-bold text-sky-700">{op.avatar_iniziali}</span>}
                            {p.scadenza && (
                              <span className={`text-[10px] ${daysUntil(p.scadenza) < 0 ? 'text-red-600' : daysUntil(p.scadenza) <= 3 ? 'text-amber-600' : 'text-slate-400'}`}>
                                📅 {new Date(p.scadenza).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            {comments > 0 && <span className="flex items-center gap-0.5"><MessageSquare className="h-3 w-3" />{comments}</span>}
                            {attachments > 0 && <span className="flex items-center gap-0.5"><Paperclip className="h-3 w-3" />{attachments}</span>}
                            {taskInfo.total > 0 && <span className="flex items-center gap-0.5"><ListChecks className="h-3 w-3" />{taskInfo.done}/{taskInfo.total}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {cards.length === 0 && <div className="text-xs text-slate-400 text-center py-8">Nessuna pratica</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminPratiche;
