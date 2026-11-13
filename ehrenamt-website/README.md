# Website „Ehrenamt für Darmstadt e.V.“

Neue Vereinswebsite – Next.js (App Router, TypeScript, Static Export) mit Tailwind CSS v4. Inhalte stammen von der bisherigen Website www.ehrenamt-darmstadt.org und wurden überarbeitet.

## Entwicklung

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # statischer Export nach out/
npm run lint     # TypeScript-Prüfung
```

## Struktur

| Pfad | Inhalt |
| --- | --- |
| `app/` | Seiten: Start, Aktiv werden, Einsatzorte, Über uns, Aktuelles, Spenden, Kontakt, Impressum, Datenschutz |
| `components/` | Header (Navigation, mobiles Menü, „Aktiv werden“-Button), Footer, Theme-Umschalter, UI-Bausteine |
| `content/` | Redaktionelle Daten: Einsatzorte, Gesuche („Wir suchen“), Meldungen („Aktuelles“) |
| `lib/site.ts` | Stammdaten (Adresse, Telefon, E-Mail, Bankverbindung, Navigation) |
| `styles/globals.css` | Tailwind-v4-Theme (Farben, Schriften) und Basis-Stile |
| `public/downloads/` | Fragebogen, Beitrittserklärung, Projektbroschüre (PDF) |

Neue Meldungen oder Gesuche werden in den Dateien unter `content/` ergänzt – die Seiten aktualisieren sich automatisch.

## Dark Mode

Klassenbasiert (`.dark` auf `<html>`). Standard ist die Systemeinstellung; eine Wahl über den Umschalter („Automatisch → Hell → Dunkel“) wird in `localStorage` unter `theme` gespeichert. Ein kleines Inline-Skript im `<head>` setzt die Klasse vor dem ersten Rendern.

## Animationen & 3D

| Was | Wo |
| --- | --- |
| 3D-Hero (Three.js, @react-three/fiber + drei) | `components/hero/` – `Hero3D` lädt `HeroScene` erst nach, wenn der Hero sichtbar ist; mobil vereinfacht; `HeroStatic` ist das statische Ersatzbild |
| Einblenden & Parallax (GSAP ScrollTrigger) | `components/MotionEffects.tsx` – per Attribut: `data-reveal`, `data-parallax="0.1"` (+ `data-parallax-root`) |
| Animierte Zahlen | `components/CountUp.tsx` |
| Eigener Cursor (nur Maus/Trackpad) | `components/CustomCursor.tsx` – System-Mauszeiger bleibt sichtbar (`HIDE_NATIVE_CURSOR`) |

Bei „Bewegung reduzieren“ (`prefers-reduced-motion`) sind 3D, Scroll-Animationen, Zähler und Cursor aus; der Hero zeigt das statische Bild. Die 3D-Farben werden zur Laufzeit aus den CSS-Variablen von `styles/globals.css` gelesen (`@theme static`).

## Offene Punkte (TODO)

Fehlende Informationen sind im Code mit `TODO` markiert und auf der Seite als gestrichelter Kasten sichtbar. Übersicht:

```bash
grep -rn "TODO" app components content lib
```

Impressum und Datenschutzerklärung sind als **Entwurf** gekennzeichnet und müssen vor dem Livegang vom Vorstand freigegeben und rechtlich geprüft werden.

## Deployment (Netlify)

Die `netlify.toml` liegt im Repository-Root und setzt `base = "ehrenamt-website"`, Build-Befehl `npm run build`, Ausgabeordner `out`.
