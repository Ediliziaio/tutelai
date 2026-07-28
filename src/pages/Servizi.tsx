import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, Shield, FileText, ShieldCheck, Eye, Clock, AlertTriangle, Zap, Scale, Users, Phone, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { APPLICAZIONE_GENERALE, conteggio } from "@/lib/scadenze";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";

// ── DATA ──────────────────────────────────────────────────────────────────────

const onetimeServices = [
  {
    id: "risk-scan",
    icon: Eye,
    name: "AI Risk Scan",
    price: "€990",
    delivery: "5 giorni lavorativi",
    tagline: "Il punto di partenza obbligatorio.",
    desc: "Prima di capire cosa fare, devi capire dove sei. L'AI Risk Scan è la fotografia completa dello stato di compliance AI della tua azienda: ogni sistema, ogni rischio, ogni gap.",
    for: "PMI fino a 50 dipendenti che vogliono capire il proprio livello di esposizione prima di decidere come procedere.",
    includes: [
      "Inventario completo dei sistemi AI in uso (SaaS, plugin, automazioni, gestionali)",
      "Classificazione per livello di rischio AI Act (inaccettabile/alto/limitato/minimo)",
      "Gap analysis rispetto a AI Act, GDPR e Legge 132/2025",
      "Report sintetico 10 pagine con priorità di intervento per urgenza",
      "Call di restituzione 60 min con il team TutelAI",
    ],
    cta: "Prenota il tuo AI Risk Scan",
    featured: false,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "compliance-pack",
    icon: FileText,
    name: "AI Compliance Pack",
    price: "€2.900",
    delivery: "15 giorni lavorativi",
    tagline: "Tutto il necessario per essere a norma oggi.",
    desc: "Il pacchetto più richiesto. Chiudi il capitolo compliance AI in una volta sola. Documenti personalizzati per il tuo settore — non template scaricati da internet.",
    for: "Aziende tra 20 e 100 dipendenti che usano AI attivamente e hanno bisogno di documentazione professionale e definitiva.",
    includes: [
      "AI Risk Scan completo (incluso nel prezzo)",
      "Policy uso AI interno — personalizzata per il tuo settore",
      "Informativa lavoratori AI (art. 11 Legge 132/2025) — pronta alla firma",
      "Clausole AI per contratti con clienti e fornitori",
      "Aggiornamento Registro Trattamenti GDPR con sistemi AI",
      "Disclaimer trasparenza AI per sito web e strumenti digitali",
      "2 call di supporto post-consegna (30 min ciascuna, entro 60 giorni)",
    ],
    cta: "Richiedi il pacchetto AI Compliance",
    featured: true,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    id: "governance-setup",
    icon: ShieldCheck,
    name: "AI Governance Setup",
    price: "€5.900",
    delivery: "30 giorni lavorativi",
    tagline: "Il framework completo per chi fa sul serio.",
    desc: "Per le aziende strutturate, con sistemi AI ad alto rischio, o che vogliono anticipare gli obblighi 2026-2027 senza correre ai ripari.",
    for: "Aziende con 100+ dipendenti, o con sistemi AI che impattano su HR, credito, selezione del personale, customer scoring.",
    includes: [
      "AI Compliance Pack completo (incluso nel prezzo)",
      "DPIA per i sistemi AI critici",
      "Aggiornamento Modello 231 con rischi AI (art. 21 Legge 132/2025)",
      "AI Governance Framework: ruoli, responsabilità, supervisione",
      "Procedura nomina AI Compliance Officer",
      "Programma AI Literacy con attestati (art. 4 AI Act)",
      "Setup audit trail e logging decisioni AI",
      "4 call di supporto + 30 giorni assistenza post-consegna",
    ],
    cta: "Richiedi una call conoscitiva",
    featured: false,
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

const comparison = [
  { label: "Senza TutelAI", items: ["Documenti inesistenti o generici", "Nessuna policy AI interna", "Lavoratori non informati", "Contratti senza clausole AI", "Rischio sanzione fino a €35M", "Audit = disastro"], bad: true },
  { label: "Con TutelAI", items: ["Documentazione legale completa", "Policy personalizzata per il tuo settore", "Formazione certificata e tracciata", "Contratti aggiornati e a norma", "Esposizione al rischio eliminata", "Audit = tranquillità totale"], bad: false },
];

const specialistServices = [
  {
    icon: Zap,
    name: "Voice & Agent Compliance",
    price: "da €800",
    urgent: true,
    desc: "Setup legale per chi usa chatbot, voice agent AI, assistenti vocali. Disclosure script obbligatori (dal 2 ago 2026), GDPR per chiamate registrate, contrattualistica con fornitori LLM.",
  },
  {
    icon: FileText,
    name: "Contratto SaaS / Software AI",
    price: "da €600",
    urgent: false,
    desc: "Termini e condizioni, licenze, SLA e clausole di esonero responsabilità per prodotti software con AI integrata. Per chi sviluppa o rivende software AI.",
  },
  {
    icon: Scale,
    name: "Due Diligence AI pre-M&A",
    price: "da €3.000",
    urgent: false,
    desc: "Analisi legale e tecnica della compliance AI di un'azienda target. Relazione strutturata per advisor, investitori, board. Obbligatoria nelle operazioni di M&A.",
  },
  {
    icon: Shield,
    name: "AI Litigation Support",
    price: "€150–€250/ora",
    urgent: false,
    desc: "Supporto legale in caso di contestazioni, data breach AI, ispezioni da ACN, AgID o Garante. Intervento rapido, competenza tecnica della normativa.",
  },
];

const retainerPlans = [
  {
    name: "AI Shield Base",
    price: "€290",
    period: "/mese",
    annual: "€3.480/anno — risparmia €696",
    commitment: "Min. 6 mesi",
    tagline: "La tranquillità senza il peso.",
    desc: "Per le PMI che vogliono stare aggiornate senza seguire ogni settimana l'evoluzione normativa.",
    includes: [
      "Newsletter normativa mensile filtrata per il tuo settore",
      "Aggiornamento automatico dei tuoi documenti se cambia la norma",
      "1 call mensile check-up (30 min)",
      "Risposta email entro 48h per quesiti urgenti",
      "Accesso TutelAI Platform (piano base)",
    ],
    cta: "Attiva AI Shield Base",
    featured: false,
  },
  {
    name: "AI Shield Pro",
    price: "€590",
    period: "/mese",
    annual: "€7.080/anno — risparmia €1.416",
    commitment: "Min. 6 mesi",
    tagline: "DPO esterno + AI Officer esterno. Un unico interlocutore.",
    desc: "Il piano più richiesto. Ti dà due figure obbligatorie in outsourcing completo, a meno del costo di un consulente generalista.",
    includes: [
      "Tutto di AI Shield Base",
      "DPO esterno formalmente nominato (tutti gli obblighi GDPR coperti)",
      "AI Compliance Officer esterno (raccomandato dall'AI Act)",
      "2 call mensili da 30 min — check-up + consulenza operativa",
      "Gestione data breach AI entro 72h dalla segnalazione",
      "Revisione 1 contratto AI/mese incluso",
      "Accesso TutelAI Platform (piano Pro)",
    ],
    cta: "Attiva AI Shield Pro",
    featured: true,
  },
  {
    name: "AI Shield Enterprise",
    price: "€1.490",
    period: "/mese",
    annual: "€17.880/anno",
    commitment: "Min. 12 mesi",
    tagline: "Per chi non può permettersi sorprese.",
    desc: "Banche, assicurazioni, sanità privata, studi strutturati, aziende con AI ad alto rischio. Risposta 4h, audit trimestrale, rappresentanza formale.",
    includes: [
      "Tutto di AI Shield Pro",
      "Audit AI trimestrale con report formale",
      "Rappresentanza davanti ad ACN, Garante, AgID",
      "Monitoraggio continuo sistemi AI ad alto rischio",
      "AI Literacy illimitata per tutto il team (e-learning)",
      "SLA risposta urgente: 4 ore lavorative",
      "Account manager dedicato",
      "Accesso completo TutelAI Platform (Enterprise)",
    ],
    cta: "Richiedi una call Enterprise",
    featured: false,
  },
];

const faqRetainer = [
  {
    q: "Posso attivare un retainer senza aver acquistato un servizio una tantum?",
    a: "Sì. Il primo mese include sempre un onboarding equivalente all'AI Risk Scan per capire la tua situazione di partenza. Il costo è incluso nel primo mese, senza sovrapprezzo.",
  },
  {
    q: "Posso cambiare piano nel corso del contratto?",
    a: "Puoi passare a un piano superiore in qualsiasi momento. Per il downgrade, aspettiamo il rinnovo alla scadenza minima.",
  },
  {
    q: "Cosa succede se la normativa cambia significativamente?",
    a: "È esattamente per questo che esiste il retainer. Se cambia qualcosa nell'AI Act o nella Legge 132/2025, aggiorniamo i tuoi documenti proattivamente — senza costi aggiuntivi.",
  },
  {
    q: "Quanto tempo ci vuole per attivarsi?",
    a: "L'onboarding dura 48-72 ore. Dopo la firma del contratto, il team TutelAI prenota la prima call, prende in carico la tua documentazione e inizia a lavorare.",
  },
];

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function Servizi() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const [tab, setTab] = useState<"onetime" | "retainer">("onetime");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Helmet>
        <title>Servizi AI Compliance | TutelAI — Una tantum e Retainer mensili</title>
        <meta name="description" content="AI Risk Scan €990, AI Compliance Pack €2.900, AI Governance Setup €5.900. Retainer mensili da €290. Conformità AI Act e Legge 132/2025 per PMI italiane." />
        <link rel="canonical" href="https://tutelai.it/servizi" />
      </Helmet>

      <Navbar onCtaClick={openModal} />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-20 bg-dark-gradient text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(14,165,233,0.12) 0%, transparent 60%), radial-gradient(circle at 80% 30%, rgba(16,185,129,0.1) 0%, transparent 60%)"
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-4xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border"
              style={{ background: "rgba(14,165,233,0.1)", borderColor: "rgba(14,165,233,0.25)" }}>
              <Shield size={14} className="text-primary" />
              <span className="text-xs font-subtitle font-semibold text-primary uppercase tracking-widest">Servizi</span>
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-heading-tight leading-[1.05] mb-6">
              Incarichi a perimetro definito,{" "}
              <span className="text-gradient-primary">con deliverable e termini certi.</span>
            </h1>
            <p className="text-primary-foreground/75 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8 font-subtitle">
              Ogni servizio indica gli atti che vengono prodotti, i tempi di consegna e l'onorario,
              determinato in via forfettaria e concordato per iscritto prima del conferimento.
            </p>

            {/* Tab switcher */}
            <div className="inline-flex rounded-full p-1 mb-2"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <button
                onClick={() => setTab("onetime")}
                className={`px-6 py-2.5 rounded-full text-sm font-subtitle font-semibold transition-all ${
                  tab === "onetime"
                    ? "bg-gradient-cta text-primary-foreground shadow-lg"
                    : "text-primary-foreground/60 hover:text-primary-foreground"
                }`}
              >
                Una tantum
              </button>
              <button
                onClick={() => setTab("retainer")}
                className={`px-6 py-2.5 rounded-full text-sm font-subtitle font-semibold transition-all ${
                  tab === "retainer"
                    ? "bg-gradient-cta text-primary-foreground shadow-lg"
                    : "text-primary-foreground/60 hover:text-primary-foreground"
                }`}
              >
                Retainer mensile
              </button>
            </div>
            <p className="text-primary-foreground/40 text-xs font-subtitle">
              {tab === "onetime" ? "Interventi chirurgici con output tangibili" : "Presidio continuativo a costo fisso prevedibile"}
            </p>
          </motion.div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {tab === "onetime" ? (
          <motion.div
            key="onetime"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* ── BEFORE/AFTER ─────────────────────────────────────────────────── */}
            <section className="py-16 sm:py-20 bg-card border-b border-border">
              <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
                <motion.div
                  className="text-center mb-10">
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-heading-tight mb-3">
                    La differenza è <span className="text-gradient-primary">tutto</span>
                  </h2>
                  <p className="text-muted-foreground font-subtitle">Stessa azienda, stesso AI Act. Ma una è esposta, l'altra è protetta.</p>
                </motion.div>
                <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  {comparison.map((col, ci) => (
                    <motion.div key={ci}
                      className={`rounded-2xl p-6 border ${col.bad
                        ? "border-destructive/20 bg-destructive/5"
                        : "border-primary/20 bg-primary/5"
                      }`}
                    >
                      <h3 className={`font-subtitle font-bold text-sm mb-4 uppercase tracking-widest ${col.bad ? "text-destructive" : "text-primary"}`}>
                        {col.bad ? "✗ " : "✓ "}{col.label}
                      </h3>
                      <ul className="space-y-2.5">
                        {col.items.map((item, ii) => (
                          <li key={ii} className="flex items-center gap-2.5 text-sm font-subtitle">
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                              col.bad ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary"
                            }`}>{col.bad ? "✗" : "✓"}</span>
                            <span className={col.bad ? "text-muted-foreground" : "text-foreground"}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── ONE-TIME SERVICES ─────────────────────────────────────────────── */}
            <section className="py-16 sm:py-24">
              <div className="container mx-auto px-4 lg:px-8">
                <motion.div
                  className="text-center mb-14">
                  <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.08] mb-4">
                    Interventi mirati,{" "}
                    <span className="text-gradient-primary">risultati concreti</span>
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-subtitle">
                    Non hai bisogno di un consulente a tempo indeterminato per iniziare.
                    I nostri servizi sono interventi chirurgici: analisi, documenti, setup. Consegnati in tempi certi.
                  </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {onetimeServices.map((s, i) => (
                    <motion.div key={s.id}
                      whileHover={{ y: -4 }}
                      className={`relative flex flex-col rounded-3xl border transition-all duration-300 overflow-hidden ${
                        s.featured
                          ? "border-primary shadow-[0_20px_60px_rgba(14,165,233,0.2)]"
                          : "border-border hover:border-primary/30 hover:shadow-lg"
                      }`}
                    >
                      {s.featured && (
                        <div className="bg-gradient-cta text-primary-foreground text-xs font-subtitle font-bold px-4 py-2 text-center">
                          ⭐ Più richiesto — Il punto di partenza ideale
                        </div>
                      )}
                      <div className="flex flex-col flex-1 p-7 bg-background">
                        <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center mb-5`}>
                          <s.icon size={22} className={s.color} />
                        </div>
                        <div className="mb-4">
                          <h3 className="font-display font-extrabold text-xl mb-1">{s.name}</h3>
                          <div className="flex items-center gap-3">
                            <span className="font-display font-extrabold text-3xl tracking-stat-tight">{s.price}</span>
                            <div className="flex items-center gap-1 text-xs text-primary font-subtitle font-semibold bg-primary/10 px-2.5 py-1 rounded-full">
                              <Clock size={11} />
                              {s.delivery}
                            </div>
                          </div>
                        </div>
                        <p className="font-subtitle font-bold text-sm mb-2 text-foreground">{s.tagline}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-5 font-subtitle">{s.desc}</p>

                        <div className="space-y-2.5 mb-5 flex-1">
                          {s.includes.map((item, j) => (
                            <div key={j} className="flex items-start gap-2.5">
                              <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
                              <span className="text-xs text-muted-foreground leading-relaxed font-subtitle">{item}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-5 border-t border-border mb-5">
                          <p className="text-xs text-muted-foreground font-subtitle italic leading-relaxed">
                            <strong className="text-foreground not-italic">Per chi è: </strong>{s.for}
                          </p>
                        </div>

                        <motion.button
                          onClick={openModal}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full font-subtitle font-bold text-sm transition-all ${
                            s.featured
                              ? "bg-gradient-cta text-primary-foreground hover:opacity-90 shadow-lg"
                              : "border border-border hover:bg-card text-foreground"
                          }`}
                        >
                          {s.cta} <ArrowRight size={14} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Urgency strip */}
                <motion.div
                  className="mt-10 max-w-3xl mx-auto flex items-center gap-4 p-4 rounded-2xl border border-destructive/25 bg-destructive/5">
                  <AlertTriangle size={20} className="text-destructive shrink-0" />
                  <p className="text-sm font-subtitle text-foreground">
                    <strong className="text-destructive">Termine 2 agosto 2026:</strong> obblighi di trasparenza ex art. 50 per chatbot e voice agent.
                    Se il tuo sito ne impiega uno, <strong>{conteggio(APPLICAZIONE_GENERALE)}</strong> per adeguarti.
                  </p>
                  <button onClick={openModal} className="shrink-0 text-xs font-subtitle font-bold text-destructive hover:opacity-70 transition-opacity whitespace-nowrap">
                    Agisci ora →
                  </button>
                </motion.div>
              </div>
            </section>

            {/* ── SPECIALIST SERVICES ──────────────────────────────────────────── */}
            <section className="py-16 sm:py-20 bg-card">
              <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
                <motion.div
                  className="text-center mb-12">
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-heading-tight mb-3">
                    Servizi <span className="text-gradient-primary">specialistici</span>
                  </h2>
                  <p className="text-muted-foreground font-subtitle">Hai un'esigenza specifica? Abbiamo la risposta.</p>
                </motion.div>
                <div className="grid sm:grid-cols-2 gap-5">
                  {specialistServices.map((s, i) => (
                    <motion.div key={i}
                      whileHover={{ y: -3 }}
                      className="p-6 rounded-2xl border border-border bg-background hover:border-primary/30 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-4 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <s.icon size={18} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-subtitle font-bold text-base">{s.name}</h3>
                            {s.urgent && (
                              <span className="text-[10px] font-subtitle font-bold bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">TERMINE 2 AGO 2026</span>
                            )}
                          </div>
                          <span className="text-sm font-mono-accent font-bold text-primary">{s.price}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed font-subtitle">{s.desc}</p>
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  className="text-center mt-8">
                  <button onClick={openModal}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-sm font-subtitle font-semibold hover:bg-card transition-colors">
                    Hai un'esigenza specifica? Parliamone <ArrowRight size={14} />
                  </button>
                </motion.div>
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div
            key="retainer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* ── RETAINER PLANS ───────────────────────────────────────────────── */}
            <section className="py-16 sm:py-24">
              <div className="container mx-auto px-4 lg:px-8">
                <motion.div
                  className="text-center mb-14">
                  <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.08] mb-4">
                    Il tuo team legale-AI,{" "}
                    <span className="text-gradient-primary">sempre operativo</span>
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-subtitle">
                    La normativa AI evolve ogni mese. Chi la presidia in modo continuativo dorme meglio —
                    e costa molto meno di chi corre ai ripari dopo una sanzione.
                  </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {retainerPlans.map((p, i) => (
                    <motion.div key={p.name}
                      whileHover={{ y: -4 }}
                      className={`relative flex flex-col rounded-3xl border overflow-hidden transition-all duration-300 ${
                        p.featured
                          ? "border-primary shadow-[0_20px_60px_rgba(14,165,233,0.2)]"
                          : "border-border hover:border-primary/30 hover:shadow-lg"
                      }`}
                    >
                      {p.featured && (
                        <div className="bg-gradient-cta text-primary-foreground text-xs font-subtitle font-bold px-4 py-2 text-center">
                          ⭐ Il più richiesto — DPO + AI Officer inclusi
                        </div>
                      )}
                      <div className="flex flex-col flex-1 p-7 bg-background">
                        <div className="mb-5">
                          <h3 className="font-display font-extrabold text-xl mb-1">{p.name}</h3>
                          <span className="text-xs font-subtitle font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">{p.commitment}</span>
                        </div>
                        <div className="flex items-end gap-1 mb-1">
                          <span className="font-display font-extrabold text-4xl tracking-stat-tight">{p.price}</span>
                          <span className="text-muted-foreground text-base mb-1.5 font-subtitle">{p.period}</span>
                        </div>
                        <p className="text-xs text-primary font-subtitle font-semibold mb-4">{p.annual}</p>
                        <p className="font-subtitle font-bold text-sm mb-2">{p.tagline}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-5 font-subtitle">{p.desc}</p>
                        <div className="space-y-2.5 flex-1 mb-6">
                          {p.includes.map((item, j) => (
                            <div key={j} className="flex items-start gap-2.5">
                              <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
                              <span className="text-xs text-muted-foreground leading-relaxed font-subtitle">{item}</span>
                            </div>
                          ))}
                        </div>
                        <motion.button onClick={openModal}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          className={`w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full font-subtitle font-bold text-sm transition-all ${
                            p.featured
                              ? "bg-gradient-cta text-primary-foreground hover:opacity-90 shadow-lg"
                              : "border border-border hover:bg-card text-foreground"
                          }`}
                        >
                          {p.cta} <ArrowRight size={14} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── RETAINER FAQ ─────────────────────────────────────────────────── */}
            <section className="py-16 sm:py-20 bg-card">
              <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
                <motion.h2
                  className="font-display font-extrabold text-2xl sm:text-3xl tracking-heading-tight mb-10 text-center">
                  Domande sui retainer
                </motion.h2>
                <div className="space-y-3">
                  {faqRetainer.map((f, i) => (
                    <motion.div key={i}
                      className="rounded-2xl border border-border bg-background overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex items-center justify-between gap-4 p-5 text-left"
                      >
                        <span className="font-subtitle font-bold text-sm">{f.q}</span>
                        <span className={`text-primary text-lg font-bold transition-transform ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                      </button>
                      <AnimatePresence>
                        {openFaq === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed font-subtitle">{f.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 border-t border-border">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.h2
            className="font-display font-extrabold text-2xl sm:text-3xl tracking-heading-tight mb-10 text-center">
            Chi ha già scelto <span className="text-gradient-primary">TutelAI</span>
          </motion.h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { q: "L'AI Compliance Pack ci ha salvato da un audit a sorpresa. Documenti perfetti, tutto in 15 giorni come promesso.", name: "Marco R.", role: "CEO — Manifattura, 45 dip." },
              { q: "Con l'AI Shield Pro ho un DPO e un AI Officer disponibili ogni mese. Costa meno di un consulente generalista e lavora su cose reali.", name: "Avv. Giulia M.", role: "Partner — Studio legale, Milano" },
            ].map((t, i) => (
              <motion.div key={i}
                className="p-7 rounded-3xl border border-border bg-card"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} className="fill-primary text-primary" />)}
                </div>
                <p className="text-foreground font-subtitle italic text-sm leading-relaxed mb-5">"{t.q}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-9 h-9 rounded-full bg-gradient-cta flex items-center justify-center shrink-0">
                    <span className="text-primary-foreground font-display font-bold text-sm">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-subtitle font-bold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-dark-gradient text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-3xl">
          <motion.div   >
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.08] mb-5">
              Non sai da dove iniziare?
            </h2>
            <p className="text-primary-foreground/75 text-lg mb-8 max-w-xl mx-auto font-subtitle">
              30 minuti di call gratuita. Ti diciamo in quale pacchetto rientri, perché, e cosa cambia nel tuo caso specifico.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button onClick={openModal}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary-foreground text-foreground font-subtitle font-bold text-base hover:opacity-90 transition-opacity shadow-xl">
                <Phone size={16} />
                Prenota la call gratuita <ArrowRight size={16} />
              </motion.button>
              <Link to="/piattaforma"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-subtitle font-semibold text-base transition-colors"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                Oppure prova la piattaforma →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <LeadFormModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
