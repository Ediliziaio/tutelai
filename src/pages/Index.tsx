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
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";

// ── ANIMATED COUNTER ──────────────────────────────────────────────────────────
function Counter({
  to, suffix = "", prefix = "", duration = 1800,
}: { to: number; suffix?: string; prefix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  useEffect(() => {
    if (!inView) return;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      setVal(Math.floor((1 - (1 - p) ** 3) * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString("it-IT")}{suffix}</span>;
}

// ── AI RISK SCANNER CARD ──────────────────────────────────────────────────────
function ScannerCard() {
  return (
    <div className="relative select-none">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-primary/25 blur-3xl scale-125 rounded-full pointer-events-none" />

      {/* Glass card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-3xl border border-white/15 p-6 shadow-2xl"
        style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(24px)" }}
      >
        {/* Card header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-white/40 text-[10px] font-mono-accent uppercase tracking-widest">TutelAI Scanner</p>
            <p className="text-white font-subtitle font-bold text-sm mt-0.5">Compliance AI — PMI Italiana</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: "rgba(52,211,153,0.15)" }}>
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-[10px] font-mono-accent font-bold">LIVE SCAN</span>
          </div>
        </div>

        {/* Radar SVG */}
        <div className="flex justify-center mb-5">
          <svg width="190" height="190" viewBox="0 0 200 200">
            {/* Background rings */}
            {[90, 70, 50, 30].map((r, i) => (
              <circle key={i} cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            ))}
            {/* Grid spokes */}
            {[0, 45, 90, 135].map((a, i) => (
              <line key={i}
                x1={100 + 90 * Math.cos((a * Math.PI) / 180)}
                y1={100 + 90 * Math.sin((a * Math.PI) / 180)}
                x2={100 - 90 * Math.cos((a * Math.PI) / 180)}
                y2={100 - 90 * Math.sin((a * Math.PI) / 180)}
                stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"
              />
            ))}

            {/* Critical arc (red) */}
            <circle cx="100" cy="100" r="80" fill="none"
              stroke="url(#arcRed)" strokeWidth="6" strokeOpacity="0.9"
              strokeDasharray="190 312" strokeDashoffset="0"
              strokeLinecap="round"
              style={{ transform: "rotate(-90deg)", transformOrigin: "center" }} />
            {/* Warning arc (orange) */}
            <circle cx="100" cy="100" r="80" fill="none"
              stroke="#f97316" strokeWidth="6" strokeOpacity="0.7"
              strokeDasharray="80 422" strokeDashoffset="-190"
              strokeLinecap="round"
              style={{ transform: "rotate(-90deg)", transformOrigin: "center" }} />
            {/* OK arc (green) */}
            <circle cx="100" cy="100" r="80" fill="none"
              stroke="#34d399" strokeWidth="6" strokeOpacity="0.6"
              strokeDasharray="32 470" strokeDashoffset="-270"
              strokeLinecap="round"
              style={{ transform: "rotate(-90deg)", transformOrigin: "center" }} />

            {/* Scanner beam */}
            <line x1="100" y1="100" x2="100" y2="16" stroke="rgba(14,165,233,0.85)" strokeWidth="1.5">
              <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="3.5s" repeatCount="indefinite" />
            </line>
            <circle cx="100" cy="16" r="3" fill="#0ea5e9" opacity="0.9">
              <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="3.5s" repeatCount="indefinite" />
            </circle>
            {/* Beam sweep glow */}
            <path d="M100,100 L88,10 A12,12 0 0,1 112,10 Z" fill="rgba(14,165,233,0.06)">
              <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="3.5s" repeatCount="indefinite" />
            </path>

            {/* Risk dots */}
            {[
              { a: 35, c: "#ef4444" }, { a: 110, c: "#ef4444" },
              { a: 195, c: "#f97316" }, { a: 285, c: "#34d399" },
            ].map(({ a, c }, i) => (
              <circle key={i}
                cx={100 + 80 * Math.cos(((a - 90) * Math.PI) / 180)}
                cy={100 + 80 * Math.sin(((a - 90) * Math.PI) / 180)}
                r="4.5" fill={c} opacity="0.85"
              />
            ))}

            {/* Center */}
            <circle cx="100" cy="100" r="30" fill="rgba(0,0,0,0.55)" />
            <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <text x="100" y="97" textAnchor="middle" fill="white" fontSize="22" fontWeight="800" fontFamily="system-ui">73%</text>
            <text x="100" y="111" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="system-ui" letterSpacing="1">RISK SCORE</text>

            <defs>
              <linearGradient id="arcRed" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Status rows */}
        <div className="space-y-2">
          {[
            { label: "Chatbot sito web", status: "CRITICO", dot: "#ef4444" },
            { label: "ChatGPT aziendale", status: "CRITICO", dot: "#ef4444" },
            { label: "AI Literacy docs", status: "MANCANTE", dot: "#f97316" },
            { label: "Policy interna AI", status: "OK", dot: "#34d399" },
          ].map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + i * 0.12 }}
              className="flex items-center justify-between rounded-xl px-3 py-2.5"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.dot }} />
                <span className="text-white/65 text-xs font-subtitle">{item.label}</span>
              </div>
              <span className="text-xs font-mono-accent font-bold" style={{ color: item.dot }}>{item.status}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Floating chips */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-5 -right-5 text-white text-xs font-subtitle font-bold px-4 py-2.5 rounded-2xl shadow-2xl whitespace-nowrap"
        style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)", border: "1px solid rgba(239,68,68,0.3)" }}
      >
        ⚠️ Multa fino a €35.000.000
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
        className="absolute -bottom-5 -left-5 text-white text-xs font-subtitle font-bold px-4 py-2.5 rounded-2xl shadow-2xl whitespace-nowrap"
        style={{ background: "linear-gradient(135deg, #059669, #047857)", border: "1px solid rgba(52,211,153,0.3)" }}
      >
        ✓ In regola in 5 giorni
      </motion.div>
    </div>
  );
}

