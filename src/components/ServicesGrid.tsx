import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { FileText, Building, Euro, Phone, Mail, Bot, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const services = [
  { icon: FileText, title: "Creazione Fatture", desc: "Gestiamo l'intero ciclo fatturazione per te. Fatture elettroniche, note di credito, scadenzario clienti. Tutto in regola con SDI.", badge: "Da €X a pratica", slug: "creazione-fatture" },
  { icon: Building, title: "Pratiche ENEA per l'Edilizia", desc: "Certificazioni energetiche, pratiche per le detrazioni fiscali 110%, 90%, 70% e 65%. Elaboriamo in 48 ore lavorative.", badge: "Da €X a pratica", slug: "pratiche-enea" },
  { icon: Euro, title: "Pratiche di Finanziamento", desc: "Gestiamo le pratiche di credito al consumo dei tuoi clienti. Raccolta documenti, portali, compilazione. Tu vendi, noi facciamo il resto.", badge: "Da €X a pratica", slug: "pratiche-finanziamento" },
  { icon: Phone, title: "Call Center Professionale", desc: "Il tuo numero, i tuoi clienti, la nostra professionalità. Gestione chiamate, appuntamenti, qualifica lead e customer service.", badge: "Da €X al giorno", slug: "call-center" },
  { icon: Mail, title: "Gestione Corrispondenza e Scadenze", desc: "Raccomandate, notifiche, scadenze fiscali e amministrative. Monitoriamo tutto e ti avvisiamo in tempo reale.", badge: "Incluso nel piano", slug: "gestione-corrispondenza" },
  { icon: Bot, title: "Segreteria Virtuale + AI", desc: "La tua assistente sempre disponibile, potenziata dall'intelligenza artificiale. Gestione agenda, email, follow-up automatici.", badge: "NOVITÀ", badgeAccent: true, slug: "segreteria-virtuale" },
];

const additionalServices = [
  "Consulenza Commerciale e Sales Support",
  "Gestione Social Media e Contenuti",
  "Preventivi e Offerte Commerciali",
  "Gestione Fornitori e Ordini",
  "Recupero Crediti (Primo Contatto Bonario)",
  "Supporto HR e Ricerca Personale (screening CV)",
  "Traduzione Documenti",
  "Data Entry e Archiviazione Digitale",
  "Supporto Dichiarazioni e F24 (con il tuo commercialista)",
  "Gestione Reclami e Post-Vendita",
];

export default function ServicesGrid() {
  const { ref, isVisible } = useScrollAnimation();
  const [expanded, setExpanded] = useState(false);

  return (
    <section ref={ref} id="servizi" className="py-20 lg:py-28 bg-card">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.1] mb-4">
            Tutto quello che ti serve,
            <br />
            <span className="text-gradient-primary">senza assumere nessuno.</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Un ecosistema completo di servizi. Attivi solo quelli che ti servono.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((s, i) => (
            <Link key={i} to={`/servizi/${s.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group h-full"
              >
                <div className="relative w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <s.icon size={24} className="text-primary" />
                  <div className="absolute inset-0 rounded-xl border-2 border-primary/20 animate-pulse-ring" />
                </div>
                <h3 className="font-subtitle font-bold text-lg mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{s.desc}</p>
                <span
                  className={`inline-block text-xs font-subtitle font-semibold px-3 py-1 rounded-full ${
                    s.badgeAccent
                      ? "bg-accent/10 text-accent"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {s.badge}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Additional services accordion */}
        <div className="max-w-3xl mx-auto mt-10">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-2 text-primary font-subtitle font-semibold py-3 hover:underline"
          >
            {expanded ? "Chiudi" : "+ Vedi tutti i servizi disponibili"}
            <ChevronDown
              size={18}
              className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            />
          </button>
          {expanded && (
            <div className="grid sm:grid-cols-2 gap-2 mt-4 animate-fade-in">
              {additionalServices.map((s) => (
                <div key={s} className="flex items-center gap-2 text-sm text-muted-foreground p-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
