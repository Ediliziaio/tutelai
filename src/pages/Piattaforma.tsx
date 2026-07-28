import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Database, FileText, Bell, BookOpen, Shield, ClipboardList, Zap, BarChart3, Lock, Globe, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import Reveal from "@/components/Reveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";

// ── DATA ──────────────────────────────────────────────────────────────────────

const modules = [
  {
    num: "01",
    icon: Database,
    name: "AI Registry",
    tagline: "Tutto quello che usi, in un unico posto.",
    desc: "Censisci e classifica ogni sistema AI che usi in azienda. Per ognuno: fornitore, finalità, livello di rischio AI Act, stato compliance, documenti collegati. Dashboard con semafori verde/giallo/rosso. Sai in un colpo d'occhio dove sei esposto.",
    highlight: false,
  },
  {
    num: "02",
    icon: FileText,
    name: "Doc Generator",
    tagline: "Documenti legali in minuti, non settimane.",
    desc: "Genera automaticamente policy, informative, disclaimer, clausole contrattuali. Non template generici: l'AI della piattaforma li personalizza sul tuo settore, la tua dimensione, i sistemi che usi. Ogni documento è pronto per la firma.",
    highlight: true,
  },
  {
    num: "03",
    icon: Bell,
    name: "AI Monitor",
    tagline: "Le novità normative che ti riguardano. Solo quelle.",
    desc: "Alert in tempo reale su nuovi obblighi, scadenze, sentenze del Garante, circolari ACN. Feed filtrato per il tuo settore e i sistemi che hai censito. Non leggi tutto: leggi solo quello che cambia qualcosa per te.",
    highlight: false,
  },
  {
    num: "04",
    icon: BookOpen,
    name: "Training Hub",
    tagline: "Formazione obbligatoria documentata e tracciata.",
    desc: "Corsi AI Literacy obbligatori (art. 4 AI Act) con attestato documentabile. Moduli distinti per ruolo: dipendente base, HR, management, IT. Tracciamento completamento per ogni persona. Report esportabile per ispezioni.",
    highlight: false,
  },
  {
    num: "05",
    icon: Shield,
    name: "GDPR + AI",
    tagline: "Registro dei Trattamenti integrato con l'AI.",
    desc: "Registro dei Trattamenti aggiornato con i sistemi AI. DPIA guidata step-by-step per i sistemi ad alto rischio. Workflow automatizzato per data breach AI con notifica entro 72h. Tutto loggato e documentato.",
    highlight: false,
  },
  {
    num: "06",
    icon: ClipboardList,
    name: "Audit Trail",
    tagline: "Log immutabile per ogni ispezione.",
    desc: "Storico completo di ogni decisione influenzata da AI. Chi ha supervisionato, con quale competenza, in quale momento. Report esportabile in formato audit-ready per ACN, Garante, revisori interni o banche.",
    highlight: false,
  },
];

const plans = [
  {
    name: "Starter",
    price: "Su richiesta",
    period: "",
    annual: "Canone annuale agevolato",
    desc: "Per chi vuole iniziare in autonomia con i fondamentali.",
    features: [
      "AI Registry (fino a 10 sistemi)",
      "Doc Generator — 5 template inclusi",
      "Scadenzario normativo con alert email",
      "1 utente",
      "Supporto via chat",
    ],
    cta: "Inizia 14 giorni gratis",
    featured: false,
    badge: null,
  },
  {
    name: "Business",
    price: "Su richiesta",
    period: "",
    annual: "Canone annuale agevolato",
    desc: "La versione completa per PMI che usano AI attivamente.",
    features: [
      "AI Registry illimitato",
      "Doc Generator AI-powered illimitato",
      "Monitor normativo con filtri settore",
      "GDPR integrato — Registro Trattamenti",
      "Training Hub (fino a 5 utenti)",
      "Audit Trail esportabile",
      "Report audit-ready PDF",
      "Supporto prioritario",
    ],
    cta: "Inizia 14 giorni gratis",
    featured: true,
    badge: "Consigliato",
  },
  {
    name: "Enterprise",
    price: "Su richiesta",
    period: "",
    annual: "White label disponibile",
    desc: "Per gruppi, multi-sede e partner che rivendono la piattaforma.",
    features: [
      "Utenti illimitati",
      "Gestione multi-azienda",
      "API aperta + SSO",
      "White label per studi legali",
      "SLA uptime 99,9%",
      "Account manager dedicato",
      "Onboarding assistito",
    ],
    cta: "Richiedi una demo",
    featured: false,
    badge: null,
  },
];

