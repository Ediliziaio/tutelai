import { useState } from 'react';
import { Search, UserPlus, X } from 'lucide-react';
import { StatusBadge } from '@/components/saas/StatusBadge';
import { mockTeam, mockAziende } from '@/data/tutelaiMockData';

type ExtUser = {
  id: string;
  tenant_id: string;
  nome: string;
  email: string;
  ruolo: string;
  stato: 'attivo';
  ultimo_accesso: string;
  avatar_initials: string;
  azienda_nome: string;
};

const baseUsers: ExtUser[] = mockTeam.map((u) => {
  const azienda = mockAziende.find((a) => a.id === u.tenant_id);
  return { ...u, azienda_nome: azienda?.ragione_sociale ?? 'Sconosciuta', stato: 'attivo' as const };
});

const extendedUsers: ExtUser[] = [
  ...baseUsers,
  { id: 'u-ext-001', tenant_id: 't-002', nome: 'Carla Mancini', email: 'carla@edil.it', ruolo: 'Owner', stato: 'attivo', ultimo_accesso: '2026-03-22T10:00:00Z', avatar_initials: 'CM', azienda_nome: 'Edil Costruzioni S.r.l.' },
  { id: 'u-ext-002', tenant_id: 't-003', nome: 'Paolo Bianchi', email: 'paolo@studiolegale.it', ruolo: 'Admin', stato: 'attivo', ultimo_accesso: '2026-03-20T14:00:00Z', avatar_initials: 'PB', azienda_nome: 'Studio Legale Bianchi' },
  { id: 'u-ext-003', tenant_id: 't-004', nome: 'Elena Russo', email: 'elena@retailplus.it', ruolo: 'Member', stato: 'attivo', ultimo_accesso: '2026-03-18T09:00:00Z', avatar_initials: 'ER', azienda_nome: 'RetailPlus S.p.A.' },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Oggi';
  if (days === 1) return 'Ieri';
  return `${days} giorni fa`;
}

const ALL = 'all';

export default function AdminUtenti() {
  const [search, setSearch] = useState('');
  const [filterRuolo, setFilterRuolo] = useState(ALL);
  const [filterAzienda, setFilterAzienda] = useState(ALL);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const ruoli = Array.from(new Set(extendedUsers.map((u) => u.ruolo)));
  const aziende = Array.from(new Set(extendedUsers.map((u) => u.azienda_nome)));

  const filtered = extendedUsers.filter((u) => {
    const matchSearch =
      search === '' ||
      u.nome.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRuolo = filterRuolo === ALL || u.ruolo === filterRuolo;
    const matchAzienda = filterAzienda === ALL || u.azienda_nome === filterAzienda;
    return matchSearch && matchRuolo && matchAzienda;
  });

  const totali = extendedUsers.length;
  const owner = extendedUsers.filter((u) => u.ruolo === 'Owner').length;
  const admin = extendedUsers.filter((u) => u.ruolo === 'Admin').length;
  const member = extendedUsers.filter((u) => u.ruolo === 'Member').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-[#1a375b]">Utenti — tutti</h1>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 bg-[#1a375b] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <UserPlus className="h-4 w-4" /> Invita utente
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Totali', value: totali, color: 'text-[#1a375b]' },
          { label: 'Owner', value: owner, color: 'text-violet-600' },
          { label: 'Admin', value: admin, color: 'text-blue-600' },
          { label: 'Member', value: member, color: 'text-gray-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca per nome o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a375b]/20 focus:border-[#1a375b]"
            />
          </div>
          <select
            value={filterRuolo}
            onChange={(e) => setFilterRuolo(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
          >
            <option value={ALL}>Tutti i ruoli</option>
            {ruoli.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select
            value={filterAzienda}
            onChange={(e) => setFilterAzienda(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
          >
            <option value={ALL}>Tutte le aziende</option>
            {aziende.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Utente', 'Azienda', 'Ruolo', 'Stato', 'Ultimo accesso', 'Azioni'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">Nessun utente trovato.</td>
                </tr>
              )}
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-[#1a375b] text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {u.avatar_initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1a375b]">{u.nome}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{u.azienda_nome}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">
                      {u.ruolo}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status="attivo" />
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{timeAgo(u.ultimo_accesso)}</td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-[#185FA5] hover:underline font-medium">Gestisci</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
          Mostrando {filtered.length} di {extendedUsers.length} utenti
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#1a375b]">Invita utente</h2>
              <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input type="email" placeholder="nome@azienda.it" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a375b]/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Azienda</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                  {mockAziende.map((a) => <option key={a.id} value={a.id}>{a.ragione_sociale}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ruolo</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                  <option>Admin</option>
                  <option>Member</option>
                  <option>Viewer</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowInviteModal(false)} className="flex-1 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Annulla
              </button>
              <button onClick={() => setShowInviteModal(false)} className="flex-1 bg-[#1a375b] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Invia invito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
