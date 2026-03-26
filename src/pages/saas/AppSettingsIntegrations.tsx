import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, X, Plug, ExternalLink, RefreshCw } from 'lucide-react';

const SETTINGS_TABS = [
  { label: 'Azienda',      path: '/app/settings/company' },
  { label: 'Team',         path: '/app/settings/team' },
  { label: 'Sicurezza',    path: '/app/settings/security' },
  { label: 'Notifiche',    path: '/app/settings/notifications' },
  { label: 'Integrazioni', path: '/app/settings/integrations' },
];

interface Integration {
  id: string;
  nome: string;
  descrizione: string;
  categoria: string;
  stato: 'attivo' | 'non_configurato' | 'errore';
  piano_richiesto?: string;
  url_docs?: string;
  ultima_sincronizzazione?: string;
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'stripe',
    nome: 'Stripe',
    descrizione: 'Gestione pagamenti e abbonamenti SaaS. Fatturazione automatica e gestione carte di credito.',
    categoria: 'Pagamenti',
    stato: 'attivo',
    ultima_sincronizzazione: '25/03/2026 09:00',
    url_docs: 'https://stripe.com/docs',
  },
  {
    id: 'resend',
    nome: 'Resend',
    descrizione: 'Notifiche email transazionali ad alta deliverability. Alert normativi, scadenze, digest settimanale.',
    categoria: 'Email',
    stato: 'attivo',
    ultima_sincronizzazione: '25/03/2026 08:55',
    url_docs: 'https://resend.com/docs',
  },
  {
    id: 'anthropic',
    nome: 'Anthropic Claude',
    descrizione: 'AI Lawyer Chat, generazione automatica di documenti compliance, analisi rischi AI Act.',
    categoria: 'Intelligenza Artificiale',
    stato: 'attivo',
    ultima_sincronizzazione: '25/03/2026 09:02',
    url_docs: 'https://docs.anthropic.com',
  },
  {
    id: 'namirial',
    nome: 'Namirial FEA',
    descrizione: 'Firma Elettronica Avanzata (FEA) per documenti legali. Conforme eIDAS e Codice del Consumo.',
    categoria: 'Firma digitale',
    stato: 'non_configurato',
    url_docs: 'https://www.namirial.com',
  },
  {
    id: 'slack',
    nome: 'Slack',
    descrizione: 'Notifiche urgenti direttamente nel tuo workspace Slack. Alert critici AI Act in tempo reale.',
    categoria: 'Comunicazione',
    stato: 'non_configurato',
    url_docs: 'https://api.slack.com',
  },
  {
    id: 'teams',
    nome: 'Microsoft Teams',
    descrizione: 'Notifiche e alert compliance nel tuo canale Teams aziendale.',
    categoria: 'Comunicazione',
    stato: 'non_configurato',
    piano_richiesto: 'Business',
    url_docs: 'https://learn.microsoft.com/teams',
  },
  {
    id: 'jira',
    nome: 'Jira / Project Management',
    descrizione: 'Sincronizza azioni di compliance come ticket Jira o task nei tuoi strumenti PM.',
    categoria: 'Project Management',
    stato: 'non_configurato',
    piano_richiesto: 'Enterprise',
  },
];

const STATO_CONFIG = {
  attivo: { label: 'Attivo', badgeCls: 'bg-[#EAF5EE] text-[#1D6B3A] border border-[#A3D9B5]', dotCls: 'bg-[#22A86B]' },
  non_configurato: { label: 'Non configurato', badgeCls: 'bg-gray-50 text-gray-500 border border-gray-200', dotCls: 'bg-gray-300' },
  errore: { label: 'Errore', badgeCls: 'bg-[#FDEAEA] text-[#8B1A1A] border border-[#F5B8B8]', dotCls: 'bg-[#DC2626]' },
};

