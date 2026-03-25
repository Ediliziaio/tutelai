import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCounterAnimation } from "@/hooks/useCounterAnimation";
import { Star } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const testimonials = [
  { text: "Finalmente mi sono tolto un peso enorme. Ho delegato tutto il ciclo fatturazione e le pratiche ENEA. Risparmio circa €2.000 al mese rispetto a prima.", author: "Marco B., Imprenditore Edile, Milano", tag: "Settore Edilizia | Risparmio: 58%" },
  { text: "Avevo un'impiegata part-time. Tra stipendio, contributi e gestione, mi costava €1.800/mese. Ora pago €400 e ho un servizio molto più efficiente.", author: "Lucia R., Titolare Studio Tecnico, Roma", tag: "Professionista | Risparmio: 78%" },
  { text: "Il call center ha rivoluzionato il mio lavoro. Non perdo più clienti per chiamate non risposte. Ho aumentato i preventivi del 30% il primo mese.", author: "Alessandro T., Installatore Serramenti, Torino", tag: "Artigiano | +30% lead" },
  { text: "Le pratiche ENEA che mi portavano via 3 giorni al mese ora le gestiscono in 48 ore. Incredibile.", author: "Stefano M., Impresa di Ristrutturazioni, Napoli", tag: "PMI Edilizia | Tempo liberato: -72h/mese" },
  { text: "Pensavo fosse troppo bello per essere vero. Invece funziona davvero. Zero costi fissi, massima professionalità.", author: "Giulia F., Architetto, Firenze", tag: "Professionista | Attiva da 8 mesi" },
];

const featured = {
  text: "In 6 mesi ho risparmiato oltre €14.000 in costi fissi di personale e ho migliorato la qualità del servizio ai miei clienti. Impresa Leggera è diventata parte integrante della mia azienda.",
  author: "Roberto C., Titolare PMI Edilizia, Bologna — 18 dipendenti",
};

const counters = [
  { target: 200, label: "Imprenditori soddisfatti", suffix: "+" },
  { target: 60, label: "Risparmio medio", suffix: "%+" },
  { target: 48, label: "Consegna pratiche", suffix: "h" },
  { target: 0, label: "Costi Fissi mensili", suffix: "€" },
];

const swipeVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
  }),
};

export default function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [[active, direction], setActiveState] = useState([0, 0]);

  const paginate = useCallback((newDirection: number) => {
    setActiveState(([prev]) => {
      const next = (prev + newDirection + testimonials.length) % testimonials.length;
      return [next, newDirection];
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => paginate(1), 5000);
    return () => clearInterval(interval);
  }, [paginate]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      paginate(1);
    } else if (info.offset.x > threshold) {
      paginate(-1);
    }
  };

  return (
    <section ref={ref} id="testimonianze" className="py-16 sm:py-20 lg:py-28 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10 sm:mb-14"
        >
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-5xl tracking-heading-tight leading-[1.1] mb-4">
            200+ Imprenditori hanno già
            <br />
            <span className="text-gradient-primary">scelto la Leggerezza.</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Professionisti, artigiani e PMI che hanno trasformato il loro back-office.
          </p>
        </motion.div>

        {/* Swipeable Carousel */}
        <div className="max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="relative overflow-hidden rounded-2xl border border-border shadow-lg min-h-[220px] sm:min-h-[200px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={active}
                custom={direction}
                variants={swipeVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.3 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={handleDragEnd}
                className="bg-card p-5 sm:p-8 flex flex-col justify-between min-h-[220px] sm:min-h-[200px] cursor-grab active:cursor-grabbing touch-pan-y"
              >
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-foreground font-body leading-relaxed italic text-sm sm:text-base select-none">
                    "{testimonials[active].text}"
                  </p>
                </div>
                <div className="mt-4">
                  <p className="font-subtitle font-semibold text-sm">{testimonials[active].author}</p>
                  <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {testimonials[active].tag}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots + swipe hint */}
          <div className="flex flex-col items-center gap-2 mt-4">
            <div className="flex justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveState([i, i > active ? 1 : -1])}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === active ? "bg-primary w-6" : "bg-border w-2.5"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground/60 sm:hidden">← Scorri per navigare →</p>
          </div>
        </div>

        {/* Featured */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto bg-gradient-cta rounded-2xl p-5 sm:p-8 text-primary-foreground mb-12 sm:mb-16"
        >
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className="fill-primary-foreground text-primary-foreground" />
            ))}
          </div>
          <p className="text-base sm:text-lg leading-relaxed italic mb-4">"{featured.text}"</p>
          <p className="font-subtitle font-bold text-sm sm:text-base">{featured.author}</p>
          <span className="inline-block mt-2 bg-primary-foreground/20 px-3 py-1 rounded-full text-xs font-semibold">
            CASO STUDIO COMPLETO →
          </span>
        </motion.div>

        {/* Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-3xl mx-auto text-center">
          {counters.map((c) => (
            <CounterItem key={c.label} {...c} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CounterItem({ target, label, suffix, isVisible }: { target: number; label: string; suffix: string; isVisible: boolean }) {
  const count = useCounterAnimation(target, isVisible);
  return (
    <div>
      <div className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-stat-tight text-primary">
        {suffix === "€" ? `${count}${suffix}` : `${count}${suffix}`}
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  );
}