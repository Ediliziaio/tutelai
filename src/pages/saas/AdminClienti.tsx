import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Download, X, ChevronRight, ArrowUpDown, MoreHorizontal, UserCog, ArrowRightLeft, Pause, Trash2, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { StatusBadge } from '@/components/saas/StatusBadge';
import { EmptyState } from '@/components/saas/EmptyState';
import { mockTenants, mockOperatori, getOperatoreById, timeAgo } from '@/data/mockDashboardData';
import { cn } from '@/lib/utils';
import type { StatoTenant, PianoTenant } from '@/types/auth';

type SortKey = 'ragione_sociale' | 'piano' | 'stato' | 'pratiche_aperte' | 'crediti_residui' | 'ultima_attivita';
type SortDir = 'asc' | 'desc';

const pianoBg: Record<string, string> = {
  starter: 'bg-slate-100 text-slate-700',
  professionale: 'bg-sky-50 text-sky-700',
  enterprise: 'bg-violet-50 text-violet-700',
};

const avatarBg: Record<string, string> = {
  starter: 'bg-slate-200 text-slate-700',
  professionale: 'bg-sky-100 text-sky-700',
  enterprise: 'bg-violet-100 text-violet-700',
};

const AdminClienti = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filtroPiano, setFiltroPiano] = useState<string>('all');
  const [filtroStato, setFiltroStato] = useState<string>('all');
  const [filtroOperatore, setFiltroOperatore] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('ultima_attivita');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...mockTenants];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.ragione_sociale.toLowerCase().includes(q) ||
        t.partita_iva.includes(q) ||
        t.email_principale.toLowerCase().includes(q)
      );
    }
    if (filtroPiano !== 'all') list = list.filter(t => t.piano === filtroPiano);
    if (filtroStato !== 'all') list = list.filter(t => t.stato === filtroStato);
    if (filtroOperatore !== 'all') list = list.filter(t => t.operatore_assegnato_id === filtroOperatore);
    return list;
  }, [search, filtroPiano, filtroStato, filtroOperatore]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'ragione_sociale': cmp = a.ragione_sociale.localeCompare(b.ragione_sociale); break;
        case 'piano': cmp = a.piano.localeCompare(b.piano); break;
        case 'stato': cmp = a.stato.localeCompare(b.stato); break;
        case 'pratiche_aperte': cmp = a.pratiche_aperte - b.pratiche_aperte; break;
        case 'crediti_residui': cmp = a.crediti_residui - b.crediti_residui; break;
        case 'ultima_attivita': cmp = new Date(a.ultima_attivita).getTime() - new Date(b.ultima_attivita).getTime(); break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  const stats = useMemo(() => ({
    attivi: mockTenants.filter(t => t.stato === 'attivo').length,
    trial: mockTenants.filter(t => t.stato === 'trial').length,
    sospesi: mockTenants.filter(t => t.stato === 'sospeso').length,
    churned: mockTenants.filter(t => t.stato === 'churned').length,
  }), []);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const resetFilters = () => {
    setSearch(''); setFiltroPiano('all'); setFiltroStato('all'); setFiltroOperatore('all'); setPage(1);
  };

  const hasFilters = search || filtroPiano !== 'all' || filtroStato !== 'all' || filtroOperatore !== 'all';

  const SortHeader = ({ label, k }: { label: string; k: SortKey }) => (
    <button onClick={() => toggleSort(k)} className="flex items-center gap-1 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors">
      {label}
      <ArrowUpDown className={cn('h-3 w-3', sortKey === k ? 'text-sky-500' : 'text-slate-300')} />
    </button>
  );

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs text-slate-400 font-medium mb-1">Impresa Leggera › Clienti</p>
          <h1 className="text-2xl font-bold font-subtitle text-slate-900">Clienti</h1>
        </div>
        <Button onClick={() => navigate('/admin/clienti/nuovo')} className="bg-sky-500 hover:bg-sky-600 text-white rounded-full px-5">
          <Plus className="h-4 w-4 mr-2" /> Nuovo Cliente
        </Button>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-8 border-b border-slate-200 pb-3 text-sm overflow-x-auto">
        <span className="flex items-center gap-2 whitespace-nowrap"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Attivi: <b className="text-sky-600 font-mono">{stats.attivi}</b></span>
        <span className="flex items-center gap-2 whitespace-nowrap"><span className="h-2 w-2 rounded-full bg-amber-500" /> Trial: <b className="text-amber-600 font-mono">{stats.trial}</b></span>
        <span className="flex items-center gap-2 whitespace-nowrap"><span className="h-2 w-2 rounded-full bg-red-500" /> Sospesi: <b className="text-red-600 font-mono">{stats.sospesi}</b></span>
        <span className="flex items-center gap-2 whitespace-nowrap"><span className="h-2 w-2 rounded-full bg-slate-400" /> Churned: <b className="text-slate-600 font-mono">{stats.churned}</b></span>
        <span className="text-slate-400 ml-auto whitespace-nowrap">Totale: {mockTenants.length} clienti</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cerca per nome, P.IVA, email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="pl-10 pr-8"
          />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="h-3.5 w-3.5" /></button>}
        </div>
        <Select value={filtroPiano} onValueChange={v => { setFiltroPiano(v); setPage(1); }}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Piano" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti i piani</SelectItem>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="professionale">Professionale</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroStato} onValueChange={v => { setFiltroStato(v); setPage(1); }}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Stato" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti gli stati</SelectItem>
            <SelectItem value="attivo">Attivo</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="sospeso">Sospeso</SelectItem>
            <SelectItem value="churned">Churned</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroOperatore} onValueChange={v => { setFiltroOperatore(v); setPage(1); }}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Operatore" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti gli operatori</SelectItem>
            {mockOperatori.map(op => <SelectItem key={op.id} value={op.id}>{op.nome}</SelectItem>)}
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-slate-400 hover:text-slate-600">
            <X className="h-3.5 w-3.5 mr-1" /> Reset filtri
          </Button>
        )}
        <Button variant="ghost" size="sm" className="ml-auto text-slate-500">
          <Download className="h-4 w-4 mr-1" /> Esporta CSV
        </Button>
      </div>

      {/* Table */}
      {paginated.length === 0 ? (
        <EmptyState
          title="Nessun cliente trovato"
          description="Modifica i filtri o aggiungi il primo cliente"
          action={
            <div className="flex gap-3">
              <Button onClick={() => navigate('/admin/clienti/nuovo')}>Aggiungi Cliente</Button>
              {hasFilters && <Button variant="ghost" onClick={resetFilters}>Reset filtri</Button>}
            </div>
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-4 py-3"><SortHeader label="Azienda" k="ragione_sociale" /></th>
                <th className="text-left px-3 py-3"><SortHeader label="Piano" k="piano" /></th>
                <th className="text-left px-3 py-3"><SortHeader label="Stato" k="stato" /></th>
                <th className="text-left px-3 py-3 hidden lg:table-cell">Operatore</th>
                <th className="text-center px-3 py-3"><SortHeader label="Pratiche" k="pratiche_aperte" /></th>
                <th className="text-right px-3 py-3"><SortHeader label="Crediti" k="crediti_residui" /></th>
                <th className="text-right px-3 py-3 hidden md:table-cell"><SortHeader label="Ultima att." k="ultima_attivita" /></th>
                <th className="w-12 px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {paginated.map(t => {
                const op = getOperatoreById(t.operatore_assegnato_id);
                return (
                  <tr
                    key={t.id}
                    onClick={() => navigate(`/admin/clienti/${t.id}`)}
                    className="border-b border-slate-50 hover:bg-slate-50/70 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold', avatarBg[t.piano])}>
                          {t.ragione_sociale.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{t.ragione_sociale}</p>
                          <p className="text-xs text-slate-400 font-mono">{t.partita_iva}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', pianoBg[t.piano])}>
                        {t.piano}
                      </span>
                    </td>
                    <td className="px-3 py-3"><StatusBadge status={t.stato} /></td>
                    <td className="px-3 py-3 hidden lg:table-cell">
                      {op ? (
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">{op.avatar_iniziali}</div>
                          <span className="text-sm text-slate-600">{op.nome.split(' ')[0]}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-amber-500 italic">Non assegnato</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="text-sm font-mono font-medium text-slate-700">{t.pratiche_aperte}</span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className={cn('text-sm font-mono font-medium',
                        t.crediti_residui < 10 ? 'text-red-600' :
                        t.crediti_residui < 50 ? 'text-amber-600' : 'text-emerald-600'
                      )}>€{t.crediti_residui}</span>
                    </td>
                    <td className="px-3 py-3 text-right hidden md:table-cell">
                      <span className="text-xs text-slate-400">{timeAgo(t.ultima_attivita)}</span>
                    </td>
                    <td className="px-3 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                          <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/admin/clienti/${t.id}`); }}>
                            <ChevronRight className="h-4 w-4 mr-2" /> Apri dettaglio
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={e => e.stopPropagation()}>
                            <UserCog className="h-4 w-4 mr-2" /> Assegna operatore
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={e => e.stopPropagation()}>
                            <ArrowRightLeft className="h-4 w-4 mr-2" /> Cambia piano
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={e => e.stopPropagation()}>
                            <Mail className="h-4 w-4 mr-2" /> Invia messaggio
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={e => e.stopPropagation()} className="text-amber-600">
                            <Pause className="h-4 w-4 mr-2" /> Sospendi account
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={e => { e.stopPropagation(); setDeleteTarget(t.id); }} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" /> Elimina
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 text-sm">
            <div className="flex items-center gap-2 text-slate-500">
              Mostra
              <Select value={String(perPage)} onValueChange={v => { setPerPage(Number(v)); setPage(1); }}>
                <SelectTrigger className="w-16 h-8"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              per pagina
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Pagina {page} di {totalPages || 1}</span>
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prec</Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Succ</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare questo cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione è irreversibile. Tutte le pratiche, fatture e documenti associati verranno eliminati permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => setDeleteTarget(null)}>
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminClienti;
