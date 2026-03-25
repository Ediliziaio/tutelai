import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { AlertTriangle, ArrowDown } from "lucide-react";

const pains = [
  "Ho bisogno di un dipendente ma non posso permettermi il costo fisso",
  "Passo più tempo a fare scartoffie che a lavorare",
  "Le pratiche ENEA dei miei clienti sono un labirinto",
  "Non riesco a stare dietro alle scadenze burocratiche",
  "Un collaboratore che si ammala mi blocca tutto",
  "Ho paura di sbagliare e prendere sanzioni",
];

export default function ProblemSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-20 lg:py-28 bg-card">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.1] mb-4">
            Quante volte hai pensato:
            <br />
            <span className="text-gradient-primary">"Ma chi me lo fa fare?"</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-12">
            Ogni imprenditore conosce questa sensazione.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pains.map((pain, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              className="bg-destructive/5 border border-destructive/10 rounded-2xl p-6 text-left hover:-translate-y-1 transition-transform duration-300"
            >
              <AlertTriangle size={20} className="text-destructive mb-3" />
              <p className="text-sm font-subtitle font-medium text-foreground">"{pain}"</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="mt-16 space-y-4"
        >
          <h3 className="font-display font-bold text-2xl">
            C'è un modo migliore. Si chiama <span className="text-gradient-primary">Impresa Leggera</span>.
          </h3>
          <ArrowDown className="mx-auto text-primary animate-bounce" size={28} />
        </motion.div>
      </div>
    </section>
  );
}
