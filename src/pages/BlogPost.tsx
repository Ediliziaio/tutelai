import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Clock, Calendar, ArrowLeft, ArrowRight, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";
import { blogArticles } from "@/data/blogData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [leadOpen, setLeadOpen] = useState(false);

  const article = blogArticles.find((a) => a.slug === slug);
  if (!article) return <Navigate to="/blog" replace />;

  // Correlati: stessa categoria, poi riempi con i più recenti finché non arrivi a 2.
  const related = [
    ...blogArticles.filter((a) => a.slug !== article.slug && a.category === article.category),
    ...blogArticles.filter((a) => a.slug !== article.slug && a.category !== article.category),
  ].slice(0, 2);

  const coverImage = article.coverImage ?? "/placeholder.svg";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seo.metaDescription,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Organization",
      name: "TutelAI",
    },
    publisher: {
      "@type": "Organization",
      name: "TutelAI",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://tutelai.it/blog/${article.slug}`,
    },
    image: coverImage,
    wordCount: article.content.reduce((acc, s) => {
      const text = "content" in s ? s.content : "items" in s ? s.items.join(" ") : s.text;
      return acc + text.split(/\s+/).filter(Boolean).length;
    }, 0),
    timeRequired: `PT${article.readingTime}M`,
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{article.seo.metaTitle}</title>
        <meta name="description" content={article.seo.metaDescription} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.seo.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={coverImage} />
        <meta property="og:url" content={`https://tutelai.it/blog/${article.slug}`} />
        <meta property="article:published_time" content={article.publishedAt} />
        <meta property="article:tag" content={article.tags.join(", ")} />
        <link rel="canonical" href={`https://tutelai.it/blog/${article.slug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Navbar onCtaClick={() => setLeadOpen(true)} />

      {/* Hero */}
      <section className="relative pt-28 pb-14 bg-gradient-to-br from-primary via-primary/90 to-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-4xl">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="text-primary-foreground/70 hover:text-primary-foreground">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-primary-foreground/50" />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/blog" className="text-primary-foreground/70 hover:text-primary-foreground">Blog</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-primary-foreground/50" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-primary-foreground/90 line-clamp-1 max-w-[200px] sm:max-w-none truncate">{article.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Badge variant="secondary" className="mb-4">{article.category}</Badge>

          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-primary-foreground/70 text-sm">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(article.publishedAt).toLocaleDateString("it-IT", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} /> {article.readingTime} min di lettura
            </span>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl -mt-8 relative z-10">
        <div className="rounded-2xl overflow-hidden shadow-xl">
          <img
            src={coverImage}
            alt={article.title}
            className="w-full aspect-video object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <article className="container mx-auto px-4 lg:px-8 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose-custom"
        >
          {article.content.map((section, i) => {
            switch (section.type) {
              case "h2":
                return <h2 key={i} className="font-display text-2xl md:text-3xl font-bold text-foreground mt-12 mb-4">{section.content}</h2>;
              case "h3":
                return <h3 key={i} className="font-display text-xl md:text-2xl font-bold text-foreground mt-8 mb-3">{section.content}</h3>;
              case "paragraph":
                return <p key={i} className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mb-6">{section.content}</p>;
              case "list":
                return (
                  <div key={i} className="mb-6">
                    <ul className="space-y-2 ml-1">
                      {section.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 font-body text-base text-muted-foreground">
                          <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              case "blockquote":
                return (
                  <blockquote key={i} className="border-l-4 border-primary bg-primary/5 rounded-r-xl px-6 py-5 my-8 italic font-body text-base md:text-lg text-foreground/80">
                    {section.content}
                  </blockquote>
                );
              case "cta":
                return (
                  <div key={i} className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-8 my-10 text-center">
                    <Button asChild className="bg-gradient-cta text-primary-foreground rounded-full px-8 font-subtitle font-semibold hover:opacity-90">
                      <Link to={section.href}>{section.text}</Link>
                    </Button>
                  </div>
                );
              default:
                return null;
            }
          })}
        </motion.div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-border">
          <Tag size={16} className="text-muted-foreground" />
          {article.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
        </div>
      </article>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">Articoli Correlati</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {related.map(r => (
                <Link
                  key={r.slug}
                  to={`/blog/${r.slug}`}
                  className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={r.coverImage ?? "/placeholder.svg"}
                      alt={r.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <Badge variant="secondary" className="text-xs mb-3">{r.category}</Badge>
                    <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                      {r.title}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground line-clamp-2 mb-4">{r.excerpt}</p>
                    <span className="flex items-center gap-1 text-sm font-subtitle font-semibold text-primary group-hover:gap-2 transition-all">
                      Leggi <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            La tua azienda è in regola con l'AI Act?
          </h2>
          <p className="font-body text-muted-foreground mb-8 max-w-xl mx-auto">
            Fai l'AI Risk Scan gratuito: in pochi minuti scopri quali sistemi AI usi, in che classe di rischio ricadono e cosa ti manca per essere a norma.
          </p>
          <Button
            onClick={() => setLeadOpen(true)}
            size="lg"
            className="bg-gradient-cta text-primary-foreground rounded-full px-10 font-subtitle font-semibold hover:opacity-90"
          >
            Inizia Gratis
          </Button>
        </div>
      </section>

      <Link to="/blog" className="fixed bottom-16 sm:bottom-6 left-4 sm:left-6 z-40 bg-card border border-border rounded-full px-4 py-2 shadow-lg flex items-center gap-2 text-sm font-subtitle font-semibold text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={14} /> Blog
      </Link>

      <Footer />
      <LeadFormModal open={leadOpen} onOpenChange={setLeadOpen} />
    </div>
  );
}
