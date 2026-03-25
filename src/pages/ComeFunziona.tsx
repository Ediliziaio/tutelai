import { useState } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Search, Settings, Rocket, UserCheck, Monitor, FileCheck, Zap, GraduationCap, Plug, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";
import InactionCostSection from "@/components/InactionCostSection";
import GuaranteeSection from "@/components/GuaranteeSection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const steps = [
  {
    icon: Search,
    badge: "STEP 1",
    title: "30 Minuti che Ti Fanno Risparmiare €72.000/Anno",
    short: "Scopri quanto ti costa davvero il tuo back-office. Spoiler: più di quanto pensi.",
    long: "Un idraulico di Brescia gestiva 40 pratiche ENEA al mese. Impiegava 3 ore a pratica tra compilazione, invio e correzioni. Costo reale: €4.800/mese solo di tempo perso. In 30 minuti glielo abbiamo dimostrato con i suoi numeri. Non con i nostri. In una call gratuita facciamo la stessa cosa con te: mappiamo i tuoi processi, calcoliamo il costo reale e ti mostriamo esattamente dove stai bruciando margini. Se non troviamo nulla da migliorare, ci stringiamo la mano e ognuno per la sua strada.",
    details: [
      "Call di 30 minuti con i TUOI numeri reali",
      "Mappatura costi nascosti del back-office",
      "Calcolo ROI personalizzato (media: €72.000/anno)",
      "Zero impegno — se non troviamo nulla, amici come prima",
    ],
  },
  {
    icon: Settings,
    badge: "STEP 2",
    title: "Mentre il Tuo Concorrente Aspetta un Preventivo, Tu Sei Già Operativo",
    short: "2 minuti per firmare. 24 ore per partire. Zero da installare.",
    long: "Un'impresa edile di Napoli ha firmato il contratto alle 10 di mattina. Alle 14 aveva il portale attivo e il referente dedicato. Il giorno dopo, 12 pratiche ENEA erano già in lavorazione. Non abbiamo chiesto di installare software. Non abbiamo chiesto di formare nessuno. Ci siamo integrati nel loro WhatsApp, nella loro email, nei loro processi. Come se fossimo sempre stati lì.",
    details: [
      "Firma digitale in 2 minuti (non 2 settimane)",
      "Referente dedicato assegnato in giornata",
      "Integrazione WhatsApp + Email + Portale",
      "Prima pratica completata entro 24 ore",
    ],
  },
  {
    icon: Rocket,
    badge: "STEP 3",
    title: "Tu Fatturi. Noi Facciamo il Resto.",
    short: "Dal giorno 1, ogni pratica completata ti viene notificata. Ogni errore è a nostro carico.",
    long: "Un elettricista di Milano gestiva da solo 60 pratiche al mese. Lavorava fino alle 22. Dopo 30 giorni con noi: stesse pratiche, zero ore di back-office. Ha usato quel tempo per acquisire 8 nuovi clienti. Non gli abbiamo dato un software. Gli abbiamo ridato le sere e i weekend. E i suoi margini sono saliti del 40%.",
    details: [
      "Report settimanali con KPI che contano",
      "Scalabilità immediata: da 5 a 500 pratiche",
      "Supporto Lun-Ven 9-18 con risposta in 2 ore",
      "Errori nostri = a carico nostro. Sempre.",
    ],
  },
];

const onboardingItems = [
  { icon: UserCheck, text: "Referente dedicato assegnato" },
  { icon: Monitor, text: "Portale operativo configurato" },
  { icon: FileCheck, text: "Prima pratica completata" },
  { icon: Clock, text: "Tutto in meno di 24 ore" },
];

