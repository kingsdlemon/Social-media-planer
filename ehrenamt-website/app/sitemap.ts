import type { MetadataRoute } from "next";
import { legalNav, mainNav } from "@/lib/site";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

const priority: Record<string, number> = { "/": 1, "/aktiv-werden/": 0.9, "/einsatzorte/": 0.8, "/aktuelles/": 0.7 };

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [...mainNav, ...legalNav].map(({ href }) => ({
    url: `${siteUrl}${href}`,
    lastModified,
    changeFrequency: href === "/aktuelles/" ? "weekly" : "monthly",
    priority: priority[href] ?? (legalNav.some((l) => l.href === href) ? 0.3 : 0.6),
  }));
}
