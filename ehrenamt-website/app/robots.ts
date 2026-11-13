import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

/**
 * Netlify setzt beim Build CONTEXT (production, deploy-preview, branch-deploy).
 * Nur die Live-Website wird zur Indexierung freigegeben – Vorschau-Deploys nicht.
 */
export default function robots(): MetadataRoute.Robots {
  const isPreview = Boolean(process.env.CONTEXT) && process.env.CONTEXT !== "production";
  if (isPreview) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
