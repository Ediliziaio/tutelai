import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Download, History, Bold, Italic, Underline,
  Heading1, Heading2, Heading3, List, ListOrdered, Link2,
  ChevronRight, ChevronLeft, RefreshCw, MessageSquare, Send,
  PenLine, AlertTriangle, Sparkles,
} from 'lucide-react';
import { mockDocumenti } from '@/data/tutelaiMockData';
import type { StatoDocumento } from '@/types/saas';

// ─── Config ───────────────────────────────────────────────────────────────────

const STATO_CFG: Record<StatoDocumento, { label: string; badge: string }> = {
  bozza:        { label: 'Bozza',       badge: 'bg-gray-100 text-gray-600 border border-gray-200' },
  in_revisione: { label: 'In revisione', badge: 'bg-[#FDF3E3] text-[#854F0B] border border-amber-200' },
  approvato:    { label: 'Approvato',   badge: 'bg-[#E6F1FB] text-[#185FA5] border border-blue-200' },
  firmato:      { label: 'Firmato',     badge: 'bg-[#EAF5EE] text-[#1D6B3A] border border-green-200' },
  archiviato:   { label: 'Archiviato', badge: 'bg-slate-100 text-slate-500 border border-slate-200' },
};

const WORKFLOW: StatoDocumento[] = ['bozza', 'in_revisione', 'approvato', 'firmato'];

// ─── Mock AI-generated content ────────────────────────────────────────────────

const MOCK_CONTENT = `# Policy Uso AI Interno — AEDIX S.r.l.

**Versione 1.0 | Approvata dal: Florin Andriciuc | Data: 25/03/2025**

---

## 1. Premessa e ambito di applicazione

La presente Policy disciplina l'utilizzo degli strumenti di intelligenza artificiale (di seguito "AI") da parte di tutti i dipendenti, collaboratori e consulenti di AEDIX S.r.l. (di seguito "Azienda"), in conformità con il Regolamento UE 2024/1689 (AI Act), il Regolamento UE 2016/679 (GDPR) e la Legge 132/2025.

La Policy si applica a qualsiasi sistema AI adottato o utilizzato nell'ambito dell'attività lavorativa, inclusi strumenti di generazione testi, analisi dati, automazione e assistenza clienti.

---

## 2. Definizioni

- **Sistema AI**: qualsiasi sistema che, sulla base di un insieme di obiettivi, genera output quali previsioni, raccomandazioni, decisioni o contenuti che influenzano ambienti reali o virtuali (art. 3 AI Act).
- **Utente AI**: qualsiasi persona che utilizza un sistema AI nell'ambito delle proprie mansioni lavorative.
- **Responsabile AI**: la persona designata dall'Azienda per supervisionare l'adozione e il corretto utilizzo dei sistemi AI.

---

## 3. Obblighi degli utenti

Ogni dipendente che utilizzi sistemi AI è tenuto a:

1. **Verificare sempre** l'output generato dall'AI prima di utilizzarlo, modificarlo o distribuirlo;
2. **Non inserire** dati personali, informazioni confidenziali o segreti aziendali in sistemi AI non approvati;
3. **Dichiarare** quando un contenuto è stato generato o assistito da AI, nei casi previsti dalla normativa o dalle istruzioni aziendali;
4. **Segnalare immediatamente** al Responsabile AI qualsiasi anomalia, errore sistemico o output inappropriato riscontrato.

---

## 4. Sistemi AI approvati

L'Azienda mantiene un registro aggiornato dei sistemi AI autorizzati all'uso interno (AI Registry). Ogni utilizzo di sistemi AI non presenti nel registro deve essere preventivamente autorizzato dal Responsabile AI.

---

## 5. Protezione dei dati personali

Il trattamento di dati personali mediante sistemi AI deve rispettare le disposizioni del GDPR. In particolare:

- I sistemi AI che trattano dati personali devono essere valutati mediante **DPIA** (Valutazione d'Impatto sulla Protezione dei Dati) prima dell'adozione;
- Gli utenti non devono inserire in sistemi AI dati appartenenti a categorie particolari (dati sanitari, dati biometrici, dati giudiziari);
- È vietato l'uso di dati personali per addestrare modelli AI esterni senza l'esplicito consenso degli interessati.

---

## 6. Responsabilità e sanzioni

Le violazioni della presente Policy potranno comportare provvedimenti disciplinari ai sensi del CCNL applicabile e della normativa vigente, fino alla risoluzione del rapporto di lavoro nei casi di violazione grave.

---

## 7. Aggiornamenti

La presente Policy viene aggiornata almeno annualmente o in seguito a rilevanti modifiche normative o tecnologiche. L'ultima versione è sempre disponibile sul portale aziendale.

---

*Documento generato da TutelAI — Piattaforma di compliance AI per PMI italiane*`;

