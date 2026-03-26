import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell, AlertTriangle, Info, CheckCircle2,
  CheckCheck, X, ChevronRight, Settings, BookOpen, FileText, Shield, AlertCircle,
} from 'lucide-react';
import { mockNotifiche } from '@/data/tutelaiMockData';
import type { Notifica } from '@/types/auth';

// ── helpers ───────────────────────────────────────────────────────────────────

function formatRelative(iso: string): string {
  const now = new Date();
  const date = new Date(iso);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);

  if (diffMin < 1) return 'ora';
  if (diffH < 1) return `${diffMin} min fa`;
  if (diffH < 24) return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  if (diffD === 1) return 'Ieri';
  return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
}

function getDayGroup(iso: string): 'oggi' | 'ieri' | 'settimana' {
  const now = new Date();
  const date = new Date(iso);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 86400000);

  if (date >= todayStart) return 'oggi';
  if (date >= yesterdayStart) return 'ieri';
  return 'settimana';
}

// ── Sub-components ────────────────────────────────────────────────────────────

function UrgencyDot({ urgenza }: { urgenza: Notifica['urgenza'] }) {
  const colors: Record<Notifica['urgenza'], string> = {
    danger: 'bg-[#DC2626]',
    warning: 'bg-[#D97706]',
    info: 'bg-[#185FA5]',
  };
  return <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${colors[urgenza]}`} />;
}

function TipoIcon({ tipo }: { tipo: Notifica['tipo'] }) {
  const cls = 'w-4 h-4 flex-shrink-0';
  switch (tipo) {
    case 'normativa': return <AlertTriangle className={`${cls} text-[#D97706]`} />;
    case 'documento': return <FileText className={`${cls} text-[#185FA5]`} />;
    case 'formazione': return <BookOpen className={`${cls} text-[#22A86B]`} />;
    case 'scadenza': return <AlertCircle className={`${cls} text-[#DC2626]`} />;
    case 'sistema': return <Shield className={`${cls} text-[#185FA5]`} />;
    default: return <Info className={`${cls} text-gray-400`} />;
  }
}

const GROUP_LABELS: Record<'oggi' | 'ieri' | 'settimana', string> = {
  oggi: 'OGGI',
  ieri: 'IERI',
  settimana: 'QUESTA SETTIMANA',
};

// ── Notification Card ─────────────────────────────────────────────────────────

