import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Download, Bell, CheckCircle2, AlertTriangle,
  XCircle, ChevronDown, ChevronUp, Clock,
} from 'lucide-react';
import { mockTeam, mockEnrollments, mockCorsi } from '@/data/tutelaiMockData';
import type { TeamMember } from '@/types/saas';

function formatRelativeTime(iso?: string): string {
  if (!iso) return 'Mai';
  const now = new Date();
  const date = new Date(iso);
  const diffMs = now.getTime() - date.getTime();
  const diffD = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffD === 0) return 'Oggi';
  if (diffD === 1) return 'Ieri';
  if (diffD < 7) return `${diffD}g fa`;
  if (diffD < 30) return `${Math.floor(diffD / 7)} sett. fa`;
  return `${Math.floor(diffD / 30)} mesi fa`;
}

const AVATAR_COLORS = ['bg-[#185FA5]', 'bg-[#22A86B]', 'bg-[#D97706]', 'bg-[#DC2626]', 'bg-[#7C3AED]'];

const obbligatoriCorsi = mockCorsi.filter(c => c.obbligatorio);
const avanzatiCorsi = mockCorsi.filter(c => !c.obbligatorio);

function getUserStats(userId: string) {
  const userEnrollments = mockEnrollments.filter(e => e.user_id === userId);

  const obbligatoriCompletati = obbligatoriCorsi.filter(c => {
    const en = userEnrollments.find(e => e.corso_id === c.id);
    return en?.stato === 'completato';
  }).length;

  const avanzatiCompletati = avanzatiCorsi.filter(c => {
    const en = userEnrollments.find(e => e.corso_id === c.id);
    return en?.stato === 'completato';
  }).length;

  return { obbligatoriCompletati, avanzatiCompletati, enrollments: userEnrollments };
}

