import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCounterAnimation } from "@/hooks/useCounterAnimation";
import { Button } from "./ui/button";
import { X } from "lucide-react";

const bullets = [
  "Ogni mese con un dipendente fisso non necessario: fino a €4.000 sprecati",
  "Ogni pratica ENEA gestita internamente: 6-8 ore di lavoro burocratico",
  "Ogni chiamata persa: un preventivo non fatto, un cliente perso",
];

export default function InactionCostSection({ onCtaClick }: { onCtaClick: () => void }) {
  const { ref, isVisible } = useScrollAnimation();
  const dailyCost = useCounterAnimation(127, isVisible);

  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-28 bg-inaction-gradient">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="font-display font-extrabold text-2xl sm:text-3xl lg:text-5xl tracking-heading-tight leading-[1.1] mb-8 sm:mb-10"
          style={{ color: "hsl(0 62% 30%)" }}
        >
          Ogni Mese che Aspetti
          <br />
          Ti Costa Soldi Veri.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="max-w-md mx-auto bg-card border-2 border-destructive/20 rounded-2xl p-6 sm:p-8 mb-8 sm:mb-10 shadow-lg"
        >
          <p className="text-sm text-muted-foreground mb-2">Stai perdendo ogni giorno:</p>
          <div className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-stat-tight text-destructive">
            € {dailyCost}
            <span className="text-lg sm:text-xl font-subtitle font-semibold text-muted-foreground"> /giorno</span>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            in costi amministrativi evitabili (media italiana PMI edile)
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="text-xs text-muted-foreground mb-8"
        >
          Il contatore è basato su dati reali. Il tuo costo effettivo potrebbe essere più alto.
        </motion.p>

        <div className="max-w-xl mx-auto space-y-4 mb-10">
          {bullets.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.15 }}
              className="flex items-start gap-3 text-left"
            >
              <X size={18} className="text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-foreground font-subtitle font-medium">{b}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9 }}
        >
          <Button
            onClick={onCtaClick}
            size="lg"
            className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-subtitle font-bold text-primary-foreground hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, hsl(0 84% 60%), hsl(38 92% 50%))" }}
          >
            → Smetti di Perdere Soldi — Inizia Adesso
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
