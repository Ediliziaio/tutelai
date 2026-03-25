import { useState } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";
import GuaranteeSection from "@/components/GuaranteeSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const categories = [
  {
    title: "Servizi e Funzionamento",
    faqs: [
      { q: "Come funziona esattamente il modello \"pay per use\"?", a: "Paghi solo per le pratiche e i servizi che utilizzi effettivamente. Non c'è nessun abbonamento mensile fisso. Ricevi un rendiconto trasparente a fine mese con ogni voce dettagliata. Se un mese non usi nulla, non paghi nulla. Punto." },
      { q: "Quanto tempo ci vuole per attivare il servizio?", a: "24 ore. Non 24 giorni. Non \"qualche settimana\". Dal primo contatto all'operatività completa: un giorno lavorativo. Lo abbiamo fatto con 200+ aziende. Funziona." },
      { q: "Posso usare solo alcuni servizi e non altri?", a: "Assolutamente sì. Ogni servizio è modulare e indipendente. Vuoi solo la fatturazione? Fatto. Solo le pratiche ENEA? Fatto. Solo il call center? Fatto. Qualsiasi combinazione, senza vincoli." },
      { q: "Chi gestisce effettivamente le pratiche?", a: "Un team di professionisti specializzati nel settore edilizia e nelle normative italiane. Non stagisti, non software automatici. Persone reali, qualificate, con un referente dedicato per la tua azienda." },
      { q: "Devo installare qualcosa?", a: "Assolutamente no. Se sai mandare un WhatsApp o un'email, sai già tutto quello che ti serve. Il portale è via browser: niente app, niente download, niente aggiornamenti." },
      { q: "Il mio team deve essere formato?", a: "No. Siamo noi che ci adattiamo ai tuoi processi, non il contrario. L'unica cosa che ti chiediamo è un briefing iniziale di 15 minuti. Poi non devi pensarci più." },
      { q: "Come mi vengono consegnate le pratiche completate?", a: "Tramite il portale dedicato e/o email. Ricevi notifica in tempo reale per ogni pratica completata. Puoi anche richiedere consegna via WhatsApp Business." },
      { q: "Il servizio è disponibile in tutta Italia?", a: "Sì, operiamo in tutta Italia. Essendo un servizio digitale, non ci sono limitazioni geografiche." },
    ],
  },
  {
    title: "Prezzi e Pagamenti",
    faqs: [
      { q: "C'è un costo di attivazione?", a: "No. Zero costi di setup, zero costi di attivazione, zero canoni mensili. Paghi solo le pratiche che gestiamo per te. Se questo ti sembra troppo bello per essere vero, è perché i nostri competitor ti hanno abituato male." },
      { q: "Come funziona la fatturazione?", a: "Fatturiamo a fine mese in base alle pratiche effettivamente gestite. Ricevi un riepilogo dettagliato con ogni pratica elencata. Nessuna sorpresa, nessun costo nascosto." },
      { q: "Ci sono sconti per volumi elevati?", a: "Assolutamente sì. Più pratiche gestisci con noi, più il prezzo unitario scende. Sconti progressivi automatici. Un nostro cliente è passato da 5 a 200 pratiche/mese e ha visto il costo unitario dimezzarsi." },
      { q: "Quali metodi di pagamento accettate?", a: "Bonifico bancario, carta di credito e SDD (addebito diretto). Per i clienti con volumi elevati offriamo condizioni di pagamento personalizzate." },
      { q: "C'è un numero minimo di pratiche mensili?", a: "No. Puoi usare il servizio anche per una sola pratica al mese. Non ci sono minimi obbligatori di alcun tipo." },
      { q: "Posso cambiare piano in qualsiasi momento?", a: "Sì. Puoi modificare i servizi attivi in qualsiasi momento, senza penali e senza interruzioni del servizio." },
    ],
  },
  {
    title: "Garanzia e Sicurezza",
    faqs: [
      { q: "Cosa succede se c'è un errore in una pratica?", a: "La correggiamo immediatamente e gratuitamente. La qualità del lavoro è garantita. Errori nostri = a carico nostro. Sempre. Nessuna eccezione." },
      { q: "Come vengono gestiti i dati aziendali riservati?", a: "Con massima riservatezza. Firmiamo sempre un accordo di riservatezza (NDA) prima di iniziare. I dati sono protetti con crittografia e non vengono mai condivisi con terze parti." },
      { q: "Le pratiche ENEA sono conformi alle ultime normative?", a: "Sì. Il nostro team è costantemente aggiornato sulle normative ENEA, sulle aliquote di detrazione vigenti (110%, 90%, 70%, 65%) e su tutti i requisiti tecnici richiesti." },
      { q: "Cosa succede se voglio smettere?", a: "Smetti. Oggi, adesso, senza preavviso. Nessuna penale, nessuna trattenuta, nessuna telefonata di \"retention\". Ti restituiamo tutto entro 48 ore. Ci teniamo i clienti con i risultati, non con i contratti." },
    ],
  },
  {
    title: "Aspetti Tecnici",
    faqs: [
      { q: "Posso integrare Impresa Leggera con il mio software gestionale?", a: "Nel piano Enterprise offriamo integrazioni personalizzate. Contattaci per valutare la compatibilità con il tuo sistema." },
      { q: "Come comunico con il team?", a: "Email, WhatsApp, telefono, portale. Un geometra di Roma ci manda le pratiche via foto su WhatsApp. Un'impresa di Padova usa il portale. Funziona tutto. Tu scegli il canale che preferisci." },
      { q: "Posso iniziare con poche pratiche e poi scalare?", a: "Certo. Un nostro cliente ha iniziato con 5 pratiche al mese. Oggi ne fa 200. Non ha cambiato nulla nel processo. Ha solo smesso di dire no ai clienti." },
      { q: "Quanto tempo ci vuole per completare una pratica?", a: "Dipende dal tipo di pratica, ma in media: fatture in giornata, pratiche ENEA in 48 ore, finanziamenti in 72 ore. Sempre con aggiornamenti in tempo reale sullo stato." },
    ],
  },
];