const advantages = [
  {
    icon: Zap,
    title: "Nessun Setup Tecnico",
    desc: "L'impresa edile di Torino ci ha detto: \"Ma devo installare qualcosa?\" No. Niente server, niente app, niente password da ricordare. Se sai usare WhatsApp, sai usare noi.",
  },
  {
    icon: GraduationCap,
    title: "Zero Formazione",
    desc: "Il tuo team continua a fare esattamente quello che fa oggi. L'unica differenza? Non deve più occuparsi delle pratiche. Le manda a noi. Fine.",
  },
  {
    icon: Plug,
    title: "Integrazione Immediata",
    desc: "Email, WhatsApp, telefono, portale. Un geometra di Roma ci manda le pratiche via foto su WhatsApp. Un'impresa di Padova usa il portale. Funziona tutto.",
  },
];

const faqs = [
  {
    q: "Quanto dura l'onboarding?",
    a: "24 ore. Non 24 giorni, non \"qualche settimana\". Ventiquattr'ore dalla firma e sei operativo. Lo abbiamo fatto con 200+ aziende. Funziona.",
  },
  {
    q: "Devo installare qualcosa?",
    a: "Assolutamente no. Se sai mandare un WhatsApp o un'email, sai già tutto quello che ti serve. Il nostro portale è via browser: niente app, niente download, niente aggiornamenti.",
  },
  {
    q: "Il mio team deve essere formato?",
    a: "No. Punto. Siamo noi che ci adattiamo ai tuoi processi, non il contrario. L'unica cosa che ti chiediamo è un briefing iniziale di 15 minuti. Poi non devi pensarci più.",
  },
  {
    q: "Posso iniziare con poche pratiche e poi scalare?",
    a: "Certo. Un nostro cliente ha iniziato con 5 pratiche al mese. Oggi ne fa 200. Non ha cambiato nulla nel processo. Ha solo smesso di dire no ai clienti.",
  },
  {
    q: "Cosa succede se voglio smettere?",
    a: "Smetti. Oggi, adesso, senza preavviso. Nessuna penale, nessuna trattenuta, nessuna telefonata di \"retention\". Ti restituiamo tutto entro 48 ore. Ci teniamo i clienti con i risultati, non con i contratti.",
  },
];

