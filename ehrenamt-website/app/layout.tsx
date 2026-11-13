import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@/styles/globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { themeInitScript } from "@/components/ThemeToggle";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} – ${site.claim}`,
    template: `%s | ${site.shortName}`,
  },
  description:
    "Ehrenamt für Darmstadt e.V. vermittelt seit 1994 Ehrenamtliche an rund 40 Kultureinrichtungen in Darmstadt – von Museumsshops über Archive bis zur Denkmalpflege.",
  openGraph: { type: "website", locale: "de_DE", siteName: site.name },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F1EA" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1F22" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-dvh flex-col pb-24 sm:pb-0">
        <a
          href="#inhalt"
          className="sr-only z-[60] rounded-full bg-teal px-5 py-3 text-lg font-bold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Zum Inhalt springen
        </a>
        <Header />
        <main id="inhalt" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