function FAQCategory({ cat, index }: { cat: typeof categories[number]; index: number }) {
  const anim = useScrollAnimation();
  return (
    <section
      ref={anim.ref}
      className={`py-16 lg:py-24 ${index % 2 === 0 ? "bg-background" : "bg-card"}`}
    >
      <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={anim.isVisible ? { opacity: 1, y: 0 } : {}}
          className="font-display font-extrabold text-2xl sm:text-3xl tracking-heading-tight leading-[1.1] mb-8 text-center"
        >
          <span className="text-gradient-primary">{cat.title}</span>
        </motion.h2>
        <Accordion type="single" collapsible className="space-y-3">
          {cat.faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`cat-${index}-${i}`}
              className="border border-border rounded-xl px-4 sm:px-6 overflow-hidden bg-card"
            >
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
  );
}

export default function FAQ() {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const hero = useScrollAnimation();
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
              ✦ Tutto Quello che Devi Sapere
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-heading-tight leading-[1.08] mb-6">
              Hai Domande.
              <br />
              Noi Abbiamo Risposte.
              <br />
              <span className="text-primary-foreground/90">Senza Giri di Parole.</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
              Non troverai risposte vaghe o linguaggio corporate. Solo fatti, numeri e trasparenza totale.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      {categories.map((cat, ci) => (
        <FAQCategory key={ci} cat={cat} index={ci} />
      ))}

      {/* CTA */}
      <section ref={cta.ref} className="py-14 sm:py-20 lg:py-28 bg-gradient-cta text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={cta.isVisible ? { opacity: 1, y: 0 } : {}}
          >
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.1] mb-6">
              Non Hai Trovato la Tua Risposta?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Parliamone. 30 minuti di consulenza gratuita per rispondere a ogni dubbio
              con i tuoi numeri alla mano.
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