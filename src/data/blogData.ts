// ── TIPI ──────────────────────────────────────────────────────────────────────

export type BlogSection =
  | { type: "h2"; content: string }
  | { type: "h3"; content: string }
  | { type: "paragraph"; content: string }
  | { type: "list"; items: string[] }
  | { type: "blockquote"; content: string }
  | { type: "cta"; text: string; href: string };

export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  readingTime: number;
  coverImage?: string;
  content: BlogSection[];
  tags: string[];
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
}

// ── CATEGORIE ─────────────────────────────────────────────────────────────────

export const blogCategories = [
  "Tutti",
  "AI Act",
  "Legge 132/2025",
  "DPO & AI Officer",
  "Compliance pratica",
  "Sanzioni",
  "Settori",
];

// ── ARTICOLI ──────────────────────────────────────────────────────────────────

export const blogArticles: BlogArticle[] = [
  // ── ARTICOLO 1 ────────────────────────────────────────────────────────────
  {
    slug: "ai-act-obblighi-pmi-italiane-2026",
    title: "AI Act: cosa devono fare le PMI italiane entro il 2026",
    excerpt:
      "Il mito da sfatare: 'L'AI Act è roba per le grandi aziende.' Sbagliato. E potenzialmente costoso. Ecco cosa devi fare se usi ChatGPT, un chatbot o un voice agent.",
    category: "AI Act",
    author: "Team TutelAI",
    publishedAt: "2026-03-20",
    readingTime: 8,
    tags: ["AI Act", "PMI", "compliance", "2026", "chatbot", "voice agent"],
    seo: {
      metaTitle: "AI Act: obblighi per le PMI italiane entro il 2026 | TutelAI",
      metaDescription:
        "Guida pratica all'AI Act per le PMI italiane. Cosa fare entro agosto 2026, come classificare i tuoi sistemi AI, e i 3 passi minimi per essere a norma.",
    },
    content: [
      {
        type: "paragraph",
        content:
          "Ogni settimana, parlando con imprenditori italiani, sentiamo la stessa cosa: \"Ma io sono una piccola azienda, queste cose non mi riguardano.\" È sbagliato. E potenzialmente costoso.",
      },
      {
        type: "paragraph",
        content:
          "L'AI Act si applica a chiunque utilizzi sistemi AI nell'Unione Europea — sviluppatori e utilizzatori. Sei un deployer se usi ChatGPT per scrivere email, se hai un chatbot sul sito, se il tuo gestionale ti fa raccomandazioni automatiche, se usi un software HR che valuta i candidati.",
      },
      {
        type: "blockquote",
        content:
          "La domanda non è se sei interessato dalla norma. La domanda è: quale livello di obbligo si applica a te?",
      },
      {
        type: "h2",
        content: "La classificazione che conta: il tuo rischio",
      },
      {
        type: "paragraph",
        content:
          "L'AI Act classifica i sistemi AI in 4 livelli di rischio. Quasi tutte le PMI che usano AI ricadono nella categoria \"rischio limitato\" — quella che include chatbot, voice agent, sistemi di interazione con il pubblico.",
      },
      {
        type: "paragraph",
        content:
          "Buone notizie: gli obblighi sono gestibili. Cattive notizie: il termine è agosto 2026 e quasi nessuno ci sta pensando.",
      },
      {
        type: "paragraph",
        content:
          "Gli obblighi per il rischio limitato sono sostanzialmente due: disclosure obbligatoria (l'utente deve sapere che sta interagendo con AI) e documentazione interna. Non è complicato. È questione di farlo.",
      },
      {
        type: "h2",
        content: "Le tre cose che devi fare adesso",
      },
      {
        type: "list",
        items: [
          "Censisci cosa usi: fai l'elenco di tutti i software, SaaS, plugin, automazioni che hanno una componente AI. Sorpresa: ce ne sono più di quanti pensi.",
          "Forma i tuoi dipendenti: l'articolo 4 dell'AI Act impone la formazione AI Literacy per chi usa AI. È già obbligatorio dal 2 febbraio 2025. Servono attestati documentabili.",
          "Prepara la disclosure: se hai un chatbot o un voice agent, prepara gli script e i disclaimer obbligatori. Non aspettare agosto 2026.",
        ],
      },
      {
        type: "h2",
        content: "Le sanzioni che nessuno ti sta dicendo",
      },
      {
        type: "paragraph",
        content:
          "Le sanzioni per violazioni degli obblighi principali dell'AI Act arrivano fino a €15 milioni o al 3% del fatturato mondiale. Per una PMI con 2 milioni di fatturato, significa fino a €60.000 di multa. Non è fantascienza: è già successo con il GDPR.",
      },
      {
        type: "cta",
        text: "Scarica la checklist AI Act per PMI italiane (gratis)",
        href: "/contatti",
      },
    ],
  },

  // ── ARTICOLO 2 ────────────────────────────────────────────────────────────
  {
    slug: "legge-132-2025-obblighi-aziende-italiane",
    title: "Legge 132/2025: tutto quello che deve sapere un imprenditore italiano",
    excerpt:
      "L'Italia ha la sua legge sull'AI. Entrata in vigore il 10 ottobre 2025. Obblighi per chi usa AI in HR, per i professionisti, e un nuovo reato penale che tutti dovrebbero conoscere.",
    category: "Legge 132/2025",
    author: "Team TutelAI",
    publishedAt: "2026-03-15",
    readingTime: 6,
    tags: ["Legge 132/2025", "PMI", "HR", "deepfake", "professionisti", "reato penale"],
    seo: {
      metaTitle: "Legge 132/2025: obblighi per le aziende italiane | TutelAI",
      metaDescription:
        "Guida completa alla Legge 132/2025, la prima legge italiana organica sull'AI. Obblighi per datori di lavoro, professionisti, e il nuovo reato penale per i deepfake.",
    },
    content: [
      {
        type: "paragraph",
        content:
          "Mentre il mondo discuteva di ChatGPT e di regolamentazione europea, l'Italia ha silenziosamente approvato la prima legge nazionale organica sull'intelligenza artificiale. La Legge 132/2025 è entrata in vigore il 10 ottobre 2025 e ha già cambiato gli obblighi per le aziende italiane.",
      },
      {
        type: "h2",
        content: "Se hai dipendenti e usi AI nei processi HR: obbligo immediato",
      },
      {
        type: "paragraph",
        content:
          "L'art. 11 dice una cosa semplice ma spesso ignorata: se usi sistemi AI nella selezione del personale, nella valutazione delle prestazioni, o nella gestione del rapporto di lavoro, devi informare i dipendenti per iscritto — prima che il sistema entri in funzione.",
      },
      {
        type: "paragraph",
        content:
          "Non basta dire \"usiamo software avanzati\". Devi spiegare quali sistemi, con quale logica, su quali dati. E il dipendente ha il diritto di contestare le decisioni algoritmiche che lo riguardano.",
      },
      {
        type: "blockquote",
        content: "Quante aziende lo stanno facendo? Quasi nessuna.",
      },
      {
        type: "h2",
        content: "Se sei un professionista: obbligo di disclosure al cliente",
      },
      {
        type: "paragraph",
        content:
          "L'art. 13 è pensato per avvocati, commercialisti, medici, consulenti. Se usi AI nello svolgimento della tua attività professionale, devi comunicarlo esplicitamente al cliente. Non è facoltativo. E devi garantire che la decisione finale — la strategia legale, il parere fiscale, la diagnosi — sia sempre umana.",
      },
      {
        type: "paragraph",
        content:
          "Questo non vieta l'uso dell'AI. Lo rende trasparente. E trasparente significa responsabile.",
      },
      {
        type: "h2",
        content: "Il nuovo reato penale che tutti dovrebbero conoscere",
      },
      {
        type: "paragraph",
        content:
          "La legge ha introdotto l'art. 612-quater nel codice penale: chiunque diffonde contenuti audio o video generati o alterati tramite AI in modo da trarre in inganno sulla loro autenticità, senza il consenso degli interessati, rischia da 1 a 5 anni di reclusione.",
      },
      {
        type: "list",
        items: [
          "Stai usando ElevenLabs per clonare una voce? Assicurati di avere il consenso.",
          "Stai generando video deepfake per campagne marketing? Verifica che tutte le persone coinvolte abbiano acconsentito.",
          "Hai un Modello Organizzativo 231? Il deepfake è ora reato presupposto: devi aggiornarlo.",
        ],
      },
      {
        type: "cta",
        text: "Hai bisogno di capire come la Legge 132/2025 impatta la tua azienda? Richiedi una call gratuita.",
        href: "/contatti",
      },
    ],
  },

  // ── ARTICOLO 3 ────────────────────────────────────────────────────────────
  {
    slug: "dpo-esterno-ai-officer-pmi-2026",
    title: "DPO esterno + AI Officer: perché le PMI ne hanno bisogno nel 2026",
    excerpt:
      "Il DPO non è più sufficiente. L'AI Act e la Legge 132/2025 introducono una nuova figura raccomandata: l'AI Compliance Officer. Ecco perché esternalizzarlo conviene.",
    category: "DPO & AI Officer",
    author: "Team TutelAI",
    publishedAt: "2026-03-10",
    readingTime: 5,
    tags: ["DPO", "AI Officer", "AI Compliance Officer", "PMI", "outsourcing"],
    seo: {
      metaTitle: "DPO esterno + AI Officer esterno per PMI nel 2026 | TutelAI",
      metaDescription:
        "Perché le PMI italiane hanno bisogno di un AI Compliance Officer nel 2026. Cosa fa, perché esternalizzarlo conviene, e come TutelAI AI Shield Pro risolve il problema.",
    },
    content: [
      {
        type: "paragraph",
        content:
          "Se hai nominato un DPO (Data Protection Officer) per il GDPR, hai fatto la cosa giusta. Ma l'AI Act e la Legge 132/2025 introducono una nuova figura raccomandata: l'AI Compliance Officer, responsabile del monitoraggio e della gestione della conformità dei sistemi AI aziendali.",
      },
      {
        type: "paragraph",
        content:
          "Non è obbligatorio per tutte le aziende. Ma per chi usa AI attivamente — e vuole dimostrare di farlo in modo responsabile — è la differenza tra avere una governance AI e avere solo dei documenti.",
      },
      {
        type: "h2",
        content: "Cosa fa un AI Compliance Officer",
      },
      {
        type: "list",
        items: [
          "Monitora lo stato di compliance dei sistemi AI in uso",
          "Mantiene aggiornato il registro dei sistemi AI",
          "Supervisiona la formazione AI Literacy del personale",
          "Gestisce i data breach AI entro i termini di legge",
          "È il punto di contatto con le autorità (ACN, Garante, AgID) in caso di ispezione",
          "Aggiorna i documenti quando cambia la normativa",
        ],
      },
      {
        type: "h2",
        content: "Perché esternalizzarlo conviene",
      },
      {
        type: "paragraph",
        content:
          "Formare internamente un AI Compliance Officer richiede tempo e un percorso di specializzazione molto specifico — diritto digitale, AI Act, GDPR, sicurezza informatica. Il costo di un professionista senior dedicato va dai €50.000 ai €80.000 annui.",
      },
      {
        type: "blockquote",
        content:
          "Con TutelAI AI Shield Pro, hai DPO e AI Officer esterni a €590/mese — meno di €7.000 l'anno. La stessa competenza, la stessa copertura legale, senza i costi fissi di un'assunzione.",
      },
      {
        type: "paragraph",
        content:
          "E quando cambia qualcosa nella norma, lo sappiamo noi prima di te. Il retainer include l'aggiornamento automatico dei tuoi documenti — senza che tu debba seguire ogni circolare del Garante o ogni decreto attuativo della Legge 132/2025.",
      },
      {
        type: "h2",
        content: "La differenza tra avere un documento e avere una governance",
      },
      {
        type: "paragraph",
        content:
          "Una policy AI scritta una volta e dimenticata nel cassetto non è compliance. È un documento. La compliance è un processo: monitoraggio continuo, aggiornamenti tempestivi, formazione documentata, audit trail. Solo una figura dedicata — interna o esterna — può garantire questo livello di presidio.",
      },
      {
        type: "cta",
        text: "Scopri AI Shield Pro e attiva il tuo DPO + AI Officer esterno",
        href: "/servizi",
      },
    ],
  },
];
