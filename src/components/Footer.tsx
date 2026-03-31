import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";

const colServizi = [
  { label: "AI Risk Scan",                href: "/servizi" },
  { label: "AI Compliance Pack",          href: "/servizi" },
  { label: "AI Governance Setup",         href: "/servizi" },
  { label: "AI Shield Base / Pro / Enterprise", href: "/servizi" },
  { label: "TutelAI Platform",            href: "/piattaforma" },
  { label: "Partner Program",             href: "/partner" },
];

const colRisorse = [
  { label: "Blog / Normativa AI",         href: "/blog" },
  { label: "Guida AI Act PMI",            href: "/normativa-ai" },
  { label: "Guida Legge 132/2025",        href: "/normativa-ai" },
  { label: "Newsletter settimanale",      href: "/contatti" },
];

const colAzienda = [
  { label: "Chi Siamo",     href: "/chi-siamo" },
  { label: "Contatti",      href: "/contatti" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Note Legali",   href: "/termini" },
];

export default function Footer() {
  return (
    <footer className="bg-dark-section text-primary-foreground/70 py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Col 1 — Brand */}
          <div>
            <Link to="/" className="inline-block mb-3">
              <span className="font-display font-extrabold text-xl text-primary-foreground">
                Tutel<span className="text-gradient-primary">AI</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              La prima Tech Legal Company italiana per la sicurezza nell'AI.
            </p>
            <p className="text-xs text-primary-foreground/50 mb-4">
              Un brand AEDIX — Florin Andriciuc<br />
              P.IVA: [da completare]
            </p>
            <a
              href="https://linkedin.com/company/tutelai"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              aria-label="TutelAI su LinkedIn"
            >
              <Linkedin size={16} />
            </a>
          </div>

          {/* Col 2 — Servizi */}
          <div>
            <h5 className="font-subtitle font-bold text-sm text-primary-foreground mb-4">Servizi</h5>
            {colServizi.map((s) => (
              <Link
                key={s.label}
                to={s.href}
                className="block text-sm mb-2 hover:text-primary-foreground transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>

          {/* Col 3 — Risorse */}
          <div>
            <h5 className="font-subtitle font-bold text-sm text-primary-foreground mb-4">Risorse</h5>
            {colRisorse.map((s) => (
              <Link
                key={s.label}
                to={s.href}
                className="block text-sm mb-2 hover:text-primary-foreground transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>

          {/* Col 4 — Azienda */}
          <div>
            <h5 className="font-subtitle font-bold text-sm text-primary-foreground mb-4">Azienda</h5>
            {colAzienda.map((s) => (
              <Link
                key={s.label}
                to={s.href}
                className="block text-sm mb-2 hover:text-primary-foreground transition-colors"
              >
                {s.label}
              </Link>
            ))}
            <a
              href="mailto:info@tutelai.it"
              className="block text-sm mb-2 hover:text-primary-foreground transition-colors"
            >
              info@tutelai.it
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 TutelAI — Un brand AEDIX S.r.l.</p>
          <p className="text-primary-foreground/40 text-center max-w-xl">
            TutelAI fornisce servizi di consulenza legale e tecnologica in materia di compliance AI.
            Le informazioni presenti su questo sito hanno carattere informativo e non costituiscono parere legale.
            Per assistenza specifica consulta il nostro team.
          </p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
            <Link to="/termini" className="hover:text-primary-foreground transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
