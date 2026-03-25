import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Target, BarChart3, RefreshCw, Brain, Rocket } from "lucide-react";

const pillars = [
  { icon: Target, num: "01", title: "OBIETTIVI CONDIVISI", desc: "Non misuriamo le pratiche completate — misuriamo la tua crescita. Il nostro KPI è il tuo utile netto." },
  { icon: BarChart3, num: "02", title: "TRASPARENZA TOTALE", desc: "Ogni mese ricevi un report completo: cosa abbiamo fatto, quanto hai speso, quanto hai risparmiato, ore liberate. Nessuna sorpresa, mai." },
  { icon: RefreshCw, num: "03", title: "ADATTABILITÀ", desc: "La tua azienda cresce? Il servizio si adatta. Hai un mese di stop? Non paghi nulla di fisso. Siamo la struttura che scala con te." },
  { icon: Brain, num: "04", title: "CONSULENZA PROATTIVA", desc: "Non aspettiamo che tu ci chieda le cose. Ti segnaliamo bandi aperti, scadenze critiche, opportunità di risparmio." },
  { icon: Rocket, num: "05", title: "VISIONE A LUNGO TERMINE", desc: "Il nostro obiettivo non è farti fare una pratica. È fare in modo che tra 3 anni tu abbia un'azienda strutturata, profittevole e gestibile." },
];

const dashboardStats = [
  { label: "Pratiche completate", value: 847, bar: 80 },
  { label: "Risparmio generato", value: "€41.200", bar: 100 },
  { label: "Ore liberate", value: "1.240h", bar: 90 },
  { label: "Clienti acquisiti (stimati)", value: "+28", bar: 80 },
  { label: "Crescita fatturato", value: "+22%", bar: 70 },
];

export default function PartnerSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <span className="inline-block bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-sm font-subtitle font-semibold mb-6">
            🤝 PARTNERSHIP, NON FORNITURA
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.1] mb-6">
            Non Sei un Cliente.
            <br />
            <span className="text-gradient-primary">Sei il Nostro Partner.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Ogni azienda che cresce con noi è una storia di cui siamo fieri.
            Non vendiamo pratiche. Costruiamo la struttura operativa
            che permette alla tua impresa di scalare senza perdere il controllo.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start mb-16">
          {/* Pillars */}
          <div className="space-y-6">
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <p.icon size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-subtitle font-bold text-sm tracking-wider text-primary mb-1">{p.num} — {p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Partnership Score Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="text-lg">🏆</span>
              <h4 className="font-subtitle font-bold text-sm tracking-wider">IMPRESA LEGGERA PARTNER SCORE</h4>
            </div>
            <div className="space-y-4">
              {dashboardStats.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-display font-bold">{s.value}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isVisible ? { width: `${s.bar}%` } : {}}
                      transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                      className="h-full rounded-full bg-gradient-cta"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              PARTNERSHIP ATTIVA — Aggiornato in tempo reale
            </div>
          </motion.div>
        </div>

        {/* Pull-quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="max-w-3xl mx-auto bg-primary/5 rounded-2xl p-8 text-center border border-primary/10"
        >
          <span className="text-4xl text-primary/30 font-display">"</span>
          <p className="font-display font-bold text-xl sm:text-2xl tracking-heading-tight leading-[1.3] text-foreground mt-2">
            Impresa Leggera non è un fornitore di servizi.
            È la struttura operativa che non potevi permetterti di costruire da solo.
            Adesso puoi.
          </p>
          <p className="text-sm text-muted-foreground mt-4 font-subtitle font-semibold">
            — Il Team di Impresa Leggera
          </p>
        </motion.div>
      </div>
    </section>
  );
}