const addons = [
  { icon: Bell, name: "WhatsApp/SMS alert normativo", price: "Su richiesta", desc: "Notifiche urgenti su mobile quando scatta un obbligo critico o una scadenza imminente." },
  { icon: Lock, name: "Firma digitale FEA integrata", price: "Su richiesta", desc: "Firma i documenti compliance dalla piattaforma. Conformità eIDAS, valore legale completo." },
  { icon: Globe, name: "AI Lawyer chat", price: "Su richiesta", desc: "Chat con AI specializzata in AI Act e GDPR. Per le domande operative quotidiane del team." },
  { icon: Users, name: "Pack 5 utenti aggiuntivi", price: "Su richiesta", desc: "Estendi l'accesso al Training Hub e all'AI Registry a team più grandi." },
];

const benefits = [
  { icon: Zap, title: "Setup in 10 minuti", desc: "Nessuna installazione. Accesso immediato da browser." },
  { icon: BarChart3, title: "Dashboard in tempo reale", desc: "Score di compliance aggiornato ogni volta che censisci un sistema." },
  { icon: Shield, title: "100% conforme GDPR", desc: "Dati ospitati in Europa. Nessun dato condiviso con terzi." },
  { icon: Lock, title: "Aggiornamenti inclusi", desc: "Ogni modifica normativa viene recepita automaticamente nella piattaforma." },
];

