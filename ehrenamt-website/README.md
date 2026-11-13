# Website „Ehrenamt für Darmstadt e.V.“

Neue Vereinswebsite: Next.js (App Router, TypeScript, statischer Export), Tailwind CSS v4, Hosting auf Netlify, Inhaltspflege mit Decap CMS. Die Texte stammen von der bisherigen Website www.ehrenamt-darmstadt.org und wurden überarbeitet.

**Inhalt:** [Schnellstart](#schnellstart-lokal) · [Netlify-Deploy](#netlify-deploy--schritt-für-schritt) · [CMS-Login einrichten](#cms-login-einrichten) · [Inhalte pflegen](#inhalte-pflegen) · [TODO-Liste](#todo-liste-fehlende-angaben-vom-verein) · [Technik](#technik)

---

## Schnellstart (lokal)

Voraussetzung: [Node.js](https://nodejs.org) 22.

```bash
cd ehrenamt-website
npm install
npm run dev      # Entwicklung: http://localhost:3000
npm run build    # statischer Export nach out/
npm run lint     # TypeScript-Prüfung
npm run images   # Bilder neu erzeugen (Logo, Favicons, WebP) – siehe „Bilder“
```

---

## Netlify-Deploy – Schritt für Schritt

Die Datei `netlify.toml` liegt im **Hauptordner des Repositorys** und enthält bereits alle Build-Einstellungen (Unterordner `ehrenamt-website`, Befehl `npm run build`, Ausgabeordner `out`, Node 22, Sicherheits- und Cache-Header). Es muss nichts von Hand eingetragen werden.

1. **Netlify-Konto anlegen** auf [netlify.com](https://www.netlify.com), am einfachsten mit „Sign up with GitHub“.
2. **Projekt anlegen:** *Add new project* → *Import an existing project* → *GitHub* → das Repository `kingsdlemon/Social-media-planer` auswählen.
3. **Branch:** `main` als Produktions-Branch lassen. Die Build-Einstellungen übernimmt Netlify aus `netlify.toml` (Base directory `ehrenamt-website`, Build command `npm run build`, Publish directory `ehrenamt-website/out`). Auf **Deploy** klicken.
4. **Prüfen:** Nach 1–2 Minuten ist die Website unter `https://<name>.netlify.app` erreichbar. Kurz testen: Startseite, `/sitemap.xml`, `/robots.txt`, `/admin/`.
5. **Eigene Domain verbinden** (z. B. `www.ehrenamt-darmstadt.org`): *Domain management* → *Add a domain*. Netlify zeigt die nötigen DNS-Einträge an (meist ein CNAME für `www` auf `<name>.netlify.app` bzw. ein A-Eintrag für die Hauptdomain). Diese beim bisherigen Domain-Anbieter eintragen.
   - **Wichtig:** Nur die Einträge für die Website ändern. E-Mail-Einträge (MX) unverändert lassen.
   - Das HTTPS-Zertifikat (Let’s Encrypt) richtet Netlify automatisch ein.
   - Die alte Website ist erst offline, wenn die DNS-Einträge umgestellt sind. Bis dahin können beide parallel laufen.
6. **Website-Adresse:** Canonical-Links, Sitemap, Open Graph und strukturierte Daten verwenden automatisch die Hauptadresse aus Netlify (Variable `URL`). Soll eine andere Adresse gelten, unter *Project configuration → Environment variables* `NEXT_PUBLIC_SITE_URL` setzen (z. B. `https://www.ehrenamt-darmstadt.org`) und neu deployen.
7. **Vorschau-Deploys** (Pull Requests, andere Branches) sperrt `robots.txt` automatisch für Suchmaschinen. Nur die Live-Website wird indexiert.

> **Kosten/Limits:** Im kostenlosen Netlify-Tarif gibt es ein monatliches Kontingent („Credits“). Jeder Produktions-Deploy verbraucht davon einen festen Anteil (Stand Nov. 2026: 300 Credits/Monat, 15 Credits pro Deploy, also rund 20 Deploys im Monat). Weil **jedes Speichern im CMS einen Deploy auslöst**, Änderungen möglichst gesammelt an einem Termin einpflegen. Aktuelle Werte: [netlify.com/pricing](https://www.netlify.com/pricing/).

---

## CMS-Login einrichten

Die Redaktionsoberfläche liegt unter **`https://<ihre-domain>/admin/`** ([Decap CMS](https://decapcms.org), Oberfläche auf Deutsch). Jede Änderung wird als Commit im Branch `main` gespeichert. Netlify baut die Website danach automatisch neu, nach 1–2 Minuten ist sie online.

**Anmeldung:** über GitHub. Das ist die von Netlify und Decap unterstützte, kostenlose Variante. Jede Person, die Inhalte pflegt, braucht ein (kostenloses) GitHub-Konto mit Schreibrecht auf das Repository.

### Einmalig einrichten (Administrator/in)

1. **GitHub-OAuth-App anlegen** (mit dem Konto, dem das Repository gehört):
   GitHub → *Settings* → *Developer settings* → *OAuth Apps* → *New OAuth App*
   - *Application name:* `Ehrenamt Darmstadt – Redaktion`
   - *Homepage URL:* die Website-Adresse, z. B. `https://www.ehrenamt-darmstadt.org`
   - *Authorization callback URL:* `https://api.netlify.com/auth/done`
   - Speichern, dann **Client ID** notieren und mit *Generate a new client secret* das **Client Secret** erzeugen und notieren.
2. **In Netlify hinterlegen:** *Project configuration* → *Access & security* → *OAuth* → *Authentication providers* → *Install provider* → **GitHub** → Client ID und Client Secret einfügen → *Install*. (Die Menünamen können sich bei Netlify leicht ändern, gesucht ist der Bereich „OAuth / Authentication providers“.)
3. **Redakteurinnen und Redakteure einladen:** GitHub-Repository → *Settings* → *Collaborators* → *Add people* → GitHub-Name eingeben → Rolle **Write**. Die Person muss die Einladung per E-Mail annehmen.

### Anmelden (alle, die Inhalte pflegen)

1. `https://<ihre-domain>/admin/` öffnen.
2. **„Mit GitHub einloggen“** klicken und beim ersten Mal den Zugriff bestätigen.
3. Bereich wählen, ändern, **Veröffentlichen**. Nach 1–2 Minuten ist die Änderung auf der Website.

### Alternativen ohne GitHub-Konto

Falls Redakteurinnen und Redakteure kein GitHub-Konto anlegen sollen:

- **Decap Turbo:** kostenpflichtiger Dienst der Decap-Macher, Anmeldung ohne GitHub- oder Netlify-Konto ([decapcms.org/turbo](https://decapcms.org/turbo/)).
- **DecapBridge:** externer Dienst mit kostenlosem Einstieg, Anmeldung per E-Mail und Passwort. Dafür muss in `public/admin/config.yml` das `backend` umgestellt werden. Datenschutz des externen Dienstes vorher prüfen.
- **Netlify Identity + Git Gateway:** Netlify Identity wird seit Februar 2026 wieder unterstützt. **Git Gateway** ist aber weiterhin abgekündigt und wird für neue Einrichtungen nicht empfohlen, deshalb hier nicht verwendet.

### Lokal ohne Login bearbeiten (für Entwickler)

Im Hauptordner des Repositorys `npx decap-server` starten, in `ehrenamt-website` `npm run dev` starten und `http://localhost:3000/admin/index.html` öffnen. Änderungen landen direkt in den lokalen Dateien (`local_backend: true` in `config.yml`).

---

## Inhalte pflegen

| Was | Wo im CMS | Datei |
| --- | --- | --- |
| Meldungen („Aktuelles“, die neuesten drei auch auf der Startseite) | Aktuelles | `content/aktuelles/*.json` (eine Datei pro Meldung) |
| Gesuche („Wir suchen“ auf „Aktiv werden“, die ersten drei auch auf der Startseite) | Seiteninhalte → Wir suchen | `content/gesucht.json` |
| Einsatzorte und Bereiche (inkl. Kacheln auf Start- und Einsatzorte-Seite) | Seiteninhalte → Einsatzorte | `content/einsatzorte.json` |
| Vorstand, Koordination, Kassenprüfung („Über uns“) | Seiteninhalte → Vorstand und Koordination | `content/verein.json` |

**Tipps für das CMS:**

- Absätze im Textfeld durch eine **Leerzeile** trennen.
- **„Interner Hinweis (TODO)“** erscheint auf der Website als gestrichelter Kasten für noch fehlende Angaben. Leer lassen, sobald alles vollständig ist.
- **Datum bei Meldungen:** bestimmt die Reihenfolge. Mit „Datum anders anzeigen“ kann stattdessen z. B. „Juni 2023“ oder „Neu“ erscheinen.
- **Bereiche (Einsatzorte):** Der erste Bereich wird als große Kachel gezeigt. Reihenfolge per Ziehen ändern.
- Ein leeres Namensfeld beim Vorstand bedeutet „Zurzeit unbesetzt“, dazu erscheint ein Link „Wir suchen Sie!“.

**Ohne CMS (im Code):**

- Kontaktdaten, Adresse, Bankverbindung, Vereinsregister, Navigation: `lib/site.ts`
- Seitentexte (Startseite, Über uns, Spenden, Kontakt, Impressum, Datenschutz): `app/*/page.tsx`
- PDFs (Fragebogen, Beitrittserklärung, Broschüre): `public/downloads/`

---

## TODO-Liste: fehlende Angaben vom Verein

Alle Lücken sind auf der Website als gestrichelter **TODO**-Kasten sichtbar. Im Code findet man sie mit `grep -rn "TODO" app components lib`, in den Inhalten mit `grep -rn '"todo"\|"note"' content`.

### Rechtliches (vor dem Livegang klären, Impressum und Datenschutz sind als **Entwurf** markiert)

- [ ] **Impressum:** vertretungsberechtigte Vorstandsmitglieder laut Satzung namentlich nennen (1. Vorsitz derzeit unbesetzt; 2. Vorsitzende: Beatrice Wesp)
- [ ] **Impressum:** verantwortliche Person nach § 18 Abs. 2 MStV bestätigen (bisher Beatrice Wesp)
- [ ] **Impressum:** ggf. steuerliche Angaben (zuständiges Finanzamt, Steuernummer)
- [ ] **Impressum:** Bildnachweise ergänzen, sobald Fotos eingebunden sind
- [ ] **Datenschutz:** vertretungsberechtigte Personen aktualisieren (alte Fassung nennt noch Dr. Marjam Schellhaas)
- [ ] **Datenschutz:** Auftragsverarbeitungsvertrag (DPA) mit Netlify abschließen; Angaben zur Datenübermittlung in die USA und zur Speicherdauer der Server-Logfiles ergänzen
- [ ] **Datenschutz:** Redaktionszugang `/admin/` beschreiben (Anmeldung über GitHub/Netlify, Programmcode von jsDelivr)
- [ ] **Datenschutz:** „Stand“-Datum nach Freigabe eintragen
- [ ] Beide Texte vom Vorstand freigeben und rechtlich prüfen lassen

### Spenden

- [ ] **BIC** der Sparkasse Darmstadt vom Schatzmeister bestätigen lassen (`lib/site.ts`)
- [ ] **Gemeinnützigkeit:** Finanzamt, Datum des Freistellungsbescheids, Ablauf der Zuwendungsbestätigung
- [ ] **Förderer und Zuschussgeber:** Liste (mit Einverständnis, ggf. mit Logos) für „Über uns → Finanzierung“

### Kontakt

- [ ] Feste **Sprechzeiten** (falls es welche gibt)
- [ ] **Anfahrt** mit Bus und Bahn, Hinweise zur **Barrierefreiheit** des John-F.-Kennedy-Hauses
- [ ] Optional: Kontaktformular (z. B. Netlify Forms). Dafür muss vorher die Datenschutzerklärung angepasst werden

### Inhalte (im CMS änderbar)

- [ ] **Einsatzorte vervollständigen:** beschrieben sind 22, der Verein ist in rund 40 Einrichtungen aktiv (Abgleich mit der Projektbroschüre)
- [ ] Bei **3 Einsatzorten** prüfen, ob noch Verstärkung gesucht wird: Kunst Archiv Darmstadt, Hessische familiengeschichtliche Vereinigung, Papiertheatersammlung Walter Röhler
- [ ] **Gesuche** („Wir suchen“) auf Aktualität prüfen
- [ ] **Vorstand und Koordination** nach der Mitgliederversammlung 2026 aktualisieren; **Einverständnis zur Namensnennung** einholen
- [ ] **Aktuelles:** echte Daten für 5 Meldungen eintragen (Mitgliederversammlung 2026, Bürgerstiftung-Technik, buergerstiftung.art, Hinweis Mobilnummer, Denkmalschutzpreis inkl. Jahr)
- [ ] **Mitgliederversammlung 2026:** Datum und Ergebnisse
- [ ] **Stammtisch** der Denkmalreinigungsgruppe: findet er noch so statt?
- [ ] **Archiv:** Jahresberichte 2020–2022 und Vereinszeitschriften von der alten Website sichern, unter `public/downloads/` ablegen und verlinken

### Bilder und Logo

- [ ] **Fotos von Einsätzen** (mit Einverständnis der abgebildeten Personen) für Startseite und Einsatzorte
- [ ] **Logo als Originaldatei** (Vektor oder hochaufgelöst): Das aktuelle Logo stammt von der alten Website und hat nur 287 × 281 Pixel. Das reicht für die Website, nicht aber für Druck oder große Darstellungen

### Technik und Organisation

- [ ] Endgültige **Domain** festlegen (bisher `ehrenamt-darmstadt.org`) und bei Bedarf in `lib/site.ts` (`url`) sowie `public/admin/config.yml` (`site_url`) anpassen
- [ ] Wer verwaltet das **Netlify-Konto** und die **GitHub-OAuth-App**?
- [ ] Wer pflegt Inhalte? GitHub-Konten anlegen und als Collaborator einladen (siehe „CMS-Login einrichten“)

---

## Technik

### Struktur

| Pfad | Inhalt |
| --- | --- |
| `app/` | Seiten, Favicons (`icon.png`, `apple-icon.png`, `favicon.ico`), `sitemap.ts`, `robots.ts` |
| `components/` | Header, Footer, UI-Bausteine, Kultur-Icons, Bento-Raster, 3D-Hero (`hero/`), Animationen, Cursor, strukturierte Daten |
| `content/` | Redaktionelle Inhalte als JSON (vom CMS bearbeitet) |
| `lib/content.ts` | Liest die Inhalte beim Build |
| `lib/site.ts` | Stammdaten (Adresse, Telefon, E-Mail, Bank, Navigation) |
| `lib/seo.ts` | Metadaten, Canonical, Open Graph, Website-Adresse |
| `public/admin/` | Decap CMS (`index.html`, `config.yml`) |
| `public/images/`, `public/downloads/` | Bilder, PDFs |
| `assets/` | Quelldateien, die nicht online gehen (Logo-Original) |
| `scripts/` | `optimize-images.mjs` (Bilder, Logo, Favicons), `og-image.cjs` (Vorschaubild) |
| `styles/globals.css` | Tailwind-Theme (Farben, Schriften) und Grundstile |

### Farben & Logo

Die Palette ist aus dem Vereinslogo abgeleitet (Logo-Blau `#0AB3EF` + Schwarz) und steht als `@theme` in `styles/globals.css`:

| Token | Hex | Einsatz |
| --- | --- | --- |
| `brand` | `#0AB3EF` | Logo-Blau: Buttons (mit `brand-deep`-Text), Flächen, Deko. **Nie als Text auf hellem Grund** |
| `brand-light` | `#9FDAFA` | Hover, Akzente im Dark Mode |
| `brand-soft` | `#E8F6FE` | helle Flächen, aktive Navigation |
| `brand-dark` | `#046F95` | Links, Dachzeilen, sekundäre Buttons (weißer Text) |
| `brand-deep` | `#012E41` | Überschriften, Footer, Text auf Logo-Blau |
| `paper` / `mist` | `#F8FBFC` / `#DDE4E8` | Seitenhintergrund / Linien, gedämpfte Flächen |
| `ink` / `ink-soft` | `#1C2327` / `#4D585F` | Fließtext / Nebentext |
| `night` / `night-raised` | `#05161F` / `#0D232E` | Dark Mode: Hintergrund / Karten |

### Bilder

- `npm run images` erzeugt aus den Quellen:
  - `public/images/logo.png` (freigestellt aus `assets/logo-quelle.jpg`)
  - die Favicons in `app/` (Turm + „EfD“ aus dem Logo)
  - die WebP-Bilder
  - Der Hero-Verlauf wird dabei per Gradient-Map in die Markenfarben umgefärbt. Das Original `public/images/hero-bg.jpg` bleibt unverändert. Abschalten: in `scripts/optimize-images.mjs` beim Hero `recolor` entfernen.
- `node scripts/og-image.cjs` erzeugt das Vorschaubild für soziale Netzwerke (`public/og-image.png`, 1200 × 630). Das Skript braucht Playwright (`npm i -D playwright && npx playwright install chromium`).

### Dark Mode

Klassenbasiert (`.dark` auf `<html>`). Standard ist die Systemeinstellung. Eine Wahl über den Umschalter („Automatisch → Hell → Dunkel“) wird in `localStorage` gespeichert. Ein Inline-Skript (`lib/theme.ts`) setzt die Klasse vor dem ersten Rendern.

### Animationen & 3D

| Was | Wo |
| --- | --- |
| 3D-Hero (Three.js, @react-three/fiber + drei) | `components/hero/`: `Hero3D` lädt `HeroScene` nach, mobil vereinfacht; `HeroStatic` ist das statische Bild |
| Einblenden & Parallax (GSAP ScrollTrigger) | `components/MotionEffects.tsx`, gesteuert über die Attribute `data-reveal`, `data-parallax`, `data-parallax-root` |
| Animierte Zahlen | `components/CountUp.tsx` |
| Eigener Cursor (nur Maus/Trackpad) | `components/CustomCursor.tsx`. Der System-Mauszeiger bleibt sichtbar (`HIDE_NATIVE_CURSOR`) |

- **Laden bei der ersten Interaktion:** Three.js und GSAP werden erst bei der ersten Interaktion (Maus, Scrollen, Touch, Taste) geladen. Bis dahin ist der Inhalt vollständig sichtbar und der Hero zeigt das statische Bild. Das hält den Seitenstart auf langsamen Handys schnell.
- **Einblenden:** Nur Inhalte unterhalb des sichtbaren Bereichs werden eingeblendet.
- **„Bewegung reduzieren“** (`prefers-reduced-motion`): 3D, Animationen, Zähler und Cursor sind aus.

### Qualität (Stand der Prüfung, November 2026)

- **Lighthouse 13** (alle 9 Seiten, mobil und Desktop): Performance 99–100, Barrierefreiheit 100, Best Practices 100, SEO 100
- **WCAG AA:**
  - Kontraste mit axe-core und einer Pixelmessung aller Texte geprüft, hell und dunkel
  - Tastaturbedienung: Skip-Link, sichtbarer Fokus, nichts verdeckt, Menü per Escape schließbar
  - Alt-Texte für alle inhaltlichen Bilder
- **SEO:**
  - Titel, Beschreibung, Canonical und Open Graph pro Seite
  - `sitemap.xml`, `robots.txt`
  - schema.org `NGO`/`Organization` und `WebSite` (JSON-LD)
- **Seitenbreiten:** alle Seiten ohne horizontales Scrollen von 320 px bis Desktop
