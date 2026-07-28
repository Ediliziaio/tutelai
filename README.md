# TutelAI

Compliance **AI Act** e **GDPR** per PMI italiane — sito pubblico + piattaforma SaaS.

Dominio di produzione previsto: `tutelai.it`.

## Stack

- **Vite** 5 + **React** 18 + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix)
- **React Router** 6 · **TanStack Query** · **react-helmet-async** (SEO per pagina)
- **framer-motion** per le animazioni
- **Vitest** + Testing Library

## Avvio

```bash
npm install
npm run dev
```

Il dev server parte su http://localhost:8080.

| Comando | Cosa fa |
| --- | --- |
| `npm run dev` | Dev server con HMR |
| `npm run build` | Build di produzione in `dist/` |
| `npm run preview` | Serve la build di produzione |
| `npm run lint` | ESLint |
| `npm test` | Vitest (single run) |

## Struttura

```
src/
├── pages/            Pagine pubbliche (landing, blog, legal, auth)
├── pages/saas/       App cliente (/app) e SuperAdmin (/admin)
├── components/       Componenti della landing
├── components/saas/  Layout e componenti della piattaforma
├── components/ui/    Primitive shadcn/ui
├── contexts/         AuthContext
├── data/             Contenuti statici (blog) e mock della piattaforma
└── types/            Tipi condivisi
```

### Rotte

- **Pubbliche** — `/`, `/chi-siamo`, `/servizi`, `/piattaforma`, `/normativa-ai`, `/partner`, `/blog`, `/blog/:slug`, `/contatti`, `/privacy`, `/termini`
- **Auth** — `/login`, `/forgot-password`, `/reset-password`
- **App cliente** (`/app`, protetta) — dashboard, AI registry, doc generator, monitor, training, GDPR, audit trail, gap analysis, AI lawyer, firma digitale, report, vendor management, billing, impostazioni
- **SuperAdmin** (`/admin`, protetta) — aziende, utenti, piani, contenuti, corsi, report, impostazioni

## Stato attuale

> ⚠️ **La piattaforma gira su dati mock.** `AuthContext` e tutte le pagine sotto `/app` e `/admin`
> leggono da `src/data/tutelaiMockData.ts`. Non esiste ancora un backend: nessun database,
> nessuna autenticazione reale, nessuna persistenza.

Da fare prima di andare in produzione:

- [ ] Backend + auth reale (l'attuale `ProtectedRoute` non protegge nulla lato server)
- [ ] Contenuti di `/privacy` e `/termini` (sono placeholder "in fase di redazione")
- [ ] P.IVA e dati societari nel footer (`[da completare]`)
- [ ] Form contatti e lead collegati a un destinatario reale
- [ ] **Sostituire `react-helmet-async`** — vedi sotto, il SEO per-pagina non funziona
- [ ] `sitemap.xml` e `llms.txt` (oggi c'è solo `robots.txt`)
- [ ] Code splitting: il chunk `index` supera i 500 kB

### 🔴 Bug aperto: il SEO per-pagina non viene applicato

Tutte e 12 le pagine dichiarano i propri tag con `<Helmet>`, ma **nella build di produzione
nessuno di questi tag arriva nel `<head>`**: niente `<title>` per pagina, niente `canonical`,
niente `og:*`, niente JSON-LD. Verificato con `npm run build && npx vite preview`:
`document.head.querySelectorAll('[data-rh]').length === 0`, nessun errore in console.

Il no-op si presenta sia con `react-helmet-async@3.0.0` (attuale) sia con `2.0.5`, quindi
**non è un problema di versione**. `HelmetProvider` è montato correttamente in `main.tsx`
e non esistono alias o shim nella config.

Conseguenza pratica: ogni URL condiviso mostra titolo e descrizione della homepage, e
i canonical per pagina non esistono. Per questo `index.html` tiene solo i tag *site-level*
(`og:site_name`, `og:type`, `og:locale`, `twitter:card`) — duplicare lì `og:title`/`og:url`
farebbe vincere quelli su ogni pagina condivisa.

Rimedio consigliato: sostituire Helmet con un componente `SEOHead` imperativo che scrive
direttamente su `document.head` in un `useEffect` — è la soluzione già adottata negli altri
progetti che avevano lo stesso sintomo. Per SEO/GEO serio serve comunque il prerendering
(es. `vite-react-ssg`), perché i crawler che non eseguono JS vedono solo `index.html`.

## Note

- Il progetto nasce da un remix Lovable: `vite.config.ts` usa ancora `lovable-tagger`
  in modalità development per il round-trip con l'editor Lovable.
- Il SEO è per-pagina via `react-helmet-async`, quindi **client-side**: i crawler che non
  eseguono JS vedono solo i meta di `index.html`. Per SEO/GEO serio serve prerendering.
