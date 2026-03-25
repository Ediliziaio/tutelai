import { useState } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Eye, ShieldCheck, Sparkles, TrendingUp, Headphones, Rocket, Heart, FileCheck, Users, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";
import GuaranteeSection from "@/components/GuaranteeSection";

const stats = [
  { value: "5.000+", label: "Pratiche gestite", icon: FileCheck },
  { value: "200+", label: "Clienti attivi", icon: Users },
  { value: "68%", label: "Risparmio medio", icon: TrendingUp },
  { value: "12.000+", label: "Ore risparmiate/anno", icon: Clock },
];

const values = [
  { icon: Eye, title: "Trasparenza", desc: "Prezzi chiari, nessun costo nascosto, nessuna clausola in piccolo. Sai sempre quanto spendi e cosa ottieni." },
  { icon: ShieldCheck, title: "Affidabilità", desc: "Ogni pratica è verificata da professionisti qualificati. Se sbagliamo, correggiamo a nostre spese. Punto." },
  { icon: Sparkles, title: "Semplicità", desc: "Niente burocrazia per accedere ai nostri servizi. Un messaggio e parte tutto. Zero complicazioni." },
  { icon: TrendingUp, title: "Risultati", desc: "Non vendiamo promesse, vendiamo ore liberate e margini recuperati. Misuriamo tutto, ogni mese." },
];

const steps = [
  { num: "01", title: "Ascoltiamo", desc: "Analizziamo i tuoi processi attuali, identifichiamo dove perdi tempo e margine. Nessun impegno, solo una conversazione onesta.", icon: Headphones },
  { num: "02", title: "Attiviamo", desc: "In 24 ore sei operativo. Configuriamo i servizi che ti servono, ti assegniamo un referente dedicato e partiamo.", icon: Rocket },
  { num: "03", title: "Cresciamo con te", desc: "Monitoriamo i risultati, ottimizziamo i processi, scaliamo i servizi quando la tua azienda cresce. Siamo il tuo reparto, non un fornitore.", icon: Heart },
];

export default function ChiSiamo() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const hero = useScrollAnimation();
  const mission = useScrollAnimation();
  const numbers = useScrollAnimation();
  const valuesAnim = useScrollAnimation();
  const process = useScrollAnimation();
  const cta = useScrollAnimation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCtaClick={openModal} />

      {/* Hero */}
      <section ref={hero.ref} className="pt-28 pb-14 sm:pb-20 lg:pt-36 lg:pb-28">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={hero.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-subtitle font-semibold tracking-widest uppercase text-primary mb-4 px-4 py-1.5 rounded-full bg-primary/10">
              Chi Siamo
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-heading-tight leading-[1.08] mb-6">
              La 1ª Azienda in Italia che
              <br />
              <span className="text-gradient-primary">Libera l'Imprenditore.</span>
            </h1>
            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
              Siamo nati con una missione semplice: permettere a chi fa impresa di concentrarsi
              su ciò che sa fare meglio, delegando tutto il resto a professionisti veri.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section ref={mission.ref} className="py-14 sm:py-20 lg:py-28 bg-card">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mission.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight leading-[1.1] mb-8 text-center">
              La Nostra <span className="text-gradient-primary">Missione</span>
            </h2>
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                In Italia, il 70% delle PMI spende più tempo in burocrazia che nel proprio core business.
                Imprenditori che dovrebbero vendere, progettare, innovare — sono bloccati tra fatture,
                pratiche, scadenze e telefonate.
              </p>
              <p>
                <strong className="text-foreground">Impresa Leggera nasce per risolvere questo problema.</strong>{" "}
                Non siamo un'agenzia generica. Non siamo un software. Siamo il tuo reparto operativo
                esterno: persone reali, potenziate dalla tecnologia, che fanno il lavoro che tu non dovresti fare.
              </p>
              <p>
                Il nostro modello è semplice: <strong className="text-foreground">paghi solo quello che usi</strong>,
                attivi in 24 ore, e puoi smettere quando vuoi. Nessun vincolo, nessun rischio.
                Solo risultati misurabili.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Numbers */}
      <section ref={numbers.ref} className="py-14 sm:py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={numbers.isVisible ? { opacity: 1, y: 0 } : {}}
            className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight leading-[1.1] mb-14 text-center"
          >
            I Nostri <span className="text-gradient-primary">Numeri</span>
          </motion.h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={numbers.isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="text-center p-4 sm:p-6 rounded-2xl bg-card border border-border"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <s.icon size={22} className="text-primary" />
                </div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-foreground mb-1">{s.value}</div>
                <div className="font-subtitle text-sm text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesAnim.ref} className="py-14 sm:py-20 lg:py-28 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={valuesAnim.isVisible ? { opacity: 1, y: 0 } : {}}
            className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight leading-[1.1] mb-14 text-center"
          >
            I Nostri <span className="text-gradient-primary">Valori</span>
          </motion.h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={valuesAnim.isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.1 }}
                className="p-6 rounded-2xl border border-border bg-background"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <v.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-subtitle font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section ref={process.ref} className="py-14 sm:py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={process.isVisible ? { opacity: 1, y: 0 } : {}}
            className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight leading-[1.1] mb-14 text-center"
          >
            Come <span className="text-gradient-primary">Lavoriamo</span>
          </motion.h2>
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-8">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={process.isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.15 }}
                className="flex gap-6 items-start"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-cta text-primary-foreground flex items-center justify-center shrink-0">
                  <s.icon size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono font-bold text-primary">{s.num}</span>
                    <h3 className="font-subtitle font-bold text-lg">{s.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={cta.ref} className="py-14 sm:py-20 lg:py-28 bg-gradient-cta text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={cta.isVisible ? { opacity: 1, y: 0 } : {}}
          >
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.1] mb-6">
              Vuoi conoscerci meglio?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Prenota una consulenza gratuita. Ti mostriamo quanto puoi risparmiare,
              senza impegno.
            </p>
            <button
              onClick={openModal}
              className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 rounded-full bg-primary-foreground text-foreground font-subtitle font-bold hover:opacity-90 transition-opacity"
            >
              Richiedi Consulenza Gratuita
            </button>
          </motion.div>
        </div>
      </section>

      <GuaranteeSection />
      <Footer />
      <LeadFormModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}