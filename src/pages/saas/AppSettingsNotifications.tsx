import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, Bell, Mail, MessageSquare, Slack } from 'lucide-react';

const SETTINGS_TABS = [
  { label: 'Azienda',      path: '/app/settings/company' },
  { label: 'Team',         path: '/app/settings/team' },
  { label: 'Sicurezza',    path: '/app/settings/security' },
  { label: 'Notifiche',    path: '/app/settings/notifications' },
  { label: 'Integrazioni', path: '/app/settings/integrations' },
];

interface NotifType {
  id: string;
  label: string;
  urgenza: 'bassa' | 'media' | 'alta';
  enabled: boolean;
}

const URGENZA_BADGE: Record<string, string> = {
  alta:  'bg-[#FDEAEA] text-[#8B1A1A]',
  media: 'bg-[#FDF3E3] text-[#854F0B]',
  bassa: 'bg-[#EAF5EE] text-[#1D6B3A]',
};

const DAYS = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì'];
const TIMES = ['08:00', '09:00', '10:00', '12:00', '15:00', '18:00'];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${checked ? 'bg-[#042C53]' : 'bg-gray-200'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  );
}

export default function AppSettingsNotifications() {
  const location = useLocation();
  const [toast, setToast] = useState(false);

  const [channels, setChannels] = useState({ email: true, whatsapp: false, slack: false });
  const [digestDay, setDigestDay] = useState('Lunedì');
  const [digestTime, setDigestTime] = useState('09:00');

  const [notifTypes, setNotifTypes] = useState<NotifType[]>([
    { id: 'scadenze',     label: 'Scadenze normative',      urgenza: 'alta',  enabled: true  },
    { id: 'documenti',    label: 'Documenti in scadenza',   urgenza: 'media', enabled: true  },
    { id: 'formazione',   label: 'Formazione in arretrato', urgenza: 'media', enabled: true  },
    { id: 'normativi',    label: 'Aggiornamenti normativi', urgenza: 'bassa', enabled: true  },
    { id: 'team',         label: 'Attività team',           urgenza: 'bassa', enabled: false },
    { id: 'report',       label: 'Report settimanale',      urgenza: 'bassa', enabled: true  },
  ]);

  function toggleNotifType(id: string) {
    setNotifTypes((prev) => prev.map((n) => n.id === id ? { ...n, enabled: !n.enabled } : n));
  }

  function handleSave() {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  }

  return (
    <div className="p-6 space-y-6 bg-[#FAFAF8] min-h-full">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#042C53] text-white px-5 py-3 rounded-xl shadow-lg text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-green-300" />
          Impostazioni notifiche salvate.
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-[#042C53]">Impostazioni — Notifiche</h1>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 border-b border-[#C8C5BC]">
        {SETTINGS_TABS.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <Link
              key={tab.label}
              to={tab.path}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                active
                  ? 'border-[#185FA5] text-[#185FA5] bg-[#E6F1FB]'
                  : 'border-transparent text-gray-600 hover:text-[#042C53] hover:border-gray-300'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Canali */}
      <div className="bg-white border border-[#C8C5BC] rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-[#042C53] flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#185FA5]" />
          Canali di notifica
        </h2>
        <div className="space-y-3">
          {/* Email */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#185FA5]" />
              <div>
                <div className="text-sm font-medium text-[#042C53]">Email</div>
                <div className="text-xs text-gray-500">Ricevi notifiche all'indirizzo registrato</div>
              </div>
            </div>
            <Toggle checked={channels.email} onChange={() => setChannels((c) => ({ ...c, email: !c.email }))} />
          </div>
          {/* WhatsApp */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 text-green-600" />
              <div>
                <div className="text-sm font-medium text-[#042C53] flex items-center gap-2">
                  WhatsApp
                  <span className="text-xs bg-[#FDF3E3] text-[#854F0B] px-2 py-0.5 rounded-full">Add-on €19/mese</span>
                </div>
                <div className="text-xs text-gray-500">Notifiche urgenti su WhatsApp</div>
              </div>
            </div>
            <Toggle checked={channels.whatsapp} onChange={() => setChannels((c) => ({ ...c, whatsapp: !c.whatsapp }))} />
          </div>
          {/* Slack */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Slack className="w-4 h-4 text-purple-600" />
              <div>
                <div className="text-sm font-medium text-[#042C53]">Slack</div>
                <div className="text-xs text-gray-500">Integra con il tuo workspace Slack</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {channels.slack && (
                <button className="border border-[#C8C5BC] hover:bg-gray-50 text-[#042C53] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                  Configura
                </button>
              )}
              <Toggle checked={channels.slack} onChange={() => setChannels((c) => ({ ...c, slack: !c.slack }))} />
            </div>
          </div>
        </div>
      </div>

      {/* Tipi notifica */}
      <div className="bg-white border border-[#C8C5BC] rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-[#042C53]">Tipi di notifica</h2>
        <div className="divide-y divide-gray-100">
          {notifTypes.map((n) => (
            <div key={n.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${URGENZA_BADGE[n.urgenza]}`}>
                  {n.urgenza.charAt(0).toUpperCase() + n.urgenza.slice(1)}
                </span>
                <span className="text-sm text-[#042C53]">{n.label}</span>
              </div>
              <Toggle checked={n.enabled} onChange={() => toggleNotifType(n.id)} />
            </div>
          ))}
        </div>
      </div>

      {/* Digest email */}
      <div className="bg-white border border-[#C8C5BC] rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-[#042C53]">Digest email settimanale</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Giorno</label>
            <select
              value={digestDay}
              onChange={(e) => setDigestDay(e.target.value)}
              className="border border-[#C8C5BC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#185FA5]"
            >
              {DAYS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Orario</label>
            <select
              value={digestTime}
              onChange={(e) => setDigestTime(e.target.value)}
              className="border border-[#C8C5BC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#185FA5]"
            >
              {TIMES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="bg-[#042C53] hover:bg-[#185FA5] text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
      >
        <Check className="w-4 h-4" />
        Salva impostazioni
      </button>
    </div>
  );
}
