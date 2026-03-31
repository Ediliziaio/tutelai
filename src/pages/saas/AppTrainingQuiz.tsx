import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, RefreshCw, Trophy, ChevronRight, ChevronLeft } from 'lucide-react';

interface QuizQuestion {
  id: number;
  domanda: string;
  opzioni: { key: string; testo: string }[];
  corretto: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    domanda: 'Cosa significa AI Act?',
    opzioni: [
      { key: 'A', testo: 'Un software per la gestione dell\'intelligenza artificiale nelle aziende' },
      { key: 'B', testo: 'Il Regolamento UE 2024/1689 sull\'intelligenza artificiale, primo quadro normativo globale sull\'AI' },
      { key: 'C', testo: 'Un protocollo tecnico per la comunicazione tra sistemi AI' },
      { key: 'D', testo: 'Una certificazione volontaria per prodotti AI sul mercato europeo' },
    ],
    corretto: 'B',
  },
  {
    id: 2,
    domanda: "Qual è l'obbligo principale dell'art. 4 AI Act?",
    opzioni: [
      { key: 'A', testo: 'Registrare tutti i sistemi AI in un registro nazionale pubblico' },
      { key: 'B', testo: 'Garantire che il personale che usa sistemi AI abbia un adeguato livello di AI literacy' },
      { key: 'C', testo: 'Vietare l\'uso di AI generativa nei processi aziendali sensibili' },
      { key: 'D', testo: 'Nominare un AI Officer obbligatorio per tutte le aziende' },
    ],
    corretto: 'B',
  },
  {
    id: 3,
    domanda: "Quale categoria di sistema AI richiede DPIA obbligatoria?",
    opzioni: [
      { key: 'A', testo: 'Qualsiasi sistema AI che elabora dati testuali' },
      { key: 'B', testo: 'Solo sistemi AI classificati come "inaccettabili" nell\'AI Act' },
      { key: 'C', testo: 'Sistemi AI ad alto rischio che trattano dati personali di larga scala' },
      { key: 'D', testo: 'Tutti i sistemi AI che interagiscono con utenti finali' },
    ],
    corretto: 'C',
  },
  {
    id: 4,
    domanda: 'Entro quando deve avvenire la notifica data breach al Garante?',
    opzioni: [
      { key: 'A', testo: 'Entro 48 ore dalla scoperta' },
      { key: 'B', testo: 'Entro 72 ore dalla scoperta, se possibile' },
      { key: 'C', testo: 'Entro 7 giorni lavorativi dalla scoperta' },
      { key: 'D', testo: 'Immediatamente, entro 24 ore dalla scoperta' },
    ],
    corretto: 'B',
  },
  {
    id: 5,
    domanda: "Quale sistema AI è classificato ad 'alto rischio' nell'AI Act?",
    opzioni: [
      { key: 'A', testo: 'Un chatbot che risponde a domande sul meteo' },
      { key: 'B', testo: 'Un sistema di generazione immagini per uso creativo' },
      { key: 'C', testo: 'Un sistema AI usato per la selezione e valutazione del personale (HR)' },
      { key: 'D', testo: 'Un assistente virtuale per la gestione del calendario' },
    ],
    corretto: 'C',
  },
];

type AnswerState = 'idle' | 'correct' | 'wrong';

