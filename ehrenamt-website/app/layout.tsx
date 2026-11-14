import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@/styles/globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MotionEffects } from "@/components/MotionEffects";
import { StructuredData } from "@/components/StructuredData";
import { motionInitScript } from "@/lib/motion";
import { defaultDescription, defaultTitle, ogImage, siteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { themeInitScript } from "@/lib/theme";

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: { default: defaultTitle, template: `%s | ${site.shortName}` },
  description: defaultDescription,
  applicationName: site.name,
  openGraph: { type: "website", locale: "de_DE", siteName: site.name, images: [ogImage] },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { color: "#FFFFFF" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript + motionInitScript }} />
      </head>
      <body className="flex min-h-dvh flex-col pb-24 sm:pb-0">
        <a
          href="#inhalt"
          className="sr-only z-[60] rounded-full bg-brand px-5 py-3 text-lg font-medium text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Zum Inhalt springen
        </a>
        <Header />
        <main id="inhalt" className="flex-1">
          {children}
        </main>
        <Footer />
        <MotionEffects />
        <StructuredData />
      </body>
    </html>
  );
}
