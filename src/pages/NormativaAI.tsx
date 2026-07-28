import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Scale,
  Globe,
  FileWarning,
  Clock,
  Shield,
  BookOpen,
  FileText,
  Eye,
  Zap,
  Users,
  MessageSquare,
} from "lucide-react";
import { APPLICAZIONE_GENERALE, conteggio } from "@/lib/scadenze";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";

const riskCategories = [
  {
    // Le emoji semaforo sono un segno da presentazione, non da documento:
    // sostituite da numeri romani, come i livelli di una classificazione.
    dot: "I",
    level: "Rischio Inaccettabile",
    badge: "VIETATO",
    badgeClass: "bg-destructive text-destructive-foreground",
    borderClass: "border-destructive/30",
    bgClass: "bg-destructive/5",
    examples: ["Social scoring", "Riconoscimento biometrico real-time", "Manipolazione comportamentale"],
    when: "In vigore dal 2 feb 2025",
    whenClass: "text-destructive",
    highlight: false,
  },
  {
    dot: "II",
    level: "Rischio Alto",
    badge: "OBBLIGHI PESANTI",
    badgeClass: "bg-primary text-primary-foreground",
    borderClass: "border-primary/25",
    bgClass: "bg-primary/5",
    examples: ["AI in HR e selezione personale", "Valutazione del credito", "AI in infrastrutture critiche"],
    when: "Dal 2 agosto 2026 (Allegato III)",
    whenClass: "text-primary",
    highlight: false,
  },
  {
    dot: "III",
    level: "Rischio Limitato",
    badge: "LE PMI SONO QUI",
    badgeClass: "bg-accent text-accent-foreground",
    borderClass: "border-accent",
    bgClass: "bg-accent/5",
    examples: ["Chatbot sul sito", "Voice agent customer service", "Assistenti AI nelle email"],
    when: "Dal 2 agosto 2026",
    whenClass: "text-foreground font-semibold",
    highlight: true,
    urgentLabel: "TERMINE IMMINENTE",
  },
  {
    dot: "IV",
    level: "Rischio Minimo",
    badge: "NESSUN OBBLIGO AI ACT",
    badgeClass: "bg-muted text-muted-foreground",
    borderClass: "border-border",
    bgClass: "bg-background",
    examples: ["Filtri antispam", "AI in videogiochi", "Sistemi di raccomandazione base"],
    when: "Sempre",
    whenClass: "text-muted-foreground",
    highlight: false,
  },
];

const deadlines = [
  {
    date: "1 ago 2024",
    label: "AI Act in vigore ufficialmente nell'UE",
    passed: true,
    urgent: false,
  },
  {
    date: "2 feb 2025",
    label: "Divieti pratiche inaccettabili + obbligo AI Literacy",
    passed: true,
    urgent: false,
  },
  {
    date: "2 ago 2025",
    label: "Regole GPAI (AI generativa), governance europea, regime sanzionatorio",
    passed: true,
    urgent: false,
  },
  {
    date: "2 ago 2026",
    label: "Applicazione generale (art. 113): trasparenza ex art. 50 per chatbot e voice agent, sistemi ad alto rischio dell'Allegato III — HR, credito, infrastrutture critiche",
    passed: false,
    urgent: true,
  },
  {
    date: "2 ago 2027",
    label: "Sistemi ad alto rischio incorporati in prodotti già regolati: macchinari, dispositivi medici (art. 6, par. 1, Allegato I)",
    passed: false,
    urgent: false,
  },
];

const legge132Articles = [
  {
    article: "Art. 11",
    title: "Obblighi per i datori di lavoro",
    desc: "Chi usa AI in processi HR deve informare i lavoratori per iscritto prima dell'uso, spiegare le logiche dell'algoritmo e garantire il diritto di contestazione delle decisioni automatizzate.",
    impact: "Alta",
    impactClass: "bg-primary/10 text-primary",
    icon: Users,
  },
  {
    article: "Art. 13",
    title: "Professioni intellettuali",
    desc: "Avvocati, commercialisti, medici che usano AI devono comunicarlo esplicitamente al cliente e garantire che la decisione finale rimanga sempre umana e verificabile.",
    impact: "Alta",
    impactClass: "bg-primary/10 text-primary",
    icon: Scale,
  },
  {
    article: "Art. 21",
    title: "Nuovo reato penale — Deepfake",
    desc: "Diffusione di deepfake senza consenso: da 1 a 5 anni di reclusione. Il deepfake è ora reato presupposto del D.Lgs. 231/2001. Chi ha un Modello 231 deve aggiornarlo immediatamente.",
    impact: "Critica",
    impactClass: "bg-destructive/10 text-destructive",
    icon: FileWarning,
  },
];

