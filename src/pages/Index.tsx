import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, useInView } from "framer-motion";
import {
  Shield, AlertTriangle, CheckCircle2, ArrowRight, Clock,
  FileText, Users, Zap, BookOpen, Phone, Star,
  Scale, TrendingUp, ShieldCheck, BarChart3,
  Globe, Award, Eye, Building2, Sparkles,
} from "lucide-react";
import { APPLICAZIONE_GENERALE, conteggio, etichettaBreve } from "@/lib/scadenze";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";

// ── ANIMATED COUNTER ──────────────────────────────────────────────────────────
// Il conteggio animato partiva da 0 e si avviava solo entrando in viewport:
// chi atterrava a metà pagina leggeva "0+" e "€0M". Il numero si scrive.
function Counter({
  to, suffix = "", prefix = "",
}: { to: number; suffix?: string; prefix?: string }) {
  return <span>{prefix}{to.toLocaleString("it-IT")}{suffix}</span>;
}

// ── ESTRATTO REGISTRO SISTEMI AI ──────────────────────────────────────────────
// Sostituisce il radar animato: un prospetto di classificazione comunica cosa
// produce davvero lo studio, e regge lo sguardo di un imprenditore adulto.
const RIGHE_REGISTRO = [
  { sistema: "Chatbot sito web", rif: "art. 50, par. 1", esito: "Obbligo di informativa", grave: true },
  { sistema: "Assistente generativo interno", rif: "art. 4", esito: "Alfabetizzazione non assolta", grave: true },
  { sistema: "Gestionale HR con scoring", rif: "All. III, p.to 4", esito: "Alto rischio — da istruire", grave: true },
  { sistema: "Filtro antispam", rif: "art. 6, par. 3", esito: "Fuori ambito", grave: false },
];

