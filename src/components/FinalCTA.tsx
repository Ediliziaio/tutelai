import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "./ui/button";
import { Clock, Phone, CheckCircle, Lock, Flag, Star } from "lucide-react";

export default function FinalCTA({ onCtaClick }: { onCtaClick: () => void }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      ref={ref}
      className="py-16 sm:py-20 lg:py-28 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(222 84% 5%) 0%, hsl(199 89% 48%) 100%)",
      }}
    >
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary-foreground/10 animate-float-slow"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            animationDelay: `${i * 0.8}s`,
          }}
        />
      ))}

      <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
        <motion.span
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          className="inline-block bg-primary-foreground/20 text-primary-foreground px-4 py-1.5 rounded-full text-sm font-subtitle font-semibold mb-6"
        >
          🚀 Inizia Oggi
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="font-display font-extrabold text-2xl sm:text-3xl lg:text-5xl tracking-heading-tight leading-[1.1] text-primary-foreground mb-6"
        >
          Il Momento Migliore
          <br />
          per Alleggerire la Tua Impresa
          <br />
          è Adesso.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="text-primary-foreground/80 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed"
        >
          Ogni mese che passa con costi fissi non necessari è denaro che regali.
          In 24 ore possiamo trasformare il tuo back-office.
          La consulenza iniziale è completamente gratuita e senza impegno.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={onCtaClick}
            size="lg"
            className="w-full sm:w-auto bg-primary-foreground text-foreground rounded-full px-10 py-6 text-base font-subtitle font-bold hover:bg-primary-foreground/90 transition-opacity"
          >
            → Prenota la Tua Consulenza Gratuita
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 text-sm text-primary-foreground/70"
        >
          <span className="flex items-center justify-center gap-1.5"><Clock size={14} /> Risposta entro 2 ore lavorative</span>
          <span className="flex items-center justify-center gap-1.5"><Phone size={14} /> Consulente specializzato, non un bot</span>
          <span className="flex items-center justify-center gap-1.5"><CheckCircle size={14} /> Nessun impegno. Solo chiarezza.</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
          className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-4 sm:gap-6 text-xs text-primary-foreground/50"
        >
          <span className="flex items-center gap-1"><Lock size={12} /> GDPR Compliant</span>
          <span className="flex items-center gap-1"><Flag size={12} /> 100% Made in Italy</span>
          <span className="flex items-center gap-1"><Star size={12} /> 4.9/5 Rating</span>
        </motion.div>
      </div>
    </section>
  );
}
