import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Unlock, CreditCard, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const guarantees = [
  { icon: Unlock, title: "Nessun Contratto Vincolante", desc: "Attivi e disattivi i servizi quando vuoi. Nessun minimo contrattuale. Nessuna penale." },
  { icon: CreditCard, title: "Paghi Solo Ciò che Usi", desc: "Zero canone mensile fisso. Ogni pratica ha un prezzo trasparente e definito." },
  { icon: Zap, title: "Attivazione in 24 Ore", desc: "Dalla firma all'operatività in un giorno lavorativo. Il tuo onboarding è incluso." },
  { icon: Shield, title: "Qualità Garantita o Rifaremo", desc: "Ogni pratica è verificata da professionisti qualificati. Correzione immediata e gratuita." },
];

export default function GuaranteeSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-gradient-cta text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.1] mb-14"
        >
          Il Tuo Rischio? Zero.
          <br />
          I Tuoi Risultati? Garantiti.
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {guarantees.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-primary-foreground/10 rounded-2xl p-6 text-center"
            >
              <div className="relative w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
                <g.icon size={24} />
                <div className="absolute inset-0 rounded-full border-2 border-primary-foreground/30 animate-pulse-ring" />
              </div>
              <h3 className="font-subtitle font-bold mb-2">{g.title}</h3>
              <p className="text-sm text-primary-foreground/80 leading-relaxed">{g.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="mt-10"
        >
          <Link
            to="/garanzia"
            className="inline-flex items-center justify-center text-sm font-subtitle font-semibold text-primary-foreground underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            Scopri la Garanzia Completa →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
