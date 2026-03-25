import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { HardHat, Building2, Pencil, Check } from "lucide-react";
import { useState } from "react";

const targets = [
  {
    icon: HardHat,
    title: "Artigiani e Installatori",
    tagline: "Se lavori nel cantiere, noi pensiamo alla scrivania",
    benefits: [
      "Fatture pronte mentre sei in cantiere",
      "Pratiche ENEA per i tuoi clienti in 48h",
      "Chiamate gestite anche quando sei su un tetto",
      "Scadenze mai più dimenticate",
      "Finanziamenti per acquistare attrezzature",
    ],
    sectors: "Idraulici, Elettricisti, Serramentisti, Imbianchini, Posatori",
  },
  {
    icon: Building2,
    title: "PMI dell'Edilizia",
    tagline: "Scala il tuo back-office senza scalare i costi",
    benefits: [
      "Gestione pratiche su grandi volumi",
      "Call center dedicato per i tuoi clienti",
      "Supporto pratiche di finanziamento cantieri",
      "Segreteria virtuale con AI",
      "Report mensile KPI aziendali",
    ],
    sectors: "Da 2 a 50 dipendenti — flessibile con la tua crescita",
  },
  {
    icon: Pencil,
    title: "Professionisti e Studi Tecnici",
    tagline: "Il tuo tempo è troppo prezioso per la burocrazia",
    benefits: [
      "Gestione pratiche ENEA per i tuoi clienti",
      "Corrispondenza e scadenzario",
      "Fatturazione elettronica completa",
      "Supporto recupero crediti bonario",
      "Segreteria e gestione agenda",
    ],
    sectors: "Geometri, Architetti, Ingegneri, Periti",
  },
];

export default function TargetSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [expandedMobile, setExpandedMobile] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-28 bg-gradient-hero">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="font-display font-extrabold text-2xl sm:text-3xl lg:text-5xl tracking-heading-tight leading-[1.1] mb-10 sm:mb-14"
        >
          Pensato per Chi Non ha
          <br />
          <span className="text-gradient-primary">Tempo da Perdere.</span>
        </motion.h2>

        {/* Desktop: flip cards */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {targets.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15 }}
              className="group [perspective:1000px]"
            >
              <div className="relative h-80 [transform-style:preserve-3d] transition-transform duration-700 group-hover:[transform:rotateY(180deg)]">
                {/* Front */}
                <div className="absolute inset-0 bg-card border border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center [backface-visibility:hidden] shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <t.icon size={28} className="text-primary" />
                  </div>
                  <h3 className="font-subtitle font-bold text-lg mb-2">{t.title}</h3>
                  <p className="text-sm text-muted-foreground italic">{t.tagline}</p>
                </div>
                {/* Back */}
                <div className="absolute inset-0 bg-gradient-cta rounded-2xl p-6 flex flex-col justify-between text-left [backface-visibility:hidden] [transform:rotateY(180deg)] text-primary-foreground">
                  <div className="space-y-2">
                    {t.benefits.map((b, bi) => (
                      <div key={bi} className="flex items-start gap-2 text-sm">
                        <Check size={14} className="shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-primary-foreground/20 rounded-xl px-3 py-2 text-xs font-subtitle font-semibold mt-4">
                    → {t.sectors}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: tap to expand */}
        <div className="md:hidden space-y-4 max-w-md mx-auto">
          {targets.map((t, i) => {
            const isExpanded = expandedMobile === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="rounded-2xl border border-border overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setExpandedMobile(isExpanded ? null : i)}
                  className="w-full bg-card p-5 flex items-center gap-4 text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <t.icon size={24} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-subtitle font-bold text-base">{t.title}</h3>
                    <p className="text-xs text-muted-foreground italic truncate">{t.tagline}</p>
                  </div>
                  <span className="text-muted-foreground text-lg shrink-0">{isExpanded ? "−" : "+"}</span>
                </button>
                {isExpanded && (
                  <div className="bg-gradient-cta p-5 text-primary-foreground text-left space-y-2">
                    {t.benefits.map((b, bi) => (
                      <div key={bi} className="flex items-start gap-2 text-sm">
                        <Check size={14} className="shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                    <div className="bg-primary-foreground/20 rounded-xl px-3 py-2 text-xs font-subtitle font-semibold mt-3">
                      → {t.sectors}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
