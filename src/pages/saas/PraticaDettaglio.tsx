import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockPratiche, mockTenants, mockOperatori, mockCommentiPratica, mockTaskPratica, mockAllegatiPratica, mockTimelinePratica, mockFatture, timeAgo, daysUntil } from '@/data/mockDashboardData';
import { StatusBadge } from '@/components/saas/StatusBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowLeft, Clock, User, Building2, Calendar, MessageSquare, ListChecks, Paperclip, FileText, History, Send, Lock, Plus, Download, Eye, Trash2, ChevronDown, ChevronRight, CheckCircle2, Circle, Zap, Phone, Mail, AlertTriangle, HelpCircle, Receipt } from 'lucide-react';
import type { StatoPratica, TipoPratica, Priorita, CommentoPratica as CommentoType, Task } from '@/types/auth';

const tipoBadgeColors: Record<TipoPratica, string> = {
  fattura: 'bg-sky-100 text-sky-700', enea: 'bg-emerald-100 text-emerald-700', finanziamento: 'bg-amber-100 text-amber-700',
  call_center: 'bg-violet-100 text-violet-700', segreteria: 'bg-pink-100 text-pink-700', recupero_crediti: 'bg-red-100 text-red-700', altro: 'bg-slate-100 text-slate-600',
};
const tipoLabels: Record<TipoPratica, string> = { fattura: 'Fattura', enea: 'ENEA', finanziamento: 'Finanziamento', call_center: 'Call Center', segreteria: 'Segreteria', recupero_crediti: 'Recupero Crediti', altro: 'Altro' };
const prioritaColors: Record<Priorita, string> = { urgente: 'bg-red-100 text-red-700', alta: 'bg-amber-100 text-amber-700', normale: 'bg-sky-100 text-sky-700', bassa: 'bg-slate-100 text-slate-600' };
const tipoIcons: Record<TipoPratica, React.ElementType> = { fattura: FileText, enea: Building2, finanziamento: Zap, call_center: Phone, segreteria: Mail, recupero_crediti: AlertTriangle, altro: HelpCircle };
const timelineIcons: Record<string, React.ElementType> = { creazione: Plus, stato: ChevronRight, assegnazione: User, commento: MessageSquare, allegato: Paperclip, task: ListChecks, fattura: Receipt };
const timelineColors: Record<string, string> = { creazione: 'bg-emerald-500', stato: 'bg-sky-500', assegnazione: 'bg-violet-500', commento: 'bg-amber-500', allegato: 'bg-pink-500', task: 'bg-indigo-500', fattura: 'bg-teal-500' };

interface PraticaDettaglioProps { isAdmin?: boolean; }

