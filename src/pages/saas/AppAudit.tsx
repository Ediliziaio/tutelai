import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Download, Shield, Filter, ChevronRight, User, Bot } from 'lucide-react';
import { mockAuditLogs } from '@/data/tutelaiMockData';

const moduleBadge: Record<string, string> = {
  'Doc Generator': 'bg-blue-100 text-blue-800',
  'AI Registry': 'bg-purple-100 text-purple-800',
  'Training Hub': 'bg-green-100 text-green-800',
  'GDPR+AI': 'bg-orange-100 text-orange-800',
  'AI Monitor': 'bg-yellow-100 text-yellow-800',
};

function formatTs(ts: string) {
  const d = new Date(ts);
  return d.toLocaleDateString('it-IT', { day:'2-digit', month:'2-digit' }) + ' ' +
    d.toLocaleTimeString('it-IT', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
}

export default function AppAudit() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = mockAuditLogs.filter(log =>
    !search ||
    log.azione.toLowerCase().includes(search.toLowerCase()) ||
    (log.utente_nome ?? '').toLowerCase().includes(search.toLowerCase()) ||
    log.modulo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[#1a375b]">Audit Trail — Log eventi</h1>
          <p className="text-sm text-gray-500 mt-0.5">Log immutabile di ogni azione. Conforme AI Act per tracciabilità.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="flex items-center gap-2 border border-[#C8C5BC] hover:bg-gray-50 text-[#1a375b] text-sm font-medium px-3 py-2 rounded-lg transition-colors">
            <Download className="h-4 w-4" /> Esporta log
          </button>
          <button className="flex items-center gap-2 border border-[#C8C5BC] hover:bg-gray-50 text-[#1a375b] text-sm font-medium px-3 py-2 rounded-lg transition-colors">
            <Shield className="h-4 w-4" /> Firma digitalmente
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#C8C5BC] rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca nel log..."
            className="w-full h-9 pl-9 pr-3 border border-[#C8C5BC] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5] focus:border-transparent"
          />
        </div>
        <select className="h-9 px-3 border border-[#C8C5BC] rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#185FA5]">
          <option>Tutti i tipi</option>
          <option>DOCUMENT_SIGNED</option>
          <option>AI_SYSTEM_ADDED</option>
          <option>TRAINING_COMPLETED</option>
          <option>DPIA_STARTED</option>
          <option>MONITOR_ALERT_SENT</option>
        </select>
        <select className="h-9 px-3 border border-[#C8C5BC] rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#185FA5]">
          <option>Tutti gli utenti</option>
          <option>Florin Andriciuc</option>
          <option>Marco Bianchi</option>
          <option>Sofia Rossi</option>
          <option>Sistema</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#C8C5BC] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F5F5F3] border-b border-[#C8C5BC]">
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">Timestamp</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">Utente</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">Modulo</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">Azione</th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">Hash</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F3]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-[#FAFAF8] cursor-pointer transition-colors" onClick={() => navigate(`/app/audit/${log.id}`)}>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{formatTs(log.timestamp)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {log.utente_nome ? (
                        <>
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a375b] text-white text-[10px] font-bold shrink-0">
                            {log.utente_nome.split(' ').map(w => w[0]).join('').slice(0,2)}
                          </div>
                          <span className="text-[#1a375b] font-medium text-xs">{log.utente_nome}</span>
                        </>
                      ) : (
                        <>
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-500 shrink-0">
                            <Bot className="h-4 w-4" />
                          </div>
                          <span className="text-gray-500 text-xs">Sistema</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${moduleBadge[log.modulo] ?? 'bg-gray-100 text-gray-700'}`}>
                      {log.modulo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-[200px]">
                    <div className="truncate">{log.azione}</div>
                    {log.oggetto && <div className="text-xs text-gray-400 truncate mt-0.5">{log.oggetto}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${log.integrita_ok ? 'bg-[#22A86B]' : 'bg-red-500'}`} />
                      <code className="text-[11px] font-mono text-gray-400">{log.hash.slice(0, 8)}…</code>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <ChevronRight className="h-4 w-4 text-gray-300" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-[#C8C5BC] flex items-center justify-between">
          <span className="text-xs text-gray-500">Mostrando {filtered.length} di 847 eventi</span>
          <button className="text-sm text-[#185FA5] hover:underline">Carica altri</button>
        </div>
      </div>
    </div>
  );
}
