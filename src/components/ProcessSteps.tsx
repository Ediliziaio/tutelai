import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Handshake, Settings, Rocket } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Handshake,
    title: "ANALISI GRATUITA",
    desc: "Ci racconti la tua azienda in 30 minuti. Quante pratiche gestisci, quali problemi hai oggi, cosa vorresti delegare. Nessun impegno, solo una conversazione onesta tra imprenditori.",
    badge: "⏱ 30 minuti",
  },
  {
    num: "02",
    icon: Settings,
    title: "CONFIGURIAMO IL TUO BACK-OFFICE",
    desc: "Definiamo insieme i servizi da attivare, i flussi operativi e le priorità. Ti forniamo accesso immediato al portale dedicato. Il setup lo facciamo noi, tu non tocchi nulla.",
    badge: "⚡ 24 ore",
  },
  {
    num: "03",
    icon: Rocket,
    title: "TU CRESCI. NOI GESTIAMO TUTTO.",
    desc: "Da quel momento deleghi. Ricevi aggiornamenti in tempo reale. Ogni pratica completata ti viene notificata. Paghi solo ciò che è stato effettivamente consegnato. Zero burocrazia. Zero stress.",
    badge: "🚀 Da subito",
  },
];

export default function ProcessSteps() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} id="come-funziona" className="py-16 sm:py-20 lg:py-28 bg-gradient-hero">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
        >
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-5xl tracking-heading-tight leading-[1.1] mb-4">
            Attivo in 24 ore.
            <br />
            <span className="text-gradient-primary">Nessuna complessità.</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg mb-12 sm:mb-16">
            Tre passi e la burocrazia non è più un tuo problema.
          </p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          {/* Vertical gradient line */}
          <div className="absolute left-6 lg:left-1/2 lg:-translate-x-0.5 top-0 bottom-0 w-1 rounded-full overflow-hidden bg-border">
            {isVisible && (
              <div className="w-full bg-gradient-cta animate-grow-line rounded-full" />
            )}
          </div>

          {steps.map((step, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.25 }}
                className={`relative flex items-start gap-4 sm:gap-6 mb-12 sm:mb-16 last:mb-0 pl-14 sm:pl-16 lg:pl-0 ${
                  isLeft ? "lg:pr-[calc(50%+2rem)] lg:text-right" : "lg:pl-[calc(50%+2rem)] lg:text-left"
                }`}
              >
                {/* Numbered circle */}
                <div
                  className={`absolute z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-cta text-primary-foreground flex items-center justify-center shadow-lg font-display font-extrabold text-xs sm:text-sm left-0 lg:left-1/2 lg:-translate-x-1/2`}
                >
                  {step.num}
                </div>

                {/* Card */}
                <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 shadow-sm flex-1">
                  <div className="flex items-center gap-2 mb-2" style={{ justifyContent: isLeft ? "flex-end" : "flex-start" }}>
                    <step.icon size={18} className="text-primary" />
                    <span className="text-xs font-subtitle font-bold tracking-wider text-primary">{step.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{step.desc}</p>
                  <span className="inline-block text-xs font-subtitle font-semibold bg-secondary/10 text-secondary px-3 py-1 rounded-full">
                    {step.badge}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
