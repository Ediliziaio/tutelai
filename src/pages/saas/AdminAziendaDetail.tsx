import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Ban, Trash2, User, Clock, LogIn } from 'lucide-react';
import { StatusBadge } from '@/components/saas/StatusBadge';
import { mockAziende, mockTeam, mockAuditLogs, mockSubscription } from '@/data/tutelaiMockData';
import { useAuth } from '@/contexts/AuthContext';
import type { Tenant } from '@/types/auth';

function PlanBadge({ piano }: { piano: string }) {
  const styles: Record<string, string> = {
    starter: 'bg-slate-100 text-slate-600 border-slate-200',
    business: 'bg-blue-50 text-blue-700 border-blue-200',
    enterprise: 'bg-violet-50 text-violet-700 border-violet-200',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${styles[piano] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {piano}
    </span>
  );
}

function RiskGauge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-gray-400">—</span>;
  const color = score < 30 ? 'bg-emerald-500' : score < 60 ? 'bg-amber-500' : 'bg-red-500';
  const textColor = score < 30 ? 'text-emerald-600' : score < 60 ? 'text-amber-600' : 'text-red-600';
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className={`font-bold ${textColor}`}>{score}/100</span>
        <span className="text-gray-400">{score < 30 ? 'Basso' : score < 60 ? 'Medio' : 'Alto'}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export default function AdminAziendaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { startImpersonation } = useAuth();
  const [note, setNote] = useState('');

  const handleImpersonate = (az: typeof mockAziende[number]) => {
    const tenant: Tenant = {
      id: az.id,
      ragione_sociale: az.ragione_sociale,
      partita_iva: az.partita_iva,
      settore: az.settore,
      num_dipendenti: az.num_dipendenti,
      email_principale: `info@${az.ragione_sociale.toLowerCase().replace(/\s+/g, '')}.it`,
      piano: az.piano as Tenant['piano'],
      stato: az.stato as Tenant['stato'],
      created_at: az.created_at,
      onboarding_completato: true,
      ai_risk_score: az.ai_risk_score ?? undefined,
      ai_risk_level: az.ai_risk_score == null ? undefined
        : az.ai_risk_score < 30 ? 'buono'
        : az.ai_risk_score < 60 ? 'attenzione'
        : 'critico',
    };
    startImpersonation(tenant);
    navigate('/app/dashboard');
  };
  const [noteSaved, setNoteSaved] = useState(false);

  const azienda = mockAziende.find((a) => a.id === id);

  if (!azienda) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-2xl font-bold text-[#042C53]">404</p>
        <p className="text-gray-500">Azienda non trovata.</p>
        <Link to="/admin/aziende" className="text-sm text-[#185FA5] hover:underline font-medium">← Torna alle aziende</Link>
      </div>
    );
  }

  const tenantTeam = mockTeam.filter((m) => m.tenant_id === azienda.id);
  const tenantLogs = mockAuditLogs.filter((l) => l.tenant_id === azienda.id).slice(0, 5);

  const handleSaveNote = () => {
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div>
        <Link to="/admin/aziende" className="flex items-center gap-1 text-sm text-[#185FA5] hover:underline font-medium mb-3">
          <ArrowLeft className="h-4 w-4" /> Aziende
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#042C53]">{azienda.ragione_sociale}</h1>
            <StatusBadge status={azienda.stato as 'attivo' | 'trial' | 'sospeso'} />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleImpersonate(azienda)}
              className="flex items-center gap-1.5 bg-[#185FA5] hover:bg-[#042C53] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <LogIn className="h-3.5 w-3.5" /> Accedi come cliente
            </button>
            <button className="flex items-center gap-1.5 bg-[#042C53] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Pencil className="h-3.5 w-3.5" /> Modifica
            </button>
            <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Ban className="h-3.5 w-3.5" /> Sospendi
            </button>
            <button className="flex items-center gap-1.5 border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Trash2 className="h-3.5 w-3.5" /> Elimina account
            </button>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2/3 */}
        <div className="lg:col-span-2 space-y-5">
          {/* Dati aziendali */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[#042C53] mb-4">Dati aziendali</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Ragione sociale', value: azienda.ragione_sociale },
                { label: 'Partita IVA', value: azienda.partita_iva },
                { label: 'Settore', value: azienda.settore },
                { label: 'Dipendenti', value: azienda.num_dipendenti },
                { label: 'Registrata il', value: azienda.created_at },
                { label: 'Ultimo accesso', value: azienda.ultimo_accesso },
              ].map((f) => (
                <div key={f.label} className="bg-gray-50 rounded-lg px-3 py-2.5">
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{f.label}</p>
                  <p className="text-sm font-medium text-[#042C53] mt-0.5">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Piano & Billing */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[#042C53] mb-4">Piano & Billing</h2>
            <div className="flex items-center gap-3 mb-4">
              <PlanBadge piano={azienda.piano} />
              <span className="text-sm text-gray-500">Piano corrente</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">MRR</p>
                <p className="text-sm font-bold text-[#042C53] mt-0.5">
                  {azienda.piano === 'starter' ? '€79' : azienda.piano === 'business' ? '€199' : '€490'}/mese
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Prossimo rinnovo</p>
                <p className="text-sm font-medium text-[#042C53] mt-0.5">{mockSubscription.prossimo_rinnovo}</p>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">Add-on attivi</p>
                <p className="text-sm font-medium text-[#042C53] mt-0.5">
                  {mockSubscription.add_ons.filter((a) => a.attivo).map((a) => a.nome).join(', ') || 'Nessuno'}
                </p>
              </div>
            </div>
          </div>

          {/* AI Compliance */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[#042C53] mb-4">AI Compliance overview</h2>
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2">AI Risk Score</p>
              <RiskGauge score={azienda.ai_risk_score} />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-gray-50 rounded-lg px-3 py-2.5 text-center">
                <p className="text-xl font-bold text-[#042C53]">{azienda.sistemi_ai}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Sistemi AI censiti</p>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2.5 text-center">
                <StatusBadge status={azienda.stato as 'attivo' | 'trial' | 'sospeso'} />
                <p className="text-[11px] text-gray-400 mt-1.5">Stato account</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1/3 */}
        <div className="space-y-5">
          {/* Utenti */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[#042C53] mb-3">Utenti ({tenantTeam.length > 0 ? tenantTeam.length : azienda.utenti})</h2>
            {tenantTeam.length > 0 ? (
              <div className="space-y-2">
                {tenantTeam.map((u) => (
                  <div key={u.id} className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-[#042C53] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                      {u.avatar_initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#042C53] truncate">{u.nome}</p>
                      <p className="text-[11px] text-gray-400">{u.ruolo}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <User className="h-4 w-4" />
                <span>{azienda.utenti} utenti (dati non disponibili)</span>
              </div>
            )}
          </div>

          {/* Attività recente */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[#042C53] mb-3">Attività recente</h2>
            {tenantLogs.length > 0 ? (
              <div className="space-y-2.5">
                {tenantLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2">
                    <Clock className="h-3.5 w-3.5 text-gray-300 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-[#042C53] font-medium">{log.azione}</p>
                      <p className="text-[11px] text-gray-400">{log.timestamp.slice(0, 10)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">Nessuna attività registrata.</p>
            )}
          </div>

          {/* Note interne */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[#042C53] mb-3">Note interne</h2>
            <textarea
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#042C53]/20 resize-none"
              rows={4}
              placeholder="Aggiungi note su questa azienda..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button
              onClick={handleSaveNote}
              className="mt-2 w-full bg-[#042C53] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {noteSaved ? 'Salvato!' : 'Salva nota'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
