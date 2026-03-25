import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCounterAnimation } from "@/hooks/useCounterAnimation";
import { Check, ArrowRight, Zap, TrendingDown, ShieldCheck, Users, BarChart3, CreditCard, Flame, PiggyBank, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GuaranteeSection from "@/components/GuaranteeSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

const services = [
  { id: "fatturazione", label: "Creazione Fatture" },
  { id: "enea", label: "Pratiche ENEA" },
  { id: "callcenter", label: "Call Center Dedicato" },
  { id: "segreteria", label: "Segreteria Virtuale + AI" },
  { id: "finanziamento", label: "Pratiche Finanziamento" },
  { id: "backoffice", label: "Back-office Completo" },
];

const faqs = [
  {
    q: "Come funziona la fatturazione?",
    a: "Fatturiamo a fine mese in base alle pratiche effettivamente gestite. Ricevi un riepilogo dettagliato con ogni pratica elencata. Nessuna sorpresa.",
  },
  {
    q: "Ci sono sconti per volumi elevati?",
    a: "Assolutamente sì. Più pratiche gestisci con noi, più il prezzo unitario scende. Troverai tutti i dettagli nella tua offerta personalizzata.",
  },
  {
    q: "Posso cambiare piano in qualsiasi momento?",
    a: "Sì. Puoi modificare i servizi attivi in qualsiasi momento, senza penali e senza interruzioni del servizio.",
  },
  {
    q: "C'è un costo di attivazione?",
    a: "No. Zero costi di setup, zero costi di attivazione, zero canoni mensili. Paghi solo le pratiche che gestiamo per te.",
  },
  {
    q: "Quali metodi di pagamento accettate?",
    a: "Bonifico bancario, carta di credito e SDD (addebito diretto). Per i clienti con volumi elevati offriamo condizioni di pagamento personalizzate.",
  },
];

export default function Tariffe() {
  const { toast } = useToast();
  const [practiceCount, setPracticeCount] = useState([30]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Calculator state
  const [calcPractices, setCalcPractices] = useState([50]);
  const [calcHours, setCalcHours] = useState([2]);

  const calcResults = useMemo(() => {
    const hoursPerMonth = calcPractices[0] * calcHours[0];
    const costPerMonth = hoursPerMonth * 30;
    const costPerYear = costPerMonth * 12;
    const savingsPerYear = Math.round(costPerYear * 0.6);
    const hoursRecoveredPerYear = hoursPerMonth * 12;
    return { costPerYear, savingsPerYear, hoursRecoveredPerYear };
  }, [calcPractices, calcHours]);

  const hero = useScrollAnimation();
  const form = useScrollAnimation();
  const calc = useScrollAnimation();
  const why = useScrollAnimation();
  const proof = useScrollAnimation();
  const faq = useScrollAnimation();
  const cta = useScrollAnimation();

  const animatedCost = useCounterAnimation(calcResults.costPerYear, calc.isVisible, 1500);
  const animatedSavings = useCounterAnimation(calcResults.savingsPerYear, calc.isVisible, 1500);
  const animatedHours = useCounterAnimation(calcResults.hoursRecoveredPerYear, calc.isVisible, 1500);

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Richiesta inviata! ✅",
        description: "Riceverai la tua offerta personalizzata entro 2 ore lavorative.",
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCtaClick={() => document.getElementById("tariffe-form")?.scrollIntoView({ behavior: "smooth" })} />

      {/* Hero */}
      <section ref={hero.ref} className="pt-28 pb-14 sm:pb-16 lg:pt-36 lg:pb-24 bg-gradient-cta text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={hero.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            {/* Stepper */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-8">
              <span className="inline-flex items-center gap-1.5 text-xs font-subtitle font-semibold px-3 py-1.5 rounded-full bg-primary-foreground/20">
                <span className="w-5 h-5 rounded-full bg-primary-foreground text-foreground flex items-center justify-center text-[10px] font-bold">1</span>
                Definisci le tue esigenze
              </span>
              <ArrowRight size={16} className="text-primary-foreground/50 hidden sm:block" />
              <span className="inline-flex items-center gap-1.5 text-xs font-subtitle font-semibold px-3 py-1.5 rounded-full bg-primary-foreground/10">
                <span className="w-5 h-5 rounded-full bg-primary-foreground/30 flex items-center justify-center text-[10px] font-bold">2</span>
                Scopri la tua offerta
              </span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-heading-tight leading-[1.08] mb-6">
              Un'Offerta Su Misura
              <br />
              per la Tua Azienda
            </h1>
            <p className="text-primary-foreground/80 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
              Rispondi a poche domande e scopri quanto puoi risparmiare.
              Nessun listino generico — solo ciò che serve a te.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Form */}
      <section ref={form.ref} id="tariffe-form" className="py-14 sm:py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={form.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <form onSubmit={handleSubmit} className="p-5 sm:p-8 md:p-10 rounded-2xl border border-border bg-card shadow-lg space-y-8">
              <div className="text-center mb-2">
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-heading-tight mb-2">
                  Raccontaci la tua azienda
                </h2>
                <p className="text-sm text-muted-foreground">
                  Costruiamo insieme la tua offerta perfetta
                </p>
              </div>

              {/* Practices slider */}
              <div>
                <Label className="font-subtitle font-bold text-sm mb-3 block">
                  Quante pratiche gestisci al mese? <span className="text-primary">{practiceCount[0]}</span>
                </Label>
                <Slider
                  value={practiceCount}
                  onValueChange={setPracticeCount}
                  min={5}
                  max={200}
                  step={5}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>5</span>
                  <span>200+</span>
                </div>
              </div>

              {/* Settore */}
              <div>
                <Label className="font-subtitle font-bold text-sm mb-2 block">Settore</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona il tuo settore" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="edilizia">Edilizia</SelectItem>
                    <SelectItem value="artigianato">Artigianato</SelectItem>
                    <SelectItem value="pmi">PMI</SelectItem>
                    <SelectItem value="professionista">Professionista</SelectItem>
                    <SelectItem value="altro">Altro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Services multi-checkbox */}
              <div>
                <Label className="font-subtitle font-bold text-sm mb-3 block">Di cosa hai bisogno?</Label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {services.map((s) => (
                    <label
                      key={s.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        selectedServices.includes(s.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <Checkbox
                        checked={selectedServices.includes(s.id)}
                        onCheckedChange={() => toggleService(s.id)}
                      />
                      <span className="text-sm">{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Separator */}
              <div className="border-t border-border" />

              {/* Contact info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="t-name" className="text-sm mb-1.5 block">Nome e Cognome *</Label>
                  <Input id="t-name" required placeholder="Mario Rossi" />
                </div>
                <div>
                  <Label htmlFor="t-company" className="text-sm mb-1.5 block">Nome Azienda</Label>
                  <Input id="t-company" placeholder="La tua azienda" />
                </div>
                <div>
                  <Label htmlFor="t-email" className="text-sm mb-1.5 block">Email *</Label>
                  <Input id="t-email" type="email" required placeholder="mario@email.it" />
                </div>
                <div>
                  <Label htmlFor="t-phone" className="text-sm mb-1.5 block">Telefono *</Label>
                  <Input id="t-phone" type="tel" required placeholder="+39 333 1234567" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full bg-gradient-cta text-primary-foreground font-subtitle font-bold text-sm sm:text-base hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                {loading ? "Invio in corso..." : (
                  <>Scopri la tua offerta <ArrowRight size={18} /></>
                )}
              </button>

              <p className="text-xs text-muted-foreground text-center">
                Riceverai la tua offerta personalizzata entro 2 ore lavorative
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section ref={calc.ref} className="py-14 sm:py-20 lg:py-28 bg-dark-section text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={calc.isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.1] mb-4 text-center">
              Quanto Ti Costa il Tuo
              <br />
              <span className="text-destructive">Back-Office Oggi?</span>
            </h2>
            <p className="text-primary-foreground/70 text-lg text-center mb-12 max-w-2xl mx-auto">
              Muovi gli slider. Guarda i numeri. Poi chiediti: posso permettermi di continuare così?
            </p>

            {/* Sliders */}
            <div className="grid sm:grid-cols-2 gap-8 mb-12">
              <div className="space-y-3">
                <label className="font-subtitle font-bold text-sm block">
                  Pratiche al mese: <span className="text-accent">{calcPractices[0]}</span>
                </label>
                <Slider value={calcPractices} onValueChange={setCalcPractices} min={5} max={200} step={5} />
                <div className="flex justify-between text-xs text-primary-foreground/50">
                  <span>5</span><span>200</span>
                </div>
              </div>
              <div className="space-y-3">
                <label className="font-subtitle font-bold text-sm block">
                  Ore per pratica: <span className="text-accent">{calcHours[0]}</span>
                </label>
                <Slider value={calcHours} onValueChange={setCalcHours} min={0.5} max={4} step={0.5} />
                <div className="flex justify-between text-xs text-primary-foreground/50">
                  <span>0.5h</span><span>4h</span>
                </div>
              </div>
            </div>

            {/* Results Cards */}
            <div className="grid sm:grid-cols-3 gap-4 mb-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={calc.isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl border border-destructive/30 bg-destructive/10 text-center"
              >
                <Flame size={28} className="text-destructive mx-auto mb-3" />
                <p className="text-xs font-subtitle font-semibold text-destructive uppercase tracking-wider mb-1">Stai Bruciando</p>
                <p className="font-display font-extrabold text-3xl sm:text-4xl text-destructive">
                  €{animatedCost.toLocaleString("it-IT")}
                </p>
                <p className="text-xs text-primary-foreground/50 mt-1">all'anno</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={calc.isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.35 }}
                className="p-6 rounded-2xl border border-secondary/30 bg-secondary/10 text-center"
              >
                <PiggyBank size={28} className="text-secondary mx-auto mb-3" />
                <p className="text-xs font-subtitle font-semibold text-secondary uppercase tracking-wider mb-1">Potresti Risparmiare</p>
                <p className="font-display font-extrabold text-3xl sm:text-4xl text-secondary">
                  €{animatedSavings.toLocaleString("it-IT")}
                </p>
                <p className="text-xs text-primary-foreground/50 mt-1">all'anno</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={calc.isVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5 }}
                className="p-6 rounded-2xl border border-primary/30 bg-primary/10 text-center"
              >
                <Clock size={28} className="text-primary mx-auto mb-3" />
                <p className="text-xs font-subtitle font-semibold text-primary uppercase tracking-wider mb-1">Ore Recuperate</p>
                <p className="font-display font-extrabold text-3xl sm:text-4xl text-primary">
                  {animatedHours.toLocaleString("it-IT")}
                </p>
                <p className="text-xs text-primary-foreground/50 mt-1">ore/anno</p>
              </motion.div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <button
                onClick={() => document.getElementById("tariffe-form")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-gradient-cta text-primary-foreground font-subtitle font-bold hover:opacity-90 transition-opacity"
              >
                Scopri la Tua Offerta Esatta <ArrowRight size={18} />
              </button>
              <p className="text-xs text-primary-foreground/40 mt-3">
                Basato su un costo medio del lavoro di €30/ora
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why no fixed pricing */}
      <section ref={why.ref} className="py-14 sm:py-20 lg:py-28 bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={why.isVisible ? { opacity: 1, y: 0 } : {}}
            className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight leading-[1.1] mb-14 text-center"
          >
            Perché un'offerta <span className="text-gradient-primary">su misura?</span>
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Zap,
                title: "Paghi Solo Ciò che Usi",
                desc: "Nessun canone mensile, nessun minimo. Paghi esclusivamente le pratiche che gestiamo per te.",
              },
              {
                icon: TrendingDown,
                title: "Prezzi che Calano col Volume",
                desc: "Più pratiche affidi a noi, più il costo unitario scende. Sconti progressivi automatici.",
              },
              {
                icon: ShieldCheck,
                title: "Zero Costi Nascosti",
                desc: "Nessun setup, nessun vincolo contrattuale, nessuna sorpresa in fattura. Mai.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={why.isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.12 }}
                className="p-6 rounded-2xl border border-border bg-background text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-display font-extrabold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section ref={proof.ref} className="py-12 bg-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={proof.isVisible ? { opacity: 1 } : {}}
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-8 md:gap-16"
          >
            {[
              { icon: Users, value: "200+", label: "Aziende Servite" },
              { icon: BarChart3, value: "60%", label: "Risparmio Medio" },
              { icon: CreditCard, value: "€0", label: "Costi di Attivazione" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 text-primary-foreground">
                <stat.icon size={20} className="text-primary-foreground/70" />
                <div>
                  <span className="font-display font-extrabold text-2xl">{stat.value}</span>
                  <span className="text-sm text-primary-foreground/70 ml-2">{stat.label}</span>
                </div>
              </div>
            ))}
          </motion.div>
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
            Domande <span className="text-gradient-primary">Frequenti</span>
          </motion.h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-4 sm:px-6 overflow-hidden bg-card">
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

      {/* Final CTA */}
      <section ref={cta.ref} className="py-14 sm:py-20 lg:py-28 bg-gradient-cta text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={cta.isVisible ? { opacity: 1, y: 0 } : {}}
          >
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.1] mb-6">
              Ogni azienda è diversa.
              <br />
              Parliamo dei tuoi numeri.
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Nessun listino generico. Solo un'offerta costruita sulle tue reali esigenze.
            </p>
            <button
              onClick={() => document.getElementById("tariffe-form")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-primary-foreground text-foreground font-subtitle font-bold hover:opacity-90 transition-opacity"
            >
              Richiedi la Tua Offerta <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </section>

      <GuaranteeSection />
      <Footer />
    </div>
  );
}