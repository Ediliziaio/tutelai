import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";
import { blogArticles, blogCategories } from "@/data/blogData";
import { Badge } from "@/components/ui/badge";

export default function Blog() {
  const [leadOpen, setLeadOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Tutti");

  const filtered =
    activeCategory === "Tutti"
      ? blogArticles
      : blogArticles.filter((a) => a.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Blog & Risorse | TutelAI — AI Compliance per PMI italiane</title>
        <meta
          name="description"
          content="Tutto quello che devi sapere sull'AI compliance — in italiano, senza gergo. AI Act, Legge 132/2025, DPO, sanzioni. Articoli pratici per imprenditori italiani."
        />
        <meta property="og:title" content="Blog TutelAI — AI Compliance per PMI italiane" />
        <meta
          property="og:description"
          content="Analisi settimanale delle novità normative che impattano le PMI italiane. Senza paroloni, con esempi concreti."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://tutelai.it/blog" />
      </Helmet>

      <Navbar onCtaClick={() => setLeadOpen(true)} />

      {/* Hero */}
      <section className="relative pt-28 pb-16 bg-gradient-to-br from-primary via-primary/90 to-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary-foreground mb-4">
            Risorse — Blog TutelAI
          </h1>
          <p className="font-body text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-6">
            Tutto quello che devi sapere sull'AI compliance — in italiano, senza gergo.
            Ogni settimana analizziamo le novità normative che impattano le PMI italiane.
            Senza paroloni. Con esempi concreti.
          </p>
          <button
            onClick={() => setLeadOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary-foreground text-foreground font-subtitle font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Iscriviti alla newsletter — Novità AI compliance ogni lunedì
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* Category filter */}
      <div className="container mx-auto px-4 lg:px-8 -mt-6 relative z-20">
        <div className="flex flex-wrap gap-2 justify-center bg-card rounded-2xl shadow-lg border border-border p-4">
          {blogCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-subtitle font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articoli */}
      <section className="py-14 sm:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">
              Nessun articolo in questa categoria. Presto in arrivo.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filtered.map((article, i) => (
                <motion.article
                  key={article.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    to={`/blog/${article.slug}`}
                    className="group flex flex-col h-full p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className="text-xs font-subtitle">
                        {article.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={12} />
                        {article.readingTime} min
                      </span>
                    </div>
                    <h2 className="font-display font-extrabold text-lg leading-snug mb-3 group-hover:text-primary transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(article.publishedAt).toLocaleDateString("it-IT", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-xs font-subtitle font-semibold text-primary flex items-center gap-1">
                        Leggi <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-14 sm:py-20 bg-card border-t border-border">
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-2xl">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-heading-tight mb-4">
            Non perdere le prossime novità normative.
          </h2>
          <p className="text-muted-foreground mb-8">
            Ogni lunedì, un aggiornamento sulle novità AI compliance che impattano le PMI italiane.
            Breve, pratico, senza gergo legale.
          </p>
          <button
            onClick={() => setLeadOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-cta text-primary-foreground font-subtitle font-bold hover:opacity-90 transition-opacity"
          >
            Iscriviti gratis <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <Footer />
      <LeadFormModal open={leadOpen} onOpenChange={setLeadOpen} />
    </div>
  );
}