// ── MINI MOCKUP ───────────────────────────────────────────────────────────────
function MiniMockup() {
  return (
    <div className="relative">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="flex items-center gap-2 px-4 py-3" style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-accent/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
          <div className="ml-3 flex-1 rounded-md h-5 flex items-center px-2.5" style={{ background: "rgba(255,255,255,0.07)" }}>
            <span className="text-white/30 text-[10px] font-mono-accent">app.tutelai.it/registry</span>
          </div>
        </div>
        <div className="p-5">
          <p className="text-white/25 text-[10px] font-mono-accent mb-3 uppercase tracking-wider">AI Registry — 8 sistemi attivi</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[{ l: "Conformi", v: "3", c: "#34d399" }, { l: "Warning", v: "4", c: "#fbbf24" }, { l: "Critici", v: "1", c: "#f87171" }].map((s, i) => (
              <div key={i} className="text-center rounded-xl py-3" style={{ background: "rgba(255,255,255,0.05)" }}>
                <p className="text-xl font-bold font-display" style={{ color: s.c }}>{s.v}</p>
                <p className="text-white/25 text-[9px] font-mono-accent">{s.l}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[
              { n: "ChatGPT Business", pct: 82, c: "#f87171" },
              { n: "HR AI Module", pct: 50, c: "#fbbf24" },
              { n: "Chatbot sito", pct: 25, c: "#f87171" },
              { n: "Analytics AI", pct: 91, c: "#34d399" },
            ].map((sys, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: sys.c }} />
                <span className="text-white/50 text-[10px] flex-1 truncate font-subtitle">{sys.n}</span>
                <div className="w-16 h-1.5 rounded-full overflow-hidden shrink-0" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <motion.div className="h-full rounded-full" style={{ background: sys.c, opacity: 0.75 }}
                     />
                </div>
                <span className="text-white/30 text-[9px] font-mono-accent w-5 text-right">{sys.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function Piattaforma() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
            <SEOHead
        title="TutelAI Platform — L'applicativo per la compliance AI"
        description="Registro dei sistemi AI, generazione documentale, monitoraggio normativo, formazione e audit trail in un unico applicativo, sotto supervisione legale. Prova gratuita 14 giorni, senza carta di credito."
        canonical="https://tutelai.it/piattaforma"
      />

      <Navbar onCtaClick={openModal} />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-20 bg-dark-gradient text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle at 15% 50%, hsl(213 56% 23% / 0.10) 0%, transparent 60%), radial-gradient(circle at 85% 30%, hsl(46 85% 50% / 0.07) 0%, transparent 60%)"
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border"
                style={{ background: "rgba(14,165,233,0.1)", borderColor: "rgba(14,165,233,0.25)" }}>
                <Zap size={14} className="text-primary" />
                <span className="text-xs font-subtitle font-semibold text-primary uppercase tracking-widest">TutelAI Platform · SaaS</span>
              </div>
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-heading-tight leading-[1.05] mb-6">
                Il centro di controllo{" "}
                <span className="text-gradient-primary">compliance AI della tua azienda.</span>
              </h1>
              <p className="text-primary-foreground/75 text-lg leading-relaxed mb-8 font-subtitle">
                Il registro dei sistemi, la documentazione adottata, gli attestati di formazione e le
                evidenze richieste in sede di verifica, mantenuti aggiornati in un unico applicativo —
                sotto la supervisione dei professionisti dello studio.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <motion.button onClick={openModal}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-primary-foreground text-foreground font-subtitle font-bold text-base shadow-xl hover:opacity-90 transition-opacity">
                  Inizia 14 giorni gratis <ArrowRight size={16} />
                </motion.button>
                <Link to="/servizi"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-subtitle font-semibold text-base transition-colors"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  Preferisci la consulenza? →
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 text-xs font-subtitle text-primary-foreground/50">
                {["✓ Nessuna carta di credito", "✓ Setup in 10 minuti", "✓ Dati ospitati in Europa", "✓ Cancella quando vuoi"].map((t, i) => (
                  <span key={i}>{t}</span>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <MiniMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── WHY PLATFORM ─────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-card border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <Reveal   >
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight leading-[1.08] mb-5">
                La compliance non è un documento.{" "}
                <span className="text-gradient-primary">È un processo continuo.</span>
              </h2>
              <div className="space-y-4 text-muted-foreground font-subtitle leading-relaxed">
                <p>Puoi avere la policy più bella del mondo. Ma se non c'è un sistema che la mantiene aggiornata, che monitora i cambi normativi, che tiene traccia di chi ha fatto la formazione — <strong className="text-foreground">sei fuori norma nel giro di qualche mese.</strong></p>
                <p>TutelAI Platform non è un archivio di documenti. È il sistema operativo per la governance AI della tua azienda.</p>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((b, i) => (
                <Reveal key={i}
                  className="p-5 rounded-2xl border border-border bg-background">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <b.icon size={18} className="text-primary" />
                  </div>
                  <h3 className="font-subtitle font-bold text-sm mb-1">{b.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6 MODULES ────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <Reveal
            className="text-center mb-14">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.08] mb-4">
              6 moduli. <span className="text-gradient-primary">Una sola piattaforma.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto font-subtitle">
              Tutto quello che serve per la compliance AI della tua PMI, integrato e aggiornato in tempo reale.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {modules.map((m, i) => (
              <motion.div key={i}
                whileHover={{ y: -4 }}
                className={`group p-7 rounded-3xl border transition-all duration-300 ${
                  m.highlight
                    ? "border-primary bg-card shadow-[0_8px_40px_rgba(14,165,233,0.15)]"
                    : "border-border bg-card hover:border-primary/30 hover:shadow-lg"
                }`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${m.highlight ? "bg-gradient-cta" : "bg-primary/10"}`}>
                    <m.icon size={22} className={m.highlight ? "text-primary-foreground" : "text-primary"} />
                  </div>
                  <span className="text-xs font-mono-accent font-bold text-muted-foreground">{m.num}</span>
                  {m.highlight && <span className="text-xs font-subtitle font-bold text-primary-foreground bg-gradient-cta px-2.5 py-1 rounded-full ml-auto">Più usato</span>}
                </div>
                <h3 className="font-display font-extrabold text-lg mb-1">{m.name}</h3>
                <p className="text-primary font-subtitle font-semibold text-sm mb-3">{m.tagline}</p>
                <p className="text-sm text-muted-foreground leading-relaxed font-subtitle">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANS ────────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <Reveal
            className="text-center mb-14">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight leading-[1.08] mb-4">
              Piani e <span className="text-gradient-primary">prezzi</span>
            </h2>
            <p className="text-muted-foreground font-subtitle">Prova gratuita di 14 giorni su tutti i piani, senza carta di credito.</p>
          </Reveal>
          <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((p, i) => (
              <motion.div key={p.name}
                whileHover={{ y: -4 }}
                className={`relative flex flex-col rounded-3xl border overflow-hidden transition-all duration-300 ${
                  p.featured
                    ? "border-primary shadow-[0_20px_60px_rgba(14,165,233,0.2)]"
                    : "border-border hover:border-primary/30 hover:shadow-lg"
                }`}
              >
                {p.badge && (
                  <div className="bg-gradient-cta text-primary-foreground text-xs font-subtitle font-bold px-4 py-2 text-center">
                    ⭐ {p.badge}
                  </div>
                )}
                <div className="flex flex-col flex-1 p-7 bg-background">
                  <h3 className="font-display font-extrabold text-xl mb-3">{p.name}</h3>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="font-display font-extrabold text-4xl tracking-stat-tight">{p.price}</span>
                    <span className="text-muted-foreground text-base mb-1.5 font-subtitle">{p.period}</span>
                  </div>
                  <p className="text-xs font-subtitle font-semibold text-primary mb-4">{p.annual}</p>
                  <p className="text-sm text-muted-foreground font-subtitle mb-5">{p.desc}</p>
                  <div className="space-y-2.5 flex-1 mb-6">
                    {p.features.map((f, j) => (
                      <div key={j} className="flex items-start gap-2.5">
                        <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
                        <span className="text-xs text-muted-foreground font-subtitle">{f}</span>
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

      {/* ── ADD-ONS ──────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <Reveal
            className="text-center mb-10">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-heading-tight mb-3">
              Add-on <span className="text-gradient-primary">disponibili</span>
            </h2>
            <p className="text-muted-foreground font-subtitle text-sm">Aggiungi solo quello che ti serve, quando ti serve.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-4">
            {addons.map((a, i) => (
              <Reveal key={i}
                className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/25 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <a.icon size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <h3 className="font-subtitle font-bold text-sm">{a.name}</h3>
                    <span className="text-xs font-mono-accent font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full shrink-0">{a.price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-subtitle">{a.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ──────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-card">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { q: "L'AI Registry ci ha aperto gli occhi: usavamo 12 sistemi AI senza saperlo. In 10 minuti avevo una mappa completa del rischio.", name: "Luca B.", role: "Founder — E-commerce, Torino" },
              { q: "La bozza di policy AI è stata generata in pochi minuti e revisionata dallo studio prima dell'adozione. Avere il testo già impostato ha ridotto di settimane il lavoro di verifica.", name: "Sara V.", role: "HR Manager — Studio di architettura" },
            ].map((t, i) => (
              <Reveal key={i}
                className="p-7 rounded-3xl border border-border bg-background">
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
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 bg-dark-gradient text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, rgba(14,165,233,0.15) 0%, transparent 70%)"
        }} />
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-3xl relative z-10">
          <Reveal   >
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.08] mb-5">
              Prova TutelAI Platform{" "}
              <span className="text-gradient-primary">gratis per 14 giorni.</span>
            </h2>
            <p className="text-primary-foreground/75 text-lg mb-10 font-subtitle max-w-xl mx-auto">
              Nessuna carta di credito. Setup in 10 minuti. Cancella quando vuoi.
              Se dopo 14 giorni non vedi il valore, non ti chiediamo nulla.
            </p>
            <motion.button onClick={openModal}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-primary-foreground text-foreground font-subtitle font-bold text-lg shadow-2xl hover:opacity-90 transition-opacity">
              Inizia la prova gratuita <ArrowRight size={20} />
            </motion.button>
            <p className="mt-6 text-primary-foreground/40 text-sm font-subtitle">
              Oppure hai bisogno di consulenza?{" "}
              <Link to="/servizi" className="text-primary hover:opacity-80 transition-opacity font-semibold">Scopri i servizi una tantum →</Link>
            </p>
          </Reveal>
        </div>
      </section>

      <Footer />
      <LeadFormModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
