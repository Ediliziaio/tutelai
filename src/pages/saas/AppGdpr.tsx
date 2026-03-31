import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, CheckCircle2, Shield, FileText, ClipboardList, AlertOctagon,
} from 'lucide-react';

type Tab = 'panoramica' | 'registro' | 'dpia' | 'breach';

const TABS: { id: Tab; label: string }[] = [
  { id: 'panoramica', label: 'Panoramica' },
  { id: 'registro',   label: 'Registro Trattamenti' },
  { id: 'dpia',       label: 'DPIA' },
  { id: 'breach',     label: 'Data Breach' },
];

const STATS = [
  { label: 'Trattamenti registrati', value: '14' },
  { label: 'DPIA completate',         value: '2' },
  { label: 'Breach gestiti',          value: '0' },
  { label: 'Informative aggiornate',  value: '3' },
];

export default function AppGdpr() {
  const [activeTab, setActiveTab] = useState<Tab>('panoramica');
  const navigate = useNavigate();

  function handleTab(id: Tab) {
    if (id === 'registro') { navigate('/app/gdpr/register'); return; }
    if (id === 'dpia')     { navigate('/app/gdpr/dpia/new'); return; }
    if (id === 'breach')   { navigate('/app/gdpr/breach');   return; }
    setActiveTab(id);
  }

  return (
    <div className="p-6 space-y-6 bg-[#FAFAF8] min-h-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a375b] flex items-center gap-2">
          <Shield className="w-6 h-6 text-[#185FA5]" />
          GDPR + AI — Centro controllo privacy
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestisci trattamenti, DPIA, breach e conformità GDPR dei tuoi sistemi AI.
        </p>
      </div>

      {/* Status banner */}
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <span className="font-semibold text-amber-800">STATO COMPLESSIVO — ⚠ ATTENZIONE</span>
          <span className="text-amber-700 text-sm ml-2">2 azioni richieste per mantenere la conformità</span>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 border-b border-[#C8C5BC]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTab(tab.id)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? 'border-[#185FA5] text-[#185FA5] bg-[#E6F1FB]'
                : 'border-transparent text-gray-600 hover:text-[#1a375b] hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panoramica content */}
      {activeTab === 'panoramica' && (
        <div className="space-y-6">
          {/* Azioni urgenti */}
          <div className="bg-white border border-[#C8C5BC] rounded-xl p-6">
            <h2 className="text-base font-semibold text-[#1a375b] mb-4 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-amber-600" />
              Azioni urgenti
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center justify-between gap-4 py-3 px-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-sm text-amber-900">
                    Registro Trattamenti non aggiornato (ultima modifica: 45 giorni fa)
                  </span>
                </div>
                <button
                  onClick={() => navigate('/app/gdpr/register')}
                  className="shrink-0 bg-[#1a375b] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Aggiorna
                </button>
              </li>
              <li className="flex items-center justify-between gap-4 py-3 px-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-sm text-amber-900">
                    DPIA mancante per HiBob HR AI (sistema ad alto rischio)
                  </span>
                </div>
                <button
                  onClick={() => navigate('/app/gdpr/dpia/new')}
                  className="shrink-0 bg-[#1a375b] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Avvia DPIA
                </button>
              </li>
              <li className="flex items-center gap-3 py-3 px-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span className="text-sm text-green-900">Nessun data breach aperto</span>
              </li>
              <li className="flex items-center gap-3 py-3 px-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span className="text-sm text-green-900">DPO nominato — Dr. Rossi — TutelAI</span>
              </li>
            </ul>
          </div>

          {/* Statistiche */}
          <div>
            <h2 className="text-base font-semibold text-[#1a375b] mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#185FA5]" />
              Statistiche
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STATS.map((s) => (
                <div key={s.label} className="bg-white border border-[#C8C5BC] rounded-xl p-5 text-center">
                  <div className="text-3xl font-bold text-[#1a375b]">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick nav */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/app/gdpr/register')}
              className="bg-white border border-[#C8C5BC] rounded-xl p-5 text-left hover:border-[#185FA5] hover:bg-[#E6F1FB] transition-colors"
            >
              <ClipboardList className="w-5 h-5 text-[#185FA5] mb-2" />
              <div className="font-semibold text-[#1a375b] text-sm">Registro Trattamenti</div>
              <div className="text-xs text-gray-500 mt-0.5">Art. 30 GDPR — 14 trattamenti</div>
            </button>
            <button
              onClick={() => navigate('/app/gdpr/dpia/new')}
              className="bg-white border border-[#C8C5BC] rounded-xl p-5 text-left hover:border-[#185FA5] hover:bg-[#E6F1FB] transition-colors"
            >
              <FileText className="w-5 h-5 text-[#185FA5] mb-2" />
              <div className="font-semibold text-[#1a375b] text-sm">Avvia DPIA</div>
              <div className="text-xs text-gray-500 mt-0.5">Wizard guidato 7 step</div>
            </button>
            <button
              onClick={() => navigate('/app/gdpr/breach')}
              className="bg-white border border-[#C8C5BC] rounded-xl p-5 text-left hover:border-[#185FA5] hover:bg-[#E6F1FB] transition-colors"
            >
              <AlertOctagon className="w-5 h-5 text-[#185FA5] mb-2" />
              <div className="font-semibold text-[#1a375b] text-sm">Data Breach</div>
              <div className="text-xs text-gray-500 mt-0.5">Workflow 72h — nessun breach attivo</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
