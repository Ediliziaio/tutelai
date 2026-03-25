import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, FileText, Building, Euro, Phone, Mail, Bot, User, Users, Building2, Factory, HardHat, Calculator, Stethoscope, Scale, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";

const serviceLinks = [
  { icon: FileText, title: "Creazione Fatture", slug: "creazione-fatture" },
  { icon: Building, title: "Pratiche ENEA", slug: "pratiche-enea" },
  { icon: Euro, title: "Finanziamenti", slug: "pratiche-finanziamento" },
  { icon: Phone, title: "Call Center", slug: "call-center" },
  { icon: Mail, title: "Corrispondenza", slug: "gestione-corrispondenza" },
  { icon: Bot, title: "Segreteria Virtuale + AI", slug: "segreteria-virtuale" },
];

const perChiDimensione = [
  { icon: User, title: "Libero Professionista", slug: "libero-professionista" },
  { icon: Users, title: "Micro Impresa (1-5)", slug: "micro-impresa" },
  { icon: Building2, title: "Piccola Impresa (6-20)", slug: "piccola-impresa" },
  { icon: Factory, title: "Media Impresa (21-50+)", slug: "media-impresa" },
];

const perChiSettore = [
  { icon: HardHat, title: "Edilizia & Costruzioni", slug: "edilizia-costruzioni" },
  { icon: Calculator, title: "Commercialisti e Consulenti", slug: "commercialisti-consulenti" },
  { icon: Stethoscope, title: "Medici e Studi Medici", slug: "medici-studi-medici" },
  { icon: Scale, title: "Avvocati e Studi Legali", slug: "avvocati-studi-legali" },
  { icon: ShoppingCart, title: "Commercio e Retail", slug: "commercio-retail" },
];

