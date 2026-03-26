import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Check, X, ChevronRight,
} from 'lucide-react';

interface Plan {
  id: 'starter' | 'business' | 'enterprise';
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  current: boolean;
  cta: string;
  ctaDisabled?: boolean;
  highlight?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    priceMonthly: 79,
    priceYearly: 790,
    features: [
      '10 sistemi AI',
      '1 utente',
      'Template base',
      'AI Registry',
      'Doc Generator base',
    ],
    current: false,
    cta: 'Downgrade',
    ctaDisabled: false,
    highlight: false,
  },
  {
    id: 'business',
    name: 'Business',
    priceMonthly: 199,
    priceYearly: 1990,
    features: [
      'Sistemi AI illimitati',
      '5 utenti',
      'Documenti AI-powered',
      'Training Hub completo',
      'GDPR+AI e DPIA',
      'Audit Trail',
      'AI Monitor',
    ],
    current: true,
    cta: 'Piano attuale',
    ctaDisabled: true,
    highlight: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceMonthly: 490,
    priceYearly: 4900,
    features: [
      'Multi-azienda',
      'Utenti illimitati',
      'White label + API',
      'SSO + SLA 99.9%',
      'Supporto dedicato',
      'Contratti personalizzati',
    ],
    current: false,
    cta: 'Upgrade →',
    highlight: false,
  },
];

export default function AppBillingUpgrade() {
  const [annual, setAnnual] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function handleCta(plan: Plan) {
    if (plan.ctaDisabled) return;
    if (plan.id === 'enterprise') {
      setSelectedPlan(plan);
      setShowModal(true);
      return;
    }
    // downgrade
    setToast(`Downgrade a ${plan.name} richiesto. Ti contatteremo entro 24h.`);
    setTimeout(() => setToast(null), 4000);
  }

  return (
    <div className="p-6 space-y-6 bg-[#FAFAF8] min-h-full">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#042C53] text-white px-5 py-3 rounded-xl shadow-lg text-sm flex items-center gap-2 max-w-sm">
          <Check className="w-4 h-4 text-green-300 shrink-0" />
          {toast}
        </div>
      )}

      {/* Modal upgrade enterprise */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#042C53]">Upgrade a Enterprise</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-700" />
              </button>
            </div>
            <div className="bg-[#E6F1FB] border border-[#185FA5]/30 rounded-lg p-4 text-sm text-[#042C53]">
              <p className="font-medium mb-1">Ottima scelta!</p>
              <p className="text-gray-600">
                Sarai contattato da un nostro commerciale entro 24h per configurare il piano Enterprise
                su misura per la tua azienda.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setToast('Richiesta Enterprise inviata. Ti contatteremo entro 24h.');
                  setTimeout(() => setToast(null), 4000);
                }}
                className="bg-[#042C53] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Richiedi upgrade
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="border border-[#C8C5BC] hover:bg-gray-50 text-[#042C53] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <Link to="/app/billing" className="inline-flex items-center gap-1.5 text-sm text-[#185FA5] hover:underline mb-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Billing
        </Link>
        <h1 className="text-2xl font-bold text-[#042C53]">Cambia piano</h1>
        <p className="text-sm text-gray-500 mt-0.5">Piano attuale: <strong>Business €199/mese</strong></p>
      </div>

      {/* Annual toggle */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Mensile</span>
        <button
          role="switch"
          aria-checked={annual}
          onClick={() => setAnnual((v) => !v)}
          className={`relative w-12 h-6 rounded-full transition-colors ${annual ? 'bg-[#042C53]' : 'bg-gray-200'}`}
        >
          <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${annual ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
        <span className="text-sm text-gray-600">
          Annuale
          <span className="ml-2 text-xs bg-[#EAF5EE] text-[#1D6B3A] px-2 py-0.5 rounded-full font-medium">
            Risparmia 2 mesi
          </span>
        </span>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-xl p-6 flex flex-col gap-4 ${
              plan.highlight
                ? 'border-2 border-[#042C53] shadow-lg'
                : 'border border-[#C8C5BC]'
            }`}
          >
            {/* Ribbon */}
            {plan.current && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#042C53] text-white text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap">
                Piano attuale
              </div>
            )}

            <div>
              <h3 className="font-bold text-[#042C53] text-lg">{plan.name}</h3>
              <div className="mt-1">
                <span className="text-3xl font-bold text-[#042C53]">
                  €{annual ? plan.priceYearly : plan.priceMonthly}
                </span>
                <span className="text-gray-500 text-sm">/{annual ? 'anno' : 'mese'}</span>
              </div>
              {annual && (
                <div className="text-xs text-[#1D6B3A] mt-0.5">
                  Equivale a €{Math.round(plan.priceYearly / 12)}/mese
                </div>
              )}
            </div>

            <ul className="space-y-2 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCta(plan)}
              disabled={plan.ctaDisabled}
              className={`w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                plan.ctaDisabled
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : plan.id === 'enterprise'
                  ? 'bg-[#042C53] hover:bg-[#185FA5] text-white'
                  : 'border border-[#C8C5BC] hover:bg-gray-50 text-[#042C53]'
              }`}
            >
              {plan.cta}
              {!plan.ctaDisabled && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center">
        Tutti i piani includono SSL, backup giornaliero e aggiornamenti gratuiti. Nessun contratto a lungo termine.
      </p>
    </div>
  );
}
