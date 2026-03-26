import { useState } from 'react';
import { Download, Calendar } from 'lucide-react';
import { mockCorsi, mockEnrollments } from '@/data/tutelaiMockData';

const moduleUsage = [
  { nome: 'AI Registry', pct: 89 },
  { nome: 'Doc Generator', pct: 75 },
  { nome: 'AI Monitor', pct: 62 },
  { nome: 'Training Hub', pct: 58 },
  { nome: 'GDPR+AI', pct: 34 },
  { nome: 'Audit Trail', pct: 22 },
];

const riskByPlan = [
  { piano: 'Starter', score: 62, aziende: 2 },
  { piano: 'Business', score: 34, aziende: 3 },
  { piano: 'Enterprise', score: 18, aziende: 1 },
];

const mrrTable = [
  { piano: 'Starter', aziende: 2, mrr: 158 },
  { piano: 'Business', aziende: 3, mrr: 796 },
  { piano: 'Enterprise', aziende: 1, mrr: 490 },
];

const totalMrr = mrrTable.reduce((s, r) => s + r.mrr, 0);

export default function AdminReport() {
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-03-25');

  // Compliance calculation
  const lowRisk = 2; // <30
  const medRisk = 3; // 30-60
  const highRisk = 1; // >60
  const total = lowRisk + medRisk + highRisk;

  // Training metrics
  const totalEnrollments = mockEnrollments.length;
  const totalCompleted = mockEnrollments.filter((e) => e.stato === 'completato').length;
  const overallRate = Math.round((totalCompleted / totalEnrollments) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#042C53]">Report & Analytics</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="text-sm border-none outline-none text-gray-700" />
            <span className="text-gray-300">—</span>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="text-sm border-none outline-none text-gray-700" />
          </div>
          <button className="flex items-center gap-2 bg-[#042C53] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Download className="h-4 w-4" /> Esporta PDF
          </button>
          <button className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Download className="h-4 w-4" /> CSV
          </button>
        </div>
      </div>

      {/* Section 1: Compliance Overview */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-[#042C53] mb-4">1. Compliance Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk by plan */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">AI Risk Score medio per piano</p>
            <div className="space-y-3">
              {riskByPlan.map((p) => {
                const color = p.score < 30 ? 'bg-emerald-500' : p.score < 60 ? 'bg-amber-500' : 'bg-red-500';
                const textColor = p.score < 30 ? 'text-emerald-600' : p.score < 60 ? 'text-amber-600' : 'text-red-600';
                return (
                  <div key={p.piano}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700">{p.piano} ({p.aziende} az.)</span>
                      <span className={`font-bold ${textColor}`}>{p.score}/100</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${p.score}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Risk distribution */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Distribuzione livelli di rischio</p>
            <div className="space-y-2">
              {[
                { label: 'Basso (< 30)', count: lowRisk, color: 'bg-emerald-500', textColor: 'text-emerald-700' },
                { label: 'Medio (30-60)', count: medRisk, color: 'bg-amber-500', textColor: 'text-amber-700' },
                { label: 'Alto (> 60)', count: highRisk, color: 'bg-red-500', textColor: 'text-red-700' },
              ].map((d) => (
                <div key={d.label} className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${d.color} shrink-0`} />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{d.label}</span>
                      <span className={`font-semibold ${d.textColor}`}>{d.count} az. ({Math.round((d.count / total) * 100)}%)</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${d.color} rounded-full`} style={{ width: `${(d.count / total) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Formazione */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-[#042C53] mb-4">2. Formazione</h2>
        <div className="flex items-center gap-6 mb-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-[#042C53]">{overallRate}%</p>
            <p className="text-xs text-gray-500 mt-1">Tasso completamento globale</p>
          </div>
          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${overallRate}%` }} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Corso', 'Iscritti', 'Completati', '% Completamento'].map((h) => (
                  <th key={h} className="px-4 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockCorsi.map((corso) => {
                const enrolled = mockEnrollments.filter((e) => e.corso_id === corso.id).length;
                const completed = mockEnrollments.filter((e) => e.corso_id === corso.id && e.stato === 'completato').length;
                const pct = enrolled > 0 ? Math.round((completed / enrolled) * 100) : 0;
                return (
                  <tr key={corso.id} className="border-b border-gray-50">
                    <td className="px-4 py-2.5 text-sm font-medium text-[#042C53]">{corso.titolo}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-600">{enrolled}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-600">{completed}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-400'}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-[#042C53]">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Utilizzo piattaforma */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-[#042C53] mb-4">3. Utilizzo piattaforma</h2>
        <div className="space-y-3">
          {moduleUsage.map((m) => (
            <div key={m.nome} className="flex items-center gap-3">
              <span className="text-sm text-gray-700 w-32 shrink-0">{m.nome}</span>
              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#185FA5] rounded-full" style={{ width: `${m.pct}%` }} />
              </div>
              <span className="text-sm font-semibold text-[#042C53] w-10 text-right">{m.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Billing */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-[#042C53] mb-4">4. Billing</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'MRR', value: `€${totalMrr.toLocaleString('it-IT')}`, sub: 'Marzo 2026' },
            { label: 'ARR', value: `€${(totalMrr * 12).toLocaleString('it-IT')}`, sub: 'Proiettato' },
            { label: 'Churn rate', value: '2.1%', sub: 'Ultimo mese' },
            { label: 'Nuove', value: '2', sub: 'Aziende questo mese' },
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{s.label}</p>
              <p className="text-xl font-bold text-[#042C53] mt-1">{s.value}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
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
              {mrrTable.map((row) => (
                <tr key={row.piano} className="border-b border-gray-50">
                  <td className="px-4 py-2.5 text-sm font-medium text-[#042C53]">{row.piano}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">{row.aziende}</td>
                  <td className="px-4 py-2.5 text-sm font-semibold text-[#042C53]">€{row.mrr}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">{Math.round((row.mrr / totalMrr) * 100)}%</td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-bold">
                <td className="px-4 py-2.5 text-sm text-[#042C53]" colSpan={2}>Totale</td>
                <td className="px-4 py-2.5 text-sm text-[#042C53]">€{totalMrr}</td>
                <td className="px-4 py-2.5 text-sm text-[#042C53]">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
