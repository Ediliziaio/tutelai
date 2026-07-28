import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  Clock,
  Phone,
  Mail,
  Linkedin,
  MessageSquare,
  Users,
  Building2,
  Star,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";

// ────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────
interface FormState {
  nome: string;
  email: string;
  azienda: string;
  dipendenti: string;
  settore: string;
  ai: string;
  canale: string;
}

// ────────────────────────────────────────────────────────────────
// Data
// ────────────────────────────────────────────────────────────────
const callSteps = [
  {
    timeLabel: "Minuto 1–5",
    title: "Capiamo la tua situazione",
    desc: "Ti chiediamo: che tipo di AI usi? Quanti dipendenti hai? Hai già qualcosa in ordine — policy, documenti, formazione? Non stiamo facendo un audit: vogliamo capire rapidamente il contesto.",
    icon: Users,
  },
  {
    timeLabel: "Minuto 6–20",
    title: "Ti diciamo cosa rischi",
    desc: "In base a quello che ci dici, identifichiamo i 2-3 rischi principali della tua azienda in questo momento. Ti diciamo quali obblighi già scattati stai potenzialmente violando e quali arrivano nei prossimi mesi.",
    icon: Building2,
  },
  {
    timeLabel: "Minuto 21–30",
    title: "Ti proponiamo un percorso",
    desc: "Se ha senso lavorare insieme, ti proponiamo il percorso più adatto — una tantum, retainer, piattaforma. Se non ha senso, te lo diciamo. Non perdiamo il tuo tempo.",
    icon: ArrowRight,
  },
];

const testimonials = [
  {
    quote:
      "In 30 minuti ho capito più cose sull'AI Act di 3 mesi di letture autonome. E soprattutto ho capito cosa rischiavo davvero.",
    name: "Marco T.",
    company: "Studio Legale, Milano",
  },
  {
    quote:
      "Pensavo di essere a posto. La call mi ha aperto gli occhi su tre cose che non sapevo nemmeno di dover fare.",
    name: "Giulia R.",
    company: "PMI manifatturiera, Brescia",
  },
];

const faqItems = [
  {
    q: "La call è davvero gratuita?",
    a: "La call è davvero gratuita. Ti ascoltiamo, ti diciamo cosa rischi, ti proponiamo cosa possiamo fare. Se non sei il cliente giusto per i nostri servizi, te lo diciamo. Non vendiamo a chi non ne ha bisogno.",
  },
  {
    q: "Siete strutturati per le piccole aziende?",
    a: "Sì. Lavoriamo con PMI da 5 dipendenti e con strutture da 300. Le PMI italiane sono le più esposte alla normativa AI proprio perché hanno meno risorse per monitorare gli aggiornamenti.",
  },
  {
    q: "Quanto tempo ci vuole per mettersi a norma?",
    a: "Dipende dalla situazione di partenza. Un'azienda che parte da zero ma usa sistemi AI a basso rischio: 2-3 settimane con il pacchetto AI Compliance Pack. Un'azienda più strutturata o con sistemi ad alto rischio: 4-8 settimane con l'AI Governance Setup.",
  },
  {
    q: "Posso iniziare dalla piattaforma senza consulenza?",
    a: "Sì. La piattaforma TutelAI è progettata per essere autonoma. Ti guida step by step attraverso l'AI Risk Scan, la documentazione e il monitoraggio normativo. La call è consigliata ma non obbligatoria.",
  },
  {
    q: "Lavorate solo con PMI italiane o anche con professionisti e studi?",
    a: "Lavoriamo con PMI italiane, studi professionali (legali, commercialisti, medici) e liberi professionisti. La Legge 132/2025 ha obblighi specifici per le professioni intellettuali — lo sappiamo bene.",
  },
];

const dipendentiOptions = ["1–10", "11–50", "51–200", "200+"];
const settoreOptions = [
  "Manifattura",
  "Commercio",
  "Servizi professionali",
  "Sanità privata",
  "Edilizia",
  "Tecnologia / IT",
  "Altro",
];
const canaleOptions = ["Google", "LinkedIn", "Passaparola", "Evento / Convegno", "Articolo / Blog", "Altro"];

