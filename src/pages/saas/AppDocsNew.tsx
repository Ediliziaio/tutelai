import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, FileText, Shield, Lock, Users,
  BookOpen, Scale, Globe, Cpu, ClipboardList,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DocType {
  id: string;
  nome: string;
  descrizione: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DocSection {
  id: string;
  titolo: string;
  icon: React.ComponentType<{ className?: string }>;
  tipi: DocType[];
}

// ─── Document catalogue ───────────────────────────────────────────────────────

const DOC_SECTIONS: DocSection[] = [
  {
    id: 'interni',
    titolo: 'Documenti Interni',
    icon: FileText,
    tipi: [
      { id: 'policy_ai_interno', nome: 'Policy uso AI interno', descrizione: 'Regole per l\'uso responsabile degli strumenti AI da parte dei dipendenti.', icon: FileText },
      { id: 'regolamento_ai', nome: 'Regolamento AI aziendale', descrizione: 'Documento di governance interno che definisce processi e responsabilità AI.', icon: ClipboardList },
      { id: 'informativa_lavoratori', nome: 'Informativa lavoratori', descrizione: 'Informativa ex art. 11 L.132/2025 sull\'uso di AI nel rapporto di lavoro.', icon: Users },
      { id: 'procedura_breach', nome: 'Procedura gestione breach', descrizione: 'Procedura operativa per la gestione di violazioni di dati o incidenti AI.', icon: Shield },
      { id: 'nomina_ai_officer', nome: 'Nomina AI Officer', descrizione: 'Atto formale di nomina del responsabile AI aziendale.', icon: Users },
      { id: 'procedura_dpia', nome: 'Procedura DPIA', descrizione: 'Procedura standard per condurre valutazioni d\'impatto sulla protezione dei dati.', icon: ClipboardList },
    ],
  },
  {
    id: 'contrattuali',
    titolo: 'Documenti Contrattuali',
    icon: Scale,
    tipi: [
      { id: 'clausole_cliente', nome: 'Clausole AI per clienti', descrizione: 'Clausole standard da inserire nei contratti con i clienti sull\'uso di AI.', icon: Scale },
      { id: 'clausole_fornitore', nome: 'Clausole AI per fornitori', descrizione: 'Clausole da includere nei contratti con i fornitori di sistemi AI.', icon: Lock },
      { id: 'contratto_saas', nome: 'Contratto SaaS AI', descrizione: 'Template di contratto per l\'erogazione di servizi AI in modalità SaaS.', icon: Cpu },
      { id: 'nda_ai', nome: 'NDA specifico AI', descrizione: 'Accordo di riservatezza adattato per progetti e soluzioni AI.', icon: Lock },
      { id: 'tc_sito', nome: 'Termini e condizioni sito', descrizione: 'T&C aggiornati con le disposizioni sull\'uso di AI nel sito web.', icon: Globe },
      { id: 'addendum_ai', nome: 'Addendum AI a contratto esistente', descrizione: 'Modifica contrattuale per integrare disposizioni AI in accordi già firmati.', icon: FileText },
    ],
  },
  {
    id: 'gdpr',
    titolo: 'Documenti GDPR',
    icon: Shield,
    tipi: [
      { id: 'registro_trattamenti', nome: 'Registro trattamenti GDPR', descrizione: 'Registro delle attività di trattamento dati con riferimento ai sistemi AI.', icon: ClipboardList },
      { id: 'informativa_privacy_ai', nome: 'Informativa privacy AI', descrizione: 'Informativa artt. 13-14 GDPR aggiornata con i trattamenti AI.', icon: FileText },
      { id: 'dpia', nome: 'DPIA — Valutazione d\'impatto', descrizione: 'Valutazione d\'impatto sulla protezione dei dati per sistemi AI ad alto rischio.', icon: Shield },
      { id: 'nomina_dpo', nome: 'Nomina DPO', descrizione: 'Lettera formale di nomina del Data Protection Officer.', icon: Users },
      { id: 'consenso_ai', nome: 'Modulo consenso AI', descrizione: 'Modulo per raccogliere il consenso al trattamento dati con AI.', icon: ClipboardList },
      { id: 'notifica_breach', nome: 'Notifica breach al Garante', descrizione: 'Template di notifica di violazione dati all\'autorità di controllo entro 72h.', icon: Shield },
    ],
  },
  {
    id: 'trasparenza',
    titolo: 'Trasparenza AI',
    icon: Globe,
    tipi: [
      { id: 'disclaimer_sito', nome: 'Disclaimer AI per sito web', descrizione: 'Banner o testo visibile che informa i visitatori sull\'uso di AI nel sito.', icon: Globe },
      { id: 'script_disclosure', nome: 'Script disclosure voice agent', descrizione: 'Testo da leggere all\'utente all\'avvio di una chiamata con agente AI vocale.', icon: FileText },
      { id: 'etichetta_contenuto', nome: 'Etichetta contenuto AI-generated', descrizione: 'Label standardizzata per marcare contenuti generati da AI.', icon: FileText },
      { id: 'informativa_chatbot', nome: 'Informativa utente chatbot', descrizione: 'Testo informativo da mostrare agli utenti che interagiscono con un chatbot AI.', icon: Cpu },
    ],
  },
  {
    id: 'formazione',
    titolo: 'Formazione',
    icon: BookOpen,
    tipi: [
      { id: 'attestato_ai_literacy', nome: 'Attestato AI Literacy', descrizione: 'Certificato di completamento del corso di formazione AI Literacy obbligatorio.', icon: BookOpen },
      { id: 'registro_corsi', nome: 'Registro corsi aziendali', descrizione: 'Registro interno dei corsi di formazione AI erogati ai dipendenti.', icon: ClipboardList },
    ],
  },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function AppDocsNew() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  const selectedDoc = DOC_SECTIONS.flatMap((s) => s.tipi).find((t) => t.id === selected);

  const handleAvanti = () => {
    if (!selected) return;
    // Navigate to configure step (mock: redirect to docs list)
    navigate('/app/docs');
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-6">
        <Link to="/app/docs" className="inline-flex items-center gap-1.5 text-sm text-[#185FA5] hover:underline mb-3">
          <ArrowLeft className="h-4 w-4" />
          Doc Generator
        </Link>
        <h1 className="text-2xl font-bold text-[#1a375b]">Genera nuovo documento</h1>
        <p className="text-sm text-slate-500 mt-0.5">Seleziona il tipo di documento da generare</p>
      </div>

      {/* ── Sections ── */}
      <div className="space-y-8 pb-32">
        {DOC_SECTIONS.map((section) => {
          const SectionIcon = section.icon;
          return (
            <div key={section.id}>
              <div className="flex items-center gap-2 mb-4">
                <SectionIcon className="h-4 w-4 text-[#185FA5]" />
                <h2 className="text-sm font-semibold text-[#1a375b] uppercase tracking-wide">{section.titolo}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {section.tipi.map((tipo) => {
                  const Icon = tipo.icon;
                  const isSelected = selected === tipo.id;
                  return (
                    <button
                      key={tipo.id}
                      onClick={() => setSelected(isSelected ? null : tipo.id)}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-[#185FA5] bg-[#E6F1FB] shadow-sm'
                          : 'border-[#C8C5BC] bg-white hover:border-[#185FA5]/50 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#185FA5]' : 'bg-slate-100'}`}>
                          <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                        </div>
                        <div>
                          <p className={`text-sm font-semibold mb-0.5 ${isSelected ? 'text-[#1a375b]' : 'text-slate-800'}`}>{tipo.nome}</p>
                          <p className="text-xs text-slate-500 leading-relaxed">{tipo.descrizione}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Sticky footer ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#C8C5BC] px-6 py-4 flex items-center justify-between z-30">
        <div className="text-sm text-slate-500">
          {selectedDoc ? (
            <span>Selezionato: <strong className="text-[#1a375b]">{selectedDoc.nome}</strong></span>
          ) : (
            'Seleziona un tipo di documento per continuare'
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/app/docs"
            className="border border-[#C8C5BC] hover:bg-gray-50 text-[#1a375b] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Annulla
          </Link>
          <button
            onClick={handleAvanti}
            disabled={!selected}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
              selected
                ? 'bg-[#1a375b] hover:bg-[#185FA5] text-white'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            Avanti{selectedDoc ? ` con ${selectedDoc.nome}` : ''}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
