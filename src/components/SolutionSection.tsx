import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useState } from "react";
import beforeChaos from "@/assets/before-chaos.png";
import afterOrder from "@/assets/after-order.png";

export default function SolutionSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-28 bg-gradient-hero" id="soluzione">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-subtitle font-bold uppercase tracking-wider mb-6"
        >
          La Rivoluzione del Back-Office
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.1] mb-6"
        >
          Il Tuo Team di Back-Office.
          <br />
          <span className="text-gradient-primary">Senza i Costi del Team.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed"
        >
          Impresa Leggera è la prima azienda in Italia che ti offre un servizio completo
          di gestione burocratica e amministrativa interamente in outsourcing.
          Niente dipendenti fissi. Niente TFR. Niente 13ª. Niente sorprese.
          Paghi solo per quello che usi, quando lo usi.
        </motion.p>

        {/* Before / After slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="max-w-3xl mx-auto relative rounded-2xl overflow-hidden border border-border shadow-lg h-48 sm:h-64 md:h-80 select-none"
          onPointerMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setSliderPos(((e.clientX - rect.left) / rect.width) * 100);
          }}
        >
          {/* After (order) */}
          <div className="absolute inset-0">
            <img src={afterOrder} alt="Dashboard pulita e ordinata" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-secondary/20 flex items-end justify-center pb-4 sm:pb-6">
              <span className="bg-secondary/90 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-subtitle font-bold">✅ Dashboard Pulita</span>
            </div>
          </div>
          {/* Before (chaos) */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          >
            <img src={beforeChaos} alt="Scrivania caotica piena di carte" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-destructive/20 flex items-end justify-center pb-4 sm:pb-6">
              <span className="bg-destructive/90 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-subtitle font-bold">📑 Caos Burocratico</span>
            </div>
          </div>
          {/* Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-lg">
              ⇔
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
