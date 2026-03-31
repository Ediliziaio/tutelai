import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Sparkles, ChevronRight, AlertCircle, RotateCcw, Copy, Check } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Source {
  label: string;
  ref: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  timestamp: Date;
  typing?: boolean;
}

// ─── Knowledge base (mock legal responses) ───────────────────────────────────

interface KBEntry {
  triggers: string[];
  response: string;
  sources: Source[];
}

const KNOWLEDGE_BASE: KBEntry[] = [
  {
    triggers: ['ai act', 'che cos\'è', 'cos\'è', 'regolamento ai', 'reg. 2024', 'regolamento europeo'],
    response: `**L'AI Act (Reg. UE 2024/1689)** è il primo quadro normativo completo sull'intelligenza artificiale al mondo, in vigore dal **1° agosto 2024**.

Struttura in base al **rischio dei sistemi AI**:

• **Rischio inaccettabile** → Divieto assoluto (es. social scoring, manipolazione subliminale)
• **Alto rischio** → Obblighi stringenti prima della messa in commercio (es. AI in HR, credito, infrastrutture critiche)
• **Rischio limitato** → Solo obblighi di trasparenza (es. chatbot, deepfake)
• **Rischio minimo** → Nessun obbligo specifico (es. filtri spam, AI nei videogiochi)

**Sanzioni**: fino a €35M o 7% del fatturato globale per violazioni gravi.

Le principali scadenze per le PMI italiane sono **febbraio 2025** (AI Literacy + divieti) e **agosto 2026** (sistemi ad alto rischio).`,
    sources: [
      { label: 'Reg. UE 2024/1689', ref: 'Art. 1-5' },
      { label: 'Classificazione rischio', ref: 'Artt. 6-7 + Allegato III' },
    ],
  },
  {
    triggers: ['alto rischio', 'high risk', 'allegato iii', 'sistema hr', 'hibob', 'rischio alto'],
    response: `I **sistemi AI ad alto rischio** sono elencati nell'**Allegato III** del AI Act e includono:

**Categorie rilevanti per le PMI:**
1. Sistemi AI in **gestione delle risorse umane** (selezione, promozione, valutazione prestazioni)
2. Sistemi di **credit scoring** e valutazione creditizia
3. Sistemi usati in **infrastrutture critiche**
4. Sistemi di **sicurezza nei prodotti** coperti da direttive UE

**Obblighi per i sistemi ad alto rischio (Artt. 9-15):**
• Sistema di gestione del rischio documentato e continuo
• Governance dei dati di addestramento
• Documentazione tecnica completa
• Logging e monitoraggio automatico
• Trasparenza verso gli utenti
• Supervisione umana definita
• Accuratezza, robustezza e cybersecurity certificate

La scadenza è il **2 agosto 2026**. Per HiBob HR AI nella vostra azienda, è obbligatoria la DPIA e la classificazione come alto rischio.`,
    sources: [
      { label: 'Allegato III AI Act', ref: 'Reg. UE 2024/1689' },
      { label: 'Obblighi alto rischio', ref: 'Artt. 9-15 Reg. 2024/1689' },
    ],
  },
  {
    triggers: ['ai literacy', 'formazione', 'art. 4', 'competenza', 'dipendenti', 'personale'],
    response: `L'**Art. 4 dell'AI Act** impone un obbligo di **AI Literacy** per tutto il personale che utilizza o supervisiona sistemi AI.

**Chi è obbligato:**
• I fornitori di sistemi AI devono garantire la formazione del proprio team
• I deployer (le aziende che usano AI) devono assicurare che il personale abbia le competenze necessarie

**Contenuto minimo della formazione:**
• Comprensione dei fondamentali dei sistemi AI in uso
• Consapevolezza dei rischi e limitazioni
• Conoscenza dei diritti delle persone coinvolte
• Procedure di supervisione umana

**Scadenza:** era il **2 febbraio 2025** — obbligo già in vigore.

⚠️ **Stato attuale:** Nella vostra azienda, **Marco Bianchi e Luca Verdi** non hanno ancora completato il corso obbligatorio. Questo costituisce una violazione attiva dell'Art. 4. Sollecitare il completamento entro il **2 aprile 2026**.`,
    sources: [
      { label: 'AI Literacy', ref: 'Art. 4 Reg. UE 2024/1689' },
      { label: 'Obblighi deployer', ref: 'Art. 26 Reg. UE 2024/1689' },
    ],
  },
  {
    triggers: ['dpia', 'valutazione impatto', 'data protection impact', 'privacy impact'],
    response: `La **DPIA (Data Protection Impact Assessment)** ex **Art. 35 GDPR** è obbligatoria quando il trattamento dati è "suscettibile di presentare un rischio elevato per i diritti e le libertà".

**Quando è obbligatoria con i sistemi AI:**
• Sistemi AI che effettuano **profilazione sistematica** delle persone
• Trattamento su **larga scala** di dati sensibili o categorie speciali
• Sistemi che prendono **decisioni automatizzate** con effetti significativi
• Sistemi AI classificati **alto rischio** ai sensi dell'AI Act (combinazione con Art. 10 AI Act)

**Processo DPIA (minimo):**
1. Descrizione del trattamento e delle finalità
2. Valutazione della necessità e proporzionalità
3. Analisi dei rischi per i diritti degli interessati
4. Misure per affrontare i rischi
5. Consultazione preventiva del DPO (se nominato)

**Per la vostra azienda:** La DPIA su **HiBob HR AI** non è ancora stata avviata. È un sistema HR AI che valuta e profila dipendenti → alto rischio GDPR + alto rischio AI Act. **Scadenza consigliata: 15 aprile 2026** per rispettare la timeline di conformità.`,
    sources: [
      { label: 'DPIA', ref: 'Art. 35 Reg. 2016/679 (GDPR)' },
      { label: 'Governance dati AI', ref: 'Art. 10 Reg. 2024/1689' },
    ],
  },
  {
    triggers: ['disclosure', 'trasparenza', 'chatbot', 'voice agent', 'twilio', 'art. 50', 'robot', 'deepfake'],
    response: `L'**Art. 50 dell'AI Act** impone obblighi di **trasparenza** per determinati sistemi AI interattivi.

**Obblighi di disclosure:**

1. **Sistemi AI interattivi** (chatbot, voice bot): devono informare l'utente che sta interagendo con un'AI, **a meno che** ciò sia ovvio per un utente ragionevole
2. **Contenuti generati dall'AI**: devono essere marcati come tali (deepfake, testi sintetici)
3. **Sistemi di riconoscimento emozioni**: obbligo di disclosure verso le persone interessate

**Requisiti minimi dello script di disclosure:**

> *"Stai interagendo con un sistema di intelligenza artificiale automatizzato. Per parlare con un operatore umano, puoi [istruzione alternativa]."*

⚠️ **Voice Agent Twilio:** nella vostra azienda manca ancora lo script di disclosure all'inizio delle chiamate. Questa è una **violazione dell'Art. 50 AI Act** — la scadenza per correggere è **1 maggio 2026**, ma l'obbligo è già teoricamente in vigore.

Sanzione per violazione disclosure: fino a **€15 milioni o 3% del fatturato**.`,
    sources: [
      { label: 'Trasparenza AI', ref: 'Art. 50 Reg. 2024/1689' },
      { label: 'Sanzioni', ref: 'Art. 99 Reg. 2024/1689' },
    ],
  },
  {
    triggers: ['gpai', 'modelli generali', 'gpt', 'claude', 'gemini', 'llm', 'modello linguistico', 'openai'],
    response: `I **modelli GPAI (General Purpose AI)** sono disciplinati dal **Titolo III, Capo 5** del AI Act (Artt. 51-56), con obblighi in vigore dal **2 agosto 2025**.

**Chi sono i "fornitori" GPAI:**
• OpenAI (GPT-4, GPT-4o), Anthropic (Claude), Google (Gemini), Meta (Llama), ecc.

**Cosa devono fare i fornitori GPAI:**
• Documentazione tecnica e test approfonditi
• Politica di rispetto del diritto d'autore
• Informazioni per i deployer

**Cosa devono fare le aziende che li INTEGRANO (deployer):**

✅ Verificare che il fornitore GPAI rispetti gli obblighi AI Act
✅ Aggiornare i contratti con clausole AI Act (DPA + responsabilità)
✅ Informare gli utenti finali sull'uso di AI generativa
✅ Non usare i modelli per scopi vietati dall'Art. 5

**Per la vostra azienda:** I contratti con **OpenAI** necessitano di aggiornamento con le clausole GPAI. Scadenza consigliata: **10 aprile 2026**.`,
    sources: [
      { label: 'Modelli GPAI', ref: 'Artt. 51-56 Reg. 2024/1689' },
      { label: 'Obblighi deployer', ref: 'Art. 25-26 Reg. 2024/1689' },
    ],
  },
  {
    triggers: ['l. 132', 'legge 132', '132/2025', 'lavoro', 'lavoratori', 'ai officer', 'sindacale'],
    response: `La **Legge italiana 132/2025** disciplina l'uso dell'AI nei rapporti di lavoro, in vigore dal **15 aprile 2025**.

**Principali obblighi:**

**1. Informativa ai lavoratori (Art. 11)**
Prima di introdurre sistemi AI che incidono sul lavoro (monitoraggio, valutazione, decisioni HR), obbligo di:
• Informativa scritta individuale
• Consultazione con rappresentanze sindacali (RSU/RSA)
• Termine di 30 giorni per l'esame sindacale

**2. AI Officer (Art. 8)**
Ogni azienda con più di 50 dipendenti o che usa AI in processi decisionali deve nominare un **AI Officer** responsabile della conformità interna.
La vostra azienda ha già adempiuto a questo obbligo ✅

**3. Relazione annuale (Art. 8)**
L'AI Officer deve redigere una relazione annuale sullo stato dell'AI aziendale. Prima scadenza: **15 ottobre 2025** (già adempiuta ✅).

**4. Divieti assoluti**
• Vietato l'uso di AI per decisioni disciplinari automatizzate senza supervisione umana
• Vietata la profilazione "psicologica" dei lavoratori senza consenso esplicito`,
    sources: [
      { label: 'L. 132/2025', ref: 'Artt. 8, 11, 14' },
      { label: 'AI Officer', ref: 'Art. 8 L. 132/2025' },
    ],
  },
  {
    triggers: ['gdpr', 'privacy', 'art. 30', 'registro trattamenti', 'dpo', 'trattamento dati'],
    response: `Il **GDPR (Reg. UE 2016/679)** si interseca in modo rilevante con l'AI Act quando i sistemi AI trattano dati personali.

**Principali intersezioni GDPR + AI:**

**Art. 22 GDPR — Decisioni automatizzate**
Le persone hanno il diritto di **non essere soggette a decisioni basate esclusivamente su trattamento automatizzato** che producono effetti giuridici significativi. I sistemi AI di credit scoring, HR AI, ecc. devono prevedere un meccanismo di revisione umana.

**Art. 30 GDPR — Registro dei trattamenti**
Ogni sistema AI che tratta dati personali deve essere censito nel Registro. ⚠️ **Il vostro registro non è stato aggiornato da oltre 45 giorni** — Voice Agent Twilio e Tidio Chatbot non risultano censiti.

**Art. 35 GDPR — DPIA**
Obbligatoria per HiBob HR AI (vedi risposta dedicata).

**Art. 28 GDPR — Responsabile del trattamento**
Ogni fornitore AI che tratta dati per vostro conto deve avere un DPA firmato. **Mancante con un fornitore.**

**Priorità immediata:** Aggiornare il Registro ex Art. 30 entro il **1 aprile 2026**.`,
    sources: [
      { label: 'Registro trattamenti', ref: 'Art. 30 Reg. 2016/679' },
      { label: 'Decisioni automatizzate', ref: 'Art. 22 Reg. 2016/679' },
      { label: 'DPA fornitori', ref: 'Art. 28 Reg. 2016/679' },
    ],
  },
  {
    triggers: ['sanzioni', 'multa', 'sanzione', 'penale', 'pena', 'rischio economico'],
    response: `Il regime sanzionatorio dell'**AI Act (Art. 99)** è strutturato su tre livelli:

**Livello 1 — Violazioni gravissime** (Art. 5 — pratiche vietate):
→ Fino a **€35.000.000** o **7% del fatturato mondiale annuo** (il maggiore)

**Livello 2 — Violazioni gravi** (non conformità sistemi alto rischio, obblighi GPAI):
→ Fino a **€15.000.000** o **3% del fatturato mondiale annuo**

**Livello 3 — Informazioni errate** (fornire dati falsi ad autorità):
→ Fino a **€7.500.000** o **1% del fatturato mondiale annuo**

**Per le PMI:** le sanzioni tengono conto delle dimensioni aziendali. Le autorità nazionali hanno discrezionalità, ma **non c'è un "regime agevolato" formale** per le piccole imprese.

**Autorità competente in Italia:**
L'Autorità AI nazionale non è ancora stata designata formalmente. Si prevede un ruolo centrale di **AGID** e **Garante Privacy** per le violazioni con dati personali.

**GDPR (Art. 83):** sanzioni fino a €20M o 4% del fatturato per violazioni gravi (es. assenza di DPIA, violazione Art. 22).`,
    sources: [
      { label: 'Regime sanzionatorio AI Act', ref: 'Art. 99 Reg. 2024/1689' },
      { label: 'Sanzioni GDPR', ref: 'Art. 83 Reg. 2016/679' },
    ],
  },
  {
    triggers: ['scadenza', 'timeline', 'quando', 'data', 'entrata in vigore', 'obblighi'],
    response: `**Timeline completa degli obblighi AI Act per le PMI italiane:**

📅 **1 agosto 2024** — AI Act in vigore (Reg. UE 2024/1689 pubblicato in GU UE)

📅 **2 febbraio 2025** — *(già in vigore)*
• Divieto assoluto pratiche AI inaccettabili (Art. 5)
• Obbligo AI Literacy per tutto il personale (Art. 4)

📅 **15 aprile 2025** — *(già in vigore)*
• L. 132/2025 italiana in vigore

📅 **2 agosto 2025** — *(già in vigore)*
• Obblighi per fornitori di modelli GPAI (Artt. 51-56)
• Le aziende deployer devono verificare conformità fornitore

📅 **2 agosto 2026** — ⚠️ **SCADENZA CRITICA (tra ${Math.round((new Date(2026, 7, 2).getTime() - new Date().getTime()) / 86400000)} giorni)**
• Piena conformità sistemi AI ad alto rischio (Allegato III)
• Obblighi di logging, DPIA, supervisione umana, documentazione tecnica

📅 **2 agosto 2027**
• Sistemi AI alto rischio preesistenti (immessi sul mercato prima del 2026) devono essere adeguati`,
    sources: [
      { label: 'Disposizioni transitorie', ref: 'Art. 111 Reg. 2024/1689' },
      { label: 'Entrata in vigore', ref: 'Art. 113 Reg. 2024/1689' },
    ],
  },
];

