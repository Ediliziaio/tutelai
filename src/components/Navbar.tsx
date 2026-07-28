import { useState, useEffect, useRef } from "react";
import {
  Menu, X, ChevronDown,
  Shield, FileText, Building2, Zap, LayoutDashboard,
} from "lucide-react";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";

const serviceLinks = [
  { icon: Shield,    title: "AI Risk Scan",        desc: "Mappatura e classificazione · 5 giorni",  href: "/servizi" },
  { icon: FileText,  title: "AI Compliance Pack",  desc: "Documentazione adottabile · 15 giorni",   href: "/servizi" },
  { icon: Building2, title: "AI Governance Setup", desc: "Struttura di governance · 30 giorni",     href: "/servizi" },
  { icon: Zap,       title: "Retainer AI Shield",  desc: "Presidio continuativo",                   href: "/servizi" },
];

const navLinks = [
  { label: "Chi Siamo",    href: "/chi-siamo" },
  { label: "Normativa AI", href: "/normativa-ai" },
  { label: "Partner",      href: "/partner" },
  { label: "Blog",         href: "/blog" },
];

export default function Navbar({ onCtaClick }: { onCtaClick: () => void }) {
  const [scrolled, setScrolled]             = useState(false);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [servicesOpen, setServicesOpen]     = useState(false);
  const [mobileServOpen, setMobileServOpen] = useState(false);
  const servicesTimeout = useRef<NodeJS.Timeout>();
  const location = useLocation();

  // Pages with a DARK hero — navbar links need to be white when not scrolled
  const hasDarkHero = [
    "/", "/chi-siamo", "/partner", "/servizi", "/piattaforma",
  ].includes(location.pathname);
  const lightText = hasDarkHero && !scrolled;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileServOpen(false);
  }, [location.pathname]);

  const isPage = (path: string) => location.pathname === path;

  const linkClass = (active: boolean) =>
    `font-subtitle text-sm font-medium transition-colors ${
      active
        ? lightText ? "text-white" : "text-primary"
        : lightText
        ? "text-white/80 hover:text-white"
        : "text-muted-foreground hover:text-foreground"
    }`;

  const dropBtnClass = `flex items-center gap-1 font-subtitle text-sm font-medium transition-colors ${
    lightText ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-foreground"
  }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/85 backdrop-blur-xl shadow-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">

        {/* Logo */}
        <Link to="/" className={`font-display font-extrabold text-xl ${lightText ? "text-white" : "text-[#1a375b]"}`}>
          Tutel<span className="text-[#eab913]">AI</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">

          {/* Servizi dropdown */}
          <div
            className="relative"
            onMouseEnter={() => { clearTimeout(servicesTimeout.current); setServicesOpen(true); }}
            onMouseLeave={() => { servicesTimeout.current = setTimeout(() => setServicesOpen(false), 180); }}
          >
            <button className={dropBtnClass}>
              Servizi{" "}
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
              />
            </button>

            {servicesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3">
                <div className="bg-card border border-border rounded-xl shadow-2xl p-4 w-[360px] animate-fade-in">
                  <div className="space-y-1">
                    {serviceLinks.map((s) => (
                      <Link
                        key={s.title}
                        to={s.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors group"
                        onClick={() => setServicesOpen(false)}
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <s.icon size={17} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-subtitle text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-none mb-0.5">
                            {s.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{s.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-border mt-3 pt-3">
                    <Link
                      to="/piattaforma"
                      className="flex items-center gap-1.5 text-xs font-subtitle font-semibold text-primary hover:underline"
                      onClick={() => setServicesOpen(false)}
                    >
                      <LayoutDashboard size={12} /> TutelAI Platform (SaaS) →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Piattaforma */}
          <Link to="/piattaforma" className={linkClass(isPage("/piattaforma"))}>
            Piattaforma
          </Link>

          {/* Other links */}
          {navLinks.map((l) => (
            <Link key={l.href} to={l.href} className={linkClass(isPage(l.href))}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/contatti"
            className={`font-subtitle text-sm font-medium transition-colors ${
              lightText ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Contatti
          </Link>
          <Button
            onClick={onCtaClick}
            className="bg-gradient-cta text-primary-foreground rounded-full px-6 font-subtitle font-semibold hover:opacity-90 transition-opacity"
          >
            AI Risk Scan gratuito
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`md:hidden p-2 ${lightText ? "text-white" : ""}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border px-4 pb-4 animate-fade-in">

          {/* Servizi accordion */}
          <button
            onClick={() => setMobileServOpen(!mobileServOpen)}
            className="w-full flex items-center justify-between py-3 font-subtitle text-sm font-medium text-muted-foreground"
          >
            Servizi
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${mobileServOpen ? "rotate-180" : ""}`}
            />
          </button>
          {mobileServOpen && (
            <div className="pl-4 pb-2 space-y-2 animate-fade-in">
              {serviceLinks.map((s) => (
                <Link
                  key={s.title}
                  to={s.href}
                  className="flex items-center gap-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  <s.icon size={14} className="text-primary" />
                  {s.title}
                  <span className="ml-auto text-xs text-muted-foreground/60">{s.desc}</span>
                </Link>
              ))}
              <Link
                to="/piattaforma"
                className="flex items-center gap-2 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                <LayoutDashboard size={14} className="text-primary" />
                TutelAI Platform (SaaS)
              </Link>
            </div>
          )}

          <Link
            to="/piattaforma"
            className={`block py-3 font-subtitle text-sm font-medium ${isPage("/piattaforma") ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => setMobileOpen(false)}
          >
            Piattaforma
          </Link>

          {navLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className={`block py-3 font-subtitle text-sm font-medium ${isPage(l.href) ? "text-primary" : "text-muted-foreground"}`}
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          ))}

          <Link
            to="/contatti"
            className="block py-3 font-subtitle text-sm font-medium text-muted-foreground"
            onClick={() => setMobileOpen(false)}
          >
            Contatti
          </Link>

          <Button
            onClick={() => { onCtaClick(); setMobileOpen(false); }}
            className="w-full mt-2 bg-gradient-cta text-primary-foreground rounded-full font-subtitle font-semibold"
          >
            AI Risk Scan gratuito
          </Button>
        </div>
      )}
    </nav>
  );
}