const checklist = [
  { text: "Censisci tutti i sistemi AI usati in azienda (anche da singoli dipendenti)", icon: Eye },
  { text: "Classifica ogni sistema per livello di rischio AI Act", icon: Scale },
  { text: "Crea e distribuisci una policy uso AI interno", icon: FileText },
  { text: "Aggiorna le informative privacy includendo l'uso di AI", icon: Shield },
  {
    text: "Adempi agli obblighi di trasparenza ex art. 50 per chatbot e voice agent entro il 2 agosto 2026",
    icon: MessageSquare,
    urgent: true,
  },
  { text: "Valuta se i tuoi sistemi HR usano scoring automatico (Art. 11 L. 132/2025)", icon: AlertTriangle },
  { text: "Verifica se sei soggetto agli obblighi per professioni intellettuali (Art. 13)", icon: BookOpen },
  { text: "Controlla e aggiorna il Modello 231 per il reato deepfake (Art. 21)", icon: Zap },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Cos'è l'AI Act europeo?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "L'AI Act (Regolamento UE 2024/1689) è la prima legge al mondo sull'intelligenza artificiale. È entrato in vigore il 1° agosto 2024 e si applica direttamente in tutti i Paesi UE, inclusa l'Italia. Classifica i sistemi AI per livello di rischio e impone obblighi proporzionati.",
      },
    },
    {
      "@type": "Question",
      name: "Cos'è la Legge 132/2025?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "La Legge italiana 132 del 2025 recepisce e integra l'AI Act a livello nazionale. Introduce obblighi specifici per i datori di lavoro che usano AI in HR (Art. 11), per le professioni intellettuali (Art. 13) e crea il nuovo reato penale di diffusione di deepfake (Art. 21).",
      },
    },
    {
      "@type": "Question",
      name: "Quando scatta l'obbligo di disclosure per i chatbot?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Il 2 agosto 2026. Da quella data, chiunque utilizzi un chatbot o un voice agent che interagisce con utenti reali dovrà informarli esplicitamente che stanno comunicando con un sistema AI. La mancata disclosure è sanzionata fino al 3% del fatturato globale.",
      },
    },
    {
      "@type": "Question",
      name: "Le PMI italiane sono soggette all'AI Act?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Sì. L'AI Act si applica a qualsiasi organizzazione che usa sistemi AI nel mercato UE, indipendentemente dalla dimensione. Anche una piccola impresa che usa ChatGPT o un CRM con funzionalità AI è tecnicamente un 'deployer' soggetto alla normativa.",
      },
    },
    {
      "@type": "Question",
      name: "Quali sono le sanzioni previste dall'AI Act?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Le sanzioni arrivano fino a €35.000.000 o il 7% del fatturato globale per le pratiche vietate, €15.000.000 o il 3% per le violazioni degli obblighi principali, e €7.500.000 o l'1% per informazioni false alle autorità.",
      },
    },
  ],
};

