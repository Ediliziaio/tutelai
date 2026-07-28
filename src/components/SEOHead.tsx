import { useLayoutEffect } from "react";

/**
 * Gestione imperativa dei tag di <head>.
 *
 * Sostituisce react-helmet-async, che in questo progetto non inietta nulla nella
 * build di produzione: nessun title per pagina, nessun canonical, nessun og,
 * nessun JSON-LD, e per giunta in silenzio. Verificato con `vite preview` sia
 * sulla 3.0.0 sia sulla 2.0.5, quindi non è un problema di versione.
 *
 * Qui si scrive direttamente su document.head in un layout effect: nessun
 * provider, nessun contesto, nessuna dipendenza esterna.
 *
 * Restano tag *client-side*: i crawler che non eseguono JS continuano a vedere
 * solo index.html. Per SEO/GEO pieno serve il prerendering.
 */

type JsonLd = Record<string, unknown>;

export interface SEOHeadProps {
  title: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  ogImage?: string;
  ogUrl?: string;
  publishedTime?: string;
  tags?: string;
  jsonLd?: JsonLd;
}

/** Marca i nodi creati da noi, per poterli rimuovere senza toccare quelli di index.html. */
const MARK = "data-seo-head";

function upsertMeta(attr: "name" | "property", key: string, content: string, created: Element[]) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    el.setAttribute(MARK, "");
    document.head.appendChild(el);
    created.push(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string, created: Element[]) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    el.setAttribute(MARK, "");
    document.head.appendChild(el);
    created.push(el);
  }
  el.setAttribute("href", href);
}

export default function SEOHead({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogType = "website",
  ogImage,
  ogUrl,
  publishedTime,
  tags,
  jsonLd,
}: SEOHeadProps) {
  // Le pagine costruiscono jsonLd inline: come dipendenza sarebbe un oggetto
  // nuovo a ogni render. Si confronta la serializzazione, non l'identità.
  const ldString = jsonLd ? JSON.stringify(jsonLd) : undefined;

  useLayoutEffect(() => {
    const created: Element[] = [];

    document.title = title;

    if (description) upsertMeta("name", "description", description, created);
    upsertMeta("property", "og:title", ogTitle ?? title, created);
    if (ogDescription ?? description) {
      upsertMeta("property", "og:description", (ogDescription ?? description)!, created);
    }
    upsertMeta("property", "og:type", ogType, created);
    if (ogImage) upsertMeta("property", "og:image", ogImage, created);
    if (ogUrl ?? canonical) upsertMeta("property", "og:url", (ogUrl ?? canonical)!, created);
    if (publishedTime) upsertMeta("property", "article:published_time", publishedTime, created);
    if (tags) upsertMeta("property", "article:tag", tags, created);
    if (canonical) upsertLink("canonical", canonical, created);

    let ld: HTMLScriptElement | null = null;
    if (ldString) {
      ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.setAttribute(MARK, "");
      ld.textContent = ldString;
      document.head.appendChild(ld);
    }

    return () => {
      // Si rimuovono solo i nodi creati qui: quelli di index.html restano,
      // e verranno riscritti dalla pagina successiva.
      created.forEach((el) => el.remove());
      ld?.remove();
    };
  }, [
    title,
    description,
    canonical,
    ogTitle,
    ogDescription,
    ogType,
    ogImage,
    ogUrl,
    publishedTime,
    tags,
    ldString,
  ]);

  return null;
}