export default function ComeFunziona() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const hero = useScrollAnimation();
  const stepsAnim = useScrollAnimation();
  const onboarding = useScrollAnimation();
  const adv = useScrollAnimation();
  const faq = useScrollAnimation();
  const cta = useScrollAnimation();
  const salesLetter = useScrollAnimation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCtaClick={openModal} />

      {/* Hero */}
      <section ref={hero.ref} className="pt-28 pb-14 sm:pb-20 lg:pt-36 lg:pb-28 bg-gradient-cta text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={hero.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-subtitle font-semibold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full bg-primary-foreground/15">
              ✦ 3 Passi. 24 Ore. Zero Rischi.
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-heading-tight leading-[1.08] mb-6">
              Domani Mattina il Tuo
              <br />
              Back-Office Non È Più
              <br />
              un Tuo Problema.
            </h1>
            <p className="text-primary-foreground/80 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
              Non tra un mese. Non dopo 10 riunioni. <strong className="text-primary-foreground">Domani.</strong> Tre passi e ogni pratica, ogni fattura, ogni scadenza è gestita da qualcun altro. Tu torni a fare quello che sai fare: far crescere la tua azienda.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3 Steps */}
      <section ref={stepsAnim.ref} className="py-14 sm:py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={stepsAnim.isVisible ? { opacity: 1, y: 0 } : {}}
            className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight leading-[1.1] mb-4 text-center"
          >
            Tre Step. <span className="text-gradient-primary">Risultati Reali.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={stepsAnim.isVisible ? { opacity: 1 } : {}}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-center max-w-xl mx-auto mb-14"
          >
            Non ti raccontiamo cosa facciamo. Ti mostriamo cosa è successo a chi lo ha già fatto.
          </motion.p>
          <div className="max-w-4xl mx-auto space-y-8">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={stepsAnim.isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.12 }}
                className="flex flex-col md:flex-row gap-6 p-6 md:p-8 rounded-2xl border border-border bg-card"
              >
                <div className="shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-cta text-primary-foreground flex items-center justify-center">
                    <s.icon size={28} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xs font-mono font-bold text-primary mb-2">{s.badge}</div>
                  <h3 className="font-display font-extrabold text-lg sm:text-xl mb-1">{s.title}</h3>
                  <p className="text-sm font-medium text-primary mb-3">{s.short}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.long}</p>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {s.details.map((d, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-0.5">✓</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sales Letter Section — "Il Costo di Non Fare Niente" */}
      <section ref={salesLetter.ref} className="py-20 lg:py-28 bg-gradient-cta text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={salesLetter.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight leading-[1.1] mb-8">
              Il Costo di Non Fare Niente
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={salesLetter.isVisible ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="text-primary-foreground/90 text-base sm:text-lg leading-relaxed space-y-5 font-subtitle"
          >
            <p>
              Facciamo due conti. Se gestisci 50 pratiche al mese e ogni pratica ti porta via 2 ore tra compilazione, invio, correzioni e telefonate… sono <strong className="text-primary-foreground">100 ore al mese.</strong>
            </p>
            <p>
              A €30/ora, sono <strong className="text-primary-foreground">€3.000 al mese. €36.000 all'anno. Bruciati.</strong>
            </p>
            <p>
              E non stiamo contando gli errori, le sanzioni, i clienti persi perché non hai risposto in tempo. Non stiamo contando le sere passate a compilare moduli invece di stare con la tua famiglia. Non stiamo contando lo stress.
            </p>
            <p className="text-lg sm:text-xl font-display font-extrabold text-primary-foreground">
              Ogni giorno che aspetti, stai pagando il prezzo più alto di tutti: quello dell'inazione.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={salesLetter.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            className="text-center mt-10"
          >
            <button
              onClick={openModal}
              className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 rounded-full bg-primary-foreground text-foreground font-subtitle font-bold hover:opacity-90 transition-opacity"
            >
              Scopri Quanto Stai Perdendo →
            </button>
          </motion.div>
        </div>
      </section>

      {/* Onboarding */}
      <section ref={onboarding.ref} className="py-14 sm:py-20 lg:py-28 bg-card">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={onboarding.isVisible ? { opacity: 1, y: 0 } : {}}
            className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight leading-[1.1] mb-4"
          >
            Cosa Succede nelle Prime <span className="text-gradient-primary">24 Ore</span>
          </motion.h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-12">
            Dall'attivazione all'operatività completa, tutto incluso nel prezzo. Nessuna sorpresa.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {onboardingItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={onboarding.isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.1 }}
                className="p-5 rounded-2xl border border-border bg-background text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon size={22} className="text-primary" />
                </div>
                <p className="text-sm font-subtitle font-semibold">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section ref={adv.ref} className="py-14 sm:py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={adv.isVisible ? { opacity: 1, y: 0 } : {}}
            className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight leading-[1.1] mb-14 text-center"
          >
            Perché è <span className="text-gradient-primary">Diverso</span>
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {advantages.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={adv.isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.1 }}
                className="p-6 rounded-2xl border border-border bg-card text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-cta text-primary-foreground flex items-center justify-center mx-auto mb-4">
                  <a.icon size={24} />
                </div>
                <h3 className="font-subtitle font-bold text-lg mb-2">{a.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section ref={faq.ref} className="py-14 sm:py-20 lg:py-28 bg-card">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={faq.isVisible ? { opacity: 1, y: 0 } : {}}
            className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight leading-[1.1] mb-14 text-center"
          >
            Domande sul <span className="text-gradient-primary">Processo</span>
          </motion.h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-4 sm:px-6 overflow-hidden bg-background">
                <AccordionTrigger className="font-subtitle font-semibold text-left hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
              Ogni Giorno che Aspetti,
              <br />
              Stai Perdendo Soldi.
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              30 minuti di call gratuita. Zero impegno.
              L'unico rischio è scoprire quanto stai spendendo in più.
            </p>
            <button
              onClick={openModal}
              className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 rounded-full bg-primary-foreground text-foreground font-subtitle font-bold hover:opacity-90 transition-opacity"
            >
              Scopri Quanto Stai Perdendo →
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
