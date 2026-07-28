import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Rivelazione allo scroll, senza il difetto di `whileInView`.
 *
 * Il problema di prima: framer-motion con `initial={{opacity:0}}` +
 * `viewport={{once:true}}` aspetta un ingresso nel viewport che, per gli
 * elementi già scorsi (link con ancora, ripristino dello scroll, back del
 * browser), non avviene mai. Risultato misurato: 44 elementi bloccati a
 * opacity 0 e i contatori fermi a "0+".
 *
 * Qui l'elemento parte nascosto solo se si trova davvero più in basso del
 * viewport. Se è già sopra o già visibile al mount, si mostra subito: la
 * rivelazione è un ornamento, non una condizione per leggere la pagina.
 */

type Direzione = "su" | "giu" | "sinistra" | "destra" | "nessuna";

const OFFSET: Record<Direzione, string> = {
  su: "translate3d(0, 22px, 0)",
  giu: "translate3d(0, -22px, 0)",
  sinistra: "translate3d(24px, 0, 0)",
  destra: "translate3d(-24px, 0, 0)",
  nessuna: "none",
};

export default function Reveal({
  children,
  delay = 0,
  direzione = "su",
  className,
  style,
  id,
}: {
  children: ReactNode;
  /** Ritardo in secondi, per gli ingressi a cascata. */
  delay?: number;
  direzione?: Direzione;
  className?: string;
  /** Stile del chiamante: viene unito, l'animazione ha la precedenza. */
  style?: CSSProperties;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visibile, setVisibile] = useState(false);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const riduci = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rect = el.getBoundingClientRect();
    // Già visibile o già superato: niente animazione, si mostra e basta.
    const giaPassato = rect.top < window.innerHeight;

    if (riduci || giaPassato) {
      setVisibile(true);
      setPronto(true);
      return;
    }

    setPronto(true);
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibile(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    obs.observe(el);

    // Rete di sicurezza: se per qualunque motivo l'osservatore non scatta,
    // dopo 1,2s il contenuto compare comunque. Meglio senza effetto che invisibile.
    const t = window.setTimeout(() => setVisibile(true), 1200);

    return () => {
      obs.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      className={className}
      style={{
        ...style,
        // Finché non si è misurato, l'elemento resta visibile: mai un flash
        // di contenuto mancante se il JS è lento.
        opacity: pronto && !visibile ? 0 : 1,
        transform: pronto && !visibile ? OFFSET[direzione] : "none",
        transition: `opacity 620ms cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 620ms cubic-bezier(0.22,1,0.36,1) ${delay}s`,
        willChange: visibile ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
