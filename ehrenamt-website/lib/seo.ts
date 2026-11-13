import type { Metadata } from "next";
import { site } from "./site";

/**
 * Basis-URL für Canonical, Open Graph, Sitemap und strukturierte Daten.
 * Netlify setzt beim Build die Variable `URL` (Hauptadresse der Website, z. B. die eigene Domain).
 * Mit NEXT_PUBLIC_SITE_URL lässt sie sich überschreiben; sonst gilt site.url.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || site.url).replace(/\/+$/, "");

export const defaultTitle = `${site.name} – ${site.claim}`;
export const defaultDescription =
  "Ehrenamt für Darmstadt e.V. vermittelt seit 1994 Ehrenamtliche an rund 40 Kultureinrichtungen in Darmstadt – von Museumsshops über Archive bis zur Denkmalpflege.";

/** Vorschaubild für soziale Netzwerke (erzeugt mit scripts/og-image.cjs) */
export const ogImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: `${site.name} – ${site.claim}`,
};

/** Einheitliche Metadaten pro Seite: Titel, Beschreibung, Canonical, Open Graph, Twitter/X */
export function pageMetadata({ title, description = defaultDescription, path }: { title?: string; description?: string; path: string }): Metadata {
  const fullTitle = title ? `${title} | ${site.shortName}` : defaultTitle;
  return {
    title: title ?? { absolute: defaultTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "de_DE",
      siteName: site.name,
      url: path,
      title: fullTitle,
      description,
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [ogImage.url] },
  };
}
