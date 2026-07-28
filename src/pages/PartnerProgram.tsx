import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Star,
  Zap,
  Globe,
  Award,
  Calculator,
  Phone,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";

// ── ANIMATED COUNTER ────────────────────────────────────────────────────────
function Counter({
  to,
  suffix = "",
  prefix = "",
  duration = 1800,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  return (
    <span>
      {prefix}
      {to.toLocaleString("it-IT")}
      {suffix}
    </span>
  );
}

// ── DATA ────────────────────────────────────────────────────────────────────
const opportunityStats = [
  {
    label: "6,2M+",
    sublabel: "PMI italiane da servire",
    desc: "Un mercato vergine. Quasi nessuna è in regola con l'AI Act.",
    isStatic: true,
  },
  {
    label: "2 ago 2026",
    sublabel: "Prossima scadenza chiave",
    desc: "Disclosure obbligatoria per chatbot e voice agent. I tuoi clienti non lo sanno.",
    isStatic: true,
  },
  {
    label: "20%",
    sublabel: "Commissione ricorrente",
    desc: "Fino a 24 mesi per ogni cliente referral. Entrate passive che si accumulano.",
    isStatic: true,
  },
  {
    label: "€35M",
    sublabel: "Multa massima AI Act",
    desc: "Il numero che spaventa i tuoi clienti — e che ti apre la porta alla conversazione.",
    isStatic: true,
  },
];

const partnerTypes = [
  {
    icon: TrendingUp,
    name: "Referral Partner",
    badge: "Commissione 20%",
    badgeStyle: "text-primary bg-primary/10",
    desc: "Segnali i tuoi clienti a TutelAI. Noi gestiamo tutto — dalla proposta alla delivery. Tu ricevi il 20% ricorrente su ogni contratto firmato, per 24 mesi.",
    bullets: [
      "Nessun obbligo di volume minimo",
      "Nessuna formazione obbligatoria",
      "Accesso al portale partner con tracking referral",
      "Commissioni pagate mensilmente",
    ],
    ideal: "Commercialisti, consulenti del lavoro, associazioni di categoria",
    featured: false,
  },
  {
    icon: Briefcase,
    name: "Reseller Partner",
    badge: "Margine 30%",
    badgeStyle: "text-primary-foreground bg-gradient-cta",
    desc: "Acquisti i nostri servizi a prezzo riservato e li rivendi ai tuoi clienti al tuo prezzo. Hai il controllo della relazione commerciale — noi facciamo il delivery.",
    bullets: [
      "Accesso a tutti i servizi con sconto 30%",
      "Materiali di vendita e presentazioni clienti",
      "Formazione dedicata per il tuo team",
      "Supporto tecnico-legale su ogni progetto",
    ],
    ideal: "Studi legali, società di consulenza IT, system integrator",
    featured: true,
  },
  {
    icon: Star,
    name: "White Label",
    badge: "Piattaforma brandizzata",
    badgeStyle: "text-primary bg-primary/10",
    desc: "La TutelAI Platform diventa il tuo strumento: con il tuo brand, il tuo dominio, i tuoi colori. I tuoi clienti non vedono TutelAI — vedono te.",
    bullets: [
      "Piattaforma completa white label",
      "Dominio e brand personalizzati",
      "Setup e onboarding dedicato",
      "Revenue share su abbonamenti clienti",
    ],
    ideal: "Studi legali strutturati, reti professionali, big consulting",
    featured: false,
  },
];

const processSteps = [
  {
    num: "01",
    icon: Phone,
    title: "Compila il form",
    time: "2 minuti",
    desc: "Dicci chi sei, cosa fai e quanti clienti potresti portare. Nessun impegno — solo informazioni per preparare la call.",
  },
  {
    num: "02",
    icon: Users,
    title: "Call conoscitiva",
    time: "30 minuti",
    desc: "Una conversazione diretta con il nostro team. Capiamo il tuo portfolio clienti e identifichiamo il modello di partnership più adatto.",
  },
  {
    num: "03",
    icon: Zap,
    title: "Onboarding e formazione",
    time: "1 settimana",
    desc: "Accesso alla piattaforma partner, materiali di vendita, formazione sulla normativa AI. Pronti per parlare con i tuoi clienti.",
  },
  {
    num: "04",
    icon: Calculator,
    title: "Inizia a guadagnare",
    time: "Dal primo referral",
    desc: "Il primo cliente che porti attiva le commissioni. Le ricevi ogni mese, per 24 mesi. Costruisci un flusso di entrate ricorrenti.",
  },
];

const benefits = [
  {
    icon: Globe,
    title: "Accesso alla TutelAI Platform",
    desc: "Account demo illimitato per mostrare la piattaforma ai tuoi clienti in tempo reale.",
  },
  {
    icon: Award,
    title: "Certificazione Partner TutelAI",
    desc: "Listed sul sito TutelAI come partner certificato — credibilità immediata con i tuoi clienti.",
  },
  {
    icon: Briefcase,
    title: "Materiali di vendita pronti",
    desc: "Presentazioni, one-pager, email template, FAQ clienti. Non devi costruire nulla da zero.",
  },
  {
    icon: Zap,
    title: "Formazione normativa inclusa",
    desc: "Formazione dedicata sulla normativa AI per te e il tuo team. Newsletter mensile con aggiornamenti anticipati.",
  },
  {
    icon: Users,
    title: "Supporto tecnico-legale",
    desc: "Per i progetti clienti complessi, il nostro team ti affianca. Hai sempre un esperto pronto.",
  },
  {
    icon: TrendingUp,
    title: "Referral inverse",
    desc: "I clienti TutelAI che cercano un avvocato, commercialista o consulente IT nella tua area vengono indirizzati a te.",
  },
  {
    icon: CheckCircle2,
    title: "Commissioni ricorrenti 24 mesi",
    desc: "Non una tantum. Per ogni cliente che porti, ricevi il 20% per 24 mesi. Entrate passive che crescono nel tempo.",
  },
];

// Earning calculator data
const earningExamples = [
  { clients: 5, monthly: "€290–€580", annual: "€3.480–€6.960" },
  { clients: 10, monthly: "€580–€1.160", annual: "€6.960–€13.920" },
  { clients: 20, monthly: "€1.160–€2.320", annual: "€13.920–€27.840" },
];

// ── PAGE ────────────────────────────────────────────────────────────────────
export default function PartnerProgram() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Partner Program | TutelAI — Guadagna con la compliance AI</title>
        <meta
          name="description"
          content="Aggiungi €50.000+ di ricavi annui al tuo studio. Referral 20%, Reseller 30%, White Label. Per commercialisti, studi legali, consulenti IT. Nessun costo di iscrizione."
        />
        <link rel="canonical" href="https://tutelai.it/partner" />
        <meta property="og:title" content="Partner Program | TutelAI" />
        <meta
          property="og:description"
          content="Il mercato della compliance AI vale miliardi. I tuoi clienti ne hanno bisogno adesso. TutelAI ti dà gli strumenti per servirli subito."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <Navbar onCtaClick={openModal} />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="bg-dark-gradient text-primary-foreground pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-44 lg:pb-36 relative overflow-hidden">
        {/* Ambient glows */}
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-4xl relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block text-xs font-mono-accent font-bold tracking-widest uppercase text-primary mb-6 px-4 py-2 rounded-full border border-primary/30 bg-primary/10">
              Partner Program
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-heading-tight leading-[1.04] mb-6">
              Aggiungi{" "}
              <span className="text-gradient-primary">€50.000+</span>
              <br />
              di ricavi annui al tuo studio.
            </h1>
            <p className="text-primary-foreground/70 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
              Con l'applicazione generale del Regolamento dal 2 agosto 2026, i tuoi assistiti devono
              adeguarsi in tempi brevi. TutelAI mette a disposizione metodologia, applicativo e
              formazione per erogare il servizio senza sviluppare una competenza interna da zero.
            </p>
            <p className="text-primary-foreground/45 text-xs max-w-2xl mx-auto leading-relaxed mb-10">
              Le forme di collaborazione con professionisti iscritti ad albi sono definite nel rispetto
              dei rispettivi ordinamenti deontologici e concordate caso per caso.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={openModal}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-cta text-primary-foreground font-subtitle font-bold text-base hover:opacity-90 transition-opacity shadow-lg"
              >
                Diventa partner ora
                <ArrowRight size={18} />
              </button>
              <a
                href="#come-funziona"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/20 text-primary-foreground/80 font-subtitle font-semibold text-base hover:border-white/40 hover:text-primary-foreground transition-all"
              >
                Scopri come funziona
                <ArrowRight size={18} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── OPPORTUNITY STATS ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-card">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.p
            className="text-center text-muted-foreground text-sm font-mono-accent uppercase tracking-widest mb-10"
          >
            I numeri che devi conoscere
          </motion.p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {opportunityStats.map((s, i) => (
              <motion.div
                key={i}
                className="text-center p-6 rounded-2xl border border-border bg-background hover:border-primary/30 transition-colors"
              >
                <p className="font-display font-extrabold text-3xl sm:text-4xl tracking-stat-tight text-gradient-primary mb-1">
                  {s.label}
                </p>
                <p className="font-subtitle font-bold text-sm text-foreground mb-2">{s.sublabel}</p>
                <p className="text-xs text-muted-foreground leading-snug">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM / OPPORTUNITY ─────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 lg:py-36 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: il problema */}
            <motion.div
            >
              <span className="inline-block text-xs font-mono-accent font-bold tracking-widest uppercase text-destructive mb-4 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20">
                Il problema
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight leading-[1.08] mb-6">
                I tuoi clienti stanno{" "}
                <span className="text-destructive">violando la legge</span>{" "}
                e non lo sanno.
              </h2>
              <div className="space-y-4 text-foreground/70 text-base leading-relaxed">
                <p>
                  Se sei un commercialista, hai clienti che usano ChatGPT per le fatture, un
                  gestionale con AI predittiva, o un chatbot sul sito. Tutti esposti all'AI Act.
                  Nessuno ha una policy.
                </p>
                <p>
                  Se sei un avvocato, i tuoi clienti firmano contratti con fornitori AI senza
                  clausole adeguate. I loro dipendenti usano strumenti AI senza formazione
                  documentata. Articolo 4 AI Act — violazione diretta.
                </p>
                <p>
                  Se sei un consulente IT, installi software AI senza fornire la documentazione
                  di conformità. Il cliente pensa che sia "roba tua". Spoiler: è roba sua.
                </p>
                <p className="font-subtitle font-semibold text-foreground">
                  La scadenza del 2 agosto 2026 si avvicina. Chi arriva dopo, paga le conseguenze.
                </p>
              </div>
            </motion.div>

            {/* Right: la tua opportunità + earning calc */}
            <motion.div
            >
              <span className="inline-block text-xs font-mono-accent font-bold tracking-widest uppercase text-primary mb-4 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                La tua opportunità
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight leading-[1.08] mb-6">
                Ogni cliente è una{" "}
                <span className="text-gradient-primary">commissione ricorrente.</span>
              </h2>
              <p className="text-muted-foreground text-base mb-7 leading-relaxed">
                Con TutelAI trasformi un problema urgente dei tuoi clienti in entrate passive per
                te. Ecco cosa puoi guadagnare come Referral Partner (20%):
              </p>

              {/* Earning calculator visual */}
              <div
                className="p-px rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, hsl(199 89% 48%), hsl(160 84% 39%))",
                }}
              >
                <div className="bg-card rounded-2xl overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-cta px-5 py-3 flex items-center gap-2">
                    <Calculator size={16} className="text-primary-foreground" />
                    <span className="font-mono-accent text-xs font-bold text-primary-foreground uppercase tracking-widest">
                      Simulatore commissioni
                    </span>
                  </div>
                  {/* Rows */}
                  <div className="divide-y divide-border">
                    <div className="grid grid-cols-3 px-5 py-2.5 bg-muted/50">
                      <span className="text-xs font-mono-accent text-muted-foreground uppercase">Clienti</span>
                      <span className="text-xs font-mono-accent text-muted-foreground uppercase">/ mese</span>
                      <span className="text-xs font-mono-accent text-muted-foreground uppercase">/ anno</span>
                    </div>
                    {earningExamples.map((row, i) => (
                      <div key={i} className="grid grid-cols-3 px-5 py-3.5 hover:bg-muted/30 transition-colors">
                        <span className="font-display font-extrabold text-base text-foreground">
                          {row.clients}
                        </span>
                        <span className="font-subtitle font-bold text-base text-gradient-primary">
                          {row.monthly}
                        </span>
                        <span className="font-subtitle font-semibold text-sm text-muted-foreground">
                          {row.annual}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-3 bg-muted/20">
                    <p className="text-xs text-muted-foreground font-subtitle">
                      * Stime basate su servizi TutelAI da €145–€290/mese. Commissione 20% per 24 mesi.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── THREE PARTNERSHIP MODELS ──────────────────────────────────────── */}
      <section className="py-20 sm:py-28 lg:py-36 bg-card">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div
            className="text-center mb-14"
          >
            <span className="inline-block text-xs font-mono-accent font-bold tracking-widest uppercase text-primary mb-4">
              I modelli
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.08] mb-4">
              Tre modelli di{" "}
              <span className="text-gradient-primary">partnership</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Scegli quello che si adatta alla tua struttura. Puoi cambiare modello in qualsiasi momento.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {partnerTypes.map((p, i) => (
              <motion.div
                key={i}
                className={`flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 ${
                  p.featured
                    ? "border-primary shadow-2xl ring-2 ring-primary/20 bg-background"
                    : "border-border bg-background hover:border-primary/30 hover:shadow-lg"
                }`}
              >
                {/* Featured ribbon */}
                {p.featured && (
                  <div className="bg-gradient-cta px-5 py-2.5 text-center">
                    <span className="text-xs font-mono-accent font-bold text-primary-foreground uppercase tracking-widest">
                      Piu scelto
                    </span>
                  </div>
                )}

                <div className="p-7 flex flex-col flex-1">
                  {/* Icon + badge */}
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        p.featured ? "bg-gradient-cta" : "bg-primary/10"
                      }`}
                    >
                      <p.icon
                        size={22}
                        className={p.featured ? "text-primary-foreground" : "text-primary"}
                      />
                    </div>
                    <span
                      className={`text-xs font-subtitle font-bold px-3 py-1.5 rounded-full shrink-0 ${p.badgeStyle}`}
                    >
                      {p.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-xl mb-3">{p.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{p.desc}</p>

                  {/* Bullet list */}
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {p.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
                        <span className="text-xs text-muted-foreground leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Ideal for */}
                  <div className="pt-5 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      <strong className="text-foreground font-subtitle">Ideale per:</strong>{" "}
                      {p.ideal}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────────────────────────────── */}
      <section id="come-funziona" className="py-20 sm:py-28 lg:py-36 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div
            className="text-center mb-14"
          >
            <span className="inline-block text-xs font-mono-accent font-bold tracking-widest uppercase text-primary mb-4">
              Come funziona
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.08] mb-4">
              Diventa partner in{" "}
              <span className="text-gradient-primary">4 passi</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Da zero a commissioni ricorrenti in meno di due settimane.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                className="flex gap-5 p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300"
              >
                {/* Number badge */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-cta text-primary-foreground flex items-center justify-center font-mono-accent font-bold text-sm">
                    {step.num}
                  </div>
                </div>
                {/* Content */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-subtitle font-bold text-base text-foreground">
                      {step.title}
                    </h3>
                    <span className="text-xs font-mono-accent text-primary/70 border border-primary/20 px-2 py-0.5 rounded-full">
                      {step.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ──────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 lg:py-36 bg-card">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div
            className="text-center mb-14"
          >
            <span className="inline-block text-xs font-mono-accent font-bold tracking-widest uppercase text-primary mb-4">
              Cosa ottieni
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.08] mb-4">
              Cosa ricevi come{" "}
              <span className="text-gradient-primary">partner</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Non solo commissioni. Un ecosistema completo per servire i tuoi clienti.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                className="flex gap-4 p-5 rounded-xl border border-border bg-background hover:border-primary/30 hover:shadow-sm transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-cta flex items-center justify-center shrink-0">
                  <b.icon size={18} className="text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-subtitle font-bold text-sm text-foreground mb-1">{b.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 lg:py-36 bg-dark-gradient text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-gradient-cta pointer-events-none" />
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-3xl relative">
          <motion.div
          >
            <span className="inline-block text-xs font-mono-accent font-bold tracking-widest uppercase text-primary mb-6">
              Unisciti al programma
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl tracking-heading-tight leading-[1.04] mb-5">
              Diventa partner{" "}
              <span className="text-gradient-primary">TutelAI.</span>
            </h2>
            <p className="text-primary-foreground/65 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Ricontattiamo entro 24 ore. Una call, nessun impegno. Poi decidi tu se ha senso
              per il tuo studio.
            </p>
            <button
              onClick={openModal}
              className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-gradient-cta text-primary-foreground font-subtitle font-bold text-lg hover:opacity-90 transition-opacity shadow-2xl"
            >
              Diventa partner ora
              <ArrowRight size={20} />
            </button>
            <div className="mt-6 flex items-center justify-center gap-6 flex-wrap">
              {[
                "Nessun costo di iscrizione",
                "Formazione inclusa",
                "Commissioni ricorrenti",
              ].map((trust, i) => (
                <span key={i} className="flex items-center gap-1.5 text-sm text-primary-foreground/50 font-subtitle">
                  <CheckCircle2 size={14} className="text-primary/60" />
                  {trust}
                </span>
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
