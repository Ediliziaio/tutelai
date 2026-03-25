import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCounterAnimation } from "@/hooks/useCounterAnimation";
import { TrendingUp, Wallet, Target } from "lucide-react";
import { Button } from "./ui/button";

const cards = [
  {
    icon: TrendingUp,
    title: "MARGINE OPERATIVO",
    desc: "Prima: ogni pratica gestita internamente costa €15–40 di costo reale (stipendio ripartito + overhead). Con Impresa Leggera: paghi €X per pratica.",
    result: "Margine recuperato per pratica: fino al 70%",
  },
  {
    icon: Wallet,
    title: "CASH FLOW IMMEDIATO",
    desc: "Zero costi fissi mensili significa zero uscite nei mesi a bassa operatività. Il tuo conto corrente respira. Hai liquidità quando ne hai bisogno davvero.",
    result: "Cashflow libero: da subito, ogni mese",
  },
  {
    icon: Target,
    title: "CRESCITA DEL FATTURATO",
    desc: "Ore liberate dalla burocrazia = ore dedicate a vendere, a fare preventivi, a seguire cantieri. Il nostro partner medio acquisisce 2-3 clienti nuovi al mese.",
    result: "Fatturato incrementale medio: +18% primo anno",
  },
];

export default function MarginsSection() {
  const { ref, isVisible } = useScrollAnimation();
  const counter = useCounterAnimation(72000, isVisible, 2500);

  return (
    <section ref={ref} className="py-16 sm:py-20 lg:py-28 bg-dark-gradient text-primary-foreground relative overflow-hidden">
      {/* Subtle star dots */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary-foreground/10"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
        />
      ))}

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="inline-block bg-accent/20 text-accent px-4 py-1.5 rounded-full text-xs sm:text-sm font-subtitle font-semibold mb-6">
            💡 IL VERO VANTAGGIO COMPETITIVO
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-[60px] tracking-display-tight leading-[1.05] mb-6">
            Ogni Euro che Risparmi
            <br />
            in Costi Fissi
            <br />
            è Utile Puro.
          </h2>
          <p className="text-primary-foreground/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Non stiamo parlando di risparmio. Stiamo parlando di margini.
            Di utili veri che rimangono in tasca tua.
            Di libertà finanziaria che ti permette di investire, crescere,
            assumere le persone giuste — non quelle obbligate.
          </p>
        </motion.div>

        {/* 3 Impact Cards */}
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto mb-12 sm:mb-16">
          {cards.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="rounded-2xl p-4 sm:p-6 border border-accent/30 hover:-translate-y-1 transition-transform duration-300"
              style={{ background: "hsl(222 84% 5%)" }}
            >
              <c.icon size={28} className="text-accent mb-4" />
              <h3 className="font-subtitle font-bold text-sm tracking-wider text-accent mb-3">{c.title}</h3>
              <p className="text-sm text-primary-foreground/60 leading-relaxed mb-4">{c.desc}</p>
              <div className="border-t border-primary-foreground/10 pt-3">
                <span className="text-sm font-subtitle font-semibold text-secondary">✅ {c.result}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Manifesto block */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="max-w-3xl mx-auto text-center mb-12 sm:mb-16"
        >
          <p className="font-display font-bold text-base sm:text-xl lg:text-3xl leading-[1.4] tracking-heading-tight text-primary-foreground/90">
            "Un imprenditore edile con 5 collaboratori spende in media <span className="text-accent">€8.000/mese</span> in personale amministrativo.
            <br /><br />
            Con Impresa Leggera, quegli stessi servizi costano meno di <span className="text-secondary">€2.000/mese</span>.
            <br /><br />
            La differenza — <span className="text-accent">€6.000 al mese</span> — è utile netto che puoi reinvestire.
            <br /><br />
            In 12 mesi: <span className="text-accent">€72.000</span> di ritorno."
          </p>
        </motion.div>

        {/* Big counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1 }}
          className="text-center mb-10"
        >
          <div className="font-display font-extrabold text-4xl sm:text-5xl lg:text-8xl tracking-stat-tight text-accent glow-amber">
            €{counter.toLocaleString("it-IT")}
          </div>
          <p className="text-sm text-primary-foreground/50 mt-3">
            di utile recuperabile in 12 mesi — dato medio dei nostri Partner
          </p>
        </motion.div>

        <div className="text-center">
          <Button
            onClick={() => document.getElementById("roi-calculator")?.scrollIntoView({ behavior: "smooth" })}
            size="lg"
            className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-subtitle font-bold bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
          >
            → Calcola il Tuo Potenziale di Guadagno
          </Button>
        </div>
      </div>
    </section>
  );
}
