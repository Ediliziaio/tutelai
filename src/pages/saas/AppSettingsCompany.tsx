import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Save, Upload, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SETTINGS_TABS = [
  { label: 'Azienda',      path: '/app/settings/company' },
  { label: 'Team',         path: '/app/settings/team' },
  { label: 'Sicurezza',    path: '/app/settings/security' },
  { label: 'Notifiche',    path: '/app/settings/notifications' },
  { label: 'Integrazioni', path: '/app/settings/integrations' },
];

const SETTORI = [
  'Consulenza / Servizi digitali', 'Manifattura', 'Retail', 'Finanza / Assicurazioni',
  'Sanità', 'Edilizia', 'Professioni legali', 'Altro',
];

const DIPENDENTI = ['1-9', '10-49', '50-199', '200+'];

export default function AppSettingsCompany() {
  const { tenant, updateTenant } = useAuth();
  const location = useLocation();
  const [toast, setToast] = useState(false);

  const [form, setForm] = useState({
    ragione_sociale:     tenant?.ragione_sociale ?? '',
    partita_iva:         tenant?.partita_iva ?? '',
    settore:             tenant?.settore ?? '',
    num_dipendenti:      tenant?.num_dipendenti ?? '',
    sito_web:            tenant?.sito_web ?? '',
    legale_rappresentante: tenant?.legale_rappresentante ?? '',
    email_legale:        tenant?.email_legale ?? '',
    pec:                 tenant?.pec ?? '',
    foro_competente:     '',
  });

  function handleSave() {
    updateTenant({
      ragione_sociale: form.ragione_sociale,
      partita_iva: form.partita_iva,
      settore: form.settore,
      num_dipendenti: form.num_dipendenti,
      sito_web: form.sito_web,
      legale_rappresentante: form.legale_rappresentante,
      email_legale: form.email_legale,
      pec: form.pec,
    });
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  }

  return (
    <div className="p-6 space-y-6 bg-[#FAFAF8] min-h-full">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#1a375b] text-white px-5 py-3 rounded-xl shadow-lg text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-green-300" />
          Modifiche salvate con successo.
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-[#1a375b]">Impostazioni</h1>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 border-b border-[#C8C5BC]">
        {SETTINGS_TABS.map((tab) => {
          const active = location.pathname === tab.path && tab.label !== 'Integrazioni';
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

      {/* Dati aziendali */}
      <div className="bg-white border border-[#C8C5BC] rounded-xl p-6 space-y-5">
        <h2 className="font-semibold text-[#1a375b]">Dati aziendali</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Ragione sociale</label>
            <input
              value={form.ragione_sociale}
              onChange={(e) => setForm((f) => ({ ...f, ragione_sociale: e.target.value }))}
              className="w-full border border-[#C8C5BC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#185FA5]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Partita IVA</label>
            <input
              value={form.partita_iva}
              onChange={(e) => setForm((f) => ({ ...f, partita_iva: e.target.value }))}
              className="w-full border border-[#C8C5BC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#185FA5]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Settore</label>
            <select
              value={form.settore}
              onChange={(e) => setForm((f) => ({ ...f, settore: e.target.value }))}
              className="w-full border border-[#C8C5BC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#185FA5]"
            >
              <option value="">— Seleziona —</option>
              {SETTORI.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">N. dipendenti</label>
            <select
              value={form.num_dipendenti}
              onChange={(e) => setForm((f) => ({ ...f, num_dipendenti: e.target.value }))}
              className="w-full border border-[#C8C5BC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#185FA5]"
            >
              <option value="">— Seleziona —</option>
              {DIPENDENTI.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Sito web</label>
            <input
              value={form.sito_web}
              onChange={(e) => setForm((f) => ({ ...f, sito_web: e.target.value }))}
              placeholder="https://esempio.it"
              className="w-full border border-[#C8C5BC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#185FA5]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Logo aziendale</label>
            <div className="border-2 border-dashed border-[#C8C5BC] rounded-xl p-6 text-center hover:border-[#185FA5] transition-colors cursor-pointer">
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Carica immagine .png .jpg max 2MB</p>
              <p className="text-xs text-gray-400 mt-1">o trascina il file qui</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dati legali */}
      <div className="bg-white border border-[#C8C5BC] rounded-xl p-6 space-y-5">
        <h2 className="font-semibold text-[#1a375b]">Dati legali</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Legale rappresentante</label>
            <input
              value={form.legale_rappresentante}
              onChange={(e) => setForm((f) => ({ ...f, legale_rappresentante: e.target.value }))}
              className="w-full border border-[#C8C5BC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#185FA5]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email legale</label>
            <input
              type="email"
              value={form.email_legale}
              onChange={(e) => setForm((f) => ({ ...f, email_legale: e.target.value }))}
              className="w-full border border-[#C8C5BC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#185FA5]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">PEC</label>
            <input
              value={form.pec}
              onChange={(e) => setForm((f) => ({ ...f, pec: e.target.value }))}
              className="w-full border border-[#C8C5BC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#185FA5]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Foro competente</label>
            <input
              value={form.foro_competente}
              onChange={(e) => setForm((f) => ({ ...f, foro_competente: e.target.value }))}
              placeholder="Es. Tribunale di Milano"
              className="w-full border border-[#C8C5BC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#185FA5]"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="bg-[#1a375b] hover:bg-[#185FA5] text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
      >
        <Save className="w-4 h-4" />
        Salva modifiche
      </button>
    </div>
  );
}
