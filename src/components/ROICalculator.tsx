import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCounterAnimation } from "@/hooks/useCounterAnimation";
import { useState } from "react";
import { Slider } from "./ui/slider";

const comparisonRows = [
  { label: "Costo mensile fisso", trad: "€2.500 - €4.000", il: "€0" },
  { label: "TFR annuale", trad: "€1.800+", il: "€0" },
  { label: "13ª e 14ª mensilità", trad: "€4.000+", il: "€0" },
  { label: "Malattia e ferie pagate", trad: "€1.200+", il: "€0" },
  { label: "Formazione e onboarding", trad: "€800+", il: "€0" },
];

export default function ROICalculator() {
  const { ref, isVisible } = useScrollAnimation();
  const [practices, setPractices] = useState(50);

  const ilCost = practices * 15;
  const tradCost = 3200;
  const savings = (tradCost - ilCost) * 12;
  const savingsAnimated = useCounterAnimation(Math.max(savings, 0), isVisible);

  return (
    <section ref={ref} id="roi-calculator" className="py-16 sm:py-20 lg:py-28 bg-dark-section text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-5xl tracking-heading-tight leading-[1.1] mb-4">
            Quanto stai davvero pagando
            <br />
            per gestire la tua burocrazia?
          </h2>
          <p className="text-primary-foreground/60 text-base sm:text-lg">
            Calcolalo tu stesso. I numeri parlano chiaro.
          </p>
        </motion.div>

        {/* Comparison table — desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto mb-16 hidden sm:block"
        >
          <div className="grid grid-cols-3 gap-4 mb-4 text-sm font-subtitle font-bold">
            <div />
            <div className="text-destructive text-center">Modello Tradizionale</div>
            <div className="text-secondary text-center">Impresa Leggera</div>
          </div>
          {comparisonRows.map((row) => (
            <div key={row.label} className="grid grid-cols-3 gap-4 py-3 border-b border-primary-foreground/10 text-sm">
              <div className="text-primary-foreground/70">{row.label}</div>
              <div className="text-center text-destructive font-mono-accent">{row.trad}</div>
              <div className="text-center text-secondary font-mono-accent font-bold">{row.il}</div>
            </div>
          ))}
          <div className="grid grid-cols-3 gap-4 py-4 text-base font-bold">
            <div>Totale Annuo</div>
            <div className="text-center text-destructive font-mono-accent">€35.000 - €55.000</div>
            <div className="text-center text-secondary font-mono-accent">Solo ciò che usi</div>
          </div>

          <div className="text-center mt-6">
            <span className="inline-block bg-secondary/20 text-secondary px-6 py-2 rounded-full font-subtitle font-bold">
              💰 Risparmio Medio dei Nostri Partner: 60%+
            </span>
          </div>
        </motion.div>

        {/* Comparison table — mobile (stacked cards) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="max-w-md mx-auto mb-12 sm:hidden space-y-3"
        >
          {comparisonRows.map((row) => (
            <div key={row.label} className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-4">
              <p className="text-xs text-primary-foreground/60 mb-2">{row.label}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-destructive font-mono-accent">{row.trad}</span>
                <span className="text-sm text-secondary font-mono-accent font-bold">{row.il}</span>
              </div>
            </div>
          ))}
          <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-4">
            <p className="text-xs text-primary-foreground/60 mb-2 font-bold">Totale Annuo</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-destructive font-mono-accent font-bold">€35k - €55k</span>
              <span className="text-sm text-secondary font-mono-accent font-bold">Solo ciò che usi</span>
            </div>
          </div>
          <div className="text-center mt-4">
            <span className="inline-block bg-secondary/20 text-secondary px-4 py-2 rounded-full font-subtitle font-bold text-sm">
              💰 Risparmio Medio: 60%+
            </span>
          </div>
        </motion.div>

        {/* Interactive calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="max-w-xl mx-auto bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-5 sm:p-8"
        >
          <label className="block text-sm font-subtitle font-semibold mb-4">
            Quante pratiche amministrative gestisci al mese?
          </label>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-mono-accent">5</span>
            <Slider
              value={[practices]}
              onValueChange={(v) => setPractices(v[0])}
              min={5}
              max={200}
              step={5}
              className="flex-1"
            />
            <span className="text-sm font-mono-accent">200</span>
          </div>
          <div className="text-center font-mono-accent text-2xl sm:text-3xl font-bold text-primary mb-1">
            {practices} pratiche/mese
          </div>
          <div className="text-center space-y-2 mt-6">
            <p className="text-sm text-primary-foreground/60">Con Impresa Leggera pagheresti circa:</p>
            <p className="font-mono-accent text-xl sm:text-2xl font-bold text-secondary">€{ilCost}/mese</p>
            <p className="text-sm text-primary-foreground/40">vs €{tradCost.toLocaleString()} con un dipendente fisso</p>
            <div className="mt-4 inline-block bg-secondary/20 text-secondary px-4 sm:px-6 py-3 rounded-xl font-subtitle font-bold text-base sm:text-lg">
              🟢 Risparmio stimato: €{savingsAnimated.toLocaleString()}/anno
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
