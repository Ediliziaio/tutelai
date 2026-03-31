import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, AlertTriangle, CheckCircle2, Clock, FileText, GraduationCap, Shield, Bot } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type EventCategory = 'normativa' | 'documento' | 'formazione' | 'gdpr' | 'sistema';
type EventUrgency = 'urgente' | 'attenzione' | 'info' | 'completato';

interface CalendarEvent {
  id: string;
  titolo: string;
  descrizione: string;
  data: string; // YYYY-MM-DD
  categoria: EventCategory;
  urgenza: EventUrgency;
  fonte?: string;
  link?: string;
}

// ─── Static compliance events (legal expert data) ─────────────────────────────
// Source: Reg. UE 2024/1689 (AI Act), L.132/2025, GDPR, mockDocumenti

const COMPLIANCE_EVENTS: CalendarEvent[] = [
  // ── AI Act milestones ──
  {
    id: 'aact-1',
    titolo: 'AI Act — Entrata in vigore',
    descrizione: 'Regolamento UE 2024/1689 ufficialmente in vigore. Inizio periodo di adeguamento.',
    data: '2024-08-01',
    categoria: 'normativa',
    urgenza: 'completato',
    fonte: 'Art. 113 Reg. UE 2024/1689',
  },
  {
    id: 'aact-2',
    titolo: 'AI Act — Divieto pratiche inaccettabili + AI Literacy',
    descrizione: 'Entrano in vigore: divieto assoluto delle pratiche AI inaccettabili (Art. 5) e obbligo di AI Literacy per tutto il personale (Art. 4). Sanzioni fino a €35M o 7% fatturato.',
    data: '2025-02-02',
    categoria: 'normativa',
    urgenza: 'completato',
    fonte: 'Art. 5 e Art. 4 Reg. UE 2024/1689',
  },
  {
    id: 'l132-1',
    titolo: 'Legge 132/2025 — Entrata in vigore',
    descrizione: 'Entra in vigore la Legge italiana 132/2025 sull\'uso dell\'AI nei rapporti di lavoro. Obblighi di informativa, consultazione sindacale, nomina AI Officer.',
    data: '2025-04-15',
    categoria: 'normativa',
    urgenza: 'completato',
    fonte: 'L. 132/2025',
  },
  {
    id: 'l132-2',
    titolo: 'L.132/2025 — Scadenza informative lavoratori',
    descrizione: 'Termine per adeguare le informative ai lavoratori sull\'uso di sistemi AI nei processi HR, monitoraggio e valutazione delle prestazioni (Art. 11 L.132/2025).',
    data: '2025-07-15',
    categoria: 'normativa',
    urgenza: 'completato',
    fonte: 'Art. 11 L. 132/2025',
  },
  {
    id: 'aact-3',
    titolo: 'AI Act — Obblighi GPAI (modelli AI per uso generale)',
    descrizione: 'Entrano in vigore gli obblighi per i fornitori di modelli GPAI (Claude, GPT-4, Gemini). Le aziende che integrano API AI devono verificare la conformità del fornitore.',
    data: '2025-08-02',
    categoria: 'normativa',
    urgenza: 'completato',
    fonte: 'Titolo III Cap. 5 Reg. UE 2024/1689',
  },
  {
    id: 'l132-3',
    titolo: 'L.132/2025 — Prima relazione annuale AI Officer',
    descrizione: 'L\'AI Officer deve redigere e consegnare la prima relazione annuale sullo stato di utilizzo e conformità AI in azienda (Art. 8 L.132/2025).',
    data: '2025-10-15',
    categoria: 'normativa',
    urgenza: 'completato',
    fonte: 'Art. 8 L. 132/2025',
  },
  {
    id: 'aact-4',
    titolo: 'AI Act — SCADENZA PRINCIPALE: Sistemi AI alto rischio',
    descrizione: 'Obbligo piena conformità per tutti i sistemi AI ad alto rischio (Allegato III): sistemi HR, credit scoring, sicurezza infrastrutture. Sanzioni fino a €30M o 6% fatturato. È LA scadenza più critica per le PMI.',
    data: '2026-08-02',
    categoria: 'normativa',
    urgenza: 'urgente',
    fonte: 'Artt. 6-49 Reg. UE 2024/1689 — Allegato III',
  },
  {
    id: 'aact-5',
    titolo: 'AI Act — Sistemi alto rischio preesistenti',
    descrizione: 'I sistemi AI ad alto rischio già in commercio prima di agosto 2026 devono essere adeguati entro questa data.',
    data: '2027-08-02',
    categoria: 'normativa',
    urgenza: 'attenzione',
    fonte: 'Art. 111 Reg. UE 2024/1689',
  },

  // ── Documenti aziendali (AEDIX) ──
  {
    id: 'doc-1',
    titolo: 'Revisione Policy uso AI interno',
    descrizione: 'La policy interna sull\'uso dell\'AI richiede revisione annuale. Verificare aggiornamenti normativi e adeguare le procedure.',
    data: '2026-03-25',
    categoria: 'documento',
    urgenza: 'urgente',
  },
  {
    id: 'doc-2',
    titolo: 'Rinnovo Clausole fornitore OpenAI',
    descrizione: 'Le clausole contrattuali AI con OpenAI devono essere aggiornate dopo l\'entrata in vigore degli obblighi GPAI (agosto 2025).',
    data: '2026-04-10',
    categoria: 'documento',
    urgenza: 'attenzione',
  },
  {
    id: 'doc-3',
    titolo: 'Aggiornamento Registro Trattamenti GDPR',
    descrizione: 'Il Registro ex Art. 30 GDPR non è stato aggiornato da 45 giorni. Aggiornare con i nuovi sistemi AI aggiunti (Voice Agent Twilio, Tidio Chatbot).',
    data: '2026-04-01',
    categoria: 'gdpr',
    urgenza: 'urgente',
  },
  {
    id: 'doc-4',
    titolo: 'DPIA — HiBob HR AI (scadenza avvio)',
    descrizione: 'La DPIA per HiBob HR AI è obbligatoria (sistema ad alto rischio, trattamento dati HR). Va avviata entro questa data per rispettare la scadenza AI Act.',
    data: '2026-04-15',
    categoria: 'gdpr',
    urgenza: 'urgente',
  },
  {
    id: 'doc-5',
    titolo: 'Revisione annuale Informativa Privacy AI',
    descrizione: 'L\'informativa agli utenti sulle finalità AI deve essere rivista e aggiornata annualmente.',
    data: '2026-06-01',
    categoria: 'gdpr',
    urgenza: 'attenzione',
  },
  {
    id: 'doc-6',
    titolo: 'Rinnovo NDA con fornitore AI',
    descrizione: 'Scadenza NDA con il fornitore del sistema AI di analisi dati.',
    data: '2026-07-15',
    categoria: 'documento',
    urgenza: 'attenzione',
  },

  // ── Formazione ──
  {
    id: 'form-1',
    titolo: 'Scadenza: AI Literacy obbligatoria — 2 utenti non completati',
    descrizione: 'Marco Bianchi e Luca Verdi non hanno ancora completato il corso AI Literacy Base obbligatorio ex Art. 4 AI Act. Sollecitare immediatamente.',
    data: '2026-04-02',
    categoria: 'formazione',
    urgenza: 'urgente',
  },
  {
    id: 'form-2',
    titolo: 'Rinnovo certificazioni AI Literacy (annuale)',
    descrizione: 'Le certificazioni AI Literacy scadono annualmente. Pianificare il rinnovo del team per l\'anno successivo.',
    data: '2027-02-01',
    categoria: 'formazione',
    urgenza: 'info',
  },

  // ── Sistemi AI ──
  {
    id: 'sist-1',
    titolo: 'Revisione Voice Agent Twilio — disclosure obbligatoria',
    descrizione: 'Il Voice Agent Twilio deve avere uno script di disclosure obbligatoria all\'inizio di ogni chiamata (Art. 50 AI Act — Trasparenza AI). Scadenza: 2 agosto 2026.',
    data: '2026-05-01',
    categoria: 'sistema',
    urgenza: 'urgente',
  },
  {
    id: 'sist-2',
    titolo: 'Audit annuale sistemi AI in produzione',
    descrizione: 'Revisione periodica di tutti i sistemi AI censiti: verifica conformità, aggiornamento fornitore, controllo documentazione tecnica.',
    data: '2026-09-01',
    categoria: 'sistema',
    urgenza: 'info',
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<EventCategory, { label: string; icon: React.ComponentType<{ className?: string }>; dot: string; bg: string; text: string; border: string }> = {
  normativa: { label: 'Normativa', icon: Shield,       dot: 'bg-purple-500',   bg: 'bg-purple-50',   text: 'text-purple-700',  border: 'border-purple-200' },
  documento: { label: 'Documento', icon: FileText,     dot: 'bg-blue-500',     bg: 'bg-blue-50',     text: 'text-blue-700',    border: 'border-blue-200' },
  formazione:{ label: 'Formazione',icon: GraduationCap,dot: 'bg-indigo-500',   bg: 'bg-indigo-50',   text: 'text-indigo-700',  border: 'border-indigo-200' },
  gdpr:      { label: 'GDPR',      icon: Shield,       dot: 'bg-orange-500',   bg: 'bg-orange-50',   text: 'text-orange-700',  border: 'border-orange-200' },
  sistema:   { label: 'Sistema AI',icon: Bot,          dot: 'bg-teal-500',     bg: 'bg-teal-50',     text: 'text-teal-700',    border: 'border-teal-200' },
};

const URGENCY_CONFIG: Record<EventUrgency, { label: string; badge: string; icon: React.ComponentType<{ className?: string }> }> = {
  urgente:    { label: 'Urgente',    badge: 'bg-red-100 text-red-700 border border-red-200',     icon: AlertTriangle },
  attenzione: { label: 'Attenzione', badge: 'bg-amber-100 text-amber-700 border border-amber-200', icon: Clock },
  info:       { label: 'Info',       badge: 'bg-gray-100 text-gray-600 border border-gray-200',   icon: Calendar },
  completato: { label: 'Fatto',      badge: 'bg-green-100 text-green-700 border border-green-200', icon: CheckCircle2 },
};

const DAYS_SHORT = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
const MONTHS_IT = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function toKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatDateIT(iso: string): string {
  const d = parseDate(iso);
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS_IT[d.getMonth()]} ${d.getFullYear()}`;
}

function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = parseDate(iso);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function EventCard({ event, compact = false }: { event: CalendarEvent; compact?: boolean }) {
  const cat = CATEGORY_CONFIG[event.categoria];
  const urg = URGENCY_CONFIG[event.urgenza];
  const UrgIcon = urg.icon;
  const CatIcon = cat.icon;
  const days = daysUntil(event.data);

  return (
    <div className={`border rounded-xl p-4 ${cat.border} ${cat.bg} ${compact ? 'py-3' : ''}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <CatIcon className={`h-4 w-4 shrink-0 ${cat.text}`} />
          <span className="text-sm font-semibold text-[#1a375b] leading-snug">{event.titolo}</span>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${urg.badge}`}>
          <UrgIcon className="h-3 w-3" />
          {urg.label}
        </span>
      </div>
      {!compact && (
        <p className="text-xs text-gray-600 leading-relaxed mb-2">{event.descrizione}</p>
      )}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{formatDateIT(event.data)}</span>
        {event.urgenza !== 'completato' && (
          <span className={`text-xs font-medium ${days < 0 ? 'text-red-600' : days <= 30 ? 'text-amber-600' : 'text-gray-500'}`}>
            {days < 0 ? `${Math.abs(days)}g scaduto` : days === 0 ? 'Oggi' : `tra ${days}g`}
          </span>
        )}
        {event.fonte && (
          <span className="text-[10px] text-gray-400 italic">{event.fonte}</span>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AppCalendario() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState<EventCategory | 'tutti'>('tutti');

  // Map events by date key
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    COMPLIANCE_EVENTS.forEach((ev) => {
      if (!map[ev.data]) map[ev.data] = [];
      map[ev.data].push(ev);
    });
    return map;
  }, []);

  // Calendar grid days
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    // Monday-based week: Mon=0 ... Sun=6
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const grid: (Date | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      grid.push(new Date(viewYear, viewMonth, d));
    }
    while (grid.length % 7 !== 0) grid.push(null);
    return grid;
  }, [viewYear, viewMonth]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };
  const goToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDate(null);
  };

  // Events for right panel
  const panelEvents = useMemo(() => {
    let evs = selectedDate
      ? (eventsByDate[selectedDate] ?? [])
      : COMPLIANCE_EVENTS.filter(ev => {
          const d = parseDate(ev.data);
          return d.getFullYear() === viewYear && d.getMonth() === viewMonth;
        }).sort((a, b) => a.data.localeCompare(b.data));
    if (filterCat !== 'tutti') evs = evs.filter(e => e.categoria === filterCat);
    return evs;
  }, [selectedDate, filterCat, viewYear, viewMonth, eventsByDate]);

  // Stats for current view (upcoming = future, not completato)
  const stats = useMemo(() => {
    const allFuture = COMPLIANCE_EVENTS.filter(e => e.urgenza !== 'completato');
    const urgenti = allFuture.filter(e => {
      const d = daysUntil(e.data);
      return d >= 0 && d <= 30;
    }).length;
    const scaduti = allFuture.filter(e => daysUntil(e.data) < 0).length;
    const prossimi = allFuture.filter(e => {
      const d = daysUntil(e.data);
      return d > 30 && d <= 90;
    }).length;
    return { urgenti, scaduti, prossimi };
  }, []);

  const todayKey = toKey(today);

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a375b] flex items-center gap-2">
          <Calendar className="h-6 w-6 text-[#185FA5]" />
          Calendario Scadenze
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Tutte le scadenze normative, documentali e formative in un'unica vista.
        </p>
      </div>

      {/* ── Stats bar ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Scaduti / Urgenti oggi', value: stats.scaduti, color: 'text-red-600', bg: 'bg-red-50 border-red-100' },
          { label: 'In scadenza (30 giorni)', value: stats.urgenti, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
          { label: 'Prossimi (90 giorni)',    value: stats.prossimi, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
        ].map((s) => (
          <div key={s.label} className={`border rounded-xl p-4 text-center ${s.bg}`}>
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Main layout: calendar + panel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">

        {/* ─ Calendar ─ */}
        <div className="bg-white border border-[#C8C5BC] rounded-xl overflow-hidden">
          {/* Month nav */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            </button>
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-[#1a375b]">
                {MONTHS_IT[viewMonth]} {viewYear}
              </h2>
              <button
                onClick={goToday}
                className="text-xs font-medium text-[#185FA5] border border-[#185FA5] px-2 py-0.5 rounded-full hover:bg-[#E6F1FB] transition-colors"
              >
                Oggi
              </button>
            </div>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Days header */}
          <div className="grid grid-cols-7 border-b border-gray-100">
            {DAYS_SHORT.map((d) => (
              <div key={d} className="py-2 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((date, i) => {
              if (!date) {
                return <div key={`empty-${i}`} className="h-[80px] border-r border-b border-gray-50 bg-gray-50/50" />;
              }
              const key = toKey(date);
              const dayEvents = eventsByDate[key] ?? [];
              const isToday = key === todayKey;
              const isSelected = key === selectedDate;
              const isPast = date < today;

              return (
                <button
                  key={key}
                  onClick={() => setSelectedDate(isSelected ? null : key)}
                  className={`h-[80px] border-r border-b border-gray-50 p-1.5 text-left transition-colors relative
                    ${isSelected ? 'bg-[#E6F1FB] ring-2 ring-inset ring-[#185FA5]' : 'hover:bg-gray-50'}
                    ${isPast && !isToday ? 'opacity-60' : ''}
                  `}
                >
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold mb-1
                    ${isToday ? 'bg-[#1a375b] text-white' : 'text-gray-700'}
                  `}>
                    {date.getDate()}
                  </span>
                  {/* Event dots */}
                  <div className="flex flex-wrap gap-0.5">
                    {dayEvents.slice(0, 4).map((ev) => (
                      <span
                        key={ev.id}
                        className={`inline-block h-1.5 w-1.5 rounded-full ${CATEGORY_CONFIG[ev.categoria].dot}`}
                        title={ev.titolo}
                      />
                    ))}
                    {dayEvents.length > 4 && (
                      <span className="text-[9px] text-gray-400 font-medium">+{dayEvents.length - 4}</span>
                    )}
                  </div>
                  {dayEvents.some(e => e.urgenza === 'urgente') && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="px-5 py-3 border-t border-gray-100 flex flex-wrap gap-3">
            {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </div>
            ))}
          </div>
        </div>

        {/* ─ Right panel: events list ─ */}
        <div className="bg-white border border-[#C8C5BC] rounded-xl flex flex-col overflow-hidden">
          {/* Panel header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#1a375b]">
              {selectedDate
                ? formatDateIT(selectedDate)
                : `${MONTHS_IT[viewMonth]} ${viewYear}`}
            </h3>
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value as EventCategory | 'tutti')}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 focus:outline-none"
            >
              <option value="tutti">Tutte le categorie</option>
              {Object.entries(CATEGORY_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>

          {/* Events */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {panelEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <Calendar className="h-8 w-8 text-gray-200 mb-2" />
                <p className="text-sm text-gray-400">Nessuna scadenza in questo periodo.</p>
              </div>
            ) : (
              panelEvents.map((ev) => <EventCard key={ev.id} event={ev} compact={panelEvents.length > 3} />)
            )}
          </div>

          {/* Panel footer — upcoming critical */}
          {!selectedDate && (
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Prossima scadenza critica</p>
              {(() => {
                const next = COMPLIANCE_EVENTS
                  .filter(e => e.urgenza === 'urgente' && daysUntil(e.data) > 0)
                  .sort((a, b) => a.data.localeCompare(b.data))[0];
                if (!next) return <p className="text-xs text-gray-400">Nessuna scadenza urgente futura.</p>;
                return (
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-[#1a375b] truncate pr-2">{next.titolo}</p>
                    <span className="text-xs font-bold text-red-600 shrink-0">tra {daysUntil(next.data)}g</span>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
