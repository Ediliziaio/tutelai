import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Building2, Users, Shield, Bell, Plug, MoreVertical, Mail, CheckCircle2, Clock, UserX } from 'lucide-react';
import { mockTeam } from '@/data/tutelaiMockData';

const tabs = [
  { label: 'Azienda', to: '/app/settings/company', icon: Building2 },
  { label: 'Team', to: '/app/settings/team', icon: Users },
  { label: 'Sicurezza', to: '/app/settings/security', icon: Shield },
  { label: 'Notifiche', to: '/app/settings/notifications', icon: Bell },
  { label: 'Integrazioni', to: '/app/settings/integrations', icon: Plug },
];

const roleBadge: Record<string, string> = {
  Owner: 'bg-[#042C53] text-white',
  Admin: 'bg-blue-100 text-blue-800',
  Member: 'bg-gray-100 text-gray-700',
  Viewer: 'bg-gray-50 text-gray-500',
  'AI Officer': 'bg-purple-100 text-purple-800',
  DPO: 'bg-orange-100 text-orange-800',
};

function formatAccess(s?: string) {
  if (!s) return '—';
  const d = new Date(s);
  const diff = Date.now() - d.getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Ora';
  if (h < 24) return `${h}h fa`;
  return `${Math.floor(h/24)} giorni fa`;
}

export default function AppSettingsTeam() {
  const location = useLocation();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-4xl">
      <h1 className="text-[22px] font-bold text-[#042C53] mb-6">Impostazioni</h1>
      <div className="bg-white border border-[#C8C5BC] rounded-xl p-6">
        <div className="flex gap-1 border-b border-[#C8C5BC] mb-6 overflow-x-auto">
          {tabs.map(t => {
            const active = location.pathname === t.to;
            return (
              <NavLink key={t.to} to={t.to}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${active ? 'border-[#185FA5] text-[#185FA5]' : 'border-transparent text-gray-500 hover:text-[#042C53]'}`}
              >
                <t.icon className="h-4 w-4" /> {t.label}
              </NavLink>
            );
          })}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">Utenti attivi: <span className="font-semibold text-[#042C53]">5/5</span> (piano Business)</p>
          </div>
          <button onClick={() => setShowInvite(v => !v)}
            className="flex items-center gap-2 bg-[#042C53] hover:bg-[#185FA5] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Mail className="h-4 w-4" /> + Invita utente
          </button>
        </div>

        {showInvite && (
          <div className="mb-4 p-4 bg-[#E6F1FB] border border-[#185FA5]/30 rounded-xl">
            <p className="text-sm font-semibold text-[#042C53] mb-3">Invita nuovo membro</p>
            <div className="flex gap-3 flex-wrap">
              <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="email@azienda.it"
                className="flex-1 h-9 px-3 border border-[#C8C5BC] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]" />
              <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                className="h-9 px-3 border border-[#C8C5BC] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]">
                {['Admin','Member','Viewer','AI Officer'].map(r => <option key={r}>{r}</option>)}
              </select>
              <button onClick={() => { setSent(true); setTimeout(() => { setShowInvite(false); setSent(false); setInviteEmail(''); }, 2000); }}
                className="bg-[#042C53] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#185FA5] transition-colors">
                {sent ? '✓ Inviato!' : 'Invia invito'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Il piano Business include max 5 utenti. <a href="/app/billing/upgrade" className="text-[#185FA5] hover:underline">Upgrade per aggiungerne altri →</a></p>
          </div>
        )}

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#C8C5BC]">
              {['Utente','Email','Ruolo','Stato','Ultimo accesso','Azioni'].map(h => (
                <th key={h} className="text-left pb-2 text-xs font-bold uppercase tracking-wide text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F5F3]">
            {mockTeam.map(m => (
              <tr key={m.id} className="hover:bg-[#FAFAF8]">
                <td className="py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#042C53] text-white text-xs font-bold">{m.avatar_initials}</div>
                    <span className="font-medium text-[#042C53]">{m.nome}</span>
                  </div>
                </td>
                <td className="py-3 text-gray-500 text-xs">{m.email}</td>
                <td className="py-3">
                  <span className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${roleBadge[m.ruolo] ?? 'bg-gray-100 text-gray-700'}`}>{m.ruolo}</span>
                </td>
                <td className="py-3">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-[#EAF5EE] text-[#1D6B3A] px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="h-3 w-3" /> Attivo
                  </span>
                </td>
                <td className="py-3 text-gray-500 text-xs">{formatAccess(m.ultimo_accesso)}</td>
                <td className="py-3">
                  {m.ruolo !== 'Owner' && (
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded"><MoreVertical className="h-4 w-4" /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 pt-4 border-t border-[#C8C5BC]">
          <p className="text-sm font-bold text-[#042C53] mb-3">Ruoli speciali TutelAI</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[['DPO esterno','Dr. Rossi — TutelAI'],['AI Officer est.','Bianchi — TutelAI']].map(([r,n]) => (
              <div key={r} className="flex items-center justify-between p-3 border border-[#C8C5BC] rounded-xl">
                <div>
                  <p className="text-xs font-bold text-[#042C53]">{r}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-[#EAF5EE] text-[#1D6B3A] px-2 py-0.5 rounded-full">Attivo</span>
                  <button className="text-xs text-[#185FA5] hover:underline">Modifica</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
