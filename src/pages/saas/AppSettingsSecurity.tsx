import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, Eye, EyeOff, Shield, Lock, Monitor, LogOut } from 'lucide-react';

const SETTINGS_TABS = [
  { label: 'Azienda',      path: '/app/settings/company' },
  { label: 'Team',         path: '/app/settings/team' },
  { label: 'Sicurezza',    path: '/app/settings/security' },
  { label: 'Notifiche',    path: '/app/settings/notifications' },
  { label: 'Integrazioni', path: '/app/settings/integrations' },
];

const ACCESS_LOG = [
  { data: '25/03/2026 09:01', browser: 'Chrome — macOS', citta: 'Milano', trusted: true },
  { data: '24/03/2026 17:30', browser: 'Safari — iPhone', citta: 'Milano', trusted: true },
  { data: '23/03/2026 10:05', browser: 'Firefox — Windows', citta: 'Roma', trusted: false },
  { data: '22/03/2026 15:00', browser: 'Chrome — macOS', citta: 'Milano', trusted: true },
  { data: '21/03/2026 08:45', browser: 'Chrome — macOS', citta: 'Milano', trusted: true },
];

export default function AppSettingsSecurity() {
  const location = useLocation();
  const [toast, setToast] = useState<string | null>(null);
  const [showPwd, setShowPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  function showToastMsg(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleChangePwd() {
    if (!currentPwd || !newPwd || newPwd !== confirmPwd) {
      showToastMsg('Controlla i campi password.');
      return;
    }
    setCurrentPwd('');
    setNewPwd('');
    setConfirmPwd('');
    showToastMsg('Password cambiata con successo.');
  }

  return (
    <div className="p-6 space-y-6 bg-[#FAFAF8] min-h-full">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#1a375b] text-white px-5 py-3 rounded-xl shadow-lg text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-green-300" />
          {toast}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-[#1a375b]">Impostazioni — Sicurezza</h1>
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
                  : 'border-transparent text-gray-600 hover:text-[#1a375b] hover:border-gray-300'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Autenticazione */}
      <div className="bg-white border border-[#C8C5BC] rounded-xl p-6 space-y-5">
        <h2 className="font-semibold text-[#1a375b] flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#185FA5]" />
          Autenticazione — Cambia password
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Password corrente</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                className="w-full border border-[#C8C5BC] rounded-lg px-3 py-2 pr-9 text-sm focus:outline-none focus:border-[#185FA5]"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nuova password</label>
            <div className="relative">
              <input
                type={showNewPwd ? 'text' : 'password'}
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                className="w-full border border-[#C8C5BC] rounded-lg px-3 py-2 pr-9 text-sm focus:outline-none focus:border-[#185FA5]"
              />
              <button
                type="button"
                onClick={() => setShowNewPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Conferma nuova password</label>
            <input
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              className="w-full border border-[#C8C5BC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#185FA5]"
            />
          </div>
        </div>
        <button
          onClick={handleChangePwd}
          className="bg-[#1a375b] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Cambia password
        </button>
      </div>

      {/* 2FA */}
      <div className="bg-white border border-[#C8C5BC] rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-[#1a375b] flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#185FA5]" />
          Autenticazione a due fattori (2FA)
        </h2>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAF5EE] text-[#1D6B3A] rounded-full text-sm font-medium">
            <Check className="w-3.5 h-3.5" />
            ATTIVO — App TOTP
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => showToastMsg('2FA disattivato.')}
            className="border border-[#C8C5BC] hover:bg-gray-50 text-[#1a375b] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Disattiva 2FA
          </button>
          <button
            onClick={() => showToastMsg('Codici di backup visualizzati.')}
            className="border border-[#C8C5BC] hover:bg-gray-50 text-[#1a375b] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Visualizza codici di backup
          </button>
        </div>
      </div>

      {/* SSO */}
      <div className="bg-white border border-[#C8C5BC] rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-[#1a375b] flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#185FA5]" />
          Single Sign-On (SSO)
        </h2>
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Non configurato</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#1a375b] text-white">solo Enterprise</span>
        </div>
        <button
          onClick={() => showToastMsg('SSO disponibile solo sul piano Enterprise.')}
          className="border border-[#C8C5BC] hover:bg-gray-50 text-[#1a375b] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Configura SSO
        </button>
      </div>

      {/* Sessioni */}
      <div className="bg-white border border-[#C8C5BC] rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-[#1a375b] flex items-center gap-2">
          <Monitor className="w-4 h-4 text-[#185FA5]" />
          Sessioni attive
        </h2>
        <p className="text-sm text-gray-600">Sessioni attive: <strong>2 dispositivi</strong></p>
        <div className="flex gap-2">
          <button
            onClick={() => showToastMsg('Sessioni visualizzate.')}
            className="border border-[#C8C5BC] hover:bg-gray-50 text-[#1a375b] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Vedi sessioni
          </button>
          <button
            onClick={() => showToastMsg('Tutti i dispositivi disconnessi.')}
            className="border border-[#8B1A1A] text-[#8B1A1A] hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Disconnetti tutti
          </button>
        </div>
      </div>

      {/* Log accessi */}
      <div className="bg-white border border-[#C8C5BC] rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-[#1a375b]">Log accessi recenti</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="text-left pb-2 text-xs font-medium text-gray-500">Data</th>
                <th className="text-left pb-2 text-xs font-medium text-gray-500">Browser/OS</th>
                <th className="text-left pb-2 text-xs font-medium text-gray-500">Città</th>
                <th className="text-center pb-2 text-xs font-medium text-gray-500">Trusted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ACCESS_LOG.map((entry, i) => (
                <tr key={i}>
                  <td className="py-2 text-gray-600 text-xs">{entry.data}</td>
                  <td className="py-2 text-gray-700 text-xs">{entry.browser}</td>
                  <td className="py-2 text-gray-600 text-xs">{entry.citta}</td>
                  <td className="py-2 text-center">
                    {entry.trusted
                      ? <Check className="w-3.5 h-3.5 text-green-500 mx-auto" />
                      : <span className="text-amber-500 text-xs">?</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