// ── PLATFORM MOCKUP ───────────────────────────────────────────────────────────
function PlatformMockup() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-primary/15 blur-3xl scale-110 rounded-3xl pointer-events-none" />
      <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)" }}>
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
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
                  initial={{ width: 0 }} whileInView={{ width: "27%" }} viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3 }} />
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
  { to: 6_200_000, suffix: "+", label: "PMI italiane esposte all'AI Act", icon: Building2 },
  { to: 98, suffix: "%", label: "Delle PMI non è ancora in regola", icon: AlertTriangle },
  { to: 35, prefix: "€", suffix: "M", label: "Sanzione massima violazione grave", icon: Scale },
  { to: 5, suffix: " giorni", label: "Per il tuo primo AI Risk Report", icon: Zap },
];

const problems = [
  {
    icon: Users,
    title: "Il tuo consulente non conosce l'AI Act.",
    desc: "Il commercialista gestisce le tasse. L'avvocato fa i contratti. L'IT configura i sistemi. Nessuno dei tre sa cosa sia un \"sistema AI ad alto rischio\" o cosa preveda la Legge 132/2025. E nessuno te lo dirà finché non arriva la multa.",
    stat: "92% degli studi legali italiani",
    statSub: "non ha ancora aggiornato i propri servizi sull'AI Act",
  },
  {
    icon: FileText,
    title: "Usi AI ogni giorno senza una riga di documentazione.",
    desc: "ChatGPT per i testi, Copilot per Excel, un chatbot sul sito, un gestionale con scoring automatico. Li usi tutti. Senza policy interna, senza clausole nei contratti, senza formazione documentata dei dipendenti.",
    stat: "Zero documenti",
    statSub: "= massima esposizione alle sanzioni",
  },
  {
    icon: Clock,
    title: "Le scadenze non aspettano.",
    desc: "Il 2 febbraio 2025 sono già scattate le prime sanzioni. Il 2 agosto 2026 — mancano pochi mesi — arriva l'obbligo di disclosure per chatbot e voice agent. È già successo con il GDPR. Questa volta la normativa è più ampia, più tecnica, più rapida.",
    stat: "Fino al 7% del fatturato",
    statSub: "per una PMI con €2M → fino a €140.000 di multa",
  },
];

