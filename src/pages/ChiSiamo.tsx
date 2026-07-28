import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Scale, Cpu, Users, Target, ArrowRight, Building2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";

// ── ANIMATED COUNTER ────────────────────────────────────────────────────────
function Counter({
  to,
  suffix = "",
  prefix = "",
  duration = 1800,
  isString = false,
  stringVal = "",
}: {
  to?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  isString?: boolean;
  stringVal?: string;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView || isString || to === undefined) return;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      setVal(Math.floor((1 - (1 - p) ** 3) * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to, duration, isString]);

  if (isString) {
    return <span ref={ref}>{stringVal}</span>;
  }
  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString("it-IT")}
      {suffix}
    </span>
  );
}

// ── DATA ────────────────────────────────────────────────────────────────────
const stats = [
  { prefix: "", to: 8, suffix: "+", label: "anni di esperienza nella digitalizzazione PMI" },
  { prefix: "", to: 4, suffix: "M+", label: "PMI italiane esposte all'AI Act" },
  { prefix: "", to: 98, suffix: "%", label: "PMI senza una policy AI interna" },
  { prefix: "", to: 5, suffix: " giorni", label: "per il primo AI Risk Report" },
];

const values = [
  {
    icon: Scale,
    title: "Specializzazione, non consulenza generalista",
    desc: "Avvocati che hanno studiato il Regolamento articolo per articolo e seguono la normativa italiana sull'intelligenza artificiale dalla pubblicazione in Gazzetta Ufficiale, con aggiornamento continuo sugli orientamenti applicativi.",
  },
  {
    icon: Cpu,
    title: "Istruttoria tecnica interna",
    desc: "Conosciamo il funzionamento dei modelli linguistici, dei voice agent, dei CRM con componenti predittive e dei gestionali con scoring. La qualificazione giuridica presuppone l'accertamento di cosa il sistema esegua in concreto.",
  },
  {
    icon: Users,
    title: "Atti, non pareri interlocutori",
    desc: "L'assistenza si conclude con documenti adottabili: policy, informative, clausole contrattuali, registro dei sistemi e attestati di formazione nominativi. Materiale opponibile in sede di verifica, non relazioni descrittive.",
  },
  {
    icon: Target,
    title: "Assistenza dedicata alle PMI",
    desc: "Le imprese strutturate dispongono di direzioni legali interne; le PMI no. Operiamo su questo segmento con onorari determinati in via forfettaria e preventivati per iscritto, come prescrive l'art. 13 della Legge 247/2012.",
  },
];

const timeline = [
  {
    year: "2016",
    title: "AEDIX fondata",
    desc: "Florin Andriciuc fonda AEDIX, holding di brand verticali nel mondo della digitalizzazione delle imprese italiane.",
  },
  {
    year: "2024",
    title: "L'AI Act come opportunità",
    desc: "Il team riconosce nel regolamento europeo la stessa dinamica del GDPR 2018: un mercato impreparato con una finestra temporale di vantaggio per chi si muove prima.",
  },
  {
    year: "2025",
    title: "Costituzione di TutelAI",
    desc: "Nasce lo studio dedicato alla materia: una rete di avvocati specializzati sul Regolamento, affiancata da un presidio tecnico interno per l'istruttoria sui sistemi.",
  },
  {
    year: "2026",
    title: "Il termine del 2 agosto",
    desc: "Con l'applicazione generale del Regolamento prevista dall'art. 113, gli obblighi di trasparenza dell'art. 50 e la disciplina dell'Allegato III diventano esigibili nei confronti delle imprese che impiegano sistemi di AI.",
  },
];

const steps = [
  {
    num: "01",
    title: "Ascoltiamo",
    desc: "Analizziamo i tuoi sistemi AI, la tua struttura aziendale, la tua esposizione normativa. Una conversazione onesta, senza impegno e senza consulenze inutili.",
  },
  {
    num: "02",
    title: "Progettiamo",
    desc: "Definiamo il percorso di compliance più adatto: una tantum, retainer o piattaforma. Tempi certi, output concreti, zero teoria.",
  },
  {
    num: "03",
    title: "Restiamo",
    desc: "La normativa AI evolve ogni mese. Siamo il tuo presidio continuativo: ti avvisiamo prima che cambi qualcosa, aggiorniamo i tuoi documenti, teniamo il controllo mentre tu fai impresa.",
  },
];