const SUGGESTED_QUESTIONS = [
  'Cos\'è l\'AI Act e cosa cambia per la mia azienda?',
  'Quali sistemi AI sono classificati ad alto rischio?',
  'Quando è obbligatoria la DPIA per un sistema AI?',
  'Quali sono le sanzioni per violazione dell\'AI Act?',
  'Cosa prevede la L. 132/2025 sul lavoro?',
  'Cosa devo fare per i modelli GPAI (ChatGPT, Claude)?',
];

// ─── Mock AI response engine ──────────────────────────────────────────────────

function findResponse(query: string): { response: string; sources: Source[] } {
  const q = query.toLowerCase();
  for (const entry of KNOWLEDGE_BASE) {
    if (entry.triggers.some((t) => q.includes(t))) {
      return { response: entry.response, sources: entry.sources };
    }
  }
  return {
    response: `Grazie per la domanda. Basandomi sulla normativa AI Act (Reg. UE 2024/1689) e GDPR (Reg. 2016/679), posso dirti che questo tema rientra nell'ambito degli obblighi di compliance per le aziende che utilizzano sistemi AI.

Per una risposta precisa su **"${query}"**, ti consiglio di:

1. Verificare la classificazione del sistema AI interessato (Art. 6 + Allegato III AI Act)
2. Consultare le linee guida dell'AI Office europeo (disponibili su artificialintelligenceact.eu)
3. Richiedere una consulenza legale specializzata per casi specifici

Puoi anche provare a riformulare la domanda o scegliere uno degli argomenti suggeriti qui sotto per una risposta più dettagliata.

⚖️ *Ricorda: questa è un'analisi automatizzata a scopo orientativo e non sostituisce un parere legale professionale.*`,
    sources: [
      { label: 'AI Act', ref: 'Reg. UE 2024/1689' },
      { label: 'GDPR', ref: 'Reg. UE 2016/679' },
    ],
  };
}

