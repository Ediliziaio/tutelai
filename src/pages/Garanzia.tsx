import { useState } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Unlock, CreditCard, Zap, Shield, ShieldCheck, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const guarantees = [
  {
    icon: Unlock,
    title: "Esci Quando Vuoi. Oggi.",
    short: "Zero penali. Zero preavviso. Zero storie.",
    long: "Nessun contratto ti tiene in trappola. Se domani mattina vuoi andartene, ci stringi la mano e te ne vai. Zero penali, zero preavviso, zero storie. Ci teniamo i clienti con i risultati, non con le catene.",
  },
  {
    icon: CreditCard,
    title: "Se Non Lavori, Non Paghi. Punto.",
    short: "Mese morto? Zero fattura.",
    long: "Non ti chiediamo un canone per il privilegio di essere nostro cliente. Paghi una pratica, ricevi una pratica. Se non ne hai bisogno, il tuo conto resta a zero. Provalo con il tuo commercialista attuale.",
  },
  {
    icon: Zap,
    title: "Operativo Domani. Non il Mese Prossimo.",
    short: "2 minuti per firmare. 24 ore per partire.",
    long: "Mentre il tuo concorrente aspetta 3 settimane per un preventivo, tu hai già il primo task completato. Il tempo che risparmi dal giorno 1 è già un guadagno.",
  },
  {
    icon: Shield,
    title: "Errore Nostro? Non Paghi. E Rifacciamo.",
    short: "Doppio controllo. Correzione immediata.",
    long: "Doppio controllo su ogni pratica. Ma se passa un errore — qualsiasi errore — lo correggiamo gratis nelle 24 ore. Se non riusciamo a correggerlo? La pratica è a nostro carico. Non ti costa un centesimo. Mai.",
  },
  {
    icon: ShieldCheck,
    title: "Il Rischio È Nostro. Sempre.",
    short: "Assicurazione professionale su ogni pratica.",
    long: "Se un nostro errore ti causa un danno economico, non scaricheremo mai la responsabilità su di te. Paghiamo noi. Perché se non siamo disposti a metterci i nostri soldi, perché dovresti metterci i tuoi?",
  },
];

const processSteps = [
  { icon: AlertCircle, title: "Alzi la mano", desc: "Un messaggio WhatsApp. Una email. Un click sul portale. Qualsiasi canale, qualsiasi ora. Entro 2 ore lavorative hai una risposta umana, non un bot." },
  { icon: RefreshCw, title: "Risolto in 24 ore. Non 'ci stiamo lavorando'.", desc: "Niente ticket aperti per settimane. Correzione, rifacimento o compensazione. Scegliamo noi l'opzione più veloce per te." },
  { icon: CheckCircle, title: "Se non basta, non paghi.", desc: "Dopo la correzione non sei soddisfatto? Non paghi la pratica. Non ci sono asterischi, non ci sono 'condizioni'. Punto." },
];

const faqs = [
  {
    q: "Cosa succede se non sono soddisfatto di una pratica?",
    a: "La rifacciamo. Gratis. Subito. Se dopo il rifacimento ancora non va bene, non paghi quella pratica. Fine della discussione. Non ci sono moduli da compilare, non ci sono 'commissioni di valutazione'. Non paghi e basta.",
  },
  {
    q: "C'è un contratto con durata minima?",
    a: "No. Zero. Niente. Puoi lavorare con noi per un giorno e andartene il giorno dopo. Nessuna penale, nessun preavviso, nessun 'periodo minimo di 3 mesi'. Se hai bisogno di catene per tenere un cliente, il problema non è il cliente.",
  },
  {
    q: "Come fate a garantire la qualità su ogni pratica?",
    a: "Ogni pratica passa attraverso un doppio controllo: il professionista che la esegue e un revisore dedicato. Monitoriamo il tasso di errore in tempo reale. Se una pratica non supera il controllo, non esce. Semplice.",
  },
  {
    q: "Quanto tempo ci vuole per l'attivazione?",
    a: "24 ore. Non 24 giorni. 2 minuti per firmare digitalmente, un referente assegnato, onboarding completato, primo task gestito. Tutto incluso. Tutto in un giorno lavorativo.",
  },
  {
    q: "Se ho un'urgenza fuori orario, come funziona?",
    a: "Supporto standard Lun-Ven 9-18. Per i clienti con piano dedicato: canali prioritari e supporto esteso. In ogni caso, nessun bot. Mai. Rispondono persone vere che conoscono il tuo dossier.",
  },
  {
    q: "Come funziona l'assicurazione sugli errori?",
    a: "Siamo coperti da polizza RC professionale. Se un nostro errore ti causa un danno economico, ci facciamo carico noi. Non devi fare nulla, non devi pagare nulla, non devi parlare con nessun avvocato. Gestiamo tutto noi. Il rischio è nostro dal primo all'ultimo centesimo.",
  },
];