// ── PAGE ────────────────────────────────────────────────────────────────────
export default function ChiSiamo() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Chi Siamo | TutelAI — Studio legale specializzato in AI Act</title>
        <meta
          name="description"
          content="TutelAI è lo studio legale che assiste le PMI italiane in materia di intelligenza artificiale: una rete di avvocati iscritti all'albo, specializzati sul Regolamento UE 2024/1689 e sulla Legge 132/2025, affiancata da competenze tecniche interne."
        />
        <link rel="canonical" href="https://tutelai.it/chi-siamo" />
        <meta property="og:title" content="Chi Siamo | TutelAI" />
        <meta property="og:description" content="Studio legale e rete di avvocati specializzati in AI Act per le PMI italiane." />
        <meta property="og:type" content="website" />
      </Helmet>

      <Navbar onCtaClick={openModal} />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="bg-dark-gradient text-primary-foreground pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-44 lg:pb-36 relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 text-center max-w-4xl relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block text-xs font-mono-accent font-bold tracking-widest uppercase text-primary mb-6 px-4 py-2 rounded-full border border-primary/30 bg-primary/10">
              Chi Siamo
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-heading-tight leading-[1.04] mb-6">
              Uno studio legale
              <br />
              <span className="text-gradient-primary">
                dedicato all'intelligenza artificiale.
              </span>
            </h1>
            <p className="text-primary-foreground/70 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
              Una rete di avvocati iscritti all'albo, specializzati sul Regolamento UE 2024/1689 e sulla
              Legge 132/2025, affiancata da competenze tecniche interne. Assistiamo le PMI italiane che
              impiegano sistemi di intelligenza artificiale nei processi aziendali, spesso senza averli
              ancora qualificati come tali.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={openModal}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-cta text-primary-foreground font-subtitle font-bold text-base hover:opacity-90 transition-opacity shadow-lg"
              >
                Prenota una call gratuita
                <ArrowRight size={18} />
              </button>
              <Link
                to="/servizi"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/20 text-primary-foreground/80 font-subtitle font-semibold text-base hover:border-white/40 hover:text-primary-foreground transition-all"
              >
                Scopri i servizi
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MANIFESTO ─────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 lg:py-36 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-mono-accent font-bold tracking-widest uppercase text-primary mb-4">
              Il nostro manifesto
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.08] mb-12">
              Perché esiste{" "}
              <span className="text-gradient-primary">TutelAI</span>
            </h2>

            <div className="space-y-7 text-foreground/70 text-lg leading-relaxed">
              <p>
                In Italia operano oltre <strong className="text-foreground">4 milioni di PMI</strong>.
                Una parte consistente impiega già sistemi di intelligenza artificiale in qualche forma —
                modelli linguistici per la redazione di testi, chatbot sul sito, gestionali con
                raccomandazioni automatiche, voice agent nel servizio clienti — senza averli qualificati
                come tali.{" "}
                <strong className="text-foreground">Nella maggior parte dei casi manca una policy interna</strong>,
                i contratti con clienti e fornitori non sono stati adeguati e l'obbligo di alfabetizzazione
                previsto dall'art. 4 del Regolamento non risulta assolto.
              </p>
              <p>
                La materia richiede due competenze che raramente coesistono. Da un lato la qualificazione
                giuridica: stabilire se un sistema ricada fra le pratiche vietate dell'art. 5, fra i
                sistemi ad alto rischio dell'Allegato III o fra quelli soggetti ai soli obblighi di
                trasparenza dell'art. 50. Dall'altro l'accertamento tecnico: capire con quali criteri
                il software valuta le persone, quali dati tratta e dove è collocato il fornitore.
              </p>
              <p>
                <strong className="text-foreground">Senza il primo accertamento, il secondo non è
                difendibile.</strong> Una classificazione fondata sul nome commerciale del software —
                anziché sulle funzioni che esegue — non regge a una verifica, e le conseguenze ricadono
                sull'impresa che ha adottato il sistema, non su chi glielo ha fornito.
              </p>
              <p>
                Per questo lo studio riunisce entrambe le competenze: avvocati specializzati sul
                Regolamento e sulla Legge 132/2025, e un presidio tecnico interno che istruisce
                l'analisi dei sistemi prima che se ne valutino gli effetti giuridici.
              </p>
            </div>

            {/* Callout box con gradient border */}
            <div
              className="mt-12 p-px rounded-2xl"
              style={{
                background: "linear-gradient(135deg, hsl(199 89% 48%), hsl(160 84% 39%))",
              }}
            >
              <div className="bg-card rounded-2xl p-8 lg:p-10">
                <p className="font-display font-extrabold text-2xl lg:text-3xl tracking-heading-tight leading-[1.2] text-foreground">
                  "Ogni giorno senza una policy AI interna è un giorno di rischio.
                  Ogni contratto firmato senza clausole AI è un'esposizione legale non necessaria.
                  <span className="text-gradient-primary">
                    {" "}TutelAI trasforma questi rischi in processi gestiti.
                  </span>
                  "
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-dark-gradient text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <p className="font-display font-extrabold text-4xl sm:text-5xl tracking-stat-tight text-gradient-primary mb-2">
                  <Counter to={s.to} suffix={s.suffix} prefix={s.prefix} />
                </p>
                <p className="text-primary-foreground/60 text-sm font-subtitle leading-snug">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORIA E DNA ──────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 lg:py-36 bg-card">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs font-mono-accent font-bold tracking-widest uppercase text-primary mb-4">
              La nostra storia
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.08]">
              Il DNA di{" "}
              <span className="text-gradient-primary">TutelAI</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left: text */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-cta flex items-center justify-center shrink-0">
                  <Building2 size={22} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-xl">AEDIX Group</h3>
                  <p className="text-sm text-muted-foreground font-subtitle">La holding madre</p>
                </div>
              </div>

              <div className="space-y-5 text-foreground/70 text-base leading-relaxed">
                <p>
                  TutelAI è un brand di{" "}
                  <strong className="text-foreground">AEDIX</strong>, la holding fondata da{" "}
                  <strong className="text-foreground">Florin Andriciuc</strong> con oltre 8 anni di
                  esperienza nella digitalizzazione delle PMI italiane. Abbiamo accompagnato centinaia
                  di piccole imprese attraverso transizioni tecnologiche complesse — e abbiamo imparato
                  che le PMI falliscono sulle tecnologie non per mancanza di voglia, ma per mancanza
                  di supporto adeguato.
                </p>
                <p>
                  Con l'AI Act abbiamo riconosciuto la stessa dinamica che aveva caratterizzato il
                  GDPR nel 2018: una normativa rivoluzionaria, un mercato impreparato, e una finestra
                  di 12–18 mesi in cui chi si muove prima costruisce un vantaggio competitivo reale.
                </p>
                <p>
                  Questa volta, invece di guardare, abbiamo deciso di essere{" "}
                  <strong className="text-foreground">la soluzione</strong>. Con la competenza tecnica
                  per capire i sistemi AI, la competenza legale per interpretare la normativa, e la
                  capacità operativa per tradurre tutto in azioni concrete.
                </p>
              </div>
            </motion.div>

            {/* Right: timeline */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-0"
            >
              {timeline.map((ev, i) => (
                <div key={i} className="flex gap-5">
                  {/* Line + dot */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-cta text-primary-foreground flex items-center justify-center font-mono-accent font-bold text-xs shrink-0">
                      {ev.year}
                    </div>
                    {i < timeline.length - 1 && (
                      <div className="w-px flex-1 bg-gradient-to-b from-primary/40 to-transparent my-2 min-h-[40px]" />
                    )}
                  </div>
                  {/* Content */}
                  <div className={`pb-8 ${i === timeline.length - 1 ? "pb-0" : ""}`}>
                    <h4 className="font-subtitle font-bold text-base mb-1">{ev.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{ev.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TEAM ──────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 lg:py-36 bg-dark-gradient text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="inline-block text-xs font-mono-accent font-bold tracking-widest uppercase text-primary mb-4">
              Il team
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.08]">
              Chi c'è dietro{" "}
              <span className="text-gradient-primary">TutelAI</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Florin */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/8 transition-colors"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-cta text-primary-foreground flex items-center justify-center font-display font-extrabold text-xl shrink-0">
                  F
                </div>
                <div>
                  <h3 className="font-subtitle font-bold text-lg text-primary-foreground">
                    Florin Andriciuc
                  </h3>
                  <p className="text-sm text-gradient-primary font-subtitle font-semibold">
                    Founder & CEO
                  </p>
                </div>
              </div>
              <p className="text-sm text-primary-foreground/65 leading-relaxed">
                Imprenditore seriale nel settore della digitalizzazione delle PMI italiane. Fondatore
                di AEDIX e di un ecosistema di brand verticali nel mondo dell'AI applicata alle
                imprese. Oltre 8 anni di esperienza nel direct response marketing e nell'automazione
                AI. Ha guidato decine di PMI attraverso la transizione digitale — ora guida la loro
                transizione verso la compliance AI.
              </p>
            </motion.div>

            {/* Co-founder legale placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="p-6 rounded-2xl border border-dashed border-white/20 bg-white/3 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-dashed border-white/20 text-primary-foreground flex items-center justify-center font-display font-extrabold text-xl shrink-0">
                  L
                </div>
                <div>
                  <h3 className="font-subtitle font-bold text-lg text-primary-foreground">
                    [ Co-founder legale ]
                  </h3>
                  <p className="text-sm text-gradient-primary font-subtitle font-semibold">
                    Legal Director
                  </p>
                </div>
              </div>
              <p className="text-sm text-primary-foreground/50 leading-relaxed mb-4">
                Specializzazione in diritto digitale, AI Act, GDPR, D.Lgs. 231/2001. Esperto nella
                redazione di policy AI, DPA, clausole contrattuali per sistemi di intelligenza
                artificiale. Il profilo completo sarà pubblicato a breve.
              </p>
              <span className="inline-block text-xs font-mono-accent text-primary/60 border border-primary/20 px-3 py-1 rounded-full">
                Profilo in arrivo
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── I NOSTRI VALORI ───────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 lg:py-36 bg-background">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="inline-block text-xs font-mono-accent font-bold tracking-widest uppercase text-primary mb-4">
              I nostri valori
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.08]">
              Il nostro{" "}
              <span className="text-gradient-primary">approccio</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4">
              Quattro principi che guidano ogni decisione, ogni documento, ogni chiamata con un cliente.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group p-7 rounded-2xl border border-border bg-card hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-cta flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <v.icon size={22} className="text-primary-foreground" />
                </div>
                <h3 className="font-subtitle font-bold text-base mb-2 text-foreground">
                  {v.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COME LAVORIAMO ────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 lg:py-36 bg-card">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="inline-block text-xs font-mono-accent font-bold tracking-widest uppercase text-primary mb-4">
              Il processo
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.08]">
              Come{" "}
              <span className="text-gradient-primary">lavoriamo</span>
            </h2>
            <p className="text-muted-foreground text-lg mt-4">
              Tre fasi. Zero burocrazia inutile. Risultati concreti.
            </p>
          </motion.div>

          <div className="space-y-0">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.15, duration: 0.5 }}
                className="flex gap-6 items-start"
              >
                {/* Badge + connector */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-cta text-primary-foreground flex items-center justify-center font-mono-accent font-bold text-sm shrink-0 shadow-lg">
                    {s.num}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 bg-gradient-to-b from-primary/50 to-transparent my-2 min-h-[40px]" />
                  )}
                </div>
                {/* Content */}
                <div className={`pb-10 ${i === steps.length - 1 ? "pb-0" : ""}`}>
                  <h3 className="font-subtitle font-bold text-xl mb-2">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 lg:py-36 bg-dark-gradient text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-cta opacity-10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 text-center max-w-3xl relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-mono-accent font-bold tracking-widest uppercase text-primary mb-6">
              Vuoi conoscerci?
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.08] mb-5">
              Una call gratuita di{" "}
              <span className="text-gradient-primary">30 minuti.</span>
            </h2>
            <p className="text-primary-foreground/65 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Una conversazione onesta su dove sei e cosa ti serve. Nessuna pressione, nessuna
              proposta commerciale forzata. Solo chiarezza.
            </p>
            <button
              onClick={openModal}
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-gradient-cta text-primary-foreground font-subtitle font-bold text-base hover:opacity-90 transition-opacity shadow-2xl"
            >
              Prenota la call gratuita
              <ArrowRight size={18} />
            </button>
            <p className="mt-5 text-primary-foreground/40 text-sm font-subtitle">
              Risposta garantita entro 2 ore lavorative · Nessun impegno
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
      <LeadFormModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
