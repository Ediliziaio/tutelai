import { Linkedin, Instagram, Youtube, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark-section text-primary-foreground/70 py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
             <h4 className="font-display font-extrabold text-lg text-primary-foreground mb-2">
              Impresa <span className="text-gradient-primary">Leggera</span>
            </h4>
            <p className="text-sm italic mb-4">"Il Back-Office che non pesa."</p>
            <div className="flex gap-3">
              {[Linkedin, Instagram, Youtube, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-subtitle font-bold text-sm text-primary-foreground mb-4">Servizi</h5>
            {[
              { label: "Creazione Fatture", href: "/servizi/creazione-fatture" },
              { label: "Pratiche ENEA", href: "/servizi/pratiche-enea" },
              { label: "Pratiche Finanziamento", href: "/servizi/pratiche-finanziamento" },
              { label: "Call Center", href: "/servizi/call-center" },
              { label: "Segreteria Virtuale", href: "/servizi/segreteria-virtuale" },
              { label: "Tutti i Servizi →", href: "/#servizi" },
            ].map((s) => (
              <a key={s.label} href={s.href} className="block text-sm mb-2 hover:text-primary-foreground transition-colors">{s.label}</a>
            ))}
          </div>

          <div>
            <h5 className="font-subtitle font-bold text-sm text-primary-foreground mb-4">Azienda</h5>
            {[
              { label: "Chi Siamo", href: "/chi-siamo" },
              { label: "Garanzia", href: "/garanzia" },
              { label: "Come Funziona", href: "/come-funziona" },
              { label: "Tariffe", href: "/tariffe" },
              { label: "Case Study", href: "#" },
              { label: "Blog / Risorse", href: "/blog" },
              { label: "Lavora con Noi", href: "#" },
              { label: "Diventa Partner", href: "#" },
            ].map((s) => (
              <a key={s.label} href={s.href} className="block text-sm mb-2 hover:text-primary-foreground transition-colors">{s.label}</a>
            ))}
          </div>

          <div>
            <h5 className="font-subtitle font-bold text-sm text-primary-foreground mb-4">Contatti</h5>
            <p className="text-sm mb-2">📧 info@impresaleggera.it</p>
            <p className="text-sm mb-2">📞 +39 XXX XXX XXXX</p>
            <p className="text-sm mb-2">💬 WhatsApp Business</p>
            <p className="text-sm">🕐 Lun-Ven 9:00-18:00</p>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2024 Impresa Leggera S.r.l. | P.IVA XXXXXXXXXX</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Cookie Policy</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Termini di Servizio</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
