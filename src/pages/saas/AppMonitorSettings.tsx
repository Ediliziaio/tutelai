import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Zap } from 'lucide-react';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

function Toggle({ checked, onChange, disabled = false }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
        ${checked ? 'bg-[#185FA5]' : 'bg-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
          ${checked ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );
}

const FONTE_OPTIONS = [
  { id: 'ai_act', label: 'AI Act UE' },
  { id: 'legge_132', label: 'Legge 132/2025' },
  { id: 'gdpr_ai', label: 'GDPR applicato AI' },
  { id: 'garante', label: 'Garante Privacy' },
  { id: 'acn', label: 'ACN' },
  { id: 'parlamento', label: 'Parlamento italiano' },
  { id: 'giurisprudenza', label: 'Giurisprudenza' },
  { id: 'iso_cen', label: 'Standard ISO/CEN' },
  { id: 'enisa', label: 'ENISA' },
];

export default function AppMonitorSettings() {
  const [toast, setToast] = useState('');
  const [emailDigest, setEmailDigest] = useState(true);
  const [emailUrgente, setEmailUrgente] = useState(true);
  const [whatsapp, setWhatsapp] = useState(false);
  const [fonteSelezionate, setFonteSelezionate] = useState<string[]>([
    'ai_act', 'legge_132', 'gdpr_ai', 'garante', 'acn',
  ]);
  const [soloRilevanti, setSoloRilevanti] = useState(true);
  const [urgenzaMinima, setUrgenzaMinima] = useState<'tutti' | 'urgenti' | 'critici'>('urgenti');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const toggleFonte = (id: string) => {
    setFonteSelezionate(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#042C53] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-[#22A86B]" />
          {toast}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/app/monitor" className="flex items-center gap-1.5 text-sm text-[#185FA5] hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Monitor
          </Link>
          <span className="text-gray-400">/</span>
          <h1 className="text-xl font-bold text-[#042C53]">Impostazioni Alert Normativi</h1>
        </div>

        {/* Canali di notifica */}
        <div className="bg-white border border-[#C8C5BC] rounded-xl p-6 mb-4">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 bg-[#185FA5] rounded" />
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Canali di notifica</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-[#F5F5F3]">
              <div>
                <p className="text-sm font-medium text-[#042C53]">Email settimanale digest</p>
                <p className="text-xs text-gray-500 mt-0.5">Riepilogo settimanale degli aggiornamenti — martedì ore 09:00</p>
              </div>
              <Toggle checked={emailDigest} onChange={setEmailDigest} />
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[#F5F5F3]">
              <div>
                <p className="text-sm font-medium text-[#042C53]">Email immediata urgenti</p>
                <p className="text-xs text-gray-500 mt-0.5">Notifica email immediata per aggiornamenti urgenti</p>
              </div>
              <Toggle checked={emailUrgente} onChange={setEmailUrgente} />
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[#F5F5F3]">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#042C53]">WhatsApp / SMS</p>
                  <span className="px-2 py-0.5 text-xs font-bold bg-[#FDF3E3] text-[#854F0B] rounded">Add-on</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Ricezione alert normativi via WhatsApp Business o SMS</p>
                {!whatsapp && (
                  <Link to="/app/billing" className="text-xs text-[#185FA5] hover:underline mt-1 inline-block">
                    Attiva (€19/mese) →
                  </Link>
                )}
              </div>
              <Toggle checked={whatsapp} onChange={setWhatsapp} />
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-[#042C53]">Notifica in-app</p>
                <p className="text-xs text-gray-500 mt-0.5">Sempre attivo — non disattivabile</p>
              </div>
              <Toggle checked={true} onChange={() => {}} disabled={true} />
            </div>
          </div>
        </div>

        {/* Filtri personalizzati */}
        <div className="bg-white border border-[#C8C5BC] rounded-xl p-6 mb-4">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 bg-[#185FA5] rounded" />
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Filtri personalizzati</h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">Ricevi notifiche solo per le fonti selezionate:</p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {FONTE_OPTIONS.map(fonte => (
              <label key={fonte.id} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fonteSelezionate.includes(fonte.id)}
                  onChange={() => toggleFonte(fonte.id)}
                  className="w-4 h-4 rounded border-[#C8C5BC] text-[#185FA5] focus:ring-[#185FA5]"
                />
                <span className="text-sm text-[#042C53]">{fonte.label}</span>
              </label>
            ))}
          </div>
          <div className="pt-4 border-t border-[#F5F5F3]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#042C53]">Mostra solo aggiornamenti rilevanti per i miei sistemi</p>
                <p className="text-xs text-gray-500 mt-0.5">Filtra in base ai sistemi AI registrati nel tuo registro</p>
              </div>
              <Toggle checked={soloRilevanti} onChange={setSoloRilevanti} />
            </div>
          </div>
        </div>

        {/* Urgenza minima */}
        <div className="bg-white border border-[#C8C5BC] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 bg-[#DC2626] rounded" />
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Livello minimo urgenza per email immediata</h2>
          </div>
          <div className="space-y-3">
            {[
              { value: 'tutti', label: 'Tutti gli aggiornamenti', desc: 'Ricevi email per ogni nuovo aggiornamento' },
              { value: 'urgenti', label: 'Solo urgenti 🔴', desc: 'Ricevi email solo per livello Critico e Attenzione' },
              { value: 'critici', label: 'Solo critici 🔴', desc: 'Ricevi email solo per aggiornamenti di livello Critico' },
            ].map(opt => (
              <label key={opt.value} className="flex items-start gap-3 p-3 rounded-lg border border-transparent hover:border-[#C8C5BC] hover:bg-[#F5F5F3] cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="urgenza_minima"
                  value={opt.value}
                  checked={urgenzaMinima === opt.value}
                  onChange={() => setUrgenzaMinima(opt.value as typeof urgenzaMinima)}
                  className="mt-0.5 w-4 h-4 text-[#185FA5] border-[#C8C5BC] focus:ring-[#185FA5]"
                />
                <div>
                  <p className="text-sm font-medium text-[#042C53]">{opt.label}</p>
                  <p className="text-xs text-gray-500">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link to="/app/monitor" className="text-sm text-gray-500 hover:text-[#042C53]">
            Annulla modifiche
          </Link>
          <button
            onClick={() => showToast('Impostazioni salvate con successo')}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#042C53] hover:bg-[#185FA5] text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Zap className="w-4 h-4" />
            Salva impostazioni
          </button>
        </div>
      </div>
    </div>
  );
}
