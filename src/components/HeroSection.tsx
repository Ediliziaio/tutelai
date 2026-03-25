import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "./ui/button";
import FloatingBadge from "./FloatingBadge";

const words = ["Liberiamo", "l'Imprenditore", "da", "Pensieri", "e", "Stress,", "riducendo", "i", "costi", "fissi", "e", "migliorando", "l'operatività", "dell'Azienda."];
const checks = [
  "Zero costi fissi",
  "Zero TFR",
  "Zero 13ª e 14ª",
  "Zero disorganizzazione",
  "Zero dipendenti da gestire",
];

export default function HeroSection({ onCtaClick }: { onCtaClick: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero pt-16">
      {/* Floating shapes */}
      <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-primary/5 animate-float-slow" />
      <div className="absolute top-40 right-[15%] w-48 h-48 rounded-full bg-secondary/5 animate-float-medium" />
      <div className="absolute bottom-20 left-[20%] w-32 h-32 rounded-full bg-accent/5 animate-float-slow" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-5 gap-8 lg:gap-12 items-center relative z-10">
        {/* Copy */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-primary/10 text-primary px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-subtitle font-semibold leading-snug"
          >
            🇮🇹 La 1ª Azienda in Italia che ti fa guadagnare riducendo fino al 60% i tuoi costi di gestione
          </motion.span>

          <h1 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[1.08] tracking-display-tight">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="inline-block mr-2 sm:mr-3"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-base sm:text-lg text-muted-foreground max-w-xl font-body leading-relaxed"
          >
            In un mercato dove l'incompetenza e l'incertezza regnano,
            noi ci prendiamo cura del tuo back-office.
            Fatture, pratiche ENEA, finanziamenti, call center e molto altro.
            Tu pensi a lavorare. Noi pensiamo a tutto il resto.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3"
          >
            {checks.map((c) => (
              <span key={c} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Check size={16} className="text-secondary shrink-0" /> {c}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="space-y-3"
          >
            <Button
              onClick={onCtaClick}
              size="lg"
              className="w-full sm:w-auto bg-gradient-cta text-primary-foreground rounded-full px-8 py-6 text-base font-subtitle font-bold hover:opacity-90 transition-opacity"
            >
              → Richiedi la Tua Consulenza Gratuita
            </Button>
            <p className="text-xs text-muted-foreground">
              Oltre 200 imprenditori ci hanno già scelto • Attivazione in 24h • Nessun vincolo
            </p>
          </motion.div>
        </div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="lg:col-span-2 hidden lg:block"
        >
          <div className="bg-card rounded-2xl shadow-xl border border-border p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <div className="w-3 h-3 rounded-full bg-accent" />
              <div className="w-3 h-3 rounded-full bg-secondary" />
            </div>
            {[
              { label: "Pratiche completate questo mese", value: "47 ✅", color: "text-secondary" },
              { label: "Risparmio generato", value: "€12.400", color: "text-primary" },
              { label: "Ore liberate", value: "186h", color: "text-accent" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className={`font-mono-accent font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              Tutto operativo — aggiornato in tempo reale
            </div>
          </div>
          <FloatingBadge />
        </motion.div>
      </div>
    </section>
  );
}