export default function Garanzia() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const hero = useScrollAnimation();
  const cards = useScrollAnimation();
  const letter = useScrollAnimation();
  const proc = useScrollAnimation();
  const faq = useScrollAnimation();
  const cta = useScrollAnimation();

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
              ✦ Garanzia Totale
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-heading-tight leading-[1.08] mb-6">
              Se Non Ti Facciamo Risparmiare,
              <br />
              Ti Paghiamo Noi.
            </h1>
            <p className="text-primary-foreground/80 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
              Questa non è una frase marketing. È un impegno scritto nel contratto.
              Ogni centesimo che ci affidi è protetto dalla garanzia più aggressiva del settore.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 5 Guarantees */}
      <section ref={cards.ref} className="py-14 sm:py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={cards.isVisible ? { opacity: 1, y: 0 } : {}}
            className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight leading-[1.1] mb-14 text-center"
          >
            Le Nostre <span className="text-gradient-primary">5 Garanzie</span>
          </motion.h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {guarantees.map((g, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={cards.isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.1 }}
                className="p-4 sm:p-6 rounded-2xl border border-border bg-card"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <g.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-subtitle font-bold text-lg mb-1">{g.title}</h3>
                <p className="text-sm font-medium text-primary mb-3">{g.short}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{g.long}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sales Letter Section */}
      <section ref={letter.ref} className="py-14 sm:py-20 lg:py-28 bg-gradient-cta text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={letter.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight leading-[1.1] mb-8">
              La Garanzia che Nessuno Ti Offre
            </h2>
            <div className="text-left text-primary-foreground/90 text-base lg:text-lg leading-relaxed space-y-5">
              <p>
                Lascia che ti dica una cosa che nessun fornitore di servizi avrà il coraggio di dirti:
              </p>
              <p className="font-bold text-primary-foreground text-lg lg:text-xl">
                Se non ti facciamo risparmiare almeno il 50% rispetto al tuo costo attuale di gestione, ti rimborsiamo tutto.
              </p>
              <p>
                Non il 10%. Non un credito. <strong>Tutto.</strong>
              </p>
              <p>
                E non finisce qui: lavoriamo gratis per te per 30 giorni in più, per dimostrarti che il problema non era il modello — era solo questione di tempo.
              </p>
              <p>
                Perché possiamo permettercelo? Perché in 200+ aziende servite, non è mai successo. Ma se fossi tu il primo, saremmo felici di pagare il conto.
              </p>
              <p className="font-semibold text-primary-foreground">
                Questo è il livello di fiducia che abbiamo nei nostri risultati.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How Guarantee Works */}
      <section ref={proc.ref} className="py-14 sm:py-20 lg:py-28 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={proc.isVisible ? { opacity: 1, y: 0 } : {}}
            className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight leading-[1.1] mb-14 text-center"
          >
            Come Funziona la <span className="text-gradient-primary">Garanzia</span>
          </motion.h2>
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-6">
            {processSteps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={proc.isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.15 }}
                className="flex-1 text-center p-4 sm:p-6 rounded-2xl border border-border bg-background"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-cta text-primary-foreground flex items-center justify-center mx-auto mb-4">
                  <s.icon size={24} />
                </div>
                <div className="text-xs font-mono font-bold text-primary mb-2">STEP {i + 1}</div>
                <h3 className="font-subtitle font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section ref={faq.ref} className="py-14 sm:py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={faq.isVisible ? { opacity: 1, y: 0 } : {}}
            className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight leading-[1.1] mb-14 text-center"
          >
            Domande sulla <span className="text-gradient-primary">Garanzia</span>
          </motion.h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-4 sm:px-6 overflow-hidden">
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
              Il Rischio È Tutto Nostro.
              <br />
              La Decisione È Tutta Tua.
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Hai zero da perdere e migliaia di euro da guadagnare.
              L'unico rischio reale? Continuare a fare come stai facendo adesso.
            </p>
            <button
              onClick={openModal}
              className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-8 rounded-full bg-primary-foreground text-foreground font-subtitle font-bold hover:opacity-90 transition-opacity"
            >
              Mettici alla Prova →
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
      <LeadFormModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}