export default function AppSettingsIntegrations() {
  const location = useLocation();
  const [syncing, setSyncing] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function handleSync(id: string) {
    setSyncing(id);
    setTimeout(() => {
      setSyncing(null);
      setToast('Sincronizzazione completata.');
      setTimeout(() => setToast(null), 3000);
    }, 1800);
  }

  const byCategory = INTEGRATIONS.reduce<Record<string, Integration[]>>((acc, intg) => {
    if (!acc[intg.categoria]) acc[intg.categoria] = [];
    acc[intg.categoria].push(intg);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6 bg-[#FAFAF8] min-h-full">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#042C53] text-white px-5 py-3 rounded-xl shadow-lg text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-green-300" />
          {toast}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-[#042C53]">Impostazioni — Integrazioni</h1>
        <p className="text-sm text-gray-500 mt-1">Servizi e strumenti connessi al tuo account TutelAI.</p>
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

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Attive', value: INTEGRATIONS.filter(i => i.stato === 'attivo').length, cls: 'text-[#22A86B]' },
          { label: 'Non configurate', value: INTEGRATIONS.filter(i => i.stato === 'non_configurato').length, cls: 'text-gray-500' },
          { label: 'Errori', value: INTEGRATIONS.filter(i => i.stato === 'errore').length, cls: 'text-[#DC2626]' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-[#C8C5BC] rounded-xl p-4 text-center">
            <div className={`text-3xl font-bold ${stat.cls}`}>{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Integration cards by category */}
      {Object.entries(byCategory).map(([categoria, items]) => (
        <div key={categoria} className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Plug className="w-3.5 h-3.5" />
            {categoria}
          </h3>
          <div className="space-y-2">
            {items.map((intg) => {
              const cfg = STATO_CONFIG[intg.stato];
              return (
                <div
                  key={intg.id}
                  className="bg-white border border-[#C8C5BC] rounded-xl p-4 flex items-center gap-4"
                >
                  {/* Status dot */}
                  <div className="w-10 h-10 rounded-lg bg-gray-50 border border-[#C8C5BC] flex items-center justify-center shrink-0">
                    <span className={`w-3 h-3 rounded-full ${cfg.dotCls}`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#042C53]">{intg.nome}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.badgeCls}`}>
                        {cfg.label}
                      </span>
                      {intg.piano_richiesto && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#042C53] text-white">
                          {intg.piano_richiesto}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{intg.descrizione}</p>
                    {intg.ultima_sincronizzazione && (
                      <p className="text-xs text-gray-400 mt-0.5">Ultima sync: {intg.ultima_sincronizzazione}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {intg.url_docs && (
                      <a
                        href={intg.url_docs}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#185FA5] transition-colors"
                        title="Documentazione"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {intg.stato === 'attivo' ? (
                      <button
                        onClick={() => handleSync(intg.id)}
                        disabled={syncing === intg.id}
                        className="border border-[#C8C5BC] hover:bg-gray-50 text-[#042C53] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-60"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${syncing === intg.id ? 'animate-spin' : ''}`} />
                        {syncing === intg.id ? 'Sync...' : 'Sincronizza'}
                      </button>
                    ) : intg.piano_richiesto ? (
                      <Link
                        to="/app/billing/upgrade"
                        className="bg-[#D97706] hover:bg-[#B45309] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        Upgrade
                      </Link>
                    ) : (
                      <button
                        onClick={() => setToast(`Configurazione ${intg.nome} — contattaci per l'attivazione.`)}
                        className="bg-[#042C53] hover:bg-[#185FA5] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        Configura
                      </button>
                    )}
                    {intg.stato === 'attivo' && (
                      <button
                        onClick={() => setToast(`${intg.nome} disconnesso.`)}
                        className="border border-red-200 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* API Key section */}
      <div className="bg-white border border-[#C8C5BC] rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-[#042C53]">Chiave API TutelAI</h2>
        <p className="text-sm text-gray-600">
          Usa questa chiave per integrare TutelAI con i tuoi sistemi interni o webhook personalizzati.
        </p>
        <div className="flex items-center gap-3">
          <input
            type="text"
            readOnly
            value="tk_live_••••••••••••••••••••••••••••••••"
            className="flex-1 border border-[#C8C5BC] rounded-lg px-3 py-2 text-sm bg-gray-50 font-mono text-gray-500"
          />
          <button
            onClick={() => setToast('Chiave API copiata negli appunti.')}
            className="border border-[#C8C5BC] hover:bg-gray-50 text-[#042C53] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Copia
          </button>
          <button
            onClick={() => setToast('Nuova chiave API generata. Aggiorna le integrazioni esistenti.')}
            className="border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Rigenera
          </button>
        </div>
        <p className="text-xs text-gray-400">
          Non condividere mai questa chiave pubblicamente. In caso di compromissione, rigenerala immediatamente.
        </p>
      </div>
    </div>
  );
}
