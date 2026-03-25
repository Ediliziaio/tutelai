import { useParams, Link } from "react-router-dom";
import { getServiceBySlug } from "@/data/servicesData";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";
import GuaranteeSection from "@/components/GuaranteeSection";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import NotFound from "./NotFound";

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const service = getServiceBySlug(slug || "");
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);

  if (!service) return <NotFound />;

  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCtaClick={openModal} />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 lg:px-8 pt-24 pb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/#servizi">Servizi</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{service.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Hero */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Icon size={18} className="text-primary" />
              <span className="text-sm font-subtitle font-semibold text-primary">
                {service.badge}
              </span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-heading-tight leading-[1.1] mb-4">
              {service.headline}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              {service.subheadline}
            </p>
            <Button
              onClick={openModal}
              size="lg"
              className="bg-gradient-cta text-primary-foreground rounded-full px-8 font-subtitle font-bold text-base hover:opacity-90 transition-opacity"
            >
              {service.ctaText} <ArrowRight size={18} />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Il Problema */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-heading-tight mb-3">
              Ti riconosci in <span className="text-destructive">questi problemi?</span>
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {service.problems.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background border border-destructive/20 rounded-2xl p-6"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                    <X size={16} className="text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-subtitle font-bold text-base mb-1">{p.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Come Funziona */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-heading-tight mb-3">
              Come funziona? <span className="text-gradient-primary">Semplicissimo.</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {service.steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="font-display font-extrabold text-xl text-primary">{s.step}</span>
                </div>
                <h3 className="font-subtitle font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vantaggi */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-heading-tight mb-3">
              Perché scegliere <span className="text-gradient-primary">Impresa Leggera?</span>
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.benefits.map((b, i) => {
              const BIcon = b.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-background border border-border rounded-2xl p-6"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <BIcon size={20} className="text-primary" />
                  </div>
                  <h3 className="font-subtitle font-bold text-base mb-1">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Confronto Prima/Dopo */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-heading-tight mb-3">
              Il confronto parla <span className="text-gradient-primary">chiaro.</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border overflow-hidden"
          >
            <div className="grid grid-cols-3 bg-muted font-subtitle font-bold text-sm">
              <div className="p-4"></div>
              <div className="p-4 text-center text-destructive">Fai-da-te / Interno</div>
              <div className="p-4 text-center text-primary">Impresa Leggera</div>
            </div>
            {service.comparison.map((c, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 text-sm ${
                  i % 2 === 0 ? "bg-background" : "bg-muted/50"
                }`}
              >
                <div className="p-4 font-subtitle font-semibold">{c.label}</div>
                <div className="p-4 text-center text-muted-foreground">{c.internal}</div>
                <div className="p-4 text-center font-semibold text-primary">{c.impresaLeggera}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Finale */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-heading-tight mb-4">
              Pronto a liberarti dalla burocrazia?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Consulenza gratuita, attivazione in 24 ore, zero vincoli contrattuali.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={openModal}
                size="lg"
                className="bg-gradient-cta text-primary-foreground rounded-full px-8 font-subtitle font-bold text-base hover:opacity-90"
              >
                {service.ctaText} <ArrowRight size={18} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="rounded-full px-8 font-subtitle font-semibold"
              >
                <Link to="/#servizi">
                  <ArrowLeft size={18} /> Torna ai servizi
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <GuaranteeSection />
      <Footer />
      <LeadFormModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
