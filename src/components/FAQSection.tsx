import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const faqs = [
  { q: "Come funziona esattamente il modello \"pay per use\"?", a: "Paghi solo per le pratiche e i servizi che utilizzi effettivamente. Non c'è nessun abbonamento mensile fisso obbligatorio. Ricevi un rendiconto trasparente a fine mese con ogni voce dettagliata." },
  { q: "Quanto tempo ci vuole per attivare il servizio?", a: "Dal primo contatto all'operatività: 24 ore lavorative. Il nostro team si occupa di tutto il setup iniziale." },
  { q: "Posso usare solo alcuni servizi e non altri?", a: "Assolutamente sì. Ogni servizio è modulare e indipendente. Puoi attivare solo la fatturazione, solo il call center, solo le pratiche ENEA o qualsiasi combinazione." },
  { q: "Chi gestisce effettivamente le pratiche?", a: "Un team di professionisti specializzati nel settore edilizia e nelle normative italiane. Ogni area ha un referente dedicato." },
  { q: "Le pratiche ENEA sono conformi alle ultime normative?", a: "Sì. Il nostro team è costantemente aggiornato sulle normative ENEA, sulle aliquote di detrazione vigenti (110%, 90%, 70%, 65%) e su tutti i requisiti tecnici richiesti." },
  { q: "Posso disdire in qualsiasi momento?", a: "Sì, senza penali e senza preavvisi lunghi. La flessibilità è uno dei nostri valori fondamentali." },
  { q: "Come mi vengono consegnate le pratiche completate?", a: "Tramite il portale dedicato e/o email. Ricevi notifica in tempo reale per ogni pratica completata. Puoi anche richiedere consegna via WhatsApp Business." },
  { q: "Il servizio è disponibile in tutta Italia?", a: "Sì, operiamo in tutta Italia. Essendo un servizio digitale, non ci sono limitazioni geografiche." },
  { q: "Come vengono gestiti i dati aziendali riservati?", a: "Con massima riservatezza. Firmiamo sempre un accordo di riservatezza (NDA) prima di iniziare. I dati sono protetti e non vengono mai condivisi con terze parti." },
  { q: "Posso integrare Impresa Leggera con il mio software gestionale?", a: "Nel piano Enterprise offriamo integrazioni personalizzate. Contattaci per valutare la compatibilità con il tuo sistema." },
  { q: "Cosa succede se c'è un errore in una pratica?", a: "La correggiamo immediatamente e gratuitamente. La qualità del lavoro è garantita. In caso di problemi, hai un referente dedicato raggiungibile direttamente." },
  { q: "C'è un numero minimo di pratiche mensili?", a: "No. Puoi usare il servizio anche per una sola pratica al mese. Non ci sono minimi obbligatori di alcun tipo." },
];

export default function FAQSection() {
  const { ref, isVisible } = useScrollAnimation();
  const half = Math.ceil(faqs.length / 2);

  return (
    <section ref={ref} id="faq" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.1] mb-4">
            Domande Frequenti.
            <br />
            <span className="text-gradient-primary">Risposte Oneste.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="grid lg:grid-cols-2 gap-x-8 max-w-5xl mx-auto"
        >
          {[faqs.slice(0, half), faqs.slice(half)].map((col, ci) => (
            <Accordion key={ci} type="single" collapsible>
              {col.map((faq, i) => (
                <AccordionItem key={i} value={`${ci}-${i}`}>
                  <AccordionTrigger className="text-left font-subtitle font-semibold text-sm">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