// ─── Markdown-like renderer (basic bold/bullets) ──────────────────────────────

function RenderContent({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1.5" />;
        // Bold via **text**
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const rendered = parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="font-semibold text-[#1a375b]">{part.slice(2, -2)}</strong>;
          }
          return <span key={j}>{part}</span>;
        });
        if (line.startsWith('• ') || line.startsWith('→ ') || line.startsWith('✅ ') || line.startsWith('⚠️ ') || line.startsWith('⚖️ ') || line.startsWith('📅 ')) {
          return <div key={i} className="flex gap-2 text-sm leading-relaxed"><span className="shrink-0">{line.slice(0, line.startsWith('📅') ? 2 : 2)}</span><span>{rendered.map((r, j) => <span key={j}>{r}</span>)}</span></div>;
        }
        if (line.startsWith('#')) {
          return <div key={i} className="text-sm font-bold text-[#1a375b] mt-1">{rendered}</div>;
        }
        return <div key={i} className="text-sm leading-relaxed text-gray-700">{rendered}</div>;
      })}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AppAILawyer() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Ciao! Sono il tuo **AI Legal Advisor** specializzato in AI Act e GDPR.\n\nPosso aiutarti a:\n• Interpretare gli obblighi normativi del Reg. UE 2024/1689\n• Capire l'impatto del GDPR sui tuoi sistemi AI\n• Analizzare le scadenze e i rischi per la tua azienda\n• Guidarti nel piano di conformità\n\n⚖️ *Le risposte sono a scopo orientativo e si basano sulla normativa vigente. Per decisioni legali specifiche, consulta un professionista.*`,
      sources: [],
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sendMessage = useCallback((text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      const { response, sources } = findResponse(text);
      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: response,
        sources,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, delay);
  }, [isTyping]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleReset = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: `Ciao! Sono il tuo **AI Legal Advisor** specializzato in AI Act e GDPR.\n\nPosso aiutarti a:\n• Interpretare gli obblighi normativi del Reg. UE 2024/1689\n• Capire l'impatto del GDPR sui tuoi sistemi AI\n• Analizzare le scadenze e i rischi per la tua azienda\n• Guidarti nel piano di conformità\n\n⚖️ *Le risposte sono a scopo orientativo e si basano sulla normativa vigente. Per decisioni legali specifiche, consulta un professionista.*`,
      sources: [],
      timestamp: new Date(),
    }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px]">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-[#1a375b] flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[#185FA5]" />
            AI Legal Advisor
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Assistente specializzato in AI Act (Reg. UE 2024/1689) e GDPR
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a375b] border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
        >
          <RotateCcw className="h-4 w-4" /> Nuova chat
        </button>
      </div>

      {/* ── Disclaimer ── */}
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mb-4 shrink-0">
        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-700">
          Le risposte sono generate automaticamente a scopo orientativo sulla base della normativa vigente. Non costituiscono parere legale professionale.
        </p>
      </div>

      {/* ── Chat area ── */}
      <div className="flex flex-1 gap-5 min-h-0">

        {/* Messages */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'assistant' ? 'bg-[#1a375b]' : 'bg-[#185FA5]'
                }`}>
                  {msg.role === 'assistant'
                    ? <Bot className="h-4 w-4 text-white" />
                    : <User className="h-4 w-4 text-white" />
                  }
                </div>

                {/* Bubble */}
                <div className={`max-w-[85%] group ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className={`rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-[#185FA5] text-white rounded-tr-sm'
                      : 'bg-white border border-gray-200 rounded-tl-sm'
                  }`}>
                    {msg.role === 'user'
                      ? <p className="text-sm">{msg.content}</p>
                      : <RenderContent text={msg.content} />
                    }
                  </div>

                  {/* Sources */}
                  {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 px-1">
                      {msg.sources.map((s, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-[10px] font-medium text-[#185FA5] bg-[#E6F1FB] border border-blue-200 rounded-full px-2 py-0.5">
                          📋 {s.label} — {s.ref}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Copy button */}
                  {msg.role === 'assistant' && msg.id !== 'welcome' && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 px-1 transition-all"
                    >
                      {copiedId === msg.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      {copiedId === msg.id ? 'Copiato' : 'Copia'}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-[#1a375b] flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1 items-center">
                    <span className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="mt-3 shrink-0">
            <div className="flex gap-2 items-end bg-white border border-gray-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-[#1a375b]/20 focus-within:border-[#1a375b] transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Chiedi qualcosa su AI Act, GDPR, obblighi di compliance..."
                className="flex-1 resize-none text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent min-h-[40px] max-h-[120px] py-2 px-2"
                rows={1}
                disabled={isTyping}
                style={{ height: 'auto' }}
                onInput={(e) => {
                  const t = e.target as HTMLTextAreaElement;
                  t.style.height = 'auto';
                  t.style.height = Math.min(t.scrollHeight, 120) + 'px';
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                className="h-9 w-9 flex items-center justify-center rounded-lg bg-[#1a375b] hover:bg-[#185FA5] text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-right mt-1 pr-1">Invio per inviare · Shift+Invio per andare a capo</p>
          </div>
        </div>

        {/* ── Sidebar: suggested questions ── */}
        <div className="hidden lg:flex flex-col w-64 shrink-0 gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex-1 overflow-y-auto">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Domande frequenti</h3>
            <div className="space-y-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={isTyping}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-xs text-gray-700 hover:bg-[#E6F1FB] hover:text-[#185FA5] transition-colors border border-gray-100 hover:border-blue-200 flex items-start gap-2 disabled:opacity-50"
                >
                  <ChevronRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-gray-300" />
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Context card */}
          <div className="bg-[#E6F1FB] border border-blue-200 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-[#1a375b] mb-2">📚 Fonti normative</h3>
            <div className="space-y-1.5 text-[11px] text-gray-600">
              <div>🇪🇺 Reg. UE 2024/1689 (AI Act)</div>
              <div>🇪🇺 Reg. UE 2016/679 (GDPR)</div>
              <div>🇮🇹 L. 132/2025 (AI + lavoro)</div>
              <div>🏛️ Linee guida AI Office UE</div>
              <div>🏛️ Provvedimenti Garante Privacy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