export default function AppTrainingQuiz() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showScore, setShowScore] = useState(false);

  const question = QUIZ_QUESTIONS[currentQ];
  const totalQ = QUIZ_QUESTIONS.length;
  const passed = score >= 4;

  const handleConfirm = () => {
    if (!selectedOption || answerState !== 'idle') return;
    const isCorrect = selectedOption === question.corretto;
    setAnswerState(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(s => s + 1);
    setAnswers(prev => ({ ...prev, [currentQ]: selectedOption }));
  };

  const handleNext = () => {
    if (currentQ < totalQ - 1) {
      setCurrentQ(q => q + 1);
      setSelectedOption(null);
      setAnswerState('idle');
    } else {
      setShowScore(true);
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setSelectedOption(null);
    setAnswerState('idle');
    setScore(0);
    setAnswers({});
    setShowScore(false);
  };

  if (showScore) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-6">
        <div className="bg-white border border-[#C8C5BC] rounded-xl p-8 max-w-md w-full text-center">
          {passed ? (
            <>
              <div className="w-16 h-16 bg-[#EAF5EE] rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-[#22A86B]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1a375b] mb-2">Complimenti!</h2>
              <p className="text-gray-600 mb-4">Hai superato il quiz con successo.</p>
              <div className="text-4xl font-bold text-[#22A86B] mb-1">{score}/5</div>
              <p className="text-sm text-gray-500 mb-6">Risposte corrette</p>
              <button
                onClick={() => navigate(`/app/training/courses/${id}/certificate`)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#1a375b] hover:bg-[#185FA5] text-white rounded-lg text-sm font-medium transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Visualizza attestato
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-[#FDEAEA] rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-[#DC2626]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1a375b] mb-2">Punteggio insufficiente</h2>
              <p className="text-gray-600 mb-4">Devi rispondere correttamente ad almeno 4 domande su 5.</p>
              <div className="text-4xl font-bold text-[#DC2626] mb-1">{score}/5</div>
              <p className="text-sm text-gray-500 mb-6">Risposte corrette</p>
              <button
                onClick={handleRetry}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#1a375b] hover:bg-[#185FA5] text-white rounded-lg text-sm font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Riprova il quiz
              </button>
            </>
          )}
          <button
            onClick={() => navigate('/app/training')}
            className="mt-3 w-full px-6 py-2 text-sm text-gray-500 hover:text-[#1a375b] transition-colors"
          >
            Torna ai corsi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-6">
      <div className="bg-white border border-[#C8C5BC] rounded-xl p-8 max-w-xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Quiz finale</p>
            <p className="text-sm font-medium text-[#1a375b]">Domanda {currentQ + 1} di {totalQ}</p>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-medium text-[#22A86B]">
            <CheckCircle2 className="w-4 h-4" />
            Punteggio: {score}/{currentQ}
          </div>
        </div>

        {/* Dot progress */}
        <div className="flex items-center gap-2 mb-6">
          {QUIZ_QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-colors ${
                i < currentQ
                  ? (answers[i] === QUIZ_QUESTIONS[i].corretto ? 'bg-[#22A86B]' : 'bg-[#DC2626]')
                  : i === currentQ
                  ? 'bg-[#185FA5]'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Question */}
        <h2 className="text-lg font-bold text-[#1a375b] mb-5">{question.domanda}</h2>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.opzioni.map(opt => {
            const isSelected = selectedOption === opt.key;
            const isCorrectOpt = opt.key === question.corretto;
            let optStyle = 'border-[#C8C5BC] text-[#1a375b] hover:border-[#185FA5] hover:bg-[#E6F1FB]';

            if (answerState !== 'idle') {
              if (isCorrectOpt) optStyle = 'border-[#22A86B] bg-[#EAF5EE] text-[#1D6B3A]';
              else if (isSelected && !isCorrectOpt) optStyle = 'border-[#DC2626] bg-[#FDEAEA] text-[#8B1A1A]';
              else optStyle = 'border-gray-200 text-gray-400';
            } else if (isSelected) {
              optStyle = 'border-[#185FA5] bg-[#E6F1FB] text-[#1a375b]';
            }

            return (
              <button
                key={opt.key}
                onClick={() => answerState === 'idle' && setSelectedOption(opt.key)}
                disabled={answerState !== 'idle'}
                className={`w-full text-left flex items-start gap-3 p-4 border rounded-lg transition-colors ${optStyle} disabled:cursor-default`}
              >
                <span className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors
                  ${isSelected && answerState === 'idle' ? 'border-[#185FA5] bg-[#185FA5] text-white' : 'border-current bg-transparent'}`}>
                  {opt.key}
                </span>
                <span className="text-sm leading-relaxed">{opt.testo}</span>
                {answerState !== 'idle' && isCorrectOpt && (
                  <CheckCircle2 className="w-5 h-5 text-[#22A86B] flex-shrink-0 ml-auto mt-0.5" />
                )}
                {answerState !== 'idle' && isSelected && !isCorrectOpt && (
                  <XCircle className="w-5 h-5 text-[#DC2626] flex-shrink-0 ml-auto mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {answerState === 'correct' && (
          <div className="flex items-center gap-2 p-3 bg-[#EAF5EE] text-[#1D6B3A] rounded-lg text-sm mb-4">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            Risposta corretta!
          </div>
        )}
        {answerState === 'wrong' && (
          <div className="flex items-center gap-2 p-3 bg-[#FDEAEA] text-[#8B1A1A] rounded-lg text-sm mb-4">
            <XCircle className="w-4 h-4 flex-shrink-0" />
            Risposta errata. La risposta corretta è <strong>{question.corretto}</strong>.
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (currentQ > 0) {
                setCurrentQ(q => q - 1);
                setSelectedOption(answers[currentQ - 1] || null);
                setAnswerState('idle');
              }
            }}
            disabled={currentQ === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 hover:text-[#1a375b] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Domanda precedente
          </button>

          {answerState === 'idle' ? (
            <button
              onClick={handleConfirm}
              disabled={!selectedOption}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1a375b] hover:bg-[#185FA5] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Conferma risposta
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1a375b] hover:bg-[#185FA5] text-white rounded-lg text-sm font-medium transition-colors"
            >
              {currentQ < totalQ - 1 ? 'Prossima domanda' : 'Vedi risultato'}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
