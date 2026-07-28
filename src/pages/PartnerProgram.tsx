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
    label: "Referral",
    sublabel: "Segnalazione qualificata",
    desc: "Istruttoria e delivery restano in capo allo studio. Condizioni nell’accordo.",
    isStatic: true,
  },
  {
    label: "€35M",
    sublabel: "Sanzione massima (art. 99)",
    desc: "L’ordine di grandezza che rende la materia non rinviabile per i tuoi assistiti.",
    isStatic: true,
  },
];

const partnerTypes = [
  {
    icon: TrendingUp,
    name: "Referral Partner",
    badge: "Referral",
    badgeStyle: "text-primary bg-primary/10",
    desc: "Segnali la posizione allo studio, che cura proposta, istruttoria e delivery. Le condizioni della collaborazione sono definite nell’accordo scritto.",
    bullets: [
      "Nessun obbligo di volume minimo",
      "Nessuna formazione obbligatoria",
      "Accesso al portale partner con tracking referral",
      "Rendicontazione periodica delle posizioni segnalate",
    ],
    ideal: "Commercialisti, consulenti del lavoro, associazioni di categoria",
    featured: false,
  },
  {
    icon: Briefcase,
    name: "Reseller Partner",
    badge: "Rivendita",
    badgeStyle: "text-primary-foreground bg-gradient-cta",
    desc: "Mantieni tu la relazione con l’assistito e ne curi la proposta; lo studio esegue l’incarico. Condizioni riservate, definite nell’accordo.",
    bullets: [
      "Accesso a tutti i servizi a condizioni riservate",
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
      "Condizioni di collaborazione definite nell'accordo",
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
    title: "Avvio della collaborazione",
    time: "Dal primo referral",
    desc: "Dalla prima posizione segnalata la collaborazione entra a regime, secondo quanto previsto dall’accordo sottoscritto.",
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
    title: "Collaborazione continuativa",
    desc: "La collaborazione non si esaurisce nella singola segnalazione: è regolata su base continuativa dall’accordo scritto.",
  },
];


// ── PAGE ────────────────────────────────────────────────────────────────────
export default function PartnerProgram() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Programma di collaborazione | TutelAI</title>
        <meta
          name="description"
          content="Programma di collaborazione TutelAI per commercialisti, studi legali e consulenti IT: referral, rivendita e white label. Condizioni definite nell’accordo, senza costi di adesione."
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
              Porta ai tuoi assistiti{" "}
              <span className="text-gradient-primary">una risposta all’AI Act.</span>
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
                Una collaborazione{" "}
                <span className="text-gradient-primary">strutturata e continuativa.</span>
              </h2>
              <p className="text-muted-foreground text-base mb-7 leading-relaxed">
                Con TutelAI il tuo assistito trova una risposta strutturata a un adempimento
                urgente, e la collaborazione è regolata da un accordo scritto.
              </p>

              <ul className="space-y-3 border-t border-border pt-6">
                {[
                  "Segnalazione qualificata: istruttoria e delivery restano in capo allo studio.",
                  "Rendicontazione periodica delle posizioni segnalate e del relativo stato.",
                  "Condizioni economiche definite nell'accordo di collaborazione, non pubblicate.",
                ].map((t) => (
                  <li key={t} className="flex gap-3 text-sm text-muted-foreground font-subtitle leading-relaxed">
                    <span className="mt-2 h-px w-4 shrink-0 bg-accent" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
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
              Dalla candidatura all’operatività in meno di due settimane.
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
              Non solo segnalazioni: metodo, strumenti e formazione per servire i tuoi assistiti.
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
                "Collaborazione continuativa",
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
