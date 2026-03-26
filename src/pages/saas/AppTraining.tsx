import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, Users, CheckCircle2, PlayCircle, Download,
  UserPlus, BarChart2, Search, ChevronRight,
} from 'lucide-react';
import { mockCorsi, mockEnrollments } from '@/data/tutelaiMockData';
import type { TrainingCourse } from '@/types/saas';

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

function CourseCard({ corso }: { corso: TrainingCourse }) {
  const navigate = useNavigate();

  const enrollments = mockEnrollments.filter(e => e.corso_id === corso.id);
  const completati = enrollments.filter(e => e.stato === 'completato').length;
  const inCorso = enrollments.filter(e => e.stato === 'in_corso').length;
  const assegnati = enrollments.length;
  const totalUsers = 5;
  const progressPct = totalUsers > 0 ? Math.round((completati / totalUsers) * 100) : 0;

  return (
    <div className="bg-white border border-[#C8C5BC] rounded-xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-base font-bold text-[#042C53]">{corso.titolo}</h3>
            {corso.obbligatorio && (
              <span className="px-2 py-0.5 text-xs font-bold bg-[#FDEAEA] text-[#8B1A1A] rounded">
                OBBLIGATORIO
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDuration(corso.durata_minuti)}
            </span>
            {corso.riferimento_normativo && (
              <span className="text-[#185FA5] font-medium">{corso.riferimento_normativo}</span>
            )}
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {assegnati}/{totalUsers} assegnati
            </span>
          </div>

          {/* Completion stats */}
          <div className="flex items-center gap-4 text-xs mb-3 flex-wrap">
            <span className="flex items-center gap-1 text-[#22A86B]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {completati} completato
            </span>
            <span className="flex items-center gap-1 text-[#D97706]">
              <Clock className="w-3.5 h-3.5" />
              {inCorso} in corso
            </span>
            <span className="text-gray-400">{totalUsers - assegnati} non iniziato</span>
          </div>

          {/* Progress bar */}
          <div className="mb-1">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Completamento team</span>
              <span>{progressPct}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#22A86B] rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={() => navigate(`/app/training/courses/${corso.id}/play`)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#042C53] hover:bg-[#185FA5] text-white rounded-lg font-medium transition-colors"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            Visualizza
          </button>
          <button
            onClick={() => navigate('/app/training/team')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#C8C5BC] text-[#042C53] hover:bg-[#E6F1FB] rounded-lg font-medium transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Assegna
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AppTraining() {
  const navigate = useNavigate();
  const [categoriaFilter, setCategoriaFilter] = useState<'all' | 'base' | 'avanzato'>('all');
  const [statoFilter, setStatoFilter] = useState<'all' | 'obbligatorio' | 'facoltativo'>('all');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const filtered = mockCorsi.filter(c => {
    if (categoriaFilter !== 'all' && c.categoria !== categoriaFilter) return false;
    if (statoFilter === 'obbligatorio' && !c.obbligatorio) return false;
    if (statoFilter === 'facoltativo' && c.obbligatorio) return false;
    if (search && !c.titolo.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const obbligatori = filtered.filter(c => c.obbligatorio);
  const avanzati = filtered.filter(c => !c.obbligatorio);

  // Overall stats
  const totalObbligatoriCorsi = mockCorsi.filter(c => c.obbligatorio).length;
  const totalUsers = 5;
  const completatiAll = mockEnrollments.filter(e => e.stato === 'completato').length;
  const obbligatoriEnrollments = mockEnrollments.filter(e => {
    const corso = mockCorsi.find(c => c.id === e.corso_id);
    return corso?.obbligatorio && e.stato === 'completato';
  }).length;

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#042C53] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-[#22A86B]" />
          {toast}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#042C53]">Training Hub — Formazione AI</h1>
            <p className="text-sm text-gray-500 mt-1">Gestione corsi obbligatori e avanzati per il tuo team</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => navigate('/app/training/team')}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#042C53] border border-[#C8C5BC] rounded-lg hover:bg-[#E6F1FB] transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Assegna corsi
            </button>
            <button
              onClick={() => navigate('/app/training/team')}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#042C53] border border-[#C8C5BC] rounded-lg hover:bg-[#E6F1FB] transition-colors"
            >
              <BarChart2 className="w-4 h-4" />
              Vedi report
            </button>
            <button
              onClick={() => showToast('Esportazione attestati in corso...')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#042C53] hover:bg-[#185FA5] text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Esporta attestati
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-[#C8C5BC] rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[#042C53]">{obbligatoriEnrollments}</p>
            <p className="text-xs text-gray-500 mt-1">Completamenti obbligatori</p>
          </div>
          <div className="bg-white border border-[#C8C5BC] rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[#22A86B]">{completatiAll}</p>
            <p className="text-xs text-gray-500 mt-1">Totale attestati rilasciati</p>
          </div>
          <div className="bg-white border border-[#C8C5BC] rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[#185FA5]">{totalObbligatoriCorsi * totalUsers}</p>
            <p className="text-xs text-gray-500 mt-1">Completamenti attesi (totale)</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <select
            value={categoriaFilter}
            onChange={e => setCategoriaFilter(e.target.value as typeof categoriaFilter)}
            className="px-3 py-2 border border-[#C8C5BC] rounded-lg text-sm bg-white text-[#042C53] focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
          >
            <option value="all">Tutte le categorie</option>
            <option value="base">Base</option>
            <option value="avanzato">Avanzato</option>
          </select>
          <select
            value={statoFilter}
            onChange={e => setStatoFilter(e.target.value as typeof statoFilter)}
            className="px-3 py-2 border border-[#C8C5BC] rounded-lg text-sm bg-white text-[#042C53] focus:outline-none focus:ring-2 focus:ring-[#185FA5]"
          >
            <option value="all">Tutti</option>
            <option value="obbligatorio">Obbligatorio</option>
            <option value="facoltativo">Facoltativo</option>
          </select>
          <div className="flex items-center gap-2 flex-1 min-w-[200px] border border-[#C8C5BC] rounded-lg bg-white px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca corso..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent text-[#042C53] placeholder-gray-400"
            />
          </div>
        </div>

        {/* Obbligatori */}
        {obbligatori.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-[#DC2626] rounded" />
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                Corsi obbligatori (art. 4 AI Act) — {obbligatori.length} corsi
              </h2>
            </div>
            <div className="space-y-4">
              {obbligatori.map(c => <CourseCard key={c.id} corso={c} />)}
            </div>
          </div>
        )}

        {/* Avanzati */}
        {avanzati.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-[#185FA5] rounded" />
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                Corsi avanzati — {avanzati.length} corsi
              </h2>
            </div>
            <div className="space-y-4">
              {avanzati.map(c => <CourseCard key={c.id} corso={c} />)}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="bg-white border border-[#C8C5BC] rounded-xl p-10 text-center text-gray-400">
            <p>Nessun corso trovato con i filtri selezionati</p>
          </div>
        )}

        {/* View all team */}
        <div className="text-center">
          <button
            onClick={() => navigate('/app/training/team')}
            className="inline-flex items-center gap-2 text-sm text-[#185FA5] hover:underline"
          >
            Vedi stato di tutto il team <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
