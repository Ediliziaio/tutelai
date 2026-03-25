import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getTargetsByCategory, getEdiliziaSubsectors } from "@/data/targetData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";
import GuaranteeSection from "@/components/GuaranteeSection";
import { useState } from "react";

export default function PerChi() {
  const [modalOpen, setModalOpen] = useState(false);
  const dimensione = getTargetsByCategory("dimensione");
  const settore = getTargetsByCategory("settore");
  const ediliziaSubsectors = getEdiliziaSubsectors();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onCtaClick={() => setModalOpen(true)} />
      <LeadFormModal open={modalOpen} onOpenChange={setModalOpen} />

      {/* Hero */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-cta text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.1] mb-6">
            Non Importa Quanto Sei Grande.<br />
            <span className="text-primary-foreground/90">Importa Quanto Stai Perdendo.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-lg lg:text-xl text-primary-foreground/85 max-w-2xl mx-auto font-subtitle leading-relaxed">
            Trova la soluzione perfetta per la tua dimensione e il tuo settore. Ogni pagina ha numeri reali, casi concreti e zero fuffa.
          </motion.p>
        </div>
      </section>

      {/* By Size */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-heading-tight mb-10 text-center">
            Per <span className="text-gradient-primary">Dimensione Aziendale</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {dimensione.map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div key={t.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Link to={`/per-chi/${t.slug}`}
                    className="block bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all group h-full">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon size={22} className="text-primary" />
                    </div>
                    <h3 className="font-subtitle font-bold text-base mb-2 group-hover:text-primary transition-colors">{t.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{t.subheadline.slice(0, 80)}...</p>
                    <div className="flex items-center gap-1 text-sm font-subtitle font-semibold text-primary">
                      Scopri <ArrowRight size={14} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* By Sector */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-heading-tight mb-10 text-center">
            Per <span className="text-gradient-primary">Settore</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {settore.map((t, i) => {
              const Icon = t.icon;
              const isEdilizia = t.slug === "edilizia-costruzioni";
              return (
                <motion.div key={t.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className={isEdilizia ? "sm:col-span-2 lg:col-span-3" : ""}>
                  <Link to={`/per-chi/${t.slug}`}
                    className="block bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon size={22} className="text-primary" />
                    </div>
                    <h3 className="font-subtitle font-bold text-base mb-2 group-hover:text-primary transition-colors">{t.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{t.subheadline.slice(0, 120)}...</p>
                    <div className="flex items-center gap-1 text-sm font-subtitle font-semibold text-primary">
                      Scopri <ArrowRight size={14} />
                    </div>
                  </Link>
                  {/* Edilizia sub-sectors */}
                  {isEdilizia && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pl-4 border-l-2 border-primary/20">
                      {ediliziaSubsectors.map((sub) => {
                        const SubIcon = sub.icon;
                        return (
                          <Link key={sub.slug} to={`/per-chi/${sub.slug}`}
                            className="block bg-card border border-border rounded-xl p-4 hover:shadow-md hover:border-primary/20 transition-all group">
                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                              <SubIcon size={18} className="text-primary" />
                            </div>
                            <h4 className="font-subtitle font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{sub.title}</h4>
                            <div className="flex items-center gap-1 text-xs font-subtitle font-semibold text-primary">
                              Dettagli <ArrowRight size={12} />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <GuaranteeSection />
      <Footer />
    </div>
  );
}
