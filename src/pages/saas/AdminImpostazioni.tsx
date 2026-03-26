import { useState } from 'react';
import { Check, X, Eye, EyeOff } from 'lucide-react';

type Tab = 'generali' | 'email' | 'integrazioni' | 'sicurezza';

interface Integration {
  id: string;
  nome: string;
  descrizione: string;
  configured: boolean;
  keyPreview?: string;
}

const integrations: Integration[] = [
  { id: 'stripe', nome: 'Stripe', descrizione: 'Pagamenti e subscription management', configured: true, keyPreview: 'sk_live_••••••••••••abcd' },
  { id: 'resend', nome: 'Resend', descrizione: 'Email transazionali e notifiche', configured: true, keyPreview: 're_••••••••••••1234' },
  { id: 'anthropic', nome: 'Anthropic Claude', descrizione: 'AI Lawyer Chat e Doc Generator', configured: true, keyPreview: 'sk-ant-••••••••••••efgh' },
  { id: 'namirial', nome: 'Namirial FEA', descrizione: 'Firma elettronica avanzata', configured: false },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-[#042C53]' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

function FormField({ label, value, onChange, type = 'text', disabled = false }: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#042C53]/20 disabled:bg-gray-50 disabled:text-gray-400"
      />
    </div>
  );
}

export default function AdminImpostazioni() {
  const [tab, setTab] = useState<Tab>('generali');

  // Generali
  const [platformName, setPlatformName] = useState('TutelAI');
  const [logoUrl, setLogoUrl] = useState('https://tutelai.it/logo.svg');
  const [supportEmail, setSupportEmail] = useState('supporto@tutelai.it');
  const [legalEmail, setLegalEmail] = useState('legal@tutelai.it');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Email
  const [smtpHost, setSmtpHost] = useState('smtp.resend.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('resend');
  const [fromAddress, setFromAddress] = useState('noreply@tutelai.it');

  // Sicurezza
  const [sessionTimeout, setSessionTimeout] = useState('8');
  const [twoFaRequired, setTwoFaRequired] = useState(false);
  const [ipWhitelist, setIpWhitelist] = useState('');

  const [saved, setSaved] = useState(false);
  const [showApiKey, setShowApiKey] = useState<string | null>(null);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'generali', label: 'Generali' },
    { id: 'email', label: 'Email' },
    { id: 'integrazioni', label: 'Integrazioni' },
    { id: 'sicurezza', label: 'Sicurezza' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#042C53]">Impostazioni piattaforma</h1>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-sm font-medium transition-colors ${tab === t.id ? 'text-[#042C53] border-b-2 border-[#042C53] -mb-px' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'generali' && (
            <div className="space-y-4 max-w-lg">
              <FormField label="Nome piattaforma" value={platformName} onChange={setPlatformName} />
              <FormField label="Logo URL" value={logoUrl} onChange={setLogoUrl} />
              <FormField label="Email supporto" value={supportEmail} onChange={setSupportEmail} type="email" />
              <FormField label="Email legale" value={legalEmail} onChange={setLegalEmail} type="email" />
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">Modalità manutenzione</p>
                  <p className="text-xs text-gray-400 mt-0.5">Disabilita l'accesso per tutti gli utenti non admin</p>
                </div>
                <Toggle checked={maintenanceMode} onChange={() => setMaintenanceMode(!maintenanceMode)} />
              </div>
              <div className="bg-gray-50 rounded-lg px-4 py-3">
                <p className="text-xs text-gray-500">Versione piattaforma: <span className="font-mono font-medium text-[#042C53]">v1.4.2</span></p>
                <p className="text-xs text-gray-500 mt-0.5">Build: <span className="font-mono font-medium text-[#042C53]">2026-03-25</span></p>
              </div>
            </div>
          )}

          {tab === 'email' && (
            <div className="space-y-4 max-w-lg">
              <p className="text-xs text-gray-500 mb-4">Configurazione SMTP per email transazionali</p>
              <FormField label="SMTP Host" value={smtpHost} onChange={setSmtpHost} />
              <div className="grid grid-cols-2 gap-3">
                <FormField label="SMTP Port" value={smtpPort} onChange={setSmtpPort} />
                <FormField label="SMTP User" value={smtpUser} onChange={setSmtpUser} />
              </div>
              <FormField label="From address" value={fromAddress} onChange={setFromAddress} type="email" />
              <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">Anteprima template email</p>
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
                  <p className="font-semibold text-[#042C53] mb-1">Benvenuto su TutelAI</p>
                  <p>Il tuo account è pronto. Accedi alla piattaforma per iniziare la compliance AI Act.</p>
                  <p className="mt-2 text-gray-400">— Il team TutelAI</p>
                </div>
              </div>
              <button className="text-sm text-[#185FA5] hover:underline font-medium">Invia email di test</button>
            </div>
          )}

          {tab === 'integrazioni' && (
            <div className="space-y-4">
              {integrations.map((intg) => (
                <div key={intg.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${intg.configured ? 'bg-emerald-50' : 'bg-gray-50'}`}>
                      {intg.configured ? (
                        <Check className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <X className="h-5 w-5 text-gray-300" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#042C53]">{intg.nome}</p>
                      <p className="text-xs text-gray-400">{intg.descrizione}</p>
                      {intg.configured && intg.keyPreview && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <code className="text-[11px] font-mono text-gray-500">
                            {showApiKey === intg.id ? intg.keyPreview : intg.keyPreview.replace(/[^•]/g, '•').slice(0, 20)}
                          </code>
                          <button
                            onClick={() => setShowApiKey(showApiKey === intg.id ? null : intg.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {showApiKey === intg.id ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${intg.configured ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-500'}`}>
                      {intg.configured ? 'Configurato' : 'Non configurato'}
                    </span>
                    <button className="bg-[#042C53] hover:bg-[#185FA5] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                      {intg.configured ? 'Aggiorna' : 'Configura'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'sicurezza' && (
            <div className="space-y-5 max-w-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Timeout sessione</label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="1">1 ora</option>
                  <option value="4">4 ore</option>
                  <option value="8">8 ore</option>
                  <option value="24">24 ore</option>
                  <option value="0">Mai (non consigliato)</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">2FA obbligatorio</p>
                  <p className="text-xs text-gray-400 mt-0.5">Richiedi autenticazione a due fattori per tutti gli utenti</p>
                </div>
                <Toggle checked={twoFaRequired} onChange={() => setTwoFaRequired(!twoFaRequired)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">IP whitelist</label>
                <textarea
                  rows={4}
                  value={ipWhitelist}
                  onChange={(e) => setIpWhitelist(e.target.value)}
                  placeholder={"Inserisci un IP per riga:\n192.168.1.0/24\n10.0.0.1"}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none font-mono resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">Lascia vuoto per permettere tutti gli IP. CIDR notation supportata.</p>
              </div>
            </div>
          )}

          {tab !== 'integrazioni' && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={handleSave}
                className="bg-[#042C53] hover:bg-[#185FA5] text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {saved ? 'Salvato!' : 'Salva modifiche'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