const steps = [
  {
    num: "01",
    title: "Capiamo dove sei",
    desc: "In 5 giorni lavorativi mappiamo tutti i sistemi AI che la tua azienda usa, li classifichiamo per livello di rischio (inaccettabile, alto, limitato, minimo) e identifichiamo i gap rispetto all'AI Act e alla Legge 132/2025.",
    icon: Eye,
    badge: "AI Risk Scan — €990",
    deliverable: "Report completo + priorità di intervento",
  },
  {
    num: "02",
    title: "Ti mettiamo in regola",
    desc: "Redigiamo i documenti che la legge richiede: policy interna AI, informativa ai lavoratori, clausole AI nei contratti con clienti e fornitori, disclaimer obbligatori, piano formazione. Non template: tutto personalizzato sul tuo settore.",
    icon: FileText,
    badge: "AI Compliance Pack — €2.900",
    deliverable: "Tutti i documenti legali pronti all'uso",
  },
  {
    num: "03",
    title: "Ti teniamo aggiornato",
    desc: "La normativa AI evolve ogni mese. Con il retainer TutelAI hai un DPO esterno e un AI Officer esterno a costo fisso, aggiornati in tempo reale, pronti a intervenire a ogni nuova scadenza o modifica normativa.",
    icon: ShieldCheck,
    badge: "AI Shield Retainer — da €290/mese",
    deliverable: "Presidio continuativo 12 mesi",
  },
];

const services = [
  {
    title: "AI Risk Scan",
    price: "€990",
    time: "5 giorni",
    desc: "Analisi completa di tutti i sistemi AI che usi, classificazione del rischio, gap analysis rispetto all'AI Act e Legge 132/2025.",
    href: "/servizi",
    hot: false,
    icon: Eye,
  },
  {
    title: "AI Compliance Pack",
    price: "€2.900",
    time: "15 giorni",
    desc: "Policy interna, informative lavoratori, clausole contrattuali, disclaimer e piano formazione. Tutto personalizzato.",
    href: "/servizi",
    hot: true,
    icon: FileText,
  },
  {
    title: "AI Governance Setup",
    price: "€5.900",
    time: "30 giorni",
    desc: "Struttura di governance AI completa: ruoli, processi, comitato AI, audit trail e sistema di monitoraggio continuo.",
    href: "/servizi",
    hot: false,
    icon: ShieldCheck,
  },
  {
    title: "AI Shield Retainer",
    price: "Da €290/mese",
    time: "Continuativo",
    desc: "DPO + AI Officer esterno. Aggiornamenti normativi in tempo reale, interventi on-demand, report trimestrale.",
    href: "/servizi",
    hot: false,
    icon: Shield,
  },
];

const differentiators = [
  { icon: BookOpen, title: "Avvocati specializzati in AI", desc: "Non generalisti. Professionisti che hanno letto l'AI Act articolo per articolo, conoscono la Legge 132/2025 e seguono l'evoluzione normativa europea in tempo reale." },
  { icon: Zap, title: "Tecnologi che capiscono l'AI", desc: "Sappiamo come funzionano ChatGPT, i voice agent e i gestionali con AI. Non ci fermiamo alla superficie normativa: analizziamo il sistema reale che usi." },
  { icon: Globe, title: "Consulenti operativi, non teorici", desc: "Traduciamo la norma in azioni concrete. Documenti pronti, processi attivi, attestati firmati. Niente PowerPoint: solo output che tiene in piedi un audit." },
];