// ────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────
export default function Contatti() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);

  const [form, setForm] = useState<FormState>({
    nome: "",
    email: "",
    azienda: "",
    dipendenti: "",
    settore: "",
    ai: "",
    canale: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (i: number) => setOpenFaq((prev) => (prev === i ? null : i));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    openModal();
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Contatti | TutelAI — Prenota una call gratuita di 30 minuti</title>
        <meta
          name="description"
          content="Primo colloquio gratuito di 30 minuti con i professionisti dello studio: inquadriamo i sistemi AI in uso, la tua esposizione rispetto al Regolamento UE 2024/1689 e il percorso di adeguamento, con preventivo scritto."
        />
        <link rel="canonical" href="https://tutelai.it/contatti" />
      </Helmet>

      <Navbar onCtaClick={openModal} />

      {/* ── 1. HERO ──────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-14 sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-28 overflow-hidden">
        {/* subtle bg decoration */}
        <div className="pointer-events-none absolute inset-0">
        </div>

        <div className="container mx-auto px-4 lg:px-8 max-w-3xl relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-mono-accent font-semibold tracking-widest uppercase text-primary mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Phone size={12} />
              Call gratuita · 30 minuti
            </span>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-heading-tight leading-[1.05] mb-6">
              Parliamo.{" "}
              <span className="text-gradient-primary bg-clip-text text-transparent">
                Una call gratuita
              </span>
              <br />
              di 30 minuti.
            </h1>

            <p className="text-muted-foreground text-lg lg:text-xl max-w-xl mx-auto leading-relaxed mb-8">
              Un primo colloquio conoscitivo, senza impegno e senza onorario, per inquadrare i sistemi
              in uso e la relativa esposizione normativa. Ogni incarico successivo è preceduto da
              preventivo scritto, come prescrive l'art. 13 della Legge 247/2012.
            </p>

            {/* trust badges */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "✓ Risposta entro 24h",
                "✓ Nessuna vendita forzata",
                "✓ Se non siamo la soluzione giusta, te lo diciamo",
              ].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center text-sm font-subtitle font-semibold px-4 py-2 rounded-full bg-card border border-border text-foreground"
                >
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. FORM + WHAT HAPPENS ───────────────────────────────── */}
      <section className="pb-20 lg:pb-28">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* LEFT: Contact form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm"
            >
              {submitted ? (
                <div className="text-center py-10">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5"
                  >
                    <CheckCircle2 size={40} className="text-primary" />
                  </motion.div>
                  <h3 className="font-display font-extrabold text-2xl mb-3">
                    ✓ Richiesta inviata!
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Ti contatteremo entro <strong>24 ore</strong> per confermare giorno e
                    orario della call. Controlla anche la cartella spam.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="mb-6">
                    <h2 className="font-display font-extrabold text-2xl mb-1">
                      Prenota la tua call gratuita
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Compila il form — ti rispondiamo entro 24h.
                    </p>
                  </div>

                  {/* Nome + Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-subtitle font-semibold mb-1.5">
                        Nome e cognome <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        name="nome"
                        required
                        value={form.nome}
                        onChange={handleChange}
                        placeholder="Mario Rossi"
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-subtitle font-semibold mb-1.5">
                        Email aziendale <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="mario@azienda.it"
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  {/* Azienda */}
                  <div>
                    <label className="block text-xs font-subtitle font-semibold mb-1.5">
                      Azienda <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      name="azienda"
                      required
                      value={form.azienda}
                      onChange={handleChange}
                      placeholder="Nome Azienda S.r.l."
                      className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>

                  {/* Dipendenti + Settore */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-subtitle font-semibold mb-1.5">
                        Dipendenti
                      </label>
                      <select
                        name="dipendenti"
                        value={form.dipendenti}
                        onChange={handleChange}
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      >
                        <option value="">Seleziona...</option>
                        {dipendentiOptions.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-subtitle font-semibold mb-1.5">
                        Settore
                      </label>
                      <select
                        name="settore"
                        value={form.settore}
                        onChange={handleChange}
                        className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      >
                        <option value="">Seleziona...</option>
                        {settoreOptions.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* AI textarea */}
                  <div>
                    <label className="block text-xs font-subtitle font-semibold mb-1.5">
                      Cosa usi già in azienda che pensi sia AI?
                    </label>
                    <textarea
                      name="ai"
                      value={form.ai}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Es: ChatGPT, un chatbot sul sito, software HR con scoring automatico, CRM con suggerimenti automatici..."
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  {/* Come ci hai trovato */}
                  <div>
                    <label className="block text-xs font-subtitle font-semibold mb-1.5">
                      Come ci hai trovato?
                    </label>
                    <select
                      name="canale"
                      value={form.canale}
                      onChange={handleChange}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    >
                      <option value="">Seleziona...</option>
                      {canaleOptions.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center h-13 px-8 py-3.5 rounded-full bg-gradient-cta text-primary-foreground font-subtitle font-bold text-base hover:opacity-90 transition-opacity gap-2 mt-2"
                  >
                    Prenota la call gratuita <ArrowRight size={16} />
                  </button>

                  <p className="text-xs text-muted-foreground text-center pt-1 font-mono-accent">
                    Nessuno spam. I tuoi dati non verranno ceduti a terzi.
                  </p>
                </form>
              )}

              {/* Direct contact links */}
              <div className="mt-6 pt-5 border-t border-border flex flex-wrap gap-4">
                <a
                  href="mailto:info@tutelai.it"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-subtitle"
                >
                  <Mail size={14} />
                  info@tutelai.it
                </a>
                <a
                  href="https://linkedin.com/company/tutelai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-subtitle"
                >
                  <Linkedin size={14} />
                  TutelAI su LinkedIn
                </a>
              </div>
            </motion.div>

            {/* RIGHT: What happens in a call */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-heading-tight leading-[1.1] mb-8">
                Cosa succede in una{" "}
                <span className="text-gradient-primary bg-clip-text text-transparent">
                  call con TutelAI
                </span>
              </h2>

              {/* Timeline steps */}
              <div className="space-y-5 mb-10">
                {callSteps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={i}
                      className="flex gap-5 items-start"
                    >
                      {/* time badge */}
                      <div className="shrink-0 inline-flex items-center justify-center h-10 min-w-[88px] rounded-full bg-primary/10 border border-primary/20 px-3">
                        <span className="text-xs font-mono-accent font-bold text-primary whitespace-nowrap">
                          {step.timeLabel}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Icon size={14} className="text-primary" />
                          <h3 className="font-subtitle font-bold text-base">{step.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Social proof */}
              <div className="space-y-4 mb-7">
                <p className="text-xs font-mono-accent font-semibold tracking-widest uppercase text-muted-foreground">
                  Cosa dicono chi ha già fatto la call
                </p>
                {testimonials.map((t, i) => (
                  <motion.div
                    key={i}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} size={12} className="fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground italic leading-relaxed mb-2">
                      "{t.quote}"
                    </p>
                    <p className="text-xs text-muted-foreground font-subtitle font-semibold">
                      — {t.name},{" "}
                      <span className="font-normal">{t.company}</span>
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Urgency */}
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3">
                <Clock size={18} className="text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-subtitle font-bold text-foreground mb-0.5">
                    Le slot si riempiono in fretta.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Prossima disponibilità: <strong className="text-foreground">questa settimana.</strong> Prenota subito per assicurarti il posto.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. FAQ ───────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-28 bg-card">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.div
            className="text-center mb-10"
          >
            <span className="inline-flex items-center gap-2 text-xs font-mono-accent font-semibold tracking-widest uppercase text-primary mb-4 px-3 py-1.5 rounded-full bg-primary/10">
              <MessageSquare size={12} />
              Domande frequenti
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-heading-tight">
              Hai domande? Ecco le risposte.
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                className="rounded-xl border border-border bg-background overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 hover:bg-muted/30 transition-colors"
                >
                  <span className="font-subtitle font-bold text-sm text-foreground leading-snug">
                    {item.q}
                  </span>
                  <span
                    className={`shrink-0 w-6 h-6 rounded-full border-2 border-border flex items-center justify-center text-muted-foreground transition-transform duration-200 ${
                      openFaq === i ? "rotate-45" : ""
                    }`}
                  >
                    <span className="text-lg leading-none">+</span>
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. FINAL CTA ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 lg:py-28 bg-dark-gradient text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <motion.div
          >
            <Phone size={40} className="mx-auto mb-6 text-primary/60" />
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl tracking-heading-tight text-white mb-5 leading-[1.08]">
              Ogni giorno che aspetti
              <br />
              è un giorno di{" "}
              <span className="text-gradient-primary bg-clip-text text-transparent">rischio.</span>
            </h2>
            <p className="text-white/60 text-base sm:text-lg mb-8 max-w-lg mx-auto">
              Il 2 agosto 2026 non si sposta. Prenota ora la call gratuita e capisci
              esattamente cosa deve fare la tua azienda.
            </p>
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-cta text-primary-foreground font-subtitle font-bold text-base hover:opacity-90 transition-opacity"
            >
              <Phone size={16} />
              Prenota ora — è gratuita
            </button>
            <p className="text-white/40 text-xs mt-4 font-mono-accent">
              Nessuna vendita forzata · Risposta entro 24h
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
      <LeadFormModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
