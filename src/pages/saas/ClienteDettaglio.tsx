import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Edit, Pause, Mail, MoreHorizontal, CheckCircle, XCircle, FolderOpen, Receipt, Users as UsersIcon, StickyNote, Activity, FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/saas/StatusBadge';
import { EmptyState } from '@/components/saas/EmptyState';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { mockTenants, mockPratiche, mockFatture, mockUtentiCliente, mockNoteInterne, mockClienteActivities, mockRicariche, mockServiziAttivi, SERVIZI_DISPONIBILI, getOperatoreById, timeAgo, daysUntil } from '@/data/mockDashboardData';
import { cn } from '@/lib/utils';

const pianoBg: Record<string, string> = {
  starter: 'bg-slate-100 text-slate-700',
  professionale: 'bg-sky-50 text-sky-700',
  enterprise: 'bg-violet-50 text-violet-700',
};

const ClienteDettaglio = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tenant = mockTenants.find(t => t.id === id);
  const [noteText, setNoteText] = useState(mockNoteInterne.find(n => n.tenant_id === id)?.testo ?? '');

  const pratiche = useMemo(() => mockPratiche.filter(p => p.tenant_id === id), [id]);
  const fatture = useMemo(() => mockFatture.filter(f => f.tenant_id === id), [id]);
  const utenti = useMemo(() => mockUtentiCliente.filter(u => u.tenant_id === id), [id]);
  const activities = useMemo(() => mockClienteActivities.filter(a => a.tenant_id === id).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()), [id]);
  const ricariche = useMemo(() => mockRicariche.filter(r => r.tenant_id === id), [id]);
  const serviziAttivi = useMemo(() => mockServiziAttivi.find(s => s.tenant_id === id)?.servizi ?? [], [id]);

  const op = getOperatoreById(tenant?.operatore_assegnato_id);
  const monthsAgo = tenant ? Math.floor((Date.now() - new Date(tenant.created_at).getTime()) / (30 * 86400000)) : 0;

  // Mock chart data for pratiche trend
  const chartData = [
    { mese: 'Ott', completate: 3, in_corso: 1 },
    { mese: 'Nov', completate: 5, in_corso: 2 },
    { mese: 'Dic', completate: 2, in_corso: 3 },
    { mese: 'Gen', completate: 4, in_corso: 2 },
    { mese: 'Feb', completate: 6, in_corso: 1 },
    { mese: 'Mar', completate: 2, in_corso: pratiche.filter(p => p.stato === 'in_corso').length },
  ];

  if (!tenant) {
    return (
      <div className="flex items-center justify-center h-96">
        <EmptyState title="Cliente non trovato" description="Il cliente richiesto non esiste." action={<Button onClick={() => navigate('/admin/clienti')}>Torna ai clienti</Button>} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Breadcrumb */}
      <button onClick={() => navigate('/admin/clienti')} className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 transition-colors">
        <ChevronLeft className="h-4 w-4" /> Clienti
      </button>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Avatar + info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold', pianoBg[tenant.piano])}>
              {tenant.ragione_sociale.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold font-subtitle text-slate-900 truncate">{tenant.ragione_sociale}</h1>
              <p className="text-sm text-slate-400 font-mono">{tenant.partita_iva}</p>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', pianoBg[tenant.piano])}>{tenant.piano}</span>
                <StatusBadge status={tenant.stato} />
                {tenant.trial_ends_at && <span className="text-xs text-amber-600 font-medium">Trial · scade tra {daysUntil(tenant.trial_ends_at)} gg</span>}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-slate-600 shrink-0">
            <div className="text-center"><p className="font-bold text-lg text-slate-800">{pratiche.filter(p => ['in_corso', 'in_attesa'].includes(p.stato)).length}</p><p className="text-xs text-slate-400">Pratiche attive</p></div>
            <div className="text-center"><p className={cn('font-bold text-lg', tenant.crediti_residui < 10 ? 'text-red-600' : tenant.crediti_residui < 50 ? 'text-amber-600' : 'text-emerald-600')}>€{tenant.crediti_residui}</p><p className="text-xs text-slate-400">Crediti</p></div>
            <div className="text-center"><p className="font-bold text-lg text-slate-800">{monthsAgo}</p><p className="text-xs text-slate-400">Mesi cliente</p></div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="sm"><Edit className="h-4 w-4 mr-1" /> Modifica</Button>
            <Button variant="ghost" size="sm" className="text-amber-600"><Pause className="h-4 w-4 mr-1" /> Sospendi</Button>
            <Button variant="ghost" size="sm"><Mail className="h-4 w-4 mr-1" /> Messaggio</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Cambia piano</DropdownMenuItem>
                <DropdownMenuItem>Ricarica crediti</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Elimina cliente</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="panoramica" className="space-y-6">
        <TabsList className="bg-white border border-slate-200 p-1 h-auto flex-wrap">
          <TabsTrigger value="panoramica" className="text-sm">Panoramica</TabsTrigger>
          <TabsTrigger value="pratiche" className="text-sm">Pratiche <span className="ml-1 text-xs text-slate-400">({pratiche.length})</span></TabsTrigger>
          <TabsTrigger value="fatture" className="text-sm">Fatture <span className="ml-1 text-xs text-slate-400">({fatture.length})</span></TabsTrigger>
          <TabsTrigger value="utenti" className="text-sm">Utenti <span className="ml-1 text-xs text-slate-400">({utenti.length})</span></TabsTrigger>
          <TabsTrigger value="note" className="text-sm">Note</TabsTrigger>
          <TabsTrigger value="log" className="text-sm">Log</TabsTrigger>
          <TabsTrigger value="documenti" className="text-sm">Documenti</TabsTrigger>
        </TabsList>

        {/* === PANORAMICA === */}
        <TabsContent value="panoramica">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left col */}
            <div className="lg:col-span-7 space-y-6">
              {/* Anagrafica */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Dati Anagrafici</h3>
                  <Button variant="ghost" size="sm"><Edit className="h-3.5 w-3.5 mr-1" /> Modifica</Button>
                </div>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <span className="text-slate-500">Ragione Sociale</span><span className="text-slate-800 font-medium">{tenant.ragione_sociale}</span>
                  <span className="text-slate-500">P.IVA</span><span className="text-slate-800 font-mono">{tenant.partita_iva}</span>
                  <span className="text-slate-500">Codice Fiscale</span><span className="text-slate-800 font-mono">{tenant.codice_fiscale}</span>
                  {tenant.codice_sdi && <><span className="text-slate-500">Codice SDI</span><span className="text-slate-800 font-mono">{tenant.codice_sdi}</span></>}
                  {tenant.pec && <><span className="text-slate-500">PEC</span><span className="text-slate-800">{tenant.pec}</span></>}
                  <span className="text-slate-500">Email</span><span className="text-slate-800">{tenant.email_principale}</span>
                  {tenant.telefono && <><span className="text-slate-500">Telefono</span><span className="text-slate-800">{tenant.telefono}</span></>}
                  {tenant.indirizzo_via && (
                    <><span className="text-slate-500">Indirizzo</span><span className="text-slate-800">{tenant.indirizzo_via}, {tenant.indirizzo_cap} {tenant.indirizzo_citta} ({tenant.indirizzo_provincia})</span></>
                  )}
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-semibold text-slate-800 mb-4">Andamento Pratiche — ultimi 6 mesi</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="mese" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="completate" fill="#10b981" radius={[4, 4, 0, 0]} name="Completate" />
                    <Bar dataKey="in_corso" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="In corso" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right col */}
            <div className="lg:col-span-5 space-y-6">
              {/* Piano & Crediti */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-semibold text-slate-800 mb-4">Piano & Crediti</h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className={cn('rounded-full px-3 py-1 text-sm font-medium capitalize', pianoBg[tenant.piano])}>{tenant.piano}</span>
                </div>
                <div className="mb-2 text-sm text-slate-600">Crediti: <b className="text-slate-800">€{tenant.crediti_residui}</b></div>
                <Progress value={Math.min((tenant.crediti_residui / 500) * 100, 100)} className="h-2 mb-4" />
                <Button variant="outline" size="sm" className="w-full mb-4">Ricarica crediti</Button>
                {ricariche.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-400 mb-2">Ultime ricariche</p>
                    {ricariche.slice(0, 3).map(r => (
                      <div key={r.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50 last:border-0">
                        <span className="text-slate-500">{new Date(r.data).toLocaleDateString('it-IT')}</span>
                        <span className="text-slate-400">{r.metodo}</span>
                        <span className="font-medium text-emerald-600">+€{r.importo}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Operatore */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-semibold text-slate-800 mb-3">Operatore Assegnato</h3>
                {op ? (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-sm font-bold">{op.avatar_iniziali}</div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{op.nome}</p>
                      <p className="text-xs text-slate-400">Rating: ⭐ {op.rating}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-amber-500 italic">Non assegnato</p>
                )}
                <Button variant="outline" size="sm" className="w-full mt-3">Cambia operatore</Button>
              </div>

              {/* Servizi */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-semibold text-slate-800 mb-3">Servizi Attivi</h3>
                <div className="space-y-2.5">
                  {SERVIZI_DISPONIBILI.map(s => (
                    <div key={s.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {serviziAttivi.includes(s.id) ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-slate-300" />}
                        <span className={cn('text-sm', serviziAttivi.includes(s.id) ? 'text-slate-700' : 'text-slate-400')}>{s.label}</span>
                      </div>
                      <Switch checked={serviziAttivi.includes(s.id)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* === PRATICHE === */}
        <TabsContent value="pratiche">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Pratiche di {tenant.ragione_sociale}</h3>
              <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white">+ Crea pratica</Button>
            </div>
            {pratiche.length === 0 ? (
              <EmptyState title="Nessuna pratica" description="Questo cliente non ha ancora pratiche." className="py-12" />
            ) : (
              <div className="divide-y divide-slate-50">
                {pratiche.map(p => {
                  const pOp = getOperatoreById(p.operatore_id);
                  return (
                    <div key={p.id} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className={cn('h-2.5 w-2.5 rounded-full shrink-0',
                        p.stato === 'in_corso' ? 'bg-sky-500 animate-pulse' :
                        p.stato === 'completata' ? 'bg-emerald-500' :
                        p.stato === 'scaduta' ? 'bg-red-500' :
                        p.stato === 'in_attesa' ? 'bg-amber-500' : 'bg-slate-300'
                      )} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-mono">{p.codice}</span>
                          <StatusBadge status={p.stato} className="text-[10px] px-1.5 py-0" />
                        </div>
                        <p className="text-sm font-medium text-slate-800 truncate">{p.titolo}</p>
                      </div>
                      {pOp && <span className="text-xs text-slate-400 hidden sm:block">{pOp.nome}</span>}
                      {p.scadenza && (
                        <span className={cn('text-xs', daysUntil(p.scadenza) < 0 ? 'text-red-600 font-bold' : daysUntil(p.scadenza) <= 2 ? 'text-amber-600' : 'text-slate-400')}>
                          {daysUntil(p.scadenza) < 0 ? 'Scaduta' : `${daysUntil(p.scadenza)}gg`}
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 text-slate-300" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        {/* === FATTURE === */}
        <TabsContent value="fatture">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Fatture</h3>
              <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white">+ Emetti Fattura</Button>
            </div>
            {fatture.length === 0 ? (
              <EmptyState title="Nessuna fattura" description="Non ci sono fatture per questo cliente." className="py-12" />
            ) : (
              <table className="w-full">
                <thead><tr className="border-b border-slate-100 text-xs text-slate-500 uppercase">
                  <th className="text-left px-5 py-2">Numero</th><th className="text-left px-3 py-2">Data</th><th className="text-right px-3 py-2">Importo</th><th className="text-left px-3 py-2">Stato</th><th className="px-3 py-2" />
                </tr></thead>
                <tbody>
                  {fatture.map(f => (
                    <tr key={f.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 text-sm font-mono text-slate-700">{f.numero}</td>
                      <td className="px-3 py-3 text-sm text-slate-500">{new Date(f.data_emissione).toLocaleDateString('it-IT')}</td>
                      <td className="px-3 py-3 text-sm font-medium text-slate-800 text-right">€{f.totale.toFixed(2)}</td>
                      <td className="px-3 py-3"><StatusBadge status={f.stato} /></td>
                      <td className="px-3 py-3 text-right">
                        <Button variant="ghost" size="sm" className="text-xs text-sky-600">
                          {f.stato === 'bozza' ? 'Invia' : f.stato === 'scaduta' ? 'Sollecita' : 'Scarica'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </TabsContent>

        {/* === UTENTI === */}
        <TabsContent value="utenti">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Utenti</h3>
              <Button size="sm" variant="outline">+ Invita utente</Button>
            </div>
            {utenti.length === 0 ? (
              <EmptyState title="Nessun utente" description="Nessun utente registrato per questo cliente." className="py-12" />
            ) : (
              <div className="divide-y divide-slate-50">
                {utenti.map(u => (
                  <div key={u.id} className="flex items-center gap-4 px-5 py-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                      {u.nome[0]}{u.cognome[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{u.nome} {u.cognome}</p>
                      <p className="text-xs text-slate-400">{u.email}{u.ruolo_azienda ? ` · ${u.ruolo_azienda}` : ''}</p>
                    </div>
                    <span className={cn('text-xs rounded-full px-2 py-0.5 font-medium',
                      u.ruolo === 'cliente_admin' ? 'bg-violet-50 text-violet-700' : 'bg-slate-100 text-slate-600'
                    )}>
                      {u.ruolo === 'cliente_admin' ? 'Admin' : 'Utente'}
                    </span>
                    <span className="text-xs text-slate-400 hidden sm:block">{timeAgo(u.ultimo_accesso)}</span>
                    <Switch checked={u.attivo} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* === NOTE === */}
        <TabsContent value="note">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Note Interne</h3>
              <span className="text-xs text-slate-400">Salvato automaticamente</span>
            </div>
            <Textarea
              rows={8}
              placeholder="Note visibili solo agli operatori. Supporta testo libero."
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              className="mb-3"
            />
            {mockNoteInterne.find(n => n.tenant_id === id) && (
              <p className="text-xs text-slate-400">
                Ultima modifica: {mockNoteInterne.find(n => n.tenant_id === id)!.autore_nome} · {timeAgo(mockNoteInterne.find(n => n.tenant_id === id)!.updated_at)}
              </p>
            )}
          </div>
        </TabsContent>

        {/* === LOG === */}
        <TabsContent value="log">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-semibold text-slate-800 mb-6">Log Attività</h3>
            {activities.length === 0 ? (
              <EmptyState title="Nessuna attività" description="Non ci sono attività registrate." className="py-12" />
            ) : (
              <div className="relative pl-6 border-l-2 border-slate-100 space-y-6">
                {activities.map(a => (
                  <div key={a.id} className="relative">
                    <div className={cn(
                      'absolute -left-[29px] h-3.5 w-3.5 rounded-full border-2 border-white',
                      a.azione === 'creazione' ? 'bg-emerald-500' :
                      a.azione === 'email' ? 'bg-sky-500' :
                      a.azione === 'accesso' ? 'bg-violet-500' :
                      a.azione === 'crediti' ? 'bg-amber-500' : 'bg-slate-300'
                    )} />
                    <div>
                      <p className="text-sm text-slate-700"><b className="font-medium">{a.user_name}</b>: {a.descrizione}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{new Date(a.created_at).toLocaleDateString('it-IT')} {new Date(a.created_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* === DOCUMENTI === */}
        <TabsContent value="documenti">
          <EmptyState
            icon={FileText}
            title="Documenti — Coming Soon"
            description="L'archivio documenti sarà disponibile nella prossima versione."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClienteDettaglio;