const PraticaDettaglio = ({ isAdmin = true }: PraticaDettaglioProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const pratica = mockPratiche.find(p => p.id === id);
  const [activeTab, setActiveTab] = useState('dettagli');
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState<'messaggio' | 'nota_interna'>('messaggio');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showNewTask, setShowNewTask] = useState(false);
  const [localComments, setLocalComments] = useState<CommentoType[]>([]);
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  if (!pratica) return <div className="p-8 text-center text-slate-400">Pratica non trovata</div>;

  const tenant = mockTenants.find(t => t.id === pratica.tenant_id);
  const operatore = mockOperatori.find(o => o.id === pratica.operatore_id);
  const comments = [...mockCommentiPratica.filter(c => c.pratica_id === pratica.id), ...localComments];
  const visibleComments = isAdmin ? comments : comments.filter(c => c.tipo !== 'nota_interna');
  const tasks = [...mockTaskPratica.filter(t => t.pratica_id === pratica.id), ...localTasks];
  const allegati = mockAllegatiPratica.filter(a => a.pratica_id === pratica.id);
  const timeline = mockTimelinePratica.filter(t => t.pratica_id === pratica.id).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const fattureCollegate = mockFatture.filter(f => f.pratiche_collegate.includes(pratica.id));
  const days = pratica.scadenza ? daysUntil(pratica.scadenza) : null;
  const TipoIcon = tipoIcons[pratica.tipo];
  const tasksDone = tasks.filter(t => t.stato === 'completato' || completedTasks.has(t.id)).length;

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const comment: CommentoType = {
      id: `local-${Date.now()}`, pratica_id: pratica.id,
      autore_id: isAdmin ? 'op1' : 'uc1', autore_nome: isAdmin ? 'Mario Rossi' : 'Francesco Bianchi',
      autore_ruolo: isAdmin ? 'operatore' : 'cliente', autore_iniziali: isAdmin ? 'MR' : 'FB',
      tipo: messageType, testo: newMessage, allegati: [], created_at: new Date().toISOString(),
    };
    setLocalComments(prev => [...prev, comment]);
    setNewMessage('');
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const task: Task = {
      id: `local-tk-${Date.now()}`, pratica_id: pratica.id, titolo: newTaskTitle,
      creato_da: 'op1', stato: 'da_fare', priorita: 'normale', created_at: new Date().toISOString(),
    };
    setLocalTasks(prev => [...prev, task]);
    setNewTaskTitle('');
    setShowNewTask(false);
  };

  const toggleTaskComplete = (taskId: string) => {
    setCompletedTasks(prev => { const s = new Set(prev); s.has(taskId) ? s.delete(taskId) : s.add(taskId); return s; });
  };

  const backUrl = isAdmin ? '/admin/pratiche' : '/app/pratiche';

  function formatBytes(bytes: number) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  const fileIcon = (tipo: string) => {
    if (tipo.includes('pdf')) return '📄';
    if (tipo.includes('image')) return '🖼️';
    if (tipo.includes('spreadsheet') || tipo.includes('excel')) return '📊';
    return '📎';
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(backUrl)} className="mb-3 gap-1.5 text-slate-500">
          <ArrowLeft className="h-4 w-4" /> Pratiche
        </Button>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
              <TipoIcon className="h-6 w-6 text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-mono text-sky-600 mb-0.5">{pratica.codice}</p>
              <h1 className="text-xl font-bold font-subtitle text-slate-900 mb-1">{pratica.titolo}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className={tipoBadgeColors[pratica.tipo]}>{tipoLabels[pratica.tipo]}</Badge>
                <Badge variant="secondary" className={prioritaColors[pratica.priorita]}>{pratica.priorita}</Badge>
                <StatusBadge status={pratica.stato as any} />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 text-sm text-slate-600">
            {tenant && (
              <div className="flex items-center gap-1.5"><Building2 className="h-4 w-4 text-slate-400" />{tenant.ragione_sociale}</div>
            )}
            {operatore && (
              <div className="flex items-center gap-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-[10px] font-bold text-sky-700">{operatore.avatar_iniziali}</span>
                {operatore.nome}
              </div>
            )}
            {pratica.scadenza && (
              <div className={`flex items-center gap-1.5 ${days !== null && days < 0 ? 'text-red-600 font-medium' : days !== null && days <= 3 ? 'text-amber-600' : ''}`}>
                <Calendar className="h-4 w-4" />
                {new Date(pratica.scadenza).toLocaleDateString('it-IT')}
                {days !== null && (days < 0 ? ` (scaduta da ${Math.abs(days)}gg)` : days === 0 ? ' (oggi!)' : days <= 7 ? ` (tra ${days}gg)` : '')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full justify-start overflow-x-auto">
          <TabsTrigger value="dettagli" className="gap-1.5"><FileText className="h-3.5 w-3.5" /> Dettagli</TabsTrigger>
          <TabsTrigger value="messaggi" className="gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Messaggi <span className="ml-1 bg-slate-200 text-[10px] rounded-full px-1.5">{visibleComments.length}</span></TabsTrigger>
          <TabsTrigger value="task" className="gap-1.5"><ListChecks className="h-3.5 w-3.5" /> Task <span className="ml-1 bg-slate-200 text-[10px] rounded-full px-1.5">{tasksDone}/{tasks.length}</span></TabsTrigger>
          <TabsTrigger value="allegati" className="gap-1.5"><Paperclip className="h-3.5 w-3.5" /> Allegati <span className="ml-1 bg-slate-200 text-[10px] rounded-full px-1.5">{allegati.length}</span></TabsTrigger>
          <TabsTrigger value="fatturazione" className="gap-1.5"><Receipt className="h-3.5 w-3.5" /> Fatturazione</TabsTrigger>
          <TabsTrigger value="timeline" className="gap-1.5"><History className="h-3.5 w-3.5" /> Timeline</TabsTrigger>
        </TabsList>

        {/* ===== TAB DETTAGLI ===== */}
        <TabsContent value="dettagli">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-2">Descrizione</h3>
                <p className="text-sm text-slate-600">{pratica.descrizione || pratica.titolo}</p>
                {pratica.note_cliente && <><h4 className="font-medium text-sm mt-4 mb-1">Note per il cliente</h4><p className="text-sm text-slate-500">{pratica.note_cliente}</p></>}
              </div>

              {/* Campi specifici per tipo */}
              <div className="bg-white border rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-3">Campi specifici — {tipoLabels[pratica.tipo]}</h3>
                {pratica.tipo === 'enea' && (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-slate-400">Tipo intervento:</span><br /><span className="font-medium">Cappotto termico 110%</span></div>
                    <div><span className="text-slate-400">Indirizzo immobile:</span><br /><span className="font-medium">Via Roma 45, Milano</span></div>
                    <div><span className="text-slate-400">Data inizio lavori:</span><br /><span className="font-medium">01/12/2025</span></div>
                    <div><span className="text-slate-400">Data fine lavori:</span><br /><span className="font-medium">28/02/2026</span></div>
                    <div><span className="text-slate-400">Importo lavori:</span><br /><span className="font-medium">€ 45.000,00</span></div>
                    <div><span className="text-slate-400">Tipologie:</span><br /><span className="font-medium">Cappotto, Infissi</span></div>
                  </div>
                )}
                {pratica.tipo === 'finanziamento' && (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-slate-400">Importo richiesto:</span><br /><span className="font-medium">€ 150.000,00</span></div>
                    <div><span className="text-slate-400">Tipo:</span><br /><span className="font-medium">Bando regionale</span></div>
                    <div><span className="text-slate-400">Scadenza bando:</span><br /><span className="font-medium">31/03/2026</span></div>
                    <div><span className="text-slate-400">Destinazione:</span><br /><span className="font-medium">Impianto fotovoltaico</span></div>
                  </div>
                )}
                {pratica.tipo === 'call_center' && (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-slate-400">Chiamate previste:</span><br /><span className="font-medium">100</span></div>
                    <div><span className="text-slate-400">Lingua:</span><br /><span className="font-medium">Italiano</span></div>
                    <div className="col-span-2"><span className="text-slate-400">Script:</span><br /><span className="font-medium">Recall clienti inattivi 2025</span></div>
                  </div>
                )}
                {!['enea', 'finanziamento', 'call_center'].includes(pratica.tipo) && (
                  <p className="text-sm text-slate-400">Nessun campo specifico per questo tipo di pratica.</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white border rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-3">Informazioni</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-400">Creata il</span><span>{new Date(pratica.created_at).toLocaleDateString('it-IT')}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Ultima modifica</span><span>{timeAgo(pratica.updated_at)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Allegati</span><span>{allegati.length} file</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Task</span><span>{tasksDone}/{tasks.length} completati</span></div>
                </div>
              </div>
              <div className="bg-white border rounded-xl p-5">
                <h3 className="font-semibold text-slate-800 mb-3">Fatture collegate</h3>
                {fattureCollegate.length > 0 ? fattureCollegate.map(f => (
                  <div key={f.id} className="flex items-center justify-between py-1.5 border-b last:border-0">
                    <span className="font-mono text-xs text-sky-600">{f.numero}</span>
                    <span className="text-sm font-medium">€ {f.totale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                    <StatusBadge status={f.stato as any} />
                  </div>
                )) : (
                  <div className="text-sm text-slate-400">
                    <p className="mb-2">Nessuna fattura collegata</p>
                    {isAdmin && <Button size="sm" variant="outline" className="gap-1.5"><Plus className="h-3.5 w-3.5" /> Crea fattura</Button>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ===== TAB MESSAGGI ===== */}
        <TabsContent value="messaggi">
          <div className="bg-white border rounded-xl flex flex-col" style={{ height: 'calc(100vh - 340px)', minHeight: 400 }}>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {visibleComments.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map(c => (
                <div key={c.id}>
                  {c.tipo === 'sistema' ? (
                    <div className="text-center text-xs text-slate-400 py-2">{c.testo} · {timeAgo(c.created_at)}</div>
                  ) : c.tipo === 'nota_interna' ? (
                    <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-3 max-w-lg">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Lock className="h-3 w-3 text-amber-600" />
                        <span className="text-[10px] font-semibold text-amber-700 uppercase">Nota interna</span>
                        <span className="text-[10px] text-amber-500 ml-auto">{timeAgo(c.created_at)}</span>
                      </div>
                      <p className="text-sm text-amber-800">{c.testo}</p>
                    </div>
                  ) : c.autore_ruolo === 'cliente' ? (
                    <div className="flex justify-end">
                      <div className="max-w-lg">
                        <div className="flex items-center justify-end gap-1.5 mb-0.5">
                          <span className="text-[10px] text-slate-400">{timeAgo(c.created_at)}</span>
                          <span className="text-xs font-medium text-slate-600">{c.autore_nome}</span>
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white">{c.autore_iniziali}</span>
                        </div>
                        <div className="bg-sky-500 text-white rounded-xl rounded-tr-sm px-4 py-2.5 text-sm">{c.testo}</div>
                        {c.allegati.length > 0 && <div className="mt-1 flex gap-1 justify-end">{c.allegati.map((a, i) => <Badge key={i} variant="secondary" className="text-[10px]"><Paperclip className="h-2.5 w-2.5 mr-0.5" />{a}</Badge>)}</div>}
                      </div>
                    </div>
                  ) : (
                    <div className="flex">
                      <div className="max-w-lg">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold">{c.autore_iniziali}</span>
                          <span className="text-xs font-medium text-slate-600">{c.autore_nome}</span>
                          <span className="text-[10px] text-slate-400">{timeAgo(c.created_at)}</span>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl rounded-tl-sm px-4 py-2.5 text-sm text-slate-700">{c.testo}</div>
                        {c.allegati.length > 0 && <div className="mt-1 flex gap-1">{c.allegati.map((a, i) => <Badge key={i} variant="secondary" className="text-[10px]"><Paperclip className="h-2.5 w-2.5 mr-0.5" />{a}</Badge>)}</div>}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Composer */}
            <div className="border-t p-3">
              {isAdmin && (
                <div className="flex gap-1 mb-2">
                  <Button size="sm" variant={messageType === 'messaggio' ? 'default' : 'ghost'} onClick={() => setMessageType('messaggio')} className="text-xs h-7">Messaggio</Button>
                  <Button size="sm" variant={messageType === 'nota_interna' ? 'default' : 'ghost'} onClick={() => setMessageType('nota_interna')} className="text-xs h-7 gap-1"><Lock className="h-3 w-3" /> Nota Interna</Button>
                </div>
              )}
              <div className="flex gap-2">
                <Textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder={messageType === 'nota_interna' ? 'Scrivi una nota interna...' : 'Scrivi un messaggio...'} className="min-h-[40px] max-h-[120px] resize-none flex-1" onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSendMessage(); }} />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()} className="self-end gap-1.5"><Send className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ===== TAB TASK ===== */}
        <TabsContent value="task">
          <div className="bg-white border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-slate-800">Task</h3>
                <span className="text-xs text-slate-400">{tasksDone}/{tasks.length} completati</span>
                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${tasks.length ? (tasksDone / tasks.length) * 100 : 0}%` }} /></div>
              </div>
              {isAdmin && <Button size="sm" variant="outline" onClick={() => setShowNewTask(true)} className="gap-1.5"><Plus className="h-3.5 w-3.5" /> Aggiungi</Button>}
            </div>

            {['da_fare', 'in_corso', 'completato'].map(section => {
              const sectionTasks = tasks.filter(t => {
                const isCompleted = t.stato === 'completato' || completedTasks.has(t.id);
                if (section === 'completato') return isCompleted;
                if (section === 'da_fare') return !isCompleted && t.stato === 'da_fare';
                return !isCompleted && t.stato === 'in_corso';
              });
              if (sectionTasks.length === 0 && section !== 'da_fare') return null;
              return (
                <Collapsible key={section} defaultOpen>
                  <CollapsibleTrigger className="flex items-center gap-1.5 mb-2 text-xs font-semibold uppercase text-slate-400 hover:text-slate-600">
                    <ChevronDown className="h-3 w-3" />
                    {section === 'da_fare' ? 'Da fare' : section === 'in_corso' ? 'In corso' : 'Completati'}
                    <span className="font-mono">({sectionTasks.length})</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 mb-4">
                    {sectionTasks.map(t => {
                      const isDone = t.stato === 'completato' || completedTasks.has(t.id);
                      const op = mockOperatori.find(o => o.id === t.assegnato_a);
                      return (
                        <div key={t.id} className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${isDone ? 'opacity-50' : ''}`}>
                          <Checkbox checked={isDone} onCheckedChange={() => toggleTaskComplete(t.id)} />
                          <span className={`text-sm flex-1 ${isDone ? 'line-through text-slate-400' : 'text-slate-700'}`}>{t.titolo}</span>
                          {op && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[8px] font-bold">{op.avatar_iniziali}</span>}
                          {t.scadenza && <span className={`text-[10px] font-mono ${daysUntil(t.scadenza) < 0 ? 'text-red-600' : 'text-slate-400'}`}>{new Date(t.scadenza).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}</span>}
                          {t.priorita === 'urgente' && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
                          {t.priorita === 'alta' && <span className="h-2 w-2 rounded-full bg-amber-500" />}
                        </div>
                      );
                    })}
                    {section === 'da_fare' && showNewTask && (
                      <div className="flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2">
                        <Circle className="h-4 w-4 text-slate-300" />
                        <Input autoFocus value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="Titolo task..." className="border-0 bg-transparent h-7 text-sm p-0 focus-visible:ring-0" onKeyDown={e => { if (e.key === 'Enter') handleAddTask(); if (e.key === 'Escape') { setShowNewTask(false); setNewTaskTitle(''); } }} />
                        <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={handleAddTask}>Salva</Button>
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </TabsContent>

        {/* ===== TAB ALLEGATI ===== */}
        <TabsContent value="allegati">
          <div className="bg-white border rounded-xl p-5">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center mb-6 hover:border-sky-400 hover:bg-sky-50/50 transition-colors cursor-pointer">
              <Paperclip className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Trascina qui i file o <span className="text-sky-600 font-medium">clicca per selezionare</span></p>
              <p className="text-[10px] text-slate-400 mt-1">PDF, PNG, JPG, DOCX, XLSX, ZIP — max 25MB</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allegati.map(a => (
                <div key={a.id} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-slate-50 group">
                  <span className="text-2xl">{fileIcon(a.tipo_file)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{a.nome}</p>
                    <p className="text-[10px] text-slate-400">{formatBytes(a.peso_bytes)} · {a.caricato_da_nome} · {timeAgo(a.created_at)}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Download className="h-3.5 w-3.5" /></Button>
                    {isAdmin && <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ===== TAB FATTURAZIONE ===== */}
        <TabsContent value="fatturazione">
          <div className="bg-white border rounded-xl p-5">
            <h3 className="font-semibold text-slate-800 mb-4">Fatture collegate a questa pratica</h3>
            {fattureCollegate.length > 0 ? (
              <div className="space-y-2">
                {fattureCollegate.map(f => {
                  const ft = mockTenants.find(t => t.id === f.tenant_id);
                  return (
                    <div key={f.id} className="flex items-center justify-between rounded-lg border p-4 hover:bg-slate-50 cursor-pointer" onClick={() => navigate(isAdmin ? `/admin/fatturazione/${f.id}/modifica` : `/app/fatture/${f.id}`)}>
                      <div>
                        <span className="font-mono text-sm text-sky-600 font-medium">{f.numero}</span>
                        <p className="text-xs text-slate-400">{new Date(f.data_emissione).toLocaleDateString('it-IT')} · {ft?.ragione_sociale}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-800">€ {f.totale.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                        <StatusBadge status={f.stato as any} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Receipt className="h-10 w-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">Nessuna fattura collegata</p>
                {isAdmin && <Button className="mt-3 gap-1.5" size="sm"><Plus className="h-3.5 w-3.5" /> Crea fattura per questa pratica</Button>}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ===== TAB TIMELINE ===== */}
        <TabsContent value="timeline">
          <div className="bg-white border rounded-xl p-5">
            <div className="relative">
              <div className="absolute left-[15px] top-0 bottom-0 w-px bg-slate-200" />
              <div className="space-y-4">
                {timeline.map(ev => {
                  const Icon = timelineIcons[ev.tipo] || Circle;
                  const color = timelineColors[ev.tipo] || 'bg-slate-400';
                  return (
                    <div key={ev.id} className="flex gap-3 relative">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${color} text-white z-10 flex-shrink-0`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 pt-0.5">
                        <p className="text-sm text-slate-700">{ev.descrizione}</p>
                        <p className="text-[10px] text-slate-400">{ev.autore_nome} · {timeAgo(ev.created_at)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PraticaDettaglio;
