import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Check } from "lucide-react";
import { Button } from "./ui/button";

const plans = [
  {
    name: "Starter",
    subtitle: "Perfetto per chi vuole iniziare",
    features: ["Creazione fatture (fino a 20/mese)", "Gestione scadenzario", "Email e corrispondenza base", "Supporto via chat"],
    price: "Da €XX a pratica",
    cta: "Inizia con Starter",
    featured: false,
  },
  {
    name: "Professionale ✨",
    subtitle: "Il più scelto dalle PMI",
    features: ["Tutto di Starter", "Pratiche ENEA illimitate", "Call center dedicato (20h/mese)", "Pratiche finanziamento", "Segreteria virtuale", "Gestione recupero crediti base", "Report mensile attività"],
    price: "Da €XX a pratica",
    cta: "Scegli Professionale",
    featured: true,
  },
  {
    name: "Enterprise",
    subtitle: "Su misura per aziende strutturate",
    features: ["Tutto di Professionale", "Account manager dedicato", "SLA personalizzato", "Integrazione con il tuo software", "Reporting avanzato", "Priority support"],
    price: "Preventivo personalizzato",
    cta: "Parliamone",
    featured: false,
  },
];

export default function PricingSection({ onCtaClick }: { onCtaClick: () => void }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} id="prezzi" className="py-16 sm:py-20 lg:py-28 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-5xl tracking-heading-tight leading-[1.1] mb-4">
            Prezzi Chiari.
            <br />
            <span className="text-gradient-primary">Zero Sorprese.</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Scegli il piano base o costruisci il tuo pacchetto personalizzato.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15 }}
              className={`rounded-2xl border p-6 sm:p-8 flex flex-col relative ${
                plan.featured
                  ? "border-primary bg-primary/5 shadow-xl md:scale-105"
                  : "border-border bg-card shadow-sm"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-subtitle font-bold px-4 py-1 rounded-full">
                  PIÙ SCELTO
                </span>
              )}
              <h3 className="font-subtitle font-bold text-lg sm:text-xl mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">{plan.subtitle}</p>
              <div className="border-t border-border pt-6 flex-1">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check size={16} className="text-secondary shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="font-mono-accent font-bold text-lg mb-4">{plan.price}</p>
              <Button
                onClick={onCtaClick}
                className={`w-full rounded-full font-subtitle font-semibold ${
                  plan.featured
                    ? "bg-gradient-cta text-primary-foreground hover:opacity-90"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-10">
          💡 Non sei sicuro di quale piano fa per te?{" "}
          <button onClick={onCtaClick} className="text-primary font-semibold underline underline-offset-4">
            Prenota una consulenza gratuita di 30 minuti →
          </button>
        </p>
      </div>
    </section>
  );
}