function ScannerCard() {
  return (
    <div className="relative select-none">

      {/* Prospetto */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative border border-white/15 bg-white/[0.04] px-7 py-6"
      >
        {/* Intestazione */}
        <div className="flex items-baseline justify-between gap-4 border-b border-white/15 pb-3">
          <p className="font-mono-accent text-[10px] uppercase tracking-[0.18em] text-white/45">
            Estratto registro sistemi AI
          </p>
          <p className="font-mono-accent text-[10px] text-white/35">Rif. 2026/0412</p>
        </div>

        <p className="mt-4 font-display text-lg text-white">
          Impresa manifatturiera, 45 addetti
        </p>
        <p className="mt-1 font-subtitle text-[13px] leading-relaxed text-white/50">
          Quattro sistemi rilevati, tre con obblighi esigibili dal 2 agosto 2026.
        </p>

        {/* Righe */}
        <div className="mt-6">
          {RIGHE_REGISTRO.map((r, i) => (
            <motion.div
              key={r.sistema}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.09, duration: 0.4 }}
              className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-t border-white/10 py-3"
            >
              <span className="font-subtitle text-[13px] leading-snug text-white/85">
                {r.sistema}
              </span>
              <span
                className={`self-start font-mono-accent text-[10px] uppercase tracking-wider ${
                  r.grave ? "text-[#eab913]" : "text-white/35"
                }`}
              >
                {r.grave ? "da adeguare" : "fuori ambito"}
              </span>
              <span className="font-mono-accent text-[10px] text-white/35">{r.rif}</span>
              <span className="text-right font-subtitle text-[11px] italic text-white/45">
                {r.esito}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Piede */}
        <div className="mt-5 flex items-baseline justify-between border-t border-white/15 pt-3">
          <span className="font-mono-accent text-[10px] uppercase tracking-[0.18em] text-white/35">
            Termine
          </span>
          <span className="font-mono-accent text-[11px] text-[#eab913]">2 agosto 2026</span>
        </div>
      </motion.div>
    </div>
  );
}

// ── PLATFORM MOCKUP ───────────────────────────────────────────────────────────
function PlatformMockup() {
  return (
    <div className="relative">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)" }}>
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-accent/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
          <div className="ml-3 flex-1 rounded-md h-5 flex items-center px-2.5" style={{ background: "rgba(255,255,255,0.07)" }}>
            <span className="text-white/30 text-[10px] font-mono-accent">app.tutelai.it/dashboard</span>
          </div>
        </div>
        {/* App layout */}
        <div className="flex" style={{ height: "300px" }}>
          {/* Sidebar */}
          <div className="w-12 flex flex-col items-center pt-4 gap-3" style={{ background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
            {[Shield, FileText, BarChart3, Users, BookOpen].map((Icon, i) => (
              <div key={i} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: i === 0 ? "linear-gradient(135deg,#0ea5e9,#10b981)" : "rgba(255,255,255,0.05)" }}>
                <Icon size={13} className={i === 0 ? "text-white" : "text-white/25"} />
              </div>
            ))}
          </div>
          {/* Main content */}
          <div className="flex-1 p-4 overflow-hidden">
            <p className="text-white/25 text-[10px] font-mono-accent mb-3 uppercase tracking-widest">AI Registry — 12 sistemi monitorati</p>
            {/* Stats row */}
            <div className="flex gap-2 mb-4">
              {[
                { l: "Conformi", v: "4", c: "#34d399" },
                { l: "Warning", v: "6", c: "#fbbf24" },
                { l: "Critici", v: "2", c: "#f87171" },
              ].map((s, i) => (
                <div key={i} className="flex-1 text-center rounded-xl py-2.5" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <p className="text-lg font-bold font-display" style={{ color: s.c }}>{s.v}</p>
                  <p className="text-white/25 text-[9px] font-mono-accent">{s.l}</p>
                </div>
              ))}
            </div>
            {/* System rows */}
            <div className="space-y-2">
              {[
                { n: "ChatGPT Business", pct: 85, c: "#f87171" },
                { n: "HR AI Module", pct: 45, c: "#fbbf24" },
                { n: "Chatbot sito web", pct: 20, c: "#f87171" },
                { n: "Analytics AI", pct: 92, c: "#34d399" },
                { n: "Voice Agent", pct: 30, c: "#fb923c" },
              ].map((sys, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: sys.c }} />
                  <span className="text-white/50 text-[10px] flex-1 truncate font-subtitle">{sys.n}</span>
                  <div className="w-20 h-1 rounded-full overflow-hidden shrink-0" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="h-full rounded-full" style={{ width: `${sys.pct}%`, background: sys.c, opacity: 0.7 }} />
                  </div>
                  <span className="text-white/30 text-[9px] w-5 text-right font-mono-accent">{sys.pct}%</span>
                </div>
              ))}
            </div>
          </div>
          {/* Right panel */}
          <div className="w-40 p-3" style={{ background: "rgba(255,255,255,0.02)", borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
            <p className="text-white/25 text-[9px] font-mono-accent mb-3 uppercase tracking-wider">Alert Attivi</p>
            <div className="space-y-2">
              {[
                { t: "Disclosure mancante chatbot", l: "Alta" },
                { t: "Formazione non documentata", l: "Media" },
                { t: "Scade: 2 ago 2026", l: "Alta" },
              ].map((alert, i) => (
                <div key={i} className="rounded-lg p-2" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <p className="text-white/55 text-[9px] leading-tight mb-1.5 font-subtitle">{alert.t}</p>
                  <span className="text-[8px] font-bold px-2 py-0.5 rounded-full font-mono-accent" style={{
                    background: alert.l === "Alta" ? "rgba(239,68,68,0.2)" : "rgba(251,191,36,0.2)",
                    color: alert.l === "Alta" ? "#f87171" : "#fbbf24"
                  }}>{alert.l}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-white/20 text-[9px] font-mono-accent mb-1.5">Compliance Score</p>
              <div className="flex items-end gap-1">
                <span className="text-white font-display font-bold text-2xl leading-none">27</span>
                <span className="text-white/30 text-xs mb-0.5">/100</span>
              </div>
              <div className="w-full h-1.5 rounded-full mt-2 overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <motion.div className="h-full rounded-full" style={{ background: "#ef4444" }}
                   />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DATA ──────────────────────────────────────────────────────────────────────
const aiTools = [
  { name: "ChatGPT", sub: "OpenAI", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", color: "#34d399" },
  { name: "Copilot", sub: "Microsoft", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.25)", color: "#60a5fa" },
  { name: "Gemini", sub: "Google", bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.25)", color: "#c084fc" },
  { name: "GitHub Copilot", sub: "GitHub", bg: "rgba(148,163,184,0.12)", border: "rgba(148,163,184,0.25)", color: "#cbd5e1" },
  { name: "Claude", sub: "Anthropic", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.25)", color: "#fb923c" },
  { name: "Notion AI", sub: "Notion", bg: "rgba(100,116,139,0.12)", border: "rgba(100,116,139,0.25)", color: "#94a3b8" },
  { name: "Midjourney", sub: "Immagini AI", bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.25)", color: "#818cf8" },
  { name: "Jasper AI", sub: "Copywriting", bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.25)", color: "#a78bfa" },
  { name: "HubSpot AI", sub: "CRM/Marketing", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)", color: "#f87171" },
  { name: "Zapier AI", sub: "Automazioni", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", color: "#fbbf24" },
];

const stats = [
  { to: 6_200_000, suffix: "+", label: "PMI italiane già soggette all'AI Act", icon: Building2 },
  { to: 98, suffix: "%", label: "Non ha ancora un documento di conformità AI", icon: AlertTriangle },
  { to: 35, prefix: "€", suffix: "M", label: "Sanzione massima per violazione grave (Art. 99)", icon: Scale },
  { to: 5, suffix: " giorni", label: "Dal primo contatto al tuo AI Risk Report", icon: Zap },
];

const problems = [
  {
    icon: Users,
    title: "La materia non rientra nel perimetro dei tuoi consulenti abituali.",
    desc: "Il commercialista presidia gli adempimenti fiscali, il consulente del lavoro quelli giuslavoristici, il fornitore IT l'infrastruttura. Nessuno di questi ruoli è tenuto a valutare se il tuo chatbot integri un obbligo di trasparenza ai sensi dell'art. 50 del Regolamento, o se il gestionale HR che utilizzi rientri fra i sistemi ad alto rischio dell'Allegato III. La qualificazione giuridica del sistema è un'attività riservata, e va svolta prima della contestazione.",
    stat: "Attività riservata",
    statSub: "la classificazione del rischio richiede una valutazione legale, non tecnica",
  },
  {
    icon: FileText,
    title: "L'impiego dell'AI è lecito. L'impiego non documentato, no.",
    desc: "ChatGPT per i preventivi, Copilot per la reportistica, un chatbot sul sito, un gestionale con scoring automatico: nessuno di questi strumenti è vietato dal Regolamento. Ciascuno però presuppone una policy interna sull'uso dell'AI, l'informativa ai lavoratori richiesta dall'art. 11 della Legge 132/2025, clausole contrattuali dedicate verso i fornitori e, ove ricorrano i presupposti, una valutazione d'impatto ai sensi dell'art. 35 GDPR.",
    stat: "Onere della prova",
    statSub: "in sede ispettiva la conformità va dimostrata con documenti datati",
  },
  {
    icon: Clock,
    title: "Una parte dei termini è già decorsa. Il più rilevante scade adesso.",
    desc: `Dal 2 febbraio 2025 sono applicabili i divieti dell'art. 5 e l'obbligo di alfabetizzazione dell'art. 4. Dal 2 agosto 2025 è operativo l'apparato sanzionatorio degli artt. 99 e 100. Il 2 agosto 2026 — ${conteggio(APPLICAZIONE_GENERALE)} — matura il termine di applicazione generale previsto dall'art. 113: da quella data rilevano gli obblighi di trasparenza dell'art. 50 e la disciplina dei sistemi ad alto rischio dell'Allegato III.`,
    stat: "2 agosto 2026",
    statSub: "termine di applicazione generale del Regolamento (art. 113)",
  },
];

const steps = [
  {
    num: "01",
    title: "Scopriamo cosa hai e cosa rischi",
    desc: "Mappiamo tutti i sistemi AI che la tua azienda usa — compresi quelli che non chiami 'AI': chatbot, gestionali con scoring, software HR, strumenti di analisi predittiva. Li classifichiamo per livello di rischio e identifichiamo i gap concreti rispetto all'AI Act e alla Legge 132/2025. In 5 giorni lavorativi hai un quadro chiaro.",
    icon: Eye,
    badge: "AI Risk Scan — €990",
    deliverable: "Report con rischi reali, gap e priorità di intervento",
  },
  {
    num: "02",
    title: "Produciamo i documenti che la legge richiede",
    desc: "Non template scaricati da internet. Documenti personalizzati per il tuo settore, i tuoi strumenti e la tua struttura: policy interna AI, informativa ai lavoratori, clausole per fornitori e clienti, disclaimer per il chatbot, attestati del piano formazione. Quello che tiene in piedi un audit.",
    icon: FileText,
    badge: "AI Compliance Pack — €2.900",
    deliverable: "Documenti legali completi, pronti all'uso",
  },
  {
    num: "03",
    title: "Manteniamo tutto aggiornato mentre la normativa cambia",
    desc: "L'AI Act viene aggiornato, arrivano nuove linee guida, cambiano le interpretazioni. Con il retainer mensile hai un team fisso — legale e tecnologico — che monitora le novità, ti avvisa prima delle scadenze e interviene quando serve. Nessuna rincorsa dell'ultimo minuto.",
    icon: ShieldCheck,
    badge: "AI Shield Retainer — da €290/mese",
    deliverable: "Presidio continuativo, aggiornamenti inclusi",
  },
];

const services = [
  {
    title: "AI Risk Scan",
    price: "€990",
    time: "5 giorni lavorativi",
    desc: "Partiamo da qui con tutte le aziende. Mappatura di ogni sistema AI in uso, classificazione per livello di rischio, gap analysis rispetto ad AI Act e Legge 132/2025. Ricevi un report con priorità chiare: cosa rischi, cosa manca, cosa fare subito.",
    href: "/servizi",
    hot: false,
    icon: Eye,
  },
  {
    title: "AI Compliance Pack",
    price: "€2.900",
    time: "15 giorni lavorativi",
    desc: "Tutti i documenti che la legge richiede: policy interna AI, informativa ai lavoratori, clausole per fornitori e clienti, disclaimer chatbot, piano formazione con attestati. Non template generici — tutto scritto su misura per la tua azienda e il tuo settore.",
    href: "/servizi",
    hot: true,
    icon: FileText,
  },
  {
    title: "AI Governance Setup",
    price: "€5.900",
    time: "30 giorni lavorativi",
    desc: "Per chi ha più sistemi AI o è già soggetto a vigilanza: struttura di governance completa con ruoli definiti, processi documentati, registro AI attivo e audit trail. La base per resistere a qualsiasi ispezione.",
    href: "/servizi",
    hot: false,
    icon: ShieldCheck,
  },
  {
    title: "AI Shield Retainer",
    price: "Da €290/mese",
    time: "Continuativo",
    desc: "DPO e AI Officer esterni a costo fisso mensile. Aggiornamenti normativi in tempo reale, interventi on-demand su ogni novità, report trimestrale. Per chi non vuole pensarci ogni volta che esce una nuova circolare.",
    href: "/servizi",
    hot: false,
    icon: Shield,
  },
];

const differentiators = [
  { icon: BookOpen, title: "Avvocati che seguono l'AI Act dal 2021", desc: "I professionisti della nostra rete hanno seguito il Regolamento fin dalla proposta della Commissione dell'aprile 2021, prima che assumesse veste definitiva. Conoscono l'articolato, gli orientamenti applicativi e il raccordo con la Legge 132/2025 — e sanno come si traducono negli adempimenti concreti di un'impresa." },
  { icon: Zap, title: "Qualificazione tecnica prima di quella giuridica", desc: "Un sistema non si classifica dal nome commerciale. Verifichiamo cosa fa in concreto: con quali criteri il software HR valuta i dipendenti, quali dati elabora il chatbot, se il motore di scoring integri una delle fattispecie dell'Allegato III. È l'istruttoria tecnica che rende difendibile la valutazione legale." },
  { icon: Globe, title: "Documenti opponibili, non relazioni interlocutorie", desc: "Una policy adottata e datata. Un'informativa consegnata ai lavoratori. Un registro dei sistemi AI aggiornato. Attestati di formazione nominativi. Atti che in sede di verifica assolvono l'onere della prova, non slide o piani programmatici." },
];

const testimonials = [
  {
    quote: "Prima dell'AI Risk Scan pensavo di avere 2 o 3 strumenti AI in azienda. Ne avevamo 9, di cui 3 con obblighi immediati che non sapevo nemmeno esistessero. Il report ci ha dato un quadro chiaro e ci ha detto esattamente da dove partire.",
    name: "Marco R.",
    role: "CEO",
    company: "Azienda manifatturiera, 45 dipendenti",
    stars: 5,
  },
  {
    quote: "Tutto lo studio usava ChatGPT senza una policy interna. In due settimane TutelAI ci ha messo in regola con documenti personalizzati, non template. Ora lo diciamo ai clienti — essere conformi all'AI Act è diventato un argomento commerciale.",
    name: "Avv. Giulia M.",
    role: "Partner",
    company: "Studio legale, Milano",
    stars: 5,
  },
  {
    quote: "Con 12 dipendenti pensavo che l'AI Act fosse roba da multinazionali. I sistemi di raccomandazione del mio e-commerce mi rendevano già soggetto alla normativa. L'AI Risk Scan a €990 mi ha evitato un'esposizione che stavo ignorando completamente.",
    name: "Luca B.",
    role: "Founder",
    company: "E-commerce, Torino",
    stars: 5,
  },
];

const deadlines = [
  { date: "1 ago 2024", label: "Entrata in vigore del Regolamento UE 2024/1689", done: true },
  { date: "2 feb 2025", label: "Divieti dell'art. 5 e obbligo di alfabetizzazione AI dell'art. 4", done: true },
  { date: "2 ago 2025", label: "Obblighi sui modelli per finalità generali, governance e apparato sanzionatorio", done: true },
  { date: "2 ago 2026", label: "Applicazione generale del Regolamento (art. 113): trasparenza ex art. 50 e sistemi ad alto rischio dell'Allegato III", done: false, urgent: true },
  { date: "2 ago 2027", label: "Sistemi ad alto rischio incorporati in prodotti già regolati (art. 6, par. 1, Allegato I)", done: false },
];

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function Index() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Helmet>
        <title>TutelAI — Studio legale specializzato in AI Act e compliance AI</title>
        <meta name="description" content="Dal 2 agosto 2026 il Regolamento UE 2024/1689 si applica per intero. Avvocati specializzati in AI Act e Legge 132/2025 assistono la tua azienda: AI Risk Scan, documentazione, DPO e AI Officer esterni." />
        <meta property="og:title" content="TutelAI — Studio legale specializzato in AI Act" />
        <meta property="og:description" content="Assistenza legale in materia di intelligenza artificiale per le PMI italiane. AI Act, Legge 132/2025, DPO e AI Officer esterni." />
        <link rel="canonical" href="https://tutelai.it" />
      </Helmet>

      <Navbar onCtaClick={openModal} />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 bg-dark-gradient text-primary-foreground overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 70%)" }}
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)" }}
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)" }}
          />
          {/* Grid overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }} />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left column */}
            <div>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border"
                  style={{ background: "rgba(234,185,19,0.12)", borderColor: "rgba(234,185,19,0.35)" }}>
                  <Sparkles size={14} style={{ color: "#eab913" }} />
                  <span className="text-xs font-subtitle font-semibold uppercase tracking-widest" style={{ color: "#eab913" }}>
                    2 agosto 2026 · {etichettaBreve(APPLICAZIONE_GENERALE)} · Reg. UE 2024/1689
                  </span>
                </div>

                <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-heading-tight leading-[1.05] mb-6">
                  Dal 2 agosto l'AI Act si applica per intero.{" "}
                  <span className="text-gradient-primary">I sistemi che usi già oggi vanno documentati.</span>
                </h1>

                <p className="text-primary-foreground/75 text-lg sm:text-xl leading-relaxed mb-8 max-w-xl font-subtitle">
                  Il 2 agosto 2026 — {conteggio(APPLICAZIONE_GENERALE)} — decorre il termine di applicazione
                  generale del Regolamento UE 2024/1689 (art. 113). Da quella data gli obblighi di trasparenza
                  dell'art. 50 vincolano chiunque impieghi chatbot, voice agent o sistemi generativi.{" "}
                  <strong className="text-primary-foreground">Non è richiesto rinunciare all'AI: è richiesto documentarne l'uso.</strong>
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-10">
                  <motion.button
                    onClick={openModal}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary-foreground text-foreground font-subtitle font-bold text-base shadow-2xl hover:opacity-90 transition-opacity"
                  >
                    <Sparkles size={18} />
                    AI Risk Scan gratuito
                    <ArrowRight size={16} />
                  </motion.button>
                  <Link
                    to="/normativa-ai"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-subtitle font-semibold text-base transition-colors"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
                  >
                    Cosa rischi oggi →
                  </Link>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-4">
                  {[
                    { icon: ShieldCheck, text: "Conforme al GDPR" },
                    { icon: Award, text: "Avvocati iscritti all'albo" },
                    { icon: TrendingUp, text: "Specializzati in AI Act dal 2021" },
                  ].map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-subtitle text-primary-foreground/50">
                      <b.icon size={13} className="text-primary-foreground/40" />
                      {b.text}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right column — scanner */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-sm">
                <ScannerCard />
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
          >
            <span className="text-xs font-subtitle text-primary-foreground/50">Scorri per scoprire</span>
            <div className="w-0.5 h-8 rounded-full bg-primary-foreground/30" />
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-card border-y border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                className="text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <s.icon size={18} className="text-primary" />
                </div>
                <p className="font-display font-extrabold text-3xl sm:text-4xl tracking-stat-tight text-foreground mb-1">
                  <Counter to={s.to} prefix={s.prefix} suffix={s.suffix} />
                </p>
                <p className="text-xs text-muted-foreground font-subtitle leading-snug max-w-[140px] mx-auto">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI TOOLS LOGO CLOUD ──────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-10"
          >
            <p className="text-muted-foreground text-sm font-subtitle font-semibold uppercase tracking-widest mb-3">
              Strumenti che usi ogni giorno — già soggetti all'AI Act
            </p>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-heading-tight">
              Ognuno di questi crea <span className="text-gradient-primary">obblighi specifici.</span>
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto mb-8">
            {aiTools.map((tool, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border cursor-default"
                style={{ background: tool.bg, borderColor: tool.border }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: tool.color }} />
                <span className="font-subtitle font-semibold text-sm" style={{ color: tool.color }}>{tool.name}</span>
                <span className="text-xs opacity-50 font-subtitle" style={{ color: tool.color }}>{tool.sub}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center"
          >
            <p className="text-muted-foreground text-sm font-subtitle mb-4">
              + qualsiasi sistema con raccomandazioni automatiche, scoring, classificazione o generazione di contenuti. Non basta usarli responsabilmente: servono policy, clausole contrattuali e formazione documentata.
            </p>
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 text-sm font-subtitle font-bold text-primary hover:opacity-80 transition-opacity"
            >
              Scopri gratis a cosa sei esposto <ArrowRight size={14} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── SANCTION SHOCK ───────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-dark-gradient text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, rgba(239,68,68,0.1) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(14,165,233,0.08) 0%, transparent 60%)"
          }} />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <motion.div
            >
              <p className="text-red-400 text-sm font-subtitle font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <AlertTriangle size={14} /> Sanzioni già operative
              </p>
              <div className="font-display font-extrabold tracking-stat-tight leading-none mb-2">
                <span className="text-5xl sm:text-7xl text-white">€</span>
                <span className="text-5xl sm:text-7xl text-red-400">
                  <Counter to={35} />
                </span>
                <span className="text-3xl sm:text-5xl text-white/60">.000.000</span>
              </div>
              <p className="text-primary-foreground/50 text-sm font-subtitle mt-2 mb-8">
                Sanzione massima per violazione grave dell'AI Act (Art. 99)
              </p>
              <div className="space-y-3">
                {[
                  { tier: "Violazioni gravi (pratiche vietate)", amount: "€35M o 7% fatturato globale", color: "#f87171" },
                  { tier: "Violazioni standard (obblighi deployer)", amount: "€15M o 3% fatturato globale", color: "#fbbf24" },
                  { tier: "Informazioni false all'autorità", amount: "€7,5M o 1% fatturato globale", color: "#34d399" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <span className="text-primary-foreground/70 text-sm font-subtitle">{item.tier}</span>
                    <span className="font-subtitle font-bold text-sm whitespace-nowrap ml-4" style={{ color: item.color }}>{item.amount}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="p-8 rounded-3xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <p className="text-sm font-subtitle font-bold uppercase tracking-widest mb-6" style={{ color: "#eab913" }}>
                Ricorda il GDPR?
              </p>
              <p className="text-primary-foreground/80 text-lg font-subtitle leading-relaxed mb-6">
                Nel 2018 molte PMI dissero: <em className="text-primary-foreground/50">"tanto non ci controllano"</em>. Nel 2019 arrivarono le prime sanzioni. Nel 2020 fu troppo tardi per adeguarsi tranquillamente.
              </p>
              <p className="text-primary-foreground font-subtitle font-bold text-lg mb-8">
                Con l'AI Act il meccanismo è identico — ma la normativa è più complessa e le sanzioni sono più alte.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: "GDPR sanzioni max", val: "€20M", note: "vs €35M AI Act" },
                  { label: "Anni per adeguarsi", val: "2", note: "Oggi hai meno" },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <p className="font-display font-extrabold text-2xl text-white">{item.val}</p>
                    <p className="text-white/50 text-xs font-subtitle mt-0.5">{item.label}</p>
                    <p className="text-xs font-subtitle font-semibold mt-1" style={{ color: "#eab913" }}>{item.note}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={openModal}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-full font-subtitle font-bold text-base bg-gradient-gold hover:opacity-90 transition-opacity"
                style={{ color: "#1a375b" }}
              >
                Mettiti in regola ora <ArrowRight size={16} />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ─────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-card border-y border-border">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 text-destructive text-sm font-subtitle font-bold mb-4">
              <Clock size={16} className="animate-pulse" />
              Termine del 2 agosto 2026 — {conteggio(APPLICAZIONE_GENERALE)}
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-heading-tight">
              I termini di decorrenza del Regolamento
            </h2>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-border hidden sm:block" />

            <div className="space-y-4">
              {deadlines.map((d, i) => (
                <motion.div
                  key={i}
                  className={`relative flex items-start gap-5 p-5 rounded-2xl border transition-all ${
                    d.urgent
                      ? "border-destructive/40 bg-destructive/5 shadow-[0_0_30px_rgba(239,68,68,0.1)]"
                      : "border-border bg-background"
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full shrink-0 mt-1.5 z-10 ${
                    d.done ? "bg-muted-foreground/40"
                    : d.urgent ? "bg-destructive ring-4 ring-destructive/20 animate-pulse"
                    : "bg-primary"
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`font-mono-accent text-sm font-bold ${d.done ? "text-muted-foreground" : d.urgent ? "text-destructive" : "text-foreground"}`}>
                        {d.date}
                      </span>
                      {d.urgent && (
                        <span className="text-xs font-subtitle font-bold text-destructive bg-destructive/10 px-2.5 py-1 rounded-full">
                          ⏰ URGENTE — Sei pronto?
                        </span>
                      )}
                      {d.done && (
                        <span className="text-xs font-subtitle text-muted-foreground/60 bg-muted px-2.5 py-1 rounded-full">
                          Già in vigore
                        </span>
                      )}
                    </div>
                    <p className={`mt-1 font-subtitle text-sm leading-relaxed ${
                      d.done ? "text-muted-foreground/60 line-through" : d.urgent ? "text-foreground font-semibold" : "text-foreground"
                    }`}>{d.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.p
              className="mt-6 text-sm text-muted-foreground leading-relaxed text-center"
            >
              Le sanzioni arrivano fino al <strong className="text-foreground">7% del fatturato mondiale</strong>.
              Per una PMI con €2M di fatturato: fino a <strong className="text-destructive">€140.000 di multa</strong>.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── PROBLEMS ─────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-14"
          >
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.08] mb-4">
              Perché la tua azienda{" "}
              <span className="text-gradient-primary">è ancora esposta</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto font-subtitle">
              Non è mancanza di attenzione. È che questa normativa è nuova, tecnica e nessuno te ne ha ancora parlato in modo concreto.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {problems.map((p, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="group relative p-8 rounded-3xl border border-border bg-card hover:border-destructive/30 hover:shadow-[0_20px_60px_rgba(239,68,68,0.08)] transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-5 group-hover:bg-destructive/15 transition-colors">
                  <p.icon size={26} className="text-destructive" />
                </div>
                <h3 className="font-subtitle font-bold text-lg mb-3 leading-snug">{p.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{p.desc}</p>
                <div className="pt-5 border-t border-border">
                  <p className="font-display font-extrabold text-xl text-foreground">{p.stat}</p>
                  <p className="text-muted-foreground text-xs mt-1 font-subtitle">{p.statSub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12 p-6 rounded-2xl max-w-3xl mx-auto"
            style={{ background: "linear-gradient(135deg, rgba(14,165,233,0.06), rgba(16,185,129,0.06))", border: "1px solid rgba(14,165,233,0.15)" }}
          >
            <p className="text-foreground font-subtitle font-semibold text-lg">
              TutelAI nasce per chiudere questo gap: un unico interlocutore con competenza legale, tecnologica e operativa sull'AI. Non devi diventare un esperto di normativa.{" "}
              <strong>Devi avere i documenti giusti e qualcuno che ti avvisi quando le cose cambiano.</strong>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-card">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div
            className="text-center mb-14"
          >
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.08] mb-4">
              Come lavoriamo{" "}
              <span className="text-gradient-primary">insieme</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto font-subtitle">
              Tre fasi chiare, dalla diagnosi alla conformità documentata. Tempi certi, costi fissi, nessuna sorpresa.
            </p>
          </motion.div>

          <div className="space-y-6">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                className="group flex flex-col sm:flex-row gap-6 items-start p-7 rounded-3xl border border-border bg-background hover:border-primary/30 hover:shadow-lg transition-all"
              >
                {/* Step icon */}
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-cta flex items-center justify-center shadow-lg">
                    <s.icon size={28} className="text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                    <span className="text-[10px] font-mono-accent font-bold text-primary">{i + 1}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                    <h3 className="font-subtitle font-bold text-xl">{s.title}</h3>
                    <span className="inline-flex text-xs font-subtitle font-bold text-primary bg-primary/10 px-3 py-1 rounded-full self-start">
                      {s.badge}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">{s.desc}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 size={15} className="text-primary shrink-0" />
                    <span className="font-subtitle font-semibold text-foreground">{s.deliverable}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-14"
          >
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.08] mb-4">
              I nostri{" "}
              <span className="text-gradient-primary">interventi</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-subtitle">
              Se non sai ancora dove sei, parti dall'AI Risk Scan — è il punto di partenza che usiamo con tutte le aziende.
              Da lì, puoi crescere verso un presidio continuativo.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {services.map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
              >
                <Link
                  to={s.href}
                  className={`group relative flex flex-col h-full p-7 rounded-3xl border transition-all duration-300 ${
                    s.hot
                      ? "border-primary bg-gradient-cta text-primary-foreground shadow-[0_20px_60px_rgba(14,165,233,0.3)]"
                      : "border-border bg-card hover:border-primary/40 hover:shadow-xl"
                  }`}
                >
                  {s.hot && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-foreground text-foreground text-xs font-subtitle font-bold px-4 py-1 rounded-full shadow-lg">
                      ⭐ Più richiesto
                    </div>
                  )}

                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${s.hot ? "bg-primary-foreground/15" : "bg-primary/10"}`}>
                    <s.icon size={22} className={s.hot ? "text-primary-foreground" : "text-primary"} />
                  </div>

                  <div className={`text-2xl font-display font-extrabold tracking-stat-tight mb-1 ${s.hot ? "text-primary-foreground" : "text-foreground"}`}>
                    {s.price}
                  </div>
                  <div className={`text-xs font-mono-accent mb-4 ${s.hot ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {s.time}
                  </div>

                  <h3 className={`font-subtitle font-bold text-lg mb-3 ${s.hot ? "text-primary-foreground" : "group-hover:text-primary transition-colors"}`}>
                    {s.title}
                  </h3>
                  <p className={`text-sm leading-relaxed flex-1 mb-5 ${s.hot ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
                    {s.desc}
                  </p>

                  <div className={`flex items-center gap-1 text-sm font-subtitle font-bold ${s.hot ? "text-primary-foreground" : "text-primary"}`}>
                    Scopri di più <ArrowRight size={14} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-10"
          >
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-cta text-primary-foreground font-subtitle font-bold text-base hover:opacity-90 transition-opacity shadow-lg"
            >
              <Phone size={16} />
              Parla con noi — capiamo insieme da dove partire
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── WHY TUTELAI ──────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-dark-gradient text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle at 50% 100%, rgba(14,165,233,0.12) 0%, transparent 60%)"
        }} />
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl relative z-10">
          <motion.div
            className="text-center mb-14"
          >
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.08] mb-4">
              Perché serve{" "}
              <span className="text-gradient-primary">una specializzazione dedicata</span>
            </h2>
            <p className="text-primary-foreground/65 text-lg max-w-2xl mx-auto font-subtitle">
              La conoscenza dell'articolato non è sufficiente. Occorre stabilire cosa esegue in concreto un voice agent, a quali condizioni un software HR ricada nell'Allegato III e quali obblighi gravino su chi impiega un sistema di raccomandazione.{" "}
              <strong className="text-primary-foreground">È su questo raccordo fra istruttoria tecnica e qualificazione giuridica che lavoriamo.</strong>
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {differentiators.map((d, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="p-8 rounded-3xl text-center transition-all duration-300"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: "linear-gradient(135deg, rgba(14,165,233,0.2), rgba(16,185,129,0.2))", border: "1px solid rgba(14,165,233,0.2)" }}>
                  <d.icon size={28} className="text-primary" />
                </div>
                <h3 className="font-subtitle font-bold text-lg mb-3">{d.title}</h3>
                <p className="text-primary-foreground/60 text-sm leading-relaxed font-subtitle">{d.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM PREVIEW ─────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left */}
            <motion.div
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-subtitle font-semibold mb-5">
                <Sparkles size={12} />
                TutelAI Platform — per il presidio quotidiano
              </div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight leading-[1.08] mb-5">
                Tutto sotto controllo,{" "}
                <span className="text-gradient-primary">in un'unica piattaforma.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8 font-subtitle">
                La consulenza ti mette in regola. La piattaforma ti aiuta a restarci. Registro AI sempre aggiornato, monitoraggio normativo in tempo reale, documenti attuali e formazione tracciata per ogni dipendente — senza doverci pensare ogni settimana.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: BarChart3, text: "AI Registry: catalogo e classificazione di tutti i tuoi sistemi AI" },
                  { icon: FileText, text: "Doc Generator: documenti legali pronti in pochi click" },
                  { icon: Eye, text: "Monitor normativo: aggiornamenti AI Act in tempo reale" },
                  { icon: Users, text: "Training Hub: formazione documentata per ogni dipendente" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon size={15} className="text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed font-subtitle mt-1">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Link
                  to="/piattaforma"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-cta text-primary-foreground font-subtitle font-bold text-sm hover:opacity-90 transition-opacity"
                >
                  Scopri la piattaforma <ArrowRight size={14} />
                </Link>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-subtitle">
                  Da <strong className="text-foreground">€79/mese</strong>
                </div>
              </div>
            </motion.div>

            {/* Right — mockup */}
            <motion.div
            >
              <PlatformMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-14"
          >
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight leading-[1.08] mb-4">
              Cosa ci dicono le aziende{" "}
              <span className="text-gradient-primary">che abbiamo già aiutato</span>
            </h2>
            <p className="text-muted-foreground font-subtitle">Tre casi reali. Tre situazioni diverse. Un problema comune.</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="flex flex-col p-8 rounded-3xl border border-border bg-background hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(t.stars)].map((_, j) => (
                    <Star key={j} size={15} style={{ fill: "#eab913", color: "#eab913" }} />
                  ))}
                </div>
                <p className="text-foreground font-subtitle leading-relaxed mb-6 flex-1 italic text-sm">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-border">
                  <div className="w-10 h-10 rounded-full bg-gradient-cta flex items-center justify-center shrink-0">
                    <span className="text-primary-foreground font-display font-bold text-sm">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-subtitle font-bold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role} · {t.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GUARANTEE ────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-8 p-8 rounded-3xl"
            style={{ background: "linear-gradient(135deg, rgba(14,165,233,0.06), rgba(16,185,129,0.06))", border: "1px solid rgba(14,165,233,0.2)" }}
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-cta flex items-center justify-center shrink-0 shadow-xl">
              <ShieldCheck size={36} className="text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-2xl tracking-heading-tight mb-2">
                Garanzia soddisfatti o rimborsati — 15 giorni
              </h3>
              <p className="text-muted-foreground font-subtitle leading-relaxed">
                Se dopo l'AI Risk Scan non ritieni che il report valga il tuo investimento, ti rimborsiamo integralmente
                senza domande. Zero vincoli contrattuali. Zero sorprese in fattura.
                <strong className="text-foreground"> Paghi solo quello che usi.</strong>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-dark-gradient text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)" }}
          />
        </div>
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-3xl relative z-10">
          <motion.div
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border"
              style={{ background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.25)" }}>
              <AlertTriangle size={14} className="text-red-400" />
              <span className="text-red-400 text-xs font-subtitle font-semibold uppercase tracking-widest">
                Termine 2 agosto 2026 — {conteggio(APPLICAZIONE_GENERALE)}
              </span>
            </div>

            <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-heading-tight leading-[1.05] mb-5">
              Prima di sapere cosa fare,{" "}
              <span className="text-gradient-primary">devi sapere dove sei.</span>
            </h2>
            <p className="text-primary-foreground/70 text-lg sm:text-xl mb-10 max-w-xl mx-auto font-subtitle leading-relaxed">
              Una call di 30 minuti con un esperto TutelAI. Ti diciamo cosa rischi concretamente, quali strumenti AI sei tenuto a documentare e qual è il primo passo per la tua situazione specifica. Senza impegno, senza offerte commerciali durante la call.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <motion.button
                onClick={openModal}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-primary-foreground text-foreground font-subtitle font-bold text-lg shadow-2xl hover:opacity-90 transition-opacity"
              >
                <Phone size={20} />
                Prenota la call — è gratuita
                <ArrowRight size={18} />
              </motion.button>
            </div>

            {/* Micro-trust */}
            <div className="flex flex-wrap justify-center gap-6 text-primary-foreground/40 text-sm font-subtitle">
              {["✓ Nessun impegno", "✓ Risposta in 24h", "✓ Rimborsabile 15 giorni", "✓ Senza sorprese"].map((item, i) => (
                <span key={i}>{item}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <LeadFormModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
