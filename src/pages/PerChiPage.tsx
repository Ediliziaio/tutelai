import { useParams, Link } from "react-router-dom";
import { getTargetBySlug, getEdiliziaSubsectors } from "@/data/targetData";
import { getServiceBySlug } from "@/data/servicesData";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, AlertTriangle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";
import GuaranteeSection from "@/components/GuaranteeSection";
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import NotFound from "./NotFound";

function CaseStudySection({ caseStudy }: { caseStudy: NonNullable<ReturnType<typeof getTargetBySlug>>["caseStudy"] }) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section ref={ref} className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight mb-4">
            Caso Concreto: <span className="text-gradient-primary">{caseStudy.name}</span>
          </h2>
          <p className="text-muted-foreground font-subtitle text-lg">{caseStudy.role} — {caseStudy.location}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={isVisible ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 }}
            className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="text-destructive" size={20} />
              <h3 className="font-subtitle font-bold text-lg text-destructive">PRIMA</h3>
            </div>
            <div className="space-y-4">
              {caseStudy.before.map((item, i) => (
                <div key={i} className="flex justify-between items-center border-b border-destructive/10 pb-2">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="font-display font-bold text-destructive">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={isVisible ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 }}
            className="bg-secondary/5 border border-secondary/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-secondary" size={20} />
              <h3 className="font-subtitle font-bold text-lg text-secondary">DOPO (con Impresa Leggera)</h3>
            </div>
            <div className="space-y-4">
              {caseStudy.after.map((item, i) => (
                <div key={i} className="flex justify-between items-center border-b border-secondary/10 pb-2">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="font-display font-bold text-secondary">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto mt-10 text-center">
          <blockquote className="text-lg italic text-foreground font-subtitle">
            "{caseStudy.quote}"
          </blockquote>
          <p className="text-sm text-muted-foreground mt-2">— {caseStudy.name}, {caseStudy.role}, {caseStudy.location}</p>
        </motion.div>
      </div>
    </section>
  );
}

export default function PerChiPage() {
  const { slug } = useParams<{ slug: string }>();
  const target = getTargetBySlug(slug || "");
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);

  if (!target) return <NotFound />;

  const Icon = target.icon;
  const relatedServices = target.services.map(s => getServiceBySlug(s)).filter(Boolean);
  const isEdiliziaHub = target.slug === "edilizia-costruzioni";
  const ediliziaSubsectors = isEdiliziaHub ? getEdiliziaSubsectors() : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onCtaClick={openModal} />
      <LeadFormModal open={modalOpen} onOpenChange={setModalOpen} />

      {/* Hero */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-cta text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <Link to="/per-chi" className="inline-flex items-center gap-1 text-primary-foreground/70 hover:text-primary-foreground text-sm font-subtitle mb-6">
            <ArrowLeft size={14} /> Tutte le soluzioni
          </Link>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary-foreground/15 flex items-center justify-center">
              <Icon size={28} />
            </div>
            <span className="text-sm font-subtitle font-semibold uppercase tracking-wider text-primary-foreground/70">
              {target.category === "dimensione" ? "Per dimensione" : target.category === "settore-edilizia" ? "Edilizia & Costruzioni" : "Per settore"}
            </span>
          </div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.1] mb-6 max-w-3xl">
            {target.headline}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-lg lg:text-xl text-primary-foreground/85 max-w-2xl font-subtitle leading-relaxed mb-8">
            {target.subheadline}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Button onClick={openModal} size="lg"
              className="bg-primary-foreground text-foreground rounded-full px-8 font-subtitle font-bold text-base hover:bg-primary-foreground/90">
              {target.cta}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Edilizia sub-sectors hub */}
      {isEdiliziaHub && ediliziaSubsectors.length > 0 && (
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight mb-4">
                Soluzioni per <span className="text-gradient-primary">Ogni Specializzazione</span>
              </h2>
              <p className="text-muted-foreground font-subtitle text-lg max-w-xl mx-auto">
                Ogni settore dell'edilizia ha problemi specifici. Trova il tuo.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {ediliziaSubsectors.map((sub, i) => {
                const SubIcon = sub.icon;
                return (
                  <motion.div key={sub.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <Link to={`/per-chi/${sub.slug}`}
                      className="block bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all group h-full">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <SubIcon size={22} className="text-primary" />
                      </div>
                      <h3 className="font-subtitle font-bold text-base mb-2 group-hover:text-primary transition-colors">{sub.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{sub.subheadline.slice(0, 80)}...</p>
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
      )}

      {/* Problems */}
      <section className={`py-20 lg:py-28 ${isEdiliziaHub ? "bg-muted/30" : ""}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight mb-4">
              Il Problema Che <span className="text-gradient-primary">Nessuno Ti Dice</span>
            </h2>
            <p className="text-muted-foreground font-subtitle text-lg max-w-xl mx-auto">
              Questi sono i costi nascosti che stanno erodendo i tuoi margini. Ogni giorno.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {target.problems.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle size={16} className="text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-subtitle font-bold text-base mb-2">{p.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study */}
      <CaseStudySection caseStudy={target.caseStudy} />

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight mb-4">
                Servizi <span className="text-gradient-primary">Pensati per Te</span>
              </h2>
              <p className="text-muted-foreground font-subtitle text-lg max-w-xl mx-auto">
                Ecco cosa possiamo fare per la tua attività. Subito.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {relatedServices.map((s) => {
                if (!s) return null;
                const SIcon = s.icon;
                return (
                  <Link key={s.slug} to={`/servizi/${s.slug}`}
                    className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <SIcon size={22} className="text-primary" />
                    </div>
                    <h3 className="font-subtitle font-bold text-base mb-1 group-hover:text-primary transition-colors">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.subheadline.slice(0, 80)}...</p>
                    <div className="flex items-center gap-1 mt-3 text-sm font-subtitle font-semibold text-primary">
                      Scopri di più <ArrowRight size={14} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-20 lg:py-28 bg-gradient-cta text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-display font-extrabold text-3xl sm:text-4xl tracking-heading-tight mb-6">
            Ogni Giorno Che Aspetti, Perdi Soldi.
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-lg text-primary-foreground/85 font-subtitle max-w-xl mx-auto mb-8">
            Zero vincoli. Zero rischi. Paghi solo quello che usi. Se non funziona, ti rimborsiamo.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <Button onClick={openModal} size="lg"
              className="bg-primary-foreground text-foreground rounded-full px-10 font-subtitle font-bold text-base hover:bg-primary-foreground/90">
              {target.cta}
            </Button>
          </motion.div>
        </div>
      </section>

      <GuaranteeSection />
      <Footer />
    </div>
  );
}