const navLinks = [
  { label: "Come Funziona", href: "/come-funziona" },
  { label: "Tariffe", href: "/tariffe" },
  { label: "Chi Siamo", href: "/chi-siamo" },
  { label: "Garanzia", href: "/garanzia" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar({ onCtaClick }: { onCtaClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [perChiOpen, setPerChiOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobilePerChiOpen, setMobilePerChiOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const perChiRef = useRef<HTMLDivElement>(null);
  const servicesTimeout = useRef<NodeJS.Timeout>();
  const perChiTimeout = useRef<NodeJS.Timeout>();
  const location = useLocation();

  const hasColoredHero = ["/come-funziona", "/tariffe", "/garanzia", "/faq", "/per-chi", "/blog"].includes(location.pathname)
    || location.pathname.startsWith("/per-chi/")
    || location.pathname.startsWith("/blog/");
  const lightText = hasColoredHero && !scrolled;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileServicesOpen(false);
    setMobilePerChiOpen(false);
  }, [location.pathname]);

  const isPage = (path: string) => location.pathname === path;

  const linkClass = (active: boolean) =>
    `font-subtitle text-sm font-medium transition-colors ${
      active
        ? lightText ? "text-white" : "text-primary"
        : lightText ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-foreground"
    }`;

  const dropdownBtnClass = `flex items-center gap-1 font-subtitle text-sm font-medium transition-colors ${lightText ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-foreground"}`;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-card/85 backdrop-blur-xl shadow-lg border-b border-border" : "bg-transparent"
    }`}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        <Link to="/" className={`font-display font-extrabold text-xl ${lightText ? "text-white" : ""}`}>
          Impresa <span className={lightText ? "text-white/90" : "text-gradient-primary"}>Leggera</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {/* Services Dropdown */}
          <div ref={servicesRef} className="relative"
            onMouseEnter={() => { clearTimeout(servicesTimeout.current); setServicesOpen(true); }}
            onMouseLeave={() => { servicesTimeout.current = setTimeout(() => setServicesOpen(false), 200); }}>
            <button className={dropdownBtnClass}>
              Servizi <ChevronDown size={14} className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`} />
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3">
                <div className="bg-card border border-border rounded-xl shadow-2xl p-4 w-[420px] animate-fade-in">
                  <div className="grid grid-cols-2 gap-1">
                    {serviceLinks.map((s) => (
                      <Link key={s.slug} to={`/servizi/${s.slug}`}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors group"
                        onClick={() => setServicesOpen(false)}>
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <s.icon size={16} className="text-primary" />
                        </div>
                        <span className="font-subtitle text-sm font-medium text-foreground group-hover:text-primary transition-colors">{s.title}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-border mt-2 pt-2">
                    <Link to="/#servizi" className="block text-center text-sm font-subtitle font-semibold text-primary hover:underline py-1"
                      onClick={() => setServicesOpen(false)}>Vedi tutti i servizi →</Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Per Chi Dropdown */}
          <div ref={perChiRef} className="relative"
            onMouseEnter={() => { clearTimeout(perChiTimeout.current); setPerChiOpen(true); }}
            onMouseLeave={() => { perChiTimeout.current = setTimeout(() => setPerChiOpen(false), 200); }}>
            <button className={dropdownBtnClass}>
              Per Chi <ChevronDown size={14} className={`transition-transform duration-200 ${perChiOpen ? "rotate-180" : ""}`} />
            </button>
            {perChiOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3">
                <div className="bg-card border border-border rounded-xl shadow-2xl p-5 w-[560px] animate-fade-in">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Dimensione */}
                    <div>
                      <p className="text-xs font-subtitle font-semibold text-muted-foreground uppercase tracking-wider mb-3">Dimensione</p>
                      <div className="space-y-1">
                        {perChiDimensione.map((t) => (
                          <Link key={t.slug} to={`/per-chi/${t.slug}`}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors group"
                            onClick={() => setPerChiOpen(false)}>
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <t.icon size={16} className="text-primary" />
                            </div>
                            <span className="font-subtitle text-sm font-medium text-foreground group-hover:text-primary transition-colors">{t.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                    {/* Settore */}
                    <div>
                      <p className="text-xs font-subtitle font-semibold text-muted-foreground uppercase tracking-wider mb-3">Settore</p>
                      <div className="space-y-1">
                        {perChiSettore.map((t) => (
                          <Link key={t.slug} to={`/per-chi/${t.slug}`}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors group"
                            onClick={() => setPerChiOpen(false)}>
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <t.icon size={16} className="text-primary" />
                            </div>
                            <span className="font-subtitle text-sm font-medium text-foreground group-hover:text-primary transition-colors">{t.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-border mt-4 pt-3">
                    <Link to="/per-chi" className="block text-center text-sm font-subtitle font-semibold text-primary hover:underline py-1"
                      onClick={() => setPerChiOpen(false)}>Vedi tutte le soluzioni →</Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Other nav links */}
          {navLinks.map((l) => (
            <Link key={l.href} to={l.href} className={linkClass(isPage(l.href))}>{l.label}</Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Button onClick={onCtaClick}
            className="bg-gradient-cta text-primary-foreground rounded-full px-6 font-subtitle font-semibold hover:opacity-90 transition-opacity">
            Inizia Gratis
          </Button>
        </div>

        <button className={`md:hidden p-2 ${lightText ? "text-white" : ""}`}
          onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border px-4 pb-4 animate-fade-in">
          {/* Services accordion */}
          <button onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
            className="w-full flex items-center justify-between py-3 font-subtitle text-sm font-medium text-muted-foreground">
            Servizi
            <ChevronDown size={16} className={`transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`} />
          </button>
          {mobileServicesOpen && (
            <div className="pl-4 pb-2 space-y-1 animate-fade-in">
              {serviceLinks.map((s) => (
                <Link key={s.slug} to={`/servizi/${s.slug}`}
                  className="flex items-center gap-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setMobileOpen(false)}>
                  <s.icon size={14} className="text-primary" /> {s.title}
                </Link>
              ))}
            </div>
          )}

          {/* Per Chi accordion */}
          <button onClick={() => setMobilePerChiOpen(!mobilePerChiOpen)}
            className="w-full flex items-center justify-between py-3 font-subtitle text-sm font-medium text-muted-foreground">
            Per Chi
            <ChevronDown size={16} className={`transition-transform duration-200 ${mobilePerChiOpen ? "rotate-180" : ""}`} />
          </button>
          {mobilePerChiOpen && (
            <div className="pl-4 pb-2 animate-fade-in">
              <p className="text-xs font-subtitle font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-1">Dimensione</p>
              {perChiDimensione.map((t) => (
                <Link key={t.slug} to={`/per-chi/${t.slug}`}
                  className="flex items-center gap-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setMobileOpen(false)}>
                  <t.icon size={14} className="text-primary" /> {t.title}
                </Link>
              ))}
              <p className="text-xs font-subtitle font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-3">Settore</p>
              {perChiSettore.map((t) => (
                <Link key={t.slug} to={`/per-chi/${t.slug}`}
                  className="flex items-center gap-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setMobileOpen(false)}>
                  <t.icon size={14} className="text-primary" /> {t.title}
                </Link>
              ))}
            </div>
          )}

          {/* Other links */}
          {navLinks.map((l) => (
            <Link key={l.href} to={l.href}
              className={`block py-3 font-subtitle text-sm font-medium ${isPage(l.href) ? "text-primary" : "text-muted-foreground"}`}
              onClick={() => setMobileOpen(false)}>
              {l.label}
            </Link>
          ))}

          <Button onClick={() => { onCtaClick(); setMobileOpen(false); }}
            className="w-full mt-2 bg-gradient-cta text-primary-foreground rounded-full font-subtitle font-semibold">
            Inizia Gratis
          </Button>
        </div>
      )}
    </nav>
  );
}
