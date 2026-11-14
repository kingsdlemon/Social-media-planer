/**
 * Redaktionelle Inhalte – werden beim Build aus den JSON-Dateien in content/ gelesen.
 * Diese Dateien bearbeitet das CMS (/admin/, Konfiguration: public/admin/config.yml).
 */
import fs from "node:fs";
import path from "node:path";
import { cultureIcons, type CultureIconName } from "@/components/CultureIcons";

const contentDir = path.join(process.cwd(), "content");
const readJson = <T,>(rel: string): T => JSON.parse(fs.readFileSync(path.join(contentDir, rel), "utf8")) as T;

/** Absätze: im CMS durch eine Leerzeile getrennt */
const paragraphs = (text = "") => text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

/** Anker-IDs aus Überschriften („Museen & Museumsshops“ → „museen-museumsshops“) */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/* ---------- Aktuelles (ein JSON pro Meldung in content/aktuelles/) ---------- */

type MeldungFile = { title: string; date: string; dateLabel?: string; text?: string; links?: { label: string; href: string }[]; todo?: string };
export type Meldung = {
  id: string;
  title: string;
  date: string;
  /** Angezeigtes Datum: freier Text aus dem CMS oder das formatierte Datum */
  dateLabel: string;
  /** true, wenn das Datum exakt ist (dann als <time> ausgezeichnet) */
  exactDate: boolean;
  text: string[];
  links: { label: string; href: string }[];
  todo?: string;
};

const dateFormat = new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export function getMeldungen(): Meldung[] {
  const dir = path.join(contentDir, "aktuelles");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((file) => {
      const m = readJson<MeldungFile>(path.join("aktuelles", file));
      const date = String(m.date).slice(0, 10);
      const label = m.dateLabel?.trim();
      return {
        id: file.replace(/\.json$/, ""),
        title: m.title,
        date,
        dateLabel: label || dateFormat.format(new Date(`${date}T00:00:00Z`)),
        exactDate: !label,
        text: paragraphs(m.text),
        links: m.links ?? [],
        todo: m.todo?.trim() || undefined,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

/** Archiv-Dokumente (noch nicht online – siehe TODO auf der Seite „Aktuelles“) */
export const archivDokumente = ["Jahresbericht 2022", "Jahresbericht 2021", "Jahresbericht 2020", "Vereinszeitschrift 2015–2019 (mehrere Ausgaben)"];

/* ---------- Wir suchen (content/gesucht.json) ---------- */

export type Gesuch = { id: string; title: string; place: string; text: string[]; facts: string[] };

export function getGesuche(): Gesuch[] {
  const { gesuche } = readJson<{ gesuche: { title: string; place: string; text?: string; facts?: string[] }[] }>("gesucht.json");
  return gesuche.map((g) => ({ id: slugify(`${g.title} ${g.place}`), title: g.title, place: g.place, text: paragraphs(g.text), facts: g.facts ?? [] }));
}

/* ---------- Einsatzorte (content/einsatzorte.json) ---------- */

export type Einsatzort = { id: string; name: string; about: string; tasks: string; wanted: boolean; note?: string; image?: string; imageAlt?: string };
export type Kategorie = { id: string; title: string; icon: CultureIconName; intro: string; image?: string; orte: Einsatzort[] };

export function getKategorien(): Kategorie[] {
  const { kategorien } = readJson<{ kategorien: (Omit<Kategorie, "id" | "orte" | "icon"> & { icon: string; orte: Omit<Einsatzort, "id">[] })[] }>(
    "einsatzorte.json",
  );
  return kategorien.map((k) => ({
    id: slugify(k.title),
    title: k.title,
    icon: (k.icon in cultureIcons ? k.icon : "column") as CultureIconName,
    intro: k.intro,
    image: (k as { image?: string }).image,
    orte: (k.orte ?? []).map((o) => ({ ...o, id: slugify(o.name), wanted: Boolean(o.wanted), note: o.note?.trim() || undefined })),
  }));
}

/* ---------- Verein: Vorstand, Koordination (content/verein.json) ---------- */

export type Verein = {
  vorstand: { role: string; name?: string }[];
  koordination: { area: string; name: string }[];
  kassenpruefung?: string;
  todo?: string;
};

export function getVerein(): Verein {
  return readJson<Verein>("verein.json");
}
