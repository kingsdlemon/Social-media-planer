/**
 * Zentrale Stammdaten des Vereins.
 * Quelle: bisherige Website www.ehrenamt-darmstadt.org (Stand: November 2026).
 * Alles, was dort nicht eindeutig belegt ist, ist als TODO markiert.
 */

export const site = {
  name: "Ehrenamt für Darmstadt e.V.",
  shortName: "Ehrenamt für Darmstadt",
  abbreviation: "EfD",
  claim: "Wir helfen, wenn es um Kultur geht.",
  /** Vereinslogo (transparent, erzeugt von scripts/optimize-images.mjs aus assets/logo-quelle.jpg) */
  logo: { src: "/images/logo.png", width: 237, height: 237 },
  founded: 1994,
  // TODO: Endgültige Domain der neuen Website festlegen (bisher ehrenamt-darmstadt.org)
  url: "https://www.ehrenamt-darmstadt.org",

  email: "info@ehrenamt-darmstadt.de",
  treasurerEmail: "schatzmeister@ehrenamt-darmstadt.de",
  phone: "0151 43308044",
  phoneHref: "tel:+4915143308044",
  officeNote: "Unser Büro ist nicht regelmäßig besetzt. Termine vereinbaren wir gern telefonisch oder per E-Mail.",

  address: {
    building: "John-F.-Kennedy-Haus (Literaturhaus)",
    street: "Kasinostraße 3",
    zip: "64293",
    city: "Darmstadt",
  },
  mapUrl: "https://www.openstreetmap.org/search?query=Kasinostra%C3%9Fe%203%2C%2064293%20Darmstadt",

  bank: {
    holder: "Ehrenamt für Darmstadt e.V.",
    name: "Sparkasse Darmstadt",
    iban: "DE38 5085 0150 0000 6279 25",
    // TODO: BIC vom Schatzmeister bestätigen lassen und hier eintragen
    bic: null as string | null,
  },

  register: {
    court: "Amtsgericht Darmstadt",
    number: "VR 2436",
  },

  umbrella: {
    name: "Dachverband Kultur Darmstadt e.V.",
    url: "https://dachverbandkulturdarmstadt.de",
  },

  downloads: {
    fragebogen: "/downloads/fragebogen.pdf",
    beitritt: "/downloads/beitrittserklaerung.pdf",
    broschuere: "/downloads/broschuere-projekte.pdf",
  },
} as const;

export const mailto = (subject?: string) =>
  `mailto:${site.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;

export type NavItem = { href: string; label: string };

export const mainNav: NavItem[] = [
  { href: "/", label: "Start" },
  { href: "/aktiv-werden/", label: "Aktiv werden" },
  { href: "/einsatzorte/", label: "Einsatzorte" },
  { href: "/ueber-uns/", label: "Über uns" },
  { href: "/aktuelles/", label: "Aktuelles" },
  { href: "/spenden/", label: "Spenden" },
  { href: "/kontakt/", label: "Kontakt" },
];

export const legalNav: NavItem[] = [
  { href: "/impressum/", label: "Impressum" },
  { href: "/datenschutz/", label: "Datenschutz" },
];