// ─── Toolbar button ────────────────────────────────────────────────────────────

const ToolbarBtn = ({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) => (
  <button
    title={label}
    className="p-1.5 rounded hover:bg-slate-100 text-slate-600 transition-colors"
  >
    <Icon className="h-4 w-4" />
  </button>
);

// ─── Main component ───────────────────────────────────────────────────────────

export default function AppDocsEdit() {
  const { id } = useParams<{ id: string }>();
  const [panelOpen, setPanelOpen] = useState(true);
  const [content, setContent] = useState(MOCK_CONTENT);

  const doc = mockDocumenti.find((d) => d.id === id);

  if (!doc) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Documento non trovato</h2>
        <p className="text-sm text-slate-500 mb-6">L'ID fornito non corrisponde a nessun documento.</p>
        <Link
          to="/app/docs"
          className="bg-[#1a375b] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Torna ai documenti
        </Link>
      </div>
    );
  }

  const cfg = STATO_CFG[doc.stato];
  const workflowIdx = WORKFLOW.indexOf(doc.stato as StatoDocumento);

  return (
    <div className="-mx-6 -my-6 flex flex-col h-[calc(100vh-64px)]">
      {/* ── Top header ── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#C8C5BC] bg-white shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/app/docs" className="inline-flex items-center gap-1 text-sm text-[#185FA5] hover:underline shrink-0">
            <ArrowLeft className="h-4 w-4" /> Documenti
          </Link>
          <span className="text-slate-300">|</span>
          <span className="font-semibold text-[#1a375b] text-sm truncate">{doc.titolo}</span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.badge} shrink-0`}>
            {cfg.label}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="border border-[#C8C5BC] hover:bg-gray-50 text-[#1a375b] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors">
            <History className="h-3.5 w-3.5" /> Cronologia versioni
          </button>
          <button className="border border-[#C8C5BC] hover:bg-gray-50 text-[#1a375b] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors">
            <Download className="h-3.5 w-3.5" /> Esporta .docx
          </button>
        </div>
      </div>

      {/* ── Workflow strip ── */}
      <div className="flex items-center gap-0 px-6 py-2 bg-slate-50 border-b border-[#C8C5BC] shrink-0 overflow-x-auto">
        {WORKFLOW.map((step, i) => {
          const stepCfg = STATO_CFG[step];
          const isActive = step === doc.stato;
          const isDone = i < workflowIdx;
          return (
            <div key={step} className="flex items-center">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                isActive ? cfg.badge : isDone ? 'text-[#1D6B3A] bg-[#EAF5EE]' : 'text-slate-400 bg-transparent'
              }`}>
                {isDone && <span className="text-xs">✓</span>}
                {stepCfg.label}
              </div>
              {i < WORKFLOW.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-slate-300 mx-1 shrink-0" />}
            </div>
          );
        })}
      </div>

      {/* ── Main body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center gap-0.5 px-4 py-2 border-b border-[#C8C5BC] bg-white shrink-0 overflow-x-auto">
            <ToolbarBtn icon={Bold} label="Grassetto" />
            <ToolbarBtn icon={Italic} label="Corsivo" />
            <ToolbarBtn icon={Underline} label="Sottolineato" />
            <span className="w-px h-5 bg-[#C8C5BC] mx-1.5" />
            <ToolbarBtn icon={Heading1} label="Titolo 1" />
            <ToolbarBtn icon={Heading2} label="Titolo 2" />
            <ToolbarBtn icon={Heading3} label="Titolo 3" />
            <span className="w-px h-5 bg-[#C8C5BC] mx-1.5" />
            <ToolbarBtn icon={List} label="Elenco puntato" />
            <ToolbarBtn icon={ListOrdered} label="Elenco numerato" />
            <span className="w-px h-5 bg-[#C8C5BC] mx-1.5" />
            <ToolbarBtn icon={Link2} label="Inserisci link" />
            <div className="ml-auto flex items-center gap-1">
              <span className="text-xs text-slate-400">v{doc.versione}</span>
            </div>
          </div>

          {/* Document body */}
          <div className="flex-1 overflow-auto bg-slate-100 p-6">
            <div className="max-w-3xl mx-auto">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[600px] bg-white rounded-xl border border-[#C8C5BC] shadow-sm p-8 text-sm text-slate-800 font-mono leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30 focus:border-[#185FA5] transition-colors"
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className={`border-l border-[#C8C5BC] bg-white flex flex-col transition-all duration-300 ${panelOpen ? 'w-72' : 'w-10'} shrink-0`}>
          {/* Panel toggle */}
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className="flex items-center justify-center h-10 border-b border-[#C8C5BC] hover:bg-slate-50 text-slate-500 transition-colors shrink-0"
            title={panelOpen ? 'Chiudi pannello' : 'Apri pannello'}
          >
            {panelOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          {panelOpen && (
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* AI suggestions */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-[#185FA5]" />
                  <h3 className="text-xs font-semibold text-[#1a375b] uppercase tracking-wide">Suggerimenti AI</h3>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      titolo: 'Aggiungi riferimento normativo',
                      testo: 'La sezione 3 dovrebbe citare esplicitamente l\'art. 4 AI Act (obblighi di AI literacy).',
                    },
                    {
                      titolo: 'Aggiorna data di revisione',
                      testo: 'La policy dovrebbe indicare una scadenza per la revisione annuale (es. 31/12/2026).',
                    },
                    {
                      titolo: 'Aggiungi clausola di esonero',
                      testo: 'Includere una clausola che precisi le responsabilità dell\'utente in caso di uso improprio.',
                    },
                  ].map((s, i) => (
                    <div key={i} className="p-3 rounded-lg bg-[#E6F1FB] border border-blue-200">
                      <p className="text-xs font-semibold text-[#185FA5] mb-1">{s.titolo}</p>
                      <p className="text-xs text-slate-600">{s.testo}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <PenLine className="h-4 w-4 text-[#185FA5]" />
                  <h3 className="text-xs font-semibold text-[#1a375b] uppercase tracking-wide">Azioni</h3>
                </div>
                <div className="space-y-2">
                  {doc.stato === 'bozza' && (
                    <button className="w-full bg-[#1a375b] hover:bg-[#185FA5] text-white px-4 py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors">
                      <Send className="h-3.5 w-3.5" /> Invia in revisione
                    </button>
                  )}
                  {doc.stato === 'approvato' && (
                    <button className="w-full bg-[#1D6B3A] hover:bg-green-700 text-white px-4 py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors">
                      <PenLine className="h-3.5 w-3.5" /> Richiedi firma
                    </button>
                  )}
                  <button className="w-full border border-[#C8C5BC] hover:bg-slate-50 text-[#1a375b] px-4 py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors">
                    <RefreshCw className="h-3.5 w-3.5" /> Rigenera sezione
                  </button>
                  <button className="w-full border border-[#C8C5BC] hover:bg-slate-50 text-[#1a375b] px-4 py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors">
                    <MessageSquare className="h-3.5 w-3.5" /> Aggiungi nota
                  </button>
                </div>
              </div>

              {/* Metadata */}
              <div className="pt-2 border-t border-[#C8C5BC]">
                <dl className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Versione</dt>
                    <dd className="font-medium text-slate-700">v{doc.versione}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Creato</dt>
                    <dd className="font-medium text-slate-700">{new Date(doc.created_at).toLocaleDateString('it-IT')}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Aggiornato</dt>
                    <dd className="font-medium text-slate-700">{new Date(doc.updated_at).toLocaleDateString('it-IT')}</dd>
                  </div>
                  {doc.firmato_da && (
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Firmato da</dt>
                      <dd className="font-medium text-slate-700">{doc.firmato_da}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
