import { useState } from 'react';
import { Pencil, X, Check, ToggleLeft, ToggleRight } from 'lucide-react';

interface Plan {
  id: string;
  nome: string;
  prezzo: number;
  userLimit: string;
  systemLimit: string;
  features: string[];
  color: string;
  accent: string;
}

const plans: Plan[] = [
  {
    id: 'starter',
    nome: 'Starter',
    prezzo: 79,
    userLimit: '1 utente',
    systemLimit: '10 sistemi AI',
    features: ['AI Registry (max 10 sistemi)', 'Doc Generator base', 'AI Monitor', 'Training Hub (corsi base)', 'Supporto email'],
    color: 'border-slate-200',
    accent: 'bg-slate-100 text-slate-700',
  },
  {
    id: 'business',
    nome: 'Business',
    prezzo: 199,
    userLimit: '5 utenti',
    systemLimit: 'Sistemi illimitati',
    features: ['AI Registry illimitato', 'Doc Generator AI avanzato', 'AI Monitor + alert', 'Training Hub completo', 'GDPR+AI toolkit', 'Audit Trail', 'Supporto prioritario'],
    color: 'border-[#185FA5]',
    accent: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'enterprise',
    nome: 'Enterprise',
    prezzo: 490,
    userLimit: 'Utenti illimitati',
    systemLimit: 'Sistemi illimitati',
    features: ['Tutto Business +', 'AI Lawyer Chat incluso', 'FEA incluso', 'WhatsApp alert incluso', 'SLA garantito 99.9%', 'Account manager dedicato', 'Onboarding personalizzato'],
    color: 'border-violet-400',
    accent: 'bg-violet-100 text-violet-700',
  },
];

interface Addon {
  id: string;
  nome: string;
  prezzo: number;
  attivo: boolean;
}

const initialAddons: Addon[] = [
  { id: 'ao-1', nome: 'AI Lawyer Chat', prezzo: 39, attivo: true },
  { id: 'ao-2', nome: 'Firma digitale FEA', prezzo: 29, attivo: true },
  { id: 'ao-3', nome: 'WhatsApp alert', prezzo: 19, attivo: true },
  { id: 'ao-4', nome: 'Onboarding dedicato', prezzo: 99, attivo: false },
  { id: 'ao-5', nome: 'API access', prezzo: 49, attivo: false },
];

const mrrByPlan = [
  { piano: 'Starter', aziende: 2, mrr: 158 },
  { piano: 'Business', aziende: 3, mrr: 796 },
  { piano: 'Enterprise', aziende: 1, mrr: 490 },
];

export default function AdminPiani() {
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [addons, setAddons] = useState<Addon[]>(initialAddons);

  const toggleAddon = (id: string) => {
    setAddons((prev) => prev.map((a) => a.id === id ? { ...a, attivo: !a.attivo } : a));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#042C53]">Piani & Pricing</h1>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className={`bg-white border-2 ${plan.color} rounded-xl p-5 flex flex-col`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${plan.accent} mb-2`}>
                  {plan.nome}
                </span>
                <p className="text-2xl font-bold text-[#042C53]">€{plan.prezzo}<span className="text-sm font-normal text-gray-400">/mese</span></p>
              </div>
              <button
                onClick={() => setEditingPlan({ ...plan })}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-[#042C53]"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-3 text-xs text-gray-500 mb-4">
              <span className="bg-gray-100 px-2 py-0.5 rounded-full">{plan.userLimit}</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded-full">{plan.systemLimit}</span>
            </div>
            <ul className="space-y-1.5 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setEditingPlan({ ...plan })}
              className="mt-4 w-full bg-[#042C53] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Modifica piano
            </button>
          </div>
        ))}
      </div>

      {/* Add-on management */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-[#042C53]">Add-on disponibili</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Nome', 'Prezzo', 'Attivo', 'Azioni'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {addons.map((addon) => (
                <tr key={addon.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-sm font-medium text-[#042C53]">{addon.nome}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">€{addon.prezzo}/mese</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleAddon(addon.id)} className="flex items-center gap-1.5">
                      {addon.attivo ? (
                        <ToggleRight className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="h-5 w-5 text-gray-300" />
                      )}
                      <span className={`text-xs font-medium ${addon.attivo ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {addon.attivo ? 'Attivo' : 'Disattivo'}
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-[#185FA5] hover:underline font-medium">Modifica</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue metrics */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-[#042C53] mb-4">Revenue breakdown per piano</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Piano', 'Aziende', 'MRR contributo', '% del totale'].map((h) => (
                  <th key={h} className="px-4 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mrrByPlan.map((row) => (
                <tr key={row.piano} className="border-b border-gray-50">
                  <td className="px-4 py-2.5 text-sm font-medium text-[#042C53]">{row.piano}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">{row.aziende}</td>
                  <td className="px-4 py-2.5 text-sm font-semibold text-[#042C53]">€{row.mrr}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">{Math.round((row.mrr / 1444) * 100)}%</td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td className="px-4 py-2.5 text-sm font-bold text-[#042C53]" colSpan={2}>Totale</td>
                <td className="px-4 py-2.5 text-sm font-bold text-[#042C53]">€{mrrByPlan.reduce((s, r) => s + r.mrr, 0)}</td>
                <td className="px-4 py-2.5 text-sm font-bold text-[#042C53]">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit plan modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#042C53]">Modifica piano — {editingPlan.nome}</h2>
              <button onClick={() => setEditingPlan(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome piano</label>
                <input
                  type="text"
                  value={editingPlan.nome}
                  onChange={(e) => setEditingPlan({ ...editingPlan, nome: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#042C53]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Prezzo (€/mese)</label>
                <input
                  type="number"
                  value={editingPlan.prezzo}
                  onChange={(e) => setEditingPlan({ ...editingPlan, prezzo: Number(e.target.value) })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#042C53]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Limite utenti</label>
                <input
                  type="text"
                  value={editingPlan.userLimit}
                  onChange={(e) => setEditingPlan({ ...editingPlan, userLimit: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#042C53]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Limite sistemi AI</label>
                <input
                  type="text"
                  value={editingPlan.systemLimit}
                  onChange={(e) => setEditingPlan({ ...editingPlan, systemLimit: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#042C53]/20"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditingPlan(null)} className="flex-1 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Annulla
              </button>
              <button onClick={() => setEditingPlan(null)} className="flex-1 bg-[#042C53] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Salva modifiche
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
