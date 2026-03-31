import { useState } from 'react';
import { Bell, Plus, CheckCircle2, Clock, AlertTriangle, Mail, Users, Toggle, Trash2, Edit2, X, Save } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ReminderFreq = 'una_volta' | 'settimanale' | 'mensile';
type ReminderChannel = 'email' | 'notifica' | 'entrambi';
type ReminderStatus = 'attivo' | 'inattivo' | 'inviato';
type ReminderCategory = 'normativa' | 'documento' | 'formazione' | 'gdpr' | 'sistema';

interface Reminder {
  id: string;
  titolo: string;
  descrizione: string;
  scadenza: string;
  anticipo_giorni: number; // alert X days before
  frequenza: ReminderFreq;
  canale: ReminderChannel;
  destinatari: string[];
  categoria: ReminderCategory;
  status: ReminderStatus;
  ultimo_invio?: string;
  prossimo_invio?: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_REMINDERS: Reminder[] = [
  {
    id: 'r1',
    titolo: 'DPIA HiBob HR AI — avvio obbligatorio',
    descrizione: 'Sollecita l\'avvio della DPIA per HiBob HR AI. Scadenza critica entro il 15 aprile 2026.',
    scadenza: '2026-04-15',
    anticipo_giorni: 21,
    frequenza: 'settimanale',
    canale: 'entrambi',
    destinatari: ['marco.rossi@aedix.it', 'sofia.ricci@aedix.it'],
    categoria: 'gdpr',
    status: 'attivo',
    ultimo_invio: '2026-03-18',
    prossimo_invio: '2026-03-25',
  },
  {
    id: 'r2',
    titolo: 'AI Literacy — sollecito dipendenti non formati',
    descrizione: 'Notifica automatica a Marco Bianchi e Luca Verdi per completare il corso AI Literacy obbligatorio.',
    scadenza: '2026-04-02',
    anticipo_giorni: 14,
    frequenza: 'settimanale',
    canale: 'email',
    destinatari: ['marco.bianchi@aedix.it', 'luca.verdi@aedix.it', 'hr@aedix.it'],
    categoria: 'formazione',
    status: 'attivo',
    ultimo_invio: '2026-03-19',
    prossimo_invio: '2026-03-26',
  },
  {
    id: 'r3',
    titolo: 'Registro Trattamenti GDPR — aggiornamento urgente',
    descrizione: 'Il registro ex Art. 30 GDPR non è stato aggiornato. Alert immediato al DPO.',
    scadenza: '2026-04-01',
    anticipo_giorni: 7,
    frequenza: 'una_volta',
    canale: 'entrambi',
    destinatari: ['marco.rossi@aedix.it'],
    categoria: 'gdpr',
    status: 'attivo',
    prossimo_invio: '2026-03-25',
  },
  {
    id: 'r4',
    titolo: 'Scadenza principale AI Act — 2 agosto 2026',
    descrizione: 'Reminder mensile sulla scadenza principale per la conformità AI Act sistemi alto rischio.',
    scadenza: '2026-08-02',
    anticipo_giorni: 90,
    frequenza: 'mensile',
    canale: 'email',
    destinatari: ['marco.rossi@aedix.it', 'sofia.ricci@aedix.it', 'luca.verdi@aedix.it'],
    categoria: 'normativa',
    status: 'attivo',
    ultimo_invio: '2026-03-01',
    prossimo_invio: '2026-04-01',
  },
  {
    id: 'r5',
    titolo: 'Rinnovo NDA Fornitore AI Analytics',
    descrizione: 'NDA scaduto il 15/01/2026. Reminder per avviare rinnovo contrattuale.',
    scadenza: '2026-01-15',
    anticipo_giorni: 30,
    frequenza: 'una_volta',
    canale: 'notifica',
    destinatari: ['marco.rossi@aedix.it'],
    categoria: 'documento',
    status: 'inviato',
    ultimo_invio: '2025-12-15',
  },
  {
    id: 'r6',
    titolo: 'Revisione annuale Policy AI interna',
    descrizione: 'La policy interna sull\'uso dell\'AI richiede revisione annuale. Alert 30 giorni prima.',
    scadenza: '2026-03-25',
    anticipo_giorni: 30,
    frequenza: 'una_volta',
    canale: 'email',
    destinatari: ['sofia.ricci@aedix.it'],
    categoria: 'documento',
    status: 'inattivo',
    ultimo_invio: '2026-02-23',
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<ReminderCategory, { label: string; dot: string; bg: string; text: string }> = {
  normativa:  { label: 'Normativa',  dot: 'bg-purple-500', bg: 'bg-purple-50', text: 'text-purple-700' },
  documento:  { label: 'Documento',  dot: 'bg-blue-500',   bg: 'bg-blue-50',   text: 'text-blue-700' },
  formazione: { label: 'Formazione', dot: 'bg-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-700' },
  gdpr:       { label: 'GDPR',       dot: 'bg-orange-500', bg: 'bg-orange-50', text: 'text-orange-700' },
  sistema:    { label: 'Sistema AI', dot: 'bg-teal-500',   bg: 'bg-teal-50',   text: 'text-teal-700' },
};

const STATUS_CONFIG: Record<ReminderStatus, { label: string; badge: string; icon: React.ComponentType<{ className?: string }> }> = {
  attivo:   { label: 'Attivo',   badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  inattivo: { label: 'Inattivo', badge: 'bg-gray-100 text-gray-500 border-gray-200',         icon: Clock },
  inviato:  { label: 'Inviato',  badge: 'bg-blue-50 text-blue-700 border-blue-200',           icon: Mail },
};

const FREQ_LABELS: Record<ReminderFreq, string> = {
  una_volta: 'Una volta',
  settimanale: 'Settimanale',
  mensile: 'Mensile',
};

const CHANNEL_LABELS: Record<ReminderChannel, string> = {
  email: '📧 Email',
  notifica: '🔔 Notifica app',
  entrambi: '📧 + 🔔 Entrambi',
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
}

function daysUntil(iso: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [y, m, d] = iso.split('-').map(Number);
  return Math.round((new Date(y, m - 1, d).getTime() - today.getTime()) / 86400000);
}

// ─── New reminder modal ───────────────────────────────────────────────────────

function NewReminderModal({ onClose }: { onClose: () => void }) {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    titolo: '',
    scadenza: '',
    anticipo: '7',
    frequenza: 'una_volta' as ReminderFreq,
    canale: 'entrambi' as ReminderChannel,
    destinatari: '',
    categoria: 'normativa' as ReminderCategory,
  });

  const upd = <K extends keyof typeof form>(k: K, v: typeof form[K]) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(onClose, 1600);
  };

  if (saved) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-xl p-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
          <p className="text-lg font-bold text-[#1a375b]">Reminder creato!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#1a375b]">Nuovo reminder</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Titolo</label>
            <input value={form.titolo} onChange={e => upd('titolo', e.target.value)} placeholder="Es. Revisione annuale Privacy Policy" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a375b]/20" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Data scadenza</label>
              <input type="date" value={form.scadenza} onChange={e => upd('scadenza', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Anticipo (giorni)</label>
              <input type="number" value={form.anticipo} onChange={e => upd('anticipo', e.target.value)} min={1} max={90} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Frequenza</label>
              <select value={form.frequenza} onChange={e => upd('frequenza', e.target.value as ReminderFreq)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                <option value="una_volta">Una volta</option>
                <option value="settimanale">Settimanale</option>
                <option value="mensile">Mensile</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Canale</label>
              <select value={form.canale} onChange={e => upd('canale', e.target.value as ReminderChannel)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                <option value="email">Email</option>
                <option value="notifica">Notifica app</option>
                <option value="entrambi">Email + Notifica</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoria</label>
            <select value={form.categoria} onChange={e => upd('categoria', e.target.value as ReminderCategory)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
              {(Object.entries(CATEGORY_CONFIG) as [ReminderCategory, typeof CATEGORY_CONFIG[ReminderCategory]][]).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Destinatari (email, separate da virgola)</label>
            <input value={form.destinatari} onChange={e => upd('destinatari', e.target.value)} placeholder="mario@azienda.it, luigi@azienda.it" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">Annulla</button>
          <button
            onClick={handleSave}
            disabled={!form.titolo || !form.scadenza}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1a375b] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
          >
            <Save className="h-4 w-4" /> Crea reminder
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Reminder row ─────────────────────────────────────────────────────────────

function ReminderRow({ reminder, onToggle }: { reminder: Reminder; onToggle: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const catCfg = CATEGORY_CONFIG[reminder.categoria];
  const statusCfg = STATUS_CONFIG[reminder.status];
  const StatusIcon = statusCfg.icon;
  const days = daysUntil(reminder.scadenza);

  return (
    <div className={`bg-white border rounded-xl overflow-hidden transition-all ${
      reminder.status === 'attivo' ? 'border-gray-200' : 'border-gray-100 opacity-70'
    }`}>
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Toggle */}
        <button
          onClick={() => onToggle(reminder.id)}
          className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ${reminder.status === 'attivo' ? 'bg-[#1a375b]' : 'bg-gray-200'}`}
        >
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${reminder.status === 'attivo' ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${catCfg.bg} ${catCfg.text}`}>{catCfg.label}</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${statusCfg.badge}`}>
              <StatusIcon className="h-3 w-3" /> {statusCfg.label}
            </span>
          </div>
          <p className="text-sm font-semibold text-[#1a375b] truncate">{reminder.titolo}</p>
          <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
            <span>{FREQ_LABELS[reminder.frequenza]}</span>
            <span>{CHANNEL_LABELS[reminder.canale]}</span>
            <span className={`font-medium ${days < 0 ? 'text-red-500' : days <= 14 ? 'text-amber-500' : 'text-gray-400'}`}>
              Scadenza {formatDate(reminder.scadenza)}{days >= 0 ? ` (tra ${days}g)` : ` (${Math.abs(days)}g fa)`}
            </span>
          </div>
        </div>

        {/* Expand */}
        <button onClick={() => setExpanded(p => !p)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
          <p className="text-xs text-gray-600">{reminder.descrizione}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Anticipo avviso</p>
              <p className="text-sm font-medium text-[#1a375b] mt-0.5">{reminder.anticipo_giorni} giorni prima</p>
            </div>
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Prossimo invio</p>
              <p className="text-sm font-medium text-[#1a375b] mt-0.5">{reminder.prossimo_invio ? formatDate(reminder.prossimo_invio) : '—'}</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1.5">Destinatari</p>
            <div className="flex flex-wrap gap-1.5">
              {reminder.destinatari.map(d => (
                <span key={d} className="flex items-center gap-1 text-[11px] bg-gray-100 text-gray-700 rounded-full px-2 py-0.5">
                  <Mail className="h-3 w-3 text-gray-400" /> {d}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#1a375b] border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              <Mail className="h-3.5 w-3.5" /> Invia ora
            </button>
            <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#1a375b] border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              <Edit2 className="h-3.5 w-3.5" /> Modifica
            </button>
            <button className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors ml-auto">
              <Trash2 className="h-3.5 w-3.5" /> Elimina
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Needed imports for expand/collapse ──────────────────────────────────────

function ChevronUp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AppReminders() {
  const [reminders, setReminders] = useState(MOCK_REMINDERS);
  const [showModal, setShowModal] = useState(false);
  const [filterCat, setFilterCat] = useState<ReminderCategory | 'tutti'>('tutti');
  const [filterStatus, setFilterStatus] = useState<ReminderStatus | 'tutti'>('tutti');

  const handleToggle = (id: string) => {
    setReminders(prev => prev.map(r =>
      r.id === id ? { ...r, status: r.status === 'attivo' ? 'inattivo' : 'attivo' as ReminderStatus } : r
    ));
  };

  const filtered = reminders.filter(r => {
    const matchCat = filterCat === 'tutti' || r.categoria === filterCat;
    const matchStatus = filterStatus === 'tutti' || r.status === filterStatus;
    return matchCat && matchStatus;
  });

  const stats = {
    totali: reminders.length,
    attivi: reminders.filter(r => r.status === 'attivo').length,
    prossimi: reminders.filter(r => r.status === 'attivo' && r.prossimo_invio && daysUntil(r.prossimo_invio) <= 7).length,
    inviati: reminders.filter(r => r.status === 'inviato').length,
  };

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1a375b] flex items-center gap-2">
            <Bell className="h-6 w-6 text-[#185FA5]" />
            Reminder Automatici
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Notifiche automatiche per scadenze, rinnovi e obblighi normativi
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#1a375b] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" /> Nuovo reminder
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Totali', value: stats.totali, color: 'text-[#1a375b]' },
          { label: 'Attivi', value: stats.attivi, color: 'text-emerald-600' },
          { label: 'In invio (7gg)', value: stats.prossimi, color: 'text-amber-600' },
          { label: 'Già inviati', value: stats.inviati, color: 'text-blue-600' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500 font-medium">Categoria:</span>
          {(['tutti', ...Object.keys(CATEGORY_CONFIG)] as (ReminderCategory | 'tutti')[]).map(c => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                filterCat === c ? 'bg-[#1a375b] text-white border-[#1a375b]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {c === 'tutti' ? 'Tutti' : CATEGORY_CONFIG[c as ReminderCategory].label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500 font-medium">Stato:</span>
          {(['tutti', 'attivo', 'inattivo', 'inviato'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                filterStatus === s ? 'bg-[#1a375b] text-white border-[#1a375b]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {s === 'tutti' ? 'Tutti' : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Reminder list ── */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center py-16 text-center">
            <Bell className="h-10 w-10 text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">Nessun reminder trovato.</p>
          </div>
        ) : (
          filtered.map(r => (
            <ReminderRow key={r.id} reminder={r} onToggle={handleToggle} />
          ))
        )}
      </div>

      {/* ── Info box ── */}
      <div className="bg-[#E6F1FB] border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Bell className="h-5 w-5 text-[#185FA5] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-[#1a375b] mb-1">Come funzionano i reminder</p>
          <p className="text-xs text-gray-600 leading-relaxed">
            I reminder vengono inviati automaticamente via email e/o notifica in-app ai destinatari specificati.
            L'anticipo definisce quanti giorni prima della scadenza inizia la notifica.
            I reminder settimanali si ripetono ogni 7 giorni fino alla scadenza.
          </p>
        </div>
      </div>

      {showModal && <NewReminderModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
