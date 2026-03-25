import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCounterAnimation } from "@/hooks/useCounterAnimation";

const row1 = [
  { target: 2400000, prefix: "€", suffix: "", label: "Risparmio totale generato ai partner", format: "compact" },
  { target: 60, prefix: "", suffix: "%+", label: "Riduzione costi medi", format: "normal" },
  { target: 48, prefix: "", suffix: "h", label: "Consegna pratiche standard", format: "normal" },
  { target: 0, prefix: "", suffix: "€", label: "Costi fissi mensili", format: "normal" },
];

const row2 = [
  { target: 200, prefix: "", suffix: "+", label: "Partner attivi", format: "normal" },
  { target: 1200, prefix: "", suffix: "+", label: "Pratiche completate ogni mese", format: "normal" },
  { target: 98, prefix: "", suffix: "%", label: "Tasso di soddisfazione clienti", format: "normal" },
  { target: 24, prefix: "", suffix: "h", label: "Onboarding completo", format: "normal" },
];

function StatItem({ target, prefix, suffix, label, format, isVisible }: {
  target: number; prefix: string; suffix: string; label: string; format: string; isVisible: boolean;
}) {
  const count = useCounterAnimation(target, isVisible, 2000);
  const displayVal = format === "compact"
    ? `${prefix}${(count / 1000000).toFixed(1)}M`
    : `${prefix}${count.toLocaleString("it-IT")}${suffix}`;

  return (
    <div className="text-center">
      <div className="font-display font-extrabold text-3xl sm:text-4xl lg:text-6xl tracking-stat-tight text-primary-foreground">
        {displayVal}
      </div>
      <p className="text-xs sm:text-sm text-primary-foreground/70 mt-2 font-subtitle">{label}</p>
    </div>
  );
}

export default function DataWallSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-28 bg-datawall text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-5xl tracking-heading-tight leading-[1.1]">
            I Numeri che Contano.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 max-w-5xl mx-auto mb-10 sm:mb-12"
        >
          {row1.map((s, i) => (
            <StatItem key={i} {...s} isVisible={isVisible} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 max-w-5xl mx-auto mb-8"
        >
          {row2.map((s, i) => (
            <StatItem key={i} {...s} isVisible={isVisible} />
          ))}
        </motion.div>

        <p className="text-center text-xs text-primary-foreground/50">
          Dati aggiornati al 2024 — elaborati su base portafoglio clienti attivo
        </p>
      </div>
    </section>
  );
}
