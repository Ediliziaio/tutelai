import { ArrowRight, BookOpen, Quote } from "lucide-react";
import Reveal from "@/components/Reveal";

/**
 * Sezione "l'avvocato e il libro".
 *
 * ────────────────────────────────────────────────────────────────────────────
 * DA COMPILARE CON I MATERIALI REALI — qui sotto non c'è nulla di inventato.
 * Sostituire i valori segnati con [ ] e mettere i file in /public:
 *   - /public/avvocato.jpg     ritratto, verticale, min 900×1200
 *   - /public/libro.jpg        copertina, verticale, min 800×1200
 * Finché i file non ci sono, restano i segnaposto tipografici qui sotto:
 * non si pubblicano immagini finte né nomi non verificati.
 * ────────────────────────────────────────────────────────────────────────────
 */
const AUTORE = {
  nome: "[Nome Cognome]",
  titolo: "Avvocato",
  albo: "[Ordine degli Avvocati di ___]",
  foto: "" as string, // es. "/avvocato.jpg"
  bio: [
    "Segue la disciplina dell'intelligenza artificiale dalla proposta di regolamento della Commissione del 2021, quando l'AI Act era ancora un testo in discussione.",
    "Assiste imprese e professionisti nella qualificazione dei sistemi, nella redazione della documentazione richiesta e nei rapporti con le autorità di vigilanza.",
  ],
};

const LIBRO = {
  titolo: "[Titolo del libro]",
  sottotitolo: "[Sottotitolo o editore]",
  anno: "[anno]",
  copertina: "" as string, // es. "/libro.jpg"
  estratto:
    "[Estratto dal libro — una frase che valga da sola. Va scelta dall'autore.]",
  link: "", // pagina editore o acquisto
};

/** Segnaposto tipografico: nessuna immagine inventata, ma non un buco. */
function Segnaposto({ righe, nota }: { righe: string[]; nota: string }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-8 text-center">
      {righe.map((r) => (
        <span key={r} className="font-display text-2xl font-extrabold text-white/25">
          {r}
        </span>
      ))}
      <span className="mt-2 font-mono-accent text-[10px] uppercase tracking-[0.18em] text-white/25">
        {nota}
      </span>
    </div>
  );
}

export default function AutoreSection({ onCtaClick }: { onCtaClick?: () => void }) {
  return (
    <section className="bg-dark-gradient text-primary-foreground py-20 sm:py-28 lg:py-36">
      <div className="container mx-auto max-w-6xl px-4 lg:px-8">
        <Reveal className="mb-14 max-w-2xl">
          <span className="mb-5 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-2 font-mono-accent text-xs font-bold uppercase tracking-widest text-accent">
            Chi firma i pareri
          </span>
          <h2 className="font-display text-3xl font-extrabold leading-[1.08] tracking-heading-tight sm:text-4xl lg:text-5xl">
            Dietro ogni documento c'è{" "}
            <span className="text-gradient-primary">un avvocato che risponde.</span>
          </h2>
        </Reveal>

        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Ritratto + copertina sovrapposta */}
          <Reveal className="lg:col-span-5" direzione="destra">
            <div className="relative">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl">
                {AUTORE.foto ? (
                  <img
                    src={AUTORE.foto}
                    alt={`${AUTORE.titolo} ${AUTORE.nome}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <Segnaposto righe={["Ritratto", "dell'avvocato"]} nota="/public/avvocato.jpg" />
                )}
              </div>

              {/* Copertina del libro, sfalsata sul ritratto */}
              <div className="absolute -bottom-8 -right-4 w-32 sm:w-40 lg:-right-10 lg:w-44">
                <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-2xl ring-1 ring-white/15">
                  {LIBRO.copertina ? (
                    <img
                      src={LIBRO.copertina}
                      alt={LIBRO.titolo}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#12233a] p-3 text-center">
                      <BookOpen size={20} className="text-accent/70" />
                      <span className="font-mono-accent text-[9px] uppercase leading-tight tracking-wider text-white/35">
                        copertina
                        <br />
                        /public/libro.jpg
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Testo */}
          <Reveal className="lg:col-span-7" delay={0.1}>
            <p className="font-display text-2xl font-extrabold tracking-heading-tight sm:text-3xl">
              {AUTORE.nome}
            </p>
            <p className="mt-1 font-mono-accent text-xs uppercase tracking-[0.16em] text-accent">
              {AUTORE.titolo} · {AUTORE.albo}
            </p>

            <div className="mt-6 space-y-4">
              {AUTORE.bio.map((b) => (
                <p key={b} className="font-subtitle text-base leading-relaxed text-primary-foreground/70">
                  {b}
                </p>
              ))}
            </div>

            {/* Il libro */}
            <div className="mt-10 rounded-2xl border border-white/12 bg-white/[0.04] p-7">
              <div className="mb-4 flex items-center gap-2">
                <BookOpen size={15} className="text-accent" />
                <span className="font-mono-accent text-[11px] uppercase tracking-[0.16em] text-white/45">
                  Il volume
                </span>
              </div>

              <p className="font-display text-xl font-extrabold leading-snug sm:text-2xl">
                {LIBRO.titolo}
              </p>
              <p className="mt-1 font-subtitle text-sm text-primary-foreground/55">
                {LIBRO.sottotitolo} · {LIBRO.anno}
              </p>

              <figure className="mt-6 border-l-2 border-accent/60 pl-5">
                <Quote size={16} className="mb-2 text-accent/60" />
                <blockquote className="font-subtitle text-base italic leading-relaxed text-primary-foreground/75">
                  {LIBRO.estratto}
                </blockquote>
              </figure>

              <div className="mt-7 flex flex-wrap gap-3">
                {LIBRO.link ? (
                  <a
                    href={LIBRO.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 font-subtitle text-sm font-bold text-accent-foreground transition-opacity hover:opacity-90"
                  >
                    Vai al volume <ArrowRight size={14} />
                  </a>
                ) : null}
                {onCtaClick ? (
                  <button
                    onClick={onCtaClick}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-subtitle text-sm font-semibold transition-colors hover:bg-white/10"
                  >
                    Parla con lo studio <ArrowRight size={14} />
                  </button>
                ) : null}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