interface NotifCardProps {
  notif: Notifica;
  isRead: boolean;
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

function NotifCard({ notif, isRead, onRead, onDismiss }: NotifCardProps) {
  const unread = !isRead;

  return (
    <div
      className={`relative flex items-start gap-3 p-4 rounded-xl border transition-colors group ${
        unread
          ? 'bg-[#E6F1FB]/50 border-[#185FA5]/25 hover:bg-[#E6F1FB]/70'
          : 'bg-white border-[#C8C5BC] hover:bg-gray-50'
      }`}
    >
      {/* Unread left accent bar */}
      {unread && (
        <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-[#185FA5] rounded-r-full" />
      )}

      {/* Urgency dot */}
      <UrgencyDot urgenza={notif.urgenza} />

      {/* Tipo icon */}
      <div className="mt-0.5 flex-shrink-0">
        <TipoIcon tipo={notif.tipo} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm leading-snug ${unread ? 'font-semibold text-[#042C53]' : 'font-medium text-gray-700'}`}>
            {notif.titolo}
          </p>
          <span className="text-[11px] text-gray-400 flex-shrink-0 mt-0.5 whitespace-nowrap">
            {formatRelative(notif.created_at)}
          </span>
        </div>
        {notif.messaggio && (
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
            {notif.messaggio}
          </p>
        )}
        {unread && (
          <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold uppercase tracking-wide bg-[#E6F1FB] text-[#185FA5] px-1.5 py-0.5 rounded-full">
            Nuova
          </span>
        )}
      </div>

      {/* Action buttons (visible on hover) */}
      <div className="flex items-center gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {notif.link && (
          <Link
            to={notif.link}
            onClick={() => onRead(notif.id)}
            className="p-1.5 rounded-lg hover:bg-[#E6F1FB] text-[#185FA5] transition-colors"
            title="Apri"
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
        <button
          onClick={() => { onRead(notif.id); onDismiss(notif.id); }}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          title="Archivia"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AppNotifications() {
  const [readIds, setReadIds] = useState<Set<string>>(
    new Set(mockNotifiche.filter((n) => n.letta).map((n) => n.id))
  );
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const PAGE_SIZE = 10;

  const visibleNotifiche = useMemo(
    () => mockNotifiche.filter((n) => !dismissedIds.has(n.id)),
    [dismissedIds]
  );

  const displayedNotifiche = useMemo(
    () => (showAll ? visibleNotifiche : visibleNotifiche.slice(0, PAGE_SIZE)),
    [visibleNotifiche, showAll]
  );

  const unreadCount = visibleNotifiche.filter((n) => !readIds.has(n.id)).length;

  function markRead(id: string) {
    setReadIds((prev) => new Set([...prev, id]));
  }

  function dismiss(id: string) {
    setDismissedIds((prev) => new Set([...prev, id]));
  }

  function markAllRead() {
    setReadIds(new Set(mockNotifiche.map((n) => n.id)));
  }

  // Group displayed notifications by day
  const grouped = useMemo(() => {
    const groups: Record<'oggi' | 'ieri' | 'settimana', Notifica[]> = {
      oggi: [],
      ieri: [],
      settimana: [],
    };
    for (const n of displayedNotifiche) {
      groups[getDayGroup(n.created_at)].push(n);
    }
    return groups;
  }, [displayedNotifiche]);

  const hasAny = visibleNotifiche.length > 0;

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-[22px] font-bold text-[#042C53]">Centro notifiche</h1>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 rounded-full bg-[#DC2626] text-white text-[10px] font-bold px-1.5">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="border border-[#C8C5BC] hover:bg-gray-50 text-[#042C53] text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <CheckCheck className="w-4 h-4" />
                Segna tutte come lette
              </button>
            )}
            <Link
              to="/app/settings/notifications"
              className="border border-[#C8C5BC] hover:bg-gray-50 text-[#042C53] text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Impostazioni notifiche
            </Link>
          </div>
        </div>

        {/* ── Empty state ── */}
        {!hasAny && (
          <div className="bg-white border border-[#C8C5BC] rounded-xl p-16 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#EAF5EE] flex items-center justify-center">
              <Bell className="w-7 h-7 text-[#22A86B]" />
            </div>
            <div>
              <p className="text-base font-semibold text-[#042C53]">Nessuna notifica</p>
              <p className="text-sm text-gray-500 mt-1">Sei in regola. Nuovi avvisi appariranno qui.</p>
            </div>
          </div>
        )}

        {/* ── Grouped notifications ── */}
        {hasAny && (
          <div className="space-y-6">
            {(['oggi', 'ieri', 'settimana'] as const).map((group) => {
              const items = grouped[group];
              if (items.length === 0) return null;
              return (
                <div key={group}>
                  {/* Group header */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                      {GROUP_LABELS[group]}
                    </span>
                    <div className="flex-1 h-px bg-[#C8C5BC]" />
                    <span className="text-[11px] text-gray-400 flex-shrink-0">{items.length}</span>
                  </div>

                  {/* Notification cards */}
                  <div className="space-y-2">
                    {items.map((notif) => (
                      <NotifCard
                        key={notif.id}
                        notif={notif}
                        isRead={readIds.has(notif.id)}
                        onRead={markRead}
                        onDismiss={dismiss}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Load more / all-read banner ── */}
        {hasAny && (
          <div className="flex flex-col items-center gap-3 pt-2">
            {!showAll && visibleNotifiche.length > PAGE_SIZE && (
              <button
                onClick={() => setShowAll(true)}
                className="border border-[#C8C5BC] hover:bg-gray-50 text-[#042C53] text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
              >
                Carica altro ({visibleNotifiche.length - PAGE_SIZE} notifiche)
              </button>
            )}
            {unreadCount === 0 && visibleNotifiche.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-[#1D6B3A] bg-[#EAF5EE] px-4 py-2.5 rounded-lg">
                <CheckCircle2 className="w-4 h-4" />
                Hai letto tutte le notifiche
              </div>
            )}
          </div>
        )}

        {/* ── Legend ── */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#C8C5BC]">
          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wide">Legenda:</span>
          {[
            { color: 'bg-[#DC2626]', label: 'Urgente' },
            { color: 'bg-[#D97706]', label: 'Attenzione' },
            { color: 'bg-[#185FA5]', label: 'Info' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <span className={`w-2 h-2 rounded-full ${item.color}`} />
              {item.label}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