export default function NormativaAI() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Normativa AI Italia 2025-2026 | AI Act e Legge 132/2025 per PMI — TutelAI</title>
        <meta
          name="description"
          content="Guida completa all'AI Act europeo e alla Legge 132/2025 italiana. Obblighi, sanzioni, scadenze e checklist per le PMI italiane. Aggiornata a luglio 2026."
        />
        <link rel="canonical" href="https://tutelai.it/normativa-ai" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Navbar onCtaClick={openModal} />

      {/* ── 1. HERO ──────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-28 bg-gradient-to-b from-primary/5 via-background to-background overflow-hidden">
        {/* decorative blur */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
        </div>

        <div className="container mx-auto px-4 lg:px-8 max-w-4xl relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            {/* badge */}
            <span className="inline-flex items-center gap-2 text-xs font-mono-accent font-semibold tracking-widest uppercase text-primary mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Globe size={12} />
              Guida aggiornata — Luglio 2026
            </span>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-heading-tight leading-[1.05] mb-6">
              Normativa AI in Italia{" "}
              <span className="text-gradient-primary bg-clip-text text-transparent">
                2025-2026
              </span>
              <br className="hidden sm:block" />
              La guida completa per le PMI
            </h1>

            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
              Cosa significano concretamente l'<strong>AI Act europeo</strong> e la{" "}
              <strong>Legge 132/2025</strong> per le aziende italiane. Obblighi reali,
              scadenze che già scattano e sanzioni che non si possono ignorare.
            </p>

            {/* chips */}
            <div className="flex flex-wrap justify-center gap-3">
              {["✓ AI Act europeo", "✓ Legge 132/2025 italiana", "✓ Aggiornata a luglio 2026"].map(
                (chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center text-sm font-subtitle font-semibold px-4 py-2 rounded-full bg-card border border-border text-foreground"
                  >
                    {chip}
                  </span>
                )
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. URGENCY BANNER ────────────────────────────────────── */}
      <section className="bg-destructive py-4">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-destructive-foreground font-subtitle font-semibold text-sm sm:text-base text-center sm:text-left">
              <span className="font-mono-accent font-bold text-lg">⚠</span>{" "}
              Il <strong>2 agosto 2026</strong> decorre il termine di applicazione generale del
              Regolamento: {conteggio(APPLICAZIONE_GENERALE)}.
            </p>
            <button
              onClick={openModal}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-destructive-foreground text-destructive font-subtitle font-bold text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Mettiti in regola ora <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ── 3. AI ACT SECTION ────────────────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-28 bg-card">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* left: editorial explanation */}
            <motion.div
            >
              <span className="inline-flex items-center gap-2 text-xs font-mono-accent font-semibold tracking-widest uppercase text-primary mb-4 px-3 py-1.5 rounded-full bg-primary/10">
                <Scale size={12} />
                Il Regolamento UE
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl tracking-heading-tight leading-[1.08] mb-5">
                Cos'è l'AI Act e perché riguarda{" "}
                <span className="text-gradient-primary bg-clip-text text-transparent">
                  la tua azienda
                </span>
              </h2>
              <div className="space-y-4 text-muted-foreground text-base leading-relaxed">
                <p>
                  L'AI Act (Regolamento UE 2024/1689) è la{" "}
                  <strong className="text-foreground">
                    prima legge al mondo sull'intelligenza artificiale
                  </strong>
                  . È entrato in vigore il 1° agosto 2024 e si applica{" "}
                  <strong className="text-foreground">direttamente in Italia</strong>, senza
                  necessità di recepimento.
                </p>
                <p>
                  Non serve sviluppare AI per essere soggetti alla normativa. Basta{" "}
                  <strong className="text-foreground">usare sistemi AI</strong> in azienda —
                  anche se acquistati da terzi.
                </p>
                <p>
                  In parallelo, la <strong className="text-foreground">Legge 132/2025</strong>{" "}
                  ha aggiunto obblighi specifici italiani per datori di lavoro, professioni
                  intellettuali e un nuovo reato penale per i deepfake.
                </p>
              </div>
            </motion.div>

            {/* right: "a chi si applica" card */}
            <motion.div
              className="rounded-2xl border-2 border-primary bg-primary/5 p-6 sm:p-8"
            >
              <p className="font-mono-accent text-xs font-bold tracking-widest uppercase text-primary mb-5">
                A CHI SI APPLICA
              </p>
              <div className="space-y-3 mb-6">
                {[
                  { label: "Chi sviluppa AI", sub: "startup, software house, team R&D" },
                  { label: "Chi usa AI (deployer)", sub: "quasi tutte le aziende oggi" },
                  { label: "Chi distribuisce AI", sub: "rivenditori, integratori, agenzie" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-subtitle font-bold text-sm text-foreground">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-primary/10 border border-primary/30 p-4">
                <p className="text-sm font-subtitle font-semibold text-foreground leading-snug">
                  Se usi <span className="text-primary font-bold">ChatGPT</span>, un{" "}
                  <span className="text-primary font-bold">CRM con AI</span>, un{" "}
                  <span className="text-primary font-bold">chatbot</span> sul sito →{" "}
                  <span className="text-primary font-extrabold">SEI UN DEPLOYER.</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Gli obblighi AI Act si applicano a te.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 4. RISK CATEGORIES ───────────────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div
            className="text-center mb-12"
          >
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl tracking-heading-tight mb-4">
              Le 4 categorie di rischio dell'AI Act
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Ogni sistema AI deve essere classificato. Gli obblighi dipendono dalla categoria.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {riskCategories.map((cat, i) => (
              <motion.div
                key={cat.level}
                className={`relative rounded-2xl border-2 p-6 ${cat.borderClass} ${cat.bgClass} ${cat.highlight ? "ring-2 ring-primary ring-offset-2" : ""}`}
              >
                {cat.highlight && cat.urgentLabel && (
                  <span className="absolute -top-3 right-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-mono-accent font-bold animate-pulse">
                    {cat.urgentLabel}
                  </span>
                )}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{cat.dot}</span>
                  <span className={`text-xs font-mono-accent font-bold px-3 py-1 rounded-full ${cat.badgeClass}`}>
                    {cat.badge}
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-lg mb-3">{cat.level}</h3>
                <ul className="space-y-1.5 mb-4">
                  {cat.examples.map((ex) => (
                    <li key={ex} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0" />
                      {ex}
                    </li>
                  ))}
                </ul>
                <div className={`text-xs font-mono-accent font-semibold ${cat.whenClass}`}>
                  <Clock size={12} className="inline mr-1" />
                  {cat.when}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. SANCTIONS ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-28 bg-dark-gradient text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 text-xs font-mono-accent font-bold tracking-widest uppercase text-red-400 mb-4 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30">
              <AlertTriangle size={12} />
              Regime sanzionatorio
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl tracking-heading-tight text-white">
              Le sanzioni che nessuno ti ha raccontato
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-5 mb-12">
            {[
              {
                amount: "€35.000.000",
                pct: "o 7% del fatturato",
                label: "Pratiche vietate",
                color: "border-red-500 bg-red-500/10",
                textColor: "text-red-400",
              },
              {
                amount: "€15.000.000",
                pct: "o 3% del fatturato",
                label: "Violazione obblighi",
                color: "border-accent bg-accent/10",
                textColor: "text-accent",
              },
              {
                amount: "€7.500.000",
                pct: "o 1% del fatturato",
                label: "Informazioni false",
                color: "border-accent bg-accent/10",
                textColor: "text-accent",
              },
            ].map((tier, i) => (
              <motion.div
                key={tier.label}
                className={`rounded-2xl border-2 p-6 text-center ${tier.color}`}
              >
                <p className={`font-display font-extrabold text-2xl sm:text-3xl tracking-stat-tight ${tier.textColor} mb-1`}>
                  {tier.amount}
                </p>
                <p className={`font-mono-accent text-xs font-semibold ${tier.textColor} mb-3`}>
                  {tier.pct}
                </p>
                <p className="text-white/70 text-sm font-subtitle font-semibold">{tier.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="rounded-2xl bg-white/5 border border-white/10 p-6 sm:p-8 text-center"
          >
            <p className="text-white/90 text-base sm:text-lg font-subtitle leading-relaxed max-w-2xl mx-auto">
              Per una <strong className="text-white">PMI con €2M di fatturato</strong>, la
              sanzione massima è{" "}
              <strong className="text-red-400 font-mono-accent text-xl">€140.000</strong>.
              <br />
              <span className="text-white/60 text-sm mt-2 block">
                È già successo con il GDPR. Questa volta è peggio: le sanzioni si applicano
                automaticamente, senza un procedimento complesso.
              </span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 6. TIMELINE ──────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.div
            className="text-center mb-12"
          >
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl tracking-heading-tight mb-4">
              La timeline dell'AI Act
            </h2>
            <p className="text-muted-foreground">Dove siamo e cosa si avvicina.</p>
          </motion.div>

          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-border" />
            <div className="space-y-6">
              {deadlines.map((d, i) => (
                <motion.div
                  key={d.date}
                  className="relative flex gap-5 items-start"
                >
                  {/* dot */}
                  <div className="relative z-10 shrink-0">
                    {d.urgent ? (
                      <div className="relative w-10 h-10 flex items-center justify-center">
                        <span className="absolute inset-0 rounded-full bg-destructive/30 animate-ping" />
                        <span className="relative w-10 h-10 rounded-full bg-destructive flex items-center justify-center">
                          <AlertTriangle size={16} className="text-destructive-foreground" />
                        </span>
                      </div>
                    ) : d.passed ? (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <CheckCircle2 size={16} className="text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full border-2 border-border bg-background flex items-center justify-center">
                        <Clock size={14} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className={`pb-2 ${d.passed ? "opacity-60" : ""}`}>
                    <p
                      className={`font-mono-accent font-bold text-sm mb-0.5 ${d.urgent ? "text-destructive" : d.passed ? "text-muted-foreground line-through" : "text-foreground"}`}
                    >
                      {d.date}
                      {d.urgent && (
                        <span className="ml-2 text-xs font-bold bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full no-underline">
                          URGENTE
                        </span>
                      )}
                    </p>
                    <p className={`text-sm ${d.passed ? "text-muted-foreground line-through" : "text-foreground"} font-subtitle`}>
                      {d.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. LEGGE 132/2025 ────────────────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-28 bg-card">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 text-xs font-mono-accent font-bold tracking-widest uppercase text-primary mb-4 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <FileText size={12} />
              Legge italiana
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl tracking-heading-tight mb-4">
              Legge 132/2025 — Gli obblighi nazionali
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              In aggiunta all'AI Act europeo, l'Italia ha introdotto obblighi specifici con la
              Legge 132/2025. Tre articoli che cambiano tutto.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {legge132Articles.map((art, i) => (
              <motion.div
                key={art.article}
                className="rounded-2xl border border-border bg-background p-6 flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono-accent font-bold text-sm text-primary">
                    {art.article}
                  </span>
                  <span className={`text-xs font-mono-accent font-bold px-2.5 py-1 rounded-full ${art.impactClass}`}>
                    Impatto: {art.impact}
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-lg mb-3 leading-snug">
                  {art.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{art.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. COMPLIANCE CHECKLIST ──────────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.div
            className="text-center mb-10"
          >
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl tracking-heading-tight mb-4">
              La checklist di compliance AI
            </h2>
            <p className="text-muted-foreground">
              Quante di queste 8 attività hai già completato?
            </p>
          </motion.div>

          <div className="space-y-3 mb-10">
            {checklist.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  className={`flex items-start gap-4 p-4 rounded-xl border ${
                    item.urgent
                      ? "border-destructive/40 bg-destructive/5"
                      : "border-border bg-card"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      item.urgent ? "bg-destructive/10" : "bg-primary/10"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={item.urgent ? "text-destructive" : "text-primary"}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-subtitle font-semibold text-foreground leading-snug">
                      {item.text}
                    </p>
                    {item.urgent && (
                      <p className="text-xs text-destructive font-mono-accent font-bold mt-0.5">
                        Scadenza: 2 agosto 2026
                      </p>
                    )}
                  </div>
                  <div className="w-5 h-5 rounded border-2 border-border shrink-0 mt-0.5" />
                </motion.div>
              );
            })}
          </div>

          <motion.div
            className="text-center"
          >
            <p className="text-muted-foreground text-sm mb-5">
              Non sai da dove iniziare? Il nostro AI Risk Scan le analizza tutte in 48 ore.
            </p>
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-cta text-primary-foreground font-subtitle font-bold hover:opacity-90 transition-opacity"
            >
              Parti dall'AI Risk Scan <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── 9. CTA ───────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-28 bg-dark-gradient text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <motion.div
          >
            <Shield size={40} className="mx-auto mb-6 text-primary/70" />
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl tracking-heading-tight text-white mb-5 leading-[1.08]">
              Hai letto la guida.
              <br />
              Ora è il momento di{" "}
              <span className="text-gradient-primary bg-clip-text text-transparent">agire.</span>
            </h2>
            <p className="text-white/60 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              Il 2 agosto 2026 non aspetta. Prenota una call gratuita di 30 minuti e capisci
              esattamente cosa deve fare la tua azienda.
            </p>
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-cta text-primary-foreground font-subtitle font-bold text-base hover:opacity-90 transition-opacity"
            >
              Prenota la call gratuita <ArrowRight size={16} />
            </button>
            <p className="text-white/40 text-xs mt-4 font-mono-accent">
              Nessuna vendita forzata. Se non siamo la soluzione giusta, te lo diciamo.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
      <LeadFormModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
