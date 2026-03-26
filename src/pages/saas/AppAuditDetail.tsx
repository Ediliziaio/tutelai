import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Shield, Download, CheckCircle2, AlertTriangle } from 'lucide-react';
import { mockAuditLogs } from '@/data/tutelaiMockData';

function formatTs(ts: string) {
  return new Date(ts).toLocaleString('it-IT', { dateStyle: 'full', timeStyle: 'long' });
}

export default function AppAuditDetail() {
  const { id } = useParams<{ id: string }>();
  const log = mockAuditLogs.find(l => l.id === id);

  if (!log) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertTriangle className="h-12 w-12 text-gray-300" />
        <p className="text-gray-500">Evento non trovato.</p>
        <Link to="/app/audit" className="text-[#185FA5] hover:underline text-sm">← Torna all'Audit Trail</Link>
      </div>
    );
  }

  const fields = [
    { label: 'Tipo evento', value: log.tipo },
    { label: 'Timestamp', value: formatTs(log.timestamp) },
    { label: 'Utente', value: log.utente_nome ?? 'Sistema automatico' },
    { label: 'IP', value: log.ip ?? 'N/A' },
    { label: 'Modulo', value: log.modulo },
    { label: 'Azione', value: log.azione },
    ...(log.oggetto ? [{ label: 'Oggetto', value: log.oggetto }] : []),
    ...(log.oggetto_id ? [{ label: 'ID oggetto', value: log.oggetto_id }] : []),
  ];

  return (
    <div className="max-w-3xl space-y-5">
      <Link to="/app/audit" className="inline-flex items-center gap-1.5 text-sm text-[#185FA5] hover:underline">
        <ChevronLeft className="h-4 w-4" /> Audit Trail
      </Link>

      <h1 className="text-[22px] font-bold text-[#042C53]">Dettaglio Evento <code className="font-mono text-base text-gray-500">#{log.hash.slice(0,8)}</code></h1>

      {/* Main fields */}
      <div className="bg-white border border-[#C8C5BC] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#C8C5BC] bg-[#F5F5F3]">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Informazioni evento</p>
        </div>
        <div className="divide-y divide-[#F5F5F3]">
          {fields.map(f => (
            <div key={f.label} className="flex px-5 py-3.5 gap-4">
              <span className="w-36 text-xs font-medium text-gray-400 uppercase tracking-wide shrink-0 mt-0.5">{f.label}</span>
              <span className="text-sm text-[#042C53] font-medium break-all">{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Integrity chain */}
      <div className="bg-white border border-[#C8C5BC] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#C8C5BC] bg-[#F5F5F3]">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Integrità catena hash</p>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Hash evento</p>
            <code className="block text-xs font-mono text-[#042C53] bg-[#F5F5F3] px-3 py-2 rounded-lg break-all">{log.hash}d2c8b1e4f7a0c3d6e9</code>
          </div>
          {log.hash_precedente && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Hash evento precedente</p>
              <code className="block text-xs font-mono text-gray-500 bg-[#F5F5F3] px-3 py-2 rounded-lg break-all">{log.hash_precedente}f4a2d6b8e0f3c1e5</code>
            </div>
          )}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${log.integrita_ok ? 'bg-[#EAF5EE]' : 'bg-[#FDEAEA]'}`}>
            {log.integrita_ok ? <CheckCircle2 className="h-4 w-4 text-[#22A86B]" /> : <AlertTriangle className="h-4 w-4 text-red-500" />}
            <span className={`text-sm font-semibold ${log.integrita_ok ? 'text-[#1D6B3A]' : 'text-[#8B1A1A]'}`}>
              {log.integrita_ok ? 'Catena integra ✓' : '⚠ Integrità compromessa'}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="flex items-center gap-2 bg-[#042C53] hover:bg-[#185FA5] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Download className="h-4 w-4" /> Scarica prova evento
        </button>
        <button className="flex items-center gap-2 border border-[#C8C5BC] hover:bg-gray-50 text-[#042C53] text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Shield className="h-4 w-4" /> Verifica integrità
        </button>
      </div>
    </div>
  );
}