const testimonials = [
  {
    quote: "Con TutelAI abbiamo completato l'adeguamento all'AI Act in 3 settimane. Prima non sapevamo nemmeno da dove cominciare. Il report iniziale ci ha aperto gli occhi su quanti sistemi AI stavamo usando senza saperlo.",
    name: "Marco R.",
    role: "CEO",
    company: "Azienda manifatturiera, 45 dipendenti",
    stars: 5,
  },
  {
    quote: "Il nostro studio usava ChatGPT ogni giorno senza una policy interna. TutelAI ci ha messo in regola in pochi giorni. Ora possiamo dirlo ai nostri clienti — ed è diventato un vantaggio competitivo.",
    name: "Avv. Giulia M.",
    role: "Partner",
    company: "Studio legale, Milano",
    stars: 5,
  },
  {
    quote: "Pensavo fosse roba per le grandi aziende. Invece il mio e-commerce con 12 dipendenti era già soggetto all'AI Act per i sistemi di raccomandazione prodotti. L'AI Risk Scan valeva 10 volte il costo.",
    name: "Luca B.",
    role: "Founder",
    company: "E-commerce, Torino",
    stars: 5,
  },
];

const deadlines = [
  { date: "2 feb 2025", label: "Pratiche AI vietate sanzionabili + AI Literacy obbligatoria", done: true },
  { date: "2 ago 2025", label: "Regime sanzionatorio formale attivo, governance europea operativa", done: true },
  { date: "2 ago 2026", label: "Obbligo di disclosure per chatbot, voice agent e sistemi generativi", done: false, urgent: true },
  { date: "2 ago 2027", label: "Sistemi HR, credito, infrastrutture critiche: conformità totale", done: false },
  { date: "2 ago 2028", label: "Tutti i sistemi AI ad alto rischio: conformità completa o shutdown", done: false },
];

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function Index() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Helmet>
        <title>TutelAI — La prima Tech Legal Company italiana per la sicurezza nell'AI</title>
        <meta name="description" content="Stai usando AI in azienda senza sapere se stai violando la legge? TutelAI ti aiuta a essere conforme all'AI Act europeo e alla Legge 132/2025. AI Risk Scan gratuito." />
        <meta property="og:title" content="TutelAI — Compliance AI per PMI italiane" />
        <meta property="og:description" content="La prima Tech Legal Company italiana per la sicurezza nell'AI. AI Act, Legge 132/2025, DPO + AI Officer esterno." />
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
                    AI Act · Legge 132/2025 · Compliance
                  </span>
                </div>

                <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-heading-tight leading-[1.05] mb-6">
                  Stai usando l'AI in azienda{" "}
                  <span className="text-gradient-primary">senza sapere se stai violando la legge.</span>
                </h1>

                <p className="text-primary-foreground/75 text-lg sm:text-xl leading-relaxed mb-8 max-w-xl font-subtitle">
                  Dal 2025 in Italia è obbligatorio rispettare l'AI Act europeo e la Legge 132/2025.
                  La maggior parte delle PMI non lo sa ancora.{" "}
                  <strong className="text-primary-foreground">Le sanzioni sono già operative.</strong>
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
                    { icon: ShieldCheck, text: "GDPR-aligned" },
                    { icon: Award, text: "Avvocati specializzati in AI" },
                    { icon: TrendingUp, text: "Prima Tech Legal Company italiana" },
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-muted-foreground text-sm font-subtitle font-semibold uppercase tracking-widest mb-3">
              Tutti questi strumenti nella tua azienda sono soggetti all'AI Act
            </p>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-heading-tight">
              Li usi. Ma sei <span className="text-gradient-primary">in regola?</span>
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto mb-8">
            {aiTools.map((tool, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
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
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-muted-foreground text-sm font-subtitle mb-4">
              + qualsiasi altro sistema con raccomandazioni automatiche, scoring, classificazione o generazione di contenuti
            </p>
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 text-sm font-subtitle font-bold text-primary hover:opacity-80 transition-opacity"
            >
              Verifica gratuitamente la tua esposizione <ArrowRight size={14} />
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
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
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
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.1 }}
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
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 text-destructive text-sm font-subtitle font-bold mb-4">
              <Clock size={16} className="animate-pulse" />
              Il 2 agosto 2026 scatta il prossimo obbligo — mancano pochi mesi
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-heading-tight">
              Le scadenze che non puoi ignorare
            </h2>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-border hidden sm:block" />

            <div className="space-y-4">
              {deadlines.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
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
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.08] mb-4">
              Tre problemi che{" "}
              <span className="text-gradient-primary">nessuno ti sta risolvendo</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto font-subtitle">
              Non è colpa tua. La normativa AI è nuova, tecnica e in rapida evoluzione. Ma l'ignoranza non è un'esimente legale.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {problems.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-12 p-6 rounded-2xl max-w-3xl mx-auto"
            style={{ background: "linear-gradient(135deg, rgba(14,165,233,0.06), rgba(16,185,129,0.06))", border: "1px solid rgba(14,165,233,0.15)" }}
          >
            <p className="text-foreground font-subtitle font-semibold text-lg">
              TutelAI è nata esattamente per questo gap. Siamo la prima realtà italiana che unisce
              competenza legale specializzata in AI, tecnologia e consulenza operativa in un <strong>unico interlocutore.</strong>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-card">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.08] mb-4">
              Tre passi per essere a norma —{" "}
              <span className="text-gradient-primary">e dormire tranquillo</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto font-subtitle">
              Dal primo contatto alla compliance certificata. Tempi certi, output concreti, zero burocrazia inutile.
            </p>
          </motion.div>

          <div className="space-y-6">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.15 }}
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.08] mb-4">
              Scegli come vuoi{" "}
              <span className="text-gradient-primary">lavorare con noi</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-subtitle">
              Puoi partire da un singolo intervento e crescere verso un presidio continuativo.
              Ogni servizio ha output concreti, tempi certi e zero sorprese.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {services.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
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
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-cta text-primary-foreground font-subtitle font-bold text-base hover:opacity-90 transition-opacity shadow-lg"
            >
              <Phone size={16} />
              Prenota una call gratuita — Scopri cosa fa per te
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.08] mb-4">
              Non siamo consulenti.{" "}
              <span className="text-gradient-primary">Siamo il tuo team legale-tecnologico sull'AI.</span>
            </h2>
            <p className="text-primary-foreground/65 text-lg max-w-2xl mx-auto font-subtitle">
              Gli studi legali trattano l'AI come un contratto. I consulenti IT come una configurazione. Le agenzie come un adempimento.
              Nessuno tiene insieme i tre livelli. <strong className="text-primary-foreground">Noi sì.</strong>
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {differentiators.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
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
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-subtitle font-semibold mb-5">
                <Sparkles size={12} />
                TutelAI Platform — SaaS
              </div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight leading-[1.08] mb-5">
                Gestisci tutta la compliance AI{" "}
                <span className="text-gradient-primary">in un'unica dashboard.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8 font-subtitle">
                Non solo consulenza: TutelAI ha anche una piattaforma SaaS che ti permette di monitorare
                i tuoi sistemi AI, generare documenti aggiornati automaticamente e ricevere alert normativi in tempo reale.
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
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight leading-[1.08] mb-4">
              Le aziende che ci hanno{" "}
              <span className="text-gradient-primary">già scelto</span>
            </h2>
            <p className="text-muted-foreground font-subtitle">Risultati reali, aziende reali.</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -4 }}
                className="flex flex-col p-8 rounded-3xl border border-border bg-background hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(t.stars)].map((_, j) => (
                    <Star key={j} size={15} className="fill-primary text-primary" />
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border"
              style={{ background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.25)" }}>
              <AlertTriangle size={14} className="text-red-400" />
              <span className="text-red-400 text-xs font-subtitle font-semibold uppercase tracking-widest">
                Scadenza 2 agosto 2026 — Mancano pochi mesi
              </span>
            </div>

            <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-heading-tight leading-[1.05] mb-5">
              Scopri in 30 minuti{" "}
              <span className="text-gradient-primary">cosa rischia la tua azienda.</span>
            </h2>
            <p className="text-primary-foreground/70 text-lg sm:text-xl mb-10 max-w-xl mx-auto font-subtitle leading-relaxed">
              Una call gratuita con un esperto TutelAI. Nessun impegno, nessuna pressione.
              Solo chiarezza su dove sei e cosa fare.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <motion.button
                onClick={openModal}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-primary-foreground text-foreground font-subtitle font-bold text-lg shadow-2xl hover:opacity-90 transition-opacity"
              >
                <Phone size={20} />
                Prenota la call gratuita
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
