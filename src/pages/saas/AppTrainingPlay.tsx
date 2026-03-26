import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Play, Pause, SkipBack, SkipForward,
  Volume2, FileText, AlignLeft, BookOpen,
  ChevronLeft, ChevronRight, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import { mockCorsi } from '@/data/tutelaiMockData';

const MODULE_CONTENT: Record<string, string> = {
  slide: 'Questa diapositiva introduce i concetti fondamentali del modulo. I punti chiave includono: la definizione normativa, gli obblighi applicabili e le best practice per la conformità. Seguire attentamente per superare il quiz finale.',
  video: 'Contenuto video in riproduzione. Il video illustra casi pratici di utilizzo dell\'AI in azienda, con esempi concreti di conformità all\'AI Act e al GDPR. Guardare fino alla fine per accedere al quiz.',
  testo: 'Materiale di lettura approfondita. Questo testo contiene riferimenti normativi completi, analisi giuridica e linee guida operative per l\'implementazione delle misure di conformità richieste dalla normativa vigente.',
};

export default function AppTrainingPlay() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const corso = mockCorsi.find(c => c.id === id);

  const [currentModuleIdx, setCurrentModuleIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [activeTab, setActiveTab] = useState<'note' | 'trascrizione' | 'risorse'>('trascrizione');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Simulate playback progress
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress(p => Math.min(p + 0.5, 100));
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress]);

  if (!corso) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-[#D97706] mx-auto mb-3" />
          <h2 className="text-xl font-bold text-[#042C53] mb-2">Corso non trovato</h2>
          <Link to="/app/training" className="text-[#185FA5] hover:underline text-sm">
            Torna ai corsi
          </Link>
        </div>
      </div>
    );
  }

  const moduli = corso.moduli.sort((a, b) => a.ordine - b.ordine);
  const currentModule = moduli[currentModuleIdx];
  const isLastModule = currentModuleIdx === moduli.length - 1;
  const isFirstModule = currentModuleIdx === 0;

  const totalDurationSec = currentModule.durata_minuti * 60;
  const progressSec = Math.floor((progress / 100) * totalDurationSec);
  const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

  const overallProgress = Math.round(((currentModuleIdx + progress / 100) / moduli.length) * 100);

  const handleNext = () => {
    if (!isLastModule) {
      setCurrentModuleIdx(i => i + 1);
      setProgress(0);
      setIsPlaying(false);
    } else if (currentModule.ha_quiz) {
      navigate(`/app/training/courses/${id}/quiz`);
    }
  };

  const handlePrev = () => {
    if (!isFirstModule) {
      setCurrentModuleIdx(i => i - 1);
      setProgress(0);
      setIsPlaying(false);
    }
  };

  const moduleTypeIcon = currentModule.tipo === 'video' ? '▶' : currentModule.tipo === 'slide' ? '📊' : '📄';

  return (
    <div className="min-h-screen bg-[#042C53] flex flex-col">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-white text-[#042C53] px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-[#22A86B]" />
          {toast}
        </div>
      )}

      {/* Top bar */}
      <div className="bg-[#042C53] border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <Link
          to="/app/training"
          className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna ai corsi
        </Link>
        <h1 className="text-sm font-medium text-white truncate max-w-md">{corso.titolo}</h1>
        <div className="text-sm text-white/50">
          {currentModuleIdx + 1}/{moduli.length} moduli
        </div>
      </div>

      {/* Progress indicator */}
      <div className="bg-[#031F3B] px-6 py-3">
        <div className="flex items-center justify-between text-xs text-white/60 mb-2">
          <span>
            Modulo {currentModuleIdx + 1}/{moduli.length}: <strong className="text-white">{currentModule.titolo}</strong>
          </span>
          <span>Progresso corso: {overallProgress}%</span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#22A86B] rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-white/40 mt-1">
          <span>{moduleTypeIcon} {currentModule.tipo.charAt(0).toUpperCase() + currentModule.tipo.slice(1)}</span>
          <span>Durata: {currentModule.durata_minuti} min rimasti</span>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video/slide area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-[#031F3B] flex items-center justify-center min-h-[360px] relative">
            <div className="text-center max-w-lg px-8">
              <div className="text-4xl mb-4">{moduleTypeIcon}</div>
              <h2 className="text-xl font-bold text-white mb-4">{currentModule.titolo}</h2>
              <p className="text-white/60 text-sm leading-relaxed">
                {MODULE_CONTENT[currentModule.tipo] || MODULE_CONTENT.testo}
              </p>
              {!isPlaying && (
                <button
                  onClick={() => setIsPlaying(true)}
                  className="mt-6 flex items-center gap-2 mx-auto px-6 py-3 bg-[#185FA5] hover:bg-[#042C53] text-white rounded-full text-sm font-medium transition-colors"
                >
                  <Play className="w-4 h-4" />
                  {progress > 0 ? 'Riprendi' : 'Inizia'}
                </button>
              )}
            </div>
            {progress === 100 && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-[#22A86B] text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                Completato
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="bg-[#042C53] border-t border-white/10 px-6 py-4">
            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs text-white/50 w-10">{formatTime(progressSec)}</span>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer">
                <div
                  className="h-full bg-[#185FA5] rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-white/50 w-10 text-right">{formatTime(totalDurationSec)}</span>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-white/50" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={e => setVolume(Number(e.target.value))}
                  className="w-20 accent-[#185FA5]"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setProgress(p => Math.max(0, p - 5))}
                  className="p-2 text-white/60 hover:text-white transition-colors"
                  title="Indietro 10s"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsPlaying(p => !p)}
                  className="w-12 h-12 bg-[#185FA5] hover:bg-[#0D4A87] text-white rounded-full flex items-center justify-center transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <button
                  onClick={() => setProgress(p => Math.min(100, p + 5))}
                  className="p-2 text-white/60 hover:text-white transition-colors"
                  title="Avanti 10s"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {(['note', 'trascrizione', 'risorse'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 text-xs rounded-lg transition-colors capitalize ${activeTab === tab ? 'bg-[#185FA5] text-white' : 'text-white/50 hover:text-white'}`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="w-72 bg-[#031F3B] border-l border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2 text-white/60 text-xs mb-1">
              {activeTab === 'note' && <FileText className="w-4 h-4" />}
              {activeTab === 'trascrizione' && <AlignLeft className="w-4 h-4" />}
              {activeTab === 'risorse' && <BookOpen className="w-4 h-4" />}
              <span className="uppercase tracking-widest font-bold">{activeTab}</span>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {activeTab === 'note' && (
              <div className="text-xs text-white/40 italic">Nessuna nota per questo modulo. Puoi aggiungere note durante la riproduzione.</div>
            )}
            {activeTab === 'trascrizione' && (
              <div className="text-xs text-white/60 leading-relaxed space-y-3">
                <p><span className="text-white/30">0:00</span> — Benvenuti a questo modulo: {currentModule.titolo}.</p>
                <p><span className="text-white/30">0:30</span> — In questa sessione affronteremo i requisiti normativi previsti dall&apos;AI Act e le relative implicazioni pratiche per la vostra azienda.</p>
                <p><span className="text-white/30">1:15</span> — I principali obblighi riguardano la trasparenza, la documentazione tecnica e la supervisione umana dei sistemi AI ad alto rischio.</p>
                <p><span className="text-white/30">2:00</span> — Vedremo ora alcuni esempi concreti applicati al contesto della vostra organizzazione.</p>
              </div>
            )}
            {activeTab === 'risorse' && (
              <div className="space-y-2">
                {[
                  { title: 'AI Act UE 2024/1689', url: '#' },
                  { title: 'Linee guida ENISA', url: '#' },
                  { title: 'Checklist conformità', url: '#' },
                ].map(r => (
                  <a key={r.title} href={r.url} className="block text-xs text-[#185FA5] hover:underline py-1">
                    → {r.title}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Modules list */}
          <div className="border-t border-white/10 p-4">
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Indice moduli</p>
            <div className="space-y-1">
              {moduli.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => { setCurrentModuleIdx(i); setProgress(0); setIsPlaying(false); }}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors
                    ${i === currentModuleIdx ? 'bg-[#185FA5] text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                >
                  {i + 1}. {m.titolo}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="bg-[#031F3B] border-t border-white/10 px-6 py-4 flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={isFirstModule}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Modulo precedente
        </button>

        <div className="flex items-center gap-1">
          {moduli.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${i === currentModuleIdx ? 'bg-[#185FA5]' : i < currentModuleIdx ? 'bg-[#22A86B]' : 'bg-white/20'}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-[#185FA5] hover:bg-[#042C53] text-white rounded-lg transition-colors font-medium"
        >
          {isLastModule && currentModule.ha_quiz ? (
            <>Completa e vai al Quiz <ChevronRight className="w-4 h-4" /></>
          ) : (
            <>Modulo successivo <ChevronRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );
}