function ObbligatorioBadge({ completed, total }: { completed: number; total: number }) {
  if (completed === total)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-[#EAF5EE] text-[#1D6B3A]">
        <CheckCircle2 className="w-3.5 h-3.5" />
        {completed}/{total}
      </span>
    );
  if (completed === 0)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-[#FDEAEA] text-[#8B1A1A]">
        <XCircle className="w-3.5 h-3.5" />
        {completed}/{total}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-[#FDF3E3] text-[#854F0B]">
      <AlertTriangle className="w-3.5 h-3.5" />
      {completed}/{total}
    </span>
  );
}

function UserRow({ member, index }: { member: TeamMember; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [toast, setToast] = useState('');
  const stats = getUserStats(member.id);
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  return (
    <>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#1a375b] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-[#22A86B]" />
          {toast}
        </div>
      )}
      <tr
        className="border-b border-[#F5F5F3] hover:bg-[#F5F5F3] cursor-pointer transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Utente */}
        <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full ${avatarColor} text-white text-sm font-bold flex items-center justify-center flex-shrink-0`}>
              {member.avatar_initials}
            </div>
            <div>
              <p className="text-sm font-medium text-[#1a375b]">{member.nome}</p>
              <p className="text-xs text-gray-500">{member.email}</p>
              <p className="text-xs text-gray-400">{member.ruolo}</p>
            </div>
          </div>
        </td>

        {/* Obbligatori */}
        <td className="px-4 py-4">
          <ObbligatorioBadge completed={stats.obbligatoriCompletati} total={obbligatoriCorsi.length} />
        </td>

        {/* Avanzati */}
        <td className="px-4 py-4">
          <span className="text-sm text-[#1a375b] font-medium">
            {stats.avanzatiCompletati}/{avanzatiCorsi.length}
          </span>
        </td>

        {/* Ultimo accesso */}
        <td className="px-4 py-4">
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            {formatRelativeTime(member.ultimo_accesso)}
          </span>
        </td>

        {/* Azioni */}
        <td className="px-4 py-4">
          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs border border-[#C8C5BC] rounded-lg text-[#1a375b] hover:bg-[#E6F1FB] transition-colors"
            >
              Dettaglio {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => showToast(`Sollecito inviato a ${member.nome}`)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs border border-[#C8C5BC] rounded-lg text-[#1a375b] hover:bg-[#FDF3E3] transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
              Sollecita
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded row */}
      {expanded && (
        <tr className="bg-[#F5F5F3] border-b border-[#C8C5BC]">
          <td colSpan={5} className="px-6 py-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Stato corsi</p>
            <div className="grid grid-cols-2 gap-2">
              {mockCorsi.map(corso => {
                const en = stats.enrollments.find(e => e.corso_id === corso.id);
                const statoLabel = en?.stato === 'completato' ? 'Completato' : en?.stato === 'in_corso' ? 'In corso' : 'Non iniziato';
                const statoColor = en?.stato === 'completato' ? 'text-[#22A86B]' : en?.stato === 'in_corso' ? 'text-[#D97706]' : 'text-gray-400';
                const Icon = en?.stato === 'completato' ? CheckCircle2 : en?.stato === 'in_corso' ? Clock : XCircle;
                return (
                  <div key={corso.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-[#C8C5BC]">
                    <div>
                      <p className="text-xs font-medium text-[#1a375b]">{corso.titolo}</p>
                      {corso.obbligatorio && <span className="text-xs text-[#8B1A1A]">Obbligatorio</span>}
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-medium ${statoColor}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {statoLabel}
                      {en?.punteggio_quiz !== undefined && (
                        <span className="ml-1 text-gray-400">({en.punteggio_quiz}/5)</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AppTrainingTeam() {
  const [globalToast, setGlobalToast] = useState('');

  const showGlobalToast = (msg: string) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(''), 3000);
  };

  const totalCompletati = mockTeam.reduce((acc, m) => {
    const stats = getUserStats(m.id);
    return acc + (stats.obbligatoriCompletati === obbligatoriCorsi.length ? 1 : 0);
  }, 0);

  const inRitardo = mockTeam.filter(m => {
    const stats = getUserStats(m.id);
    return stats.obbligatoriCompletati < obbligatoriCorsi.length;
  });

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {globalToast && (
        <div className="fixed top-4 right-4 z-50 bg-[#1a375b] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-[#22A86B]" />
          {globalToast}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/app/training" className="flex items-center gap-1.5 text-sm text-[#185FA5] hover:underline">
              <ArrowLeft className="w-4 h-4" />
              Training Hub
            </Link>
            <span className="text-gray-400">/</span>
            <h1 className="text-xl font-bold text-[#1a375b]">Training Hub — Stato per utente</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (inRitardo.length === 0) {
                  showGlobalToast('Tutti gli utenti sono in regola!');
                } else {
                  showGlobalToast(`Sollecito inviato a ${inRitardo.length} utenti in ritardo`);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#1a375b] border border-[#C8C5BC] rounded-lg hover:bg-[#FDF3E3] transition-colors"
            >
              <Bell className="w-4 h-4" />
              Sollecita tutti in ritardo
            </button>
            <button
              onClick={() => showGlobalToast('Esportazione report in corso...')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#1a375b] hover:bg-[#185FA5] text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Esporta report
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#C8C5BC] rounded-xl overflow-hidden mb-6">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F5F3] border-b border-[#C8C5BC]">
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Utente</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Corsi Obbligatori</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Corsi Avanzati</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Ultimo accesso</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {mockTeam.map((member, i) => (
                <UserRow key={member.id} member={member} index={i} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary row */}
        <div className="bg-white border border-[#C8C5BC] rounded-xl p-5">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-[#1a375b]">{mockTeam.length}</p>
              <p className="text-xs text-gray-500 mt-1">Utenti totali</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#22A86B]">{totalCompletati}</p>
              <p className="text-xs text-gray-500 mt-1">Obbligatori completati (tutti)</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#D97706]">{inRitardo.length}</p>
              <p className="text-xs text-gray-500 mt-1">In ritardo</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#185FA5]">
                {mockEnrollments.filter(e => e.stato === 'completato').length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Attestati rilasciati</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
