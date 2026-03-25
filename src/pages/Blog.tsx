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

  const filtered = activeCategory === "Tutti"
    ? blogArticles
    : blogArticles.filter(a => a.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Blog & Risorse per PMI | Impresa Leggera</title>
        <meta name="description" content="Guide pratiche, calcoli reali e strategie concrete per liberare la tua impresa dalla burocrazia. Articoli SEO per PMI, professionisti, edilizia e retail." />
        <meta property="og:title" content="Blog & Risorse per PMI | Impresa Leggera" />
        <meta property="og:description" content="Guide pratiche e strategie concrete per liberare la tua impresa dalla burocrazia." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://impresaleggera.it/blog" />
      </Helmet>

      <Navbar onCtaClick={() => setLeadOpen(true)} />

      {/* Hero */}
      <section className="relative pt-28 pb-16 bg-gradient-to-br from-primary via-primary/90 to-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary-foreground mb-4">
            Blog & Risorse
          </h1>
          <p className="font-body text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Guide pratiche, calcoli reali e strategie concrete per liberare la tua impresa dalla burocrazia. Niente teoria: solo contenuti che puoi applicare subito.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <div className="container mx-auto px-4 lg:px-8 -mt-6 relative z-20">
        <div className="flex flex-wrap gap-2 justify-center bg-card rounded-2xl shadow-lg border border-border p-4">
          {blogCategories.map(cat => (
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

      {/* Articles Grid */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((article, i) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link
                to={`/blog/${article.slug}`}
                className="group block bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full"
              >
                {/* Cover Image */}
                <div className="aspect-video overflow-hidden">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col h-[calc(100%-theme(spacing.0))]">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="secondary" className="text-xs font-subtitle">
                      {article.category}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={12} /> {article.readingTime} min
                    </span>
                  </div>

                  <h2 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-3">
                    {article.title}
                  </h2>

                  <p className="font-body text-sm text-muted-foreground mb-6 line-clamp-3 flex-1">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      {new Date(article.date).toLocaleDateString("it-IT", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-subtitle font-semibold text-primary group-hover:gap-2 transition-all">
                      Leggi <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            Nessun articolo in questa categoria. Torna presto!
          </p>
        )}
      </section>

      <Footer />
      <LeadFormModal open={leadOpen} onOpenChange={setLeadOpen} />
    </div>
  );
}
