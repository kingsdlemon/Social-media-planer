"""Baut aus dem statischen Next.js-Export ein WordPress-Block-Theme (eine ZIP),
das in WordPress Studio hochgeladen und aktiviert werden kann.
Beim Aktivieren legt das Theme alle Seiten an und setzt Startseite + Permalinks."""
import json, os, re, shutil, html as htmlmod
TODOS = []

OUT = "/home/claude/social-media-planer/ehrenamt-website/out"
T = "/tmp/theme/ehrenamt-darmstadt"
shutil.rmtree("/tmp/theme", ignore_errors=True)
os.makedirs(f"{T}/assets/css", exist_ok=True)
for d in ("templates", "parts", "content"):
    os.makedirs(f"{T}/{d}", exist_ok=True)

# --- CSS + Schriften ---
css_name = [f for f in os.listdir(f"{OUT}/_next/static/chunks") if f.endswith(".css")]
css = "\n".join(open(f"{OUT}/_next/static/chunks/{n}").read() for n in sorted(css_name, key=lambda n: n != "0031e74turhvc.css"))
shutil.copytree(f"{OUT}/_next/static/media", f"{T}/assets/media")
css = css.replace("url(../media/", "url(../media/")  # assets/css -> assets/media
# WordPress-Wrapper neutralisieren, damit das Layout identisch bleibt
css += """
/* WordPress-Anpassungen */
.wp-site-blocks{display:contents}
.wp-site-blocks>*{margin-block-start:0!important;margin-block-end:0!important}
body{margin:0}
.wp-block-post-content>*{margin:0!important;max-width:none!important}
/* Formular-Auswahl-Chips ohne JavaScript */
.efd-chip:has(input:checked){background:#1d1d1f;color:#fff;--tw-ring-color:#1d1d1f}
.efd-chip:has(input:focus-visible){outline:3px solid #0071e3;outline-offset:2px}
"""
open(f"{T}/assets/css/site.css", "w").write(css)
shutil.copytree(f"{OUT}/images", f"{T}/assets/images")
shutil.copytree(f"{OUT}/downloads", f"{T}/assets/downloads")
for f in ("favicon.ico", "icon.png", "apple-icon.png"):
    shutil.copy(f"{OUT}/{f}", f"{T}/assets/{f}")


def part(h, start_tag, end_tag):
    i = h.index(start_tag)
    j = h.index(end_tag, i) + len(end_tag)
    return h[i:j]


def clean(s):
    # Next.js-Kommentare/Platzhalter entfernen
    s = re.sub(r"<!--\$!?-->|<!--/\$-->", "", s)
    s = re.sub(r'<template[^>]*></template>', "", s)
    return s



def wp_fixes(slug, main):
    """Alles entfernen/anpassen, was in WordPress nicht passt oder unfertig aussieht."""
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(main, "html.parser")
    # 0) Spenden: BIC der Sparkasse Darmstadt (BLZ 508 501 50) eintragen
    if slug == "spenden":
        dts = {d.get_text(strip=True): d for d in soup.find_all("dt")}
        if "BIC" in dts and "IBAN" in dts:
            iban_dd, bic_dd = dts["IBAN"].find_next_sibling("dd"), dts["BIC"].find_next_sibling("dd")
            bic_dd.clear(); bic_dd["class"] = iban_dd.get("class", []); bic_dd.string = "HELADEF1DAS"
    # 1) Interne TODO-Hinweiskästen nicht öffentlich zeigen (stehen in OFFENE-PUNKTE.md)
    for sp in soup.select('span.border-dashed[role="note"]'):
        TODOS.append((slug, " ".join(sp.get_text(" ").replace("TODO:", "").split())))
        parent = sp.parent
        sp.decompose()
        if parent is not None and not parent.get_text(strip=True) and not parent.find(["img", "svg", "a", "button"]):
            parent.decompose()
    # 2) Spenden: Online-Spenden-Karte hat noch keinen PayPal-Link -> raus
    if slug == "spenden":
        for t in soup.find_all(["h2", "h3"]):
            if "Online spenden" in t.get_text():
                TODOS.append((slug, "Online-Spenden-Karte (PayPal) wieder einbauen, sobald ein PayPal-Spendenlink des Vereins vorliegt."))
                t.find_parent("div", class_="rounded-[28px]").decompose()
                break
    # 3) Datenschutz an WordPress anpassen
    if slug == "datenschutz":
        def h3(text):
            return next(x for x in soup.find_all("h3") if x.get_text(strip=True) == text)
        def set_p(head, text):
            p = head.find_next_sibling("p"); p.string = text; return p
        set_p(h3("Hosting und Server-Logfiles"), "Diese Website läuft mit WordPress bei einem Hosting-Anbieter. Beim Aufruf der Seiten verarbeitet der Server technisch notwendige Daten (u. a. IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Browser und Betriebssystem), um die Website auszuliefern und ihre Sicherheit zu gewährleisten. Rechtsgrundlage ist unser berechtigtes Interesse an einem sicheren und stabilen Betrieb (Art. 6 Abs. 1 lit. f DSGVO).")
        head = h3("Keine Cookies, kein Tracking"); head.string = "Cookies und Tracking"
        set_p(head, "Für Besucherinnen und Besucher setzen wir keine Cookies und keine Analyse- oder Tracking-Werkzeuge ein. Schriftarten werden von unserem eigenen Server geladen, nicht von Drittanbietern. Nur wer sich zur Pflege der Inhalte anmeldet, erhält technisch notwendige Anmelde-Cookies von WordPress.")
        lok = h3("Lokale Speicherung der Darstellung")
        lok.find_next_sibling("p").decompose(); lok.decompose()
        kontakt = h3("Kontakt per E-Mail oder Telefon")
        p = kontakt.find_next_sibling("p")
        new_h = soup.new_tag("h3"); new_h.string = "Anmelde- und Kontaktformular"
        new_p = soup.new_tag("p"); new_p.string = "Wenn Sie das Formular „Aktiv werden“ oder das Kontaktformular nutzen, speichern wir Ihre Angaben in unserem WordPress-System und erhalten sie zusätzlich per E-Mail, um Ihre Anfrage zu bearbeiten (Art. 6 Abs. 1 lit. b DSGVO). Wir löschen die Angaben, sobald sie dafür nicht mehr benötigt werden."
        p.insert_after(new_h); new_h.insert_after(new_p)
        map_h = soup.new_tag("h3"); map_h.string = "Karte (OpenStreetMap)"
        map_p = soup.new_tag("p"); map_p.string = "Auf der Seite „Einsatzorte“ können Sie eine Karte einblenden. Erst wenn Sie auf „Karte anzeigen“ klicken, werden Kartenbilder von der OpenStreetMap Foundation geladen; dabei wird Ihre IP-Adresse an deren Server übertragen. Rechtsgrundlage ist Ihre Einwilligung durch den Klick (Art. 6 Abs. 1 lit. a DSGVO)."
        new_p.insert_after(map_h); map_h.insert_after(map_p)
        red = h3("Redaktionszugang")
        rp = soup.new_tag("p"); rp.string = "Die Inhalte werden über WordPress gepflegt. Für angemeldete Redakteurinnen und Redakteure speichert WordPress Benutzername, E-Mail-Adresse und technisch notwendige Anmelde-Cookies."
        red.insert_after(rp)
    return str(soup)


def swap_forms(slug, main):
    """React-Formulare (brauchen JavaScript) durch WordPress-Shortcodes ersetzen."""
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(main, "html.parser")
    form = soup.find("form")
    if not form:
        return main
    if slug == "aktiv-werden":
        target, code = form.find_parent("div", class_="scroll-mt-28"), "efd_aktiv_formular"
    elif slug == "kontakt":
        target, code = form, "efd_kontakt_formular"
    else:
        return main
    ph = soup.new_tag("div")
    ph["data-efd-shortcode"] = code
    target.replace_with(ph)
    return str(soup)


def block(html_str):
    return "<!-- wp:html -->\n" + html_str + "\n<!-- /wp:html -->"


home = open(f"{OUT}/index.html").read()
body = home[home.index("<body"):]
header_html = clean(body[body.index('<a href="#inhalt"'): body.index("<main")])  # Skip-Link + Header + mobile Leiste
footer_html = clean(part(body, "<footer", "</footer>"))
# Aktiver Menüpunkt wird in WordPress pro Seite gesetzt (nicht fest „Start“)
header_html = header_html.replace(' aria-current="page"', '').replace("text-ink font-medium dark:text-white", "text-ink/70 hover:text-ink dark:text-white/70 dark:hover:text-white").replace('no-underline text-ink dark:text-white"', 'no-underline text-ink/70 hover:text-ink dark:text-white/70 dark:hover:text-white"')
open(f"{T}/parts/header.html", "w").write(block(header_html))
open(f"{T}/parts/footer.html", "w").write(block(footer_html))

tpl = """<!-- wp:template-part {"slug":"header","tagName":"div"} /-->
<!-- wp:post-content {"layout":{"type":"default"}} /-->
<!-- wp:template-part {"slug":"footer","tagName":"div"} /-->
"""
for t in ("index", "page", "front-page", "single"):
    open(f"{T}/templates/{t}.html", "w").write(tpl)

nf = open(f"{OUT}/404.html").read()
open(f"{T}/templates/404.html", "w").write(
    '<!-- wp:template-part {"slug":"header","tagName":"div"} /-->\n'
    + block(clean(part(nf, "<main", "</main>")))
    + '\n<!-- wp:template-part {"slug":"footer","tagName":"div"} /-->\n'
)

# --- Seiten ---
pages = []
for slug in ["", "aktiv-werden", "einsatzorte", "aktuelles", "ueber-uns", "spenden", "kontakt", "impressum", "datenschutz"]:
    f = f"{OUT}/{slug}/index.html" if slug else f"{OUT}/index.html"
    h = open(f).read()
    title = htmlmod.unescape(re.search(r"<title>(.*?)</title>", h).group(1)).split(" | ")[0].split(" – ")[0].strip()
    main = clean(part(h, "<main", "</main>"))
    main = wp_fixes(slug, swap_forms(slug, main))
    key = slug or "startseite"
    import sys; sys.path.insert(0, "/home/claude")
    from to_blocks import to_blocks
    open(f"{T}/content/{key}.html", "w").write(to_blocks(main))
    pages.append({"slug": key, "title": "Startseite" if not slug else title, "front": not slug})
json.dump(pages, open(f"{T}/content/pages.json", "w"), ensure_ascii=False, indent=1)

open(f"{T}/style.css", "w").write("""/*
Theme Name: Ehrenamt für Darmstadt
Description: Apple-minimalistisches Theme für Ehrenamt für Darmstadt e.V. Beim Aktivieren werden alle Seiten automatisch angelegt.
Version: 4.0
Requires at least: 6.4
Requires PHP: 7.4
Text Domain: ehrenamt-darmstadt
*/
""")

open(f"{T}/theme.json", "w").write(json.dumps({
    "$schema": "https://schemas.wp.org/trunk/theme.json",
    "version": 3,
    "settings": {"appearanceTools": False, "layout": {}, "useRootPaddingAwareAlignments": False,
                 "color": {"defaultPalette": False, "defaultGradients": False, "defaultDuotone": False},
                 "typography": {"defaultFontSizes": False}, "spacing": {"defaultSpacingSizes": False}},
    "styles": {"spacing": {"blockGap": "0", "padding": {"top": "0", "right": "0", "bottom": "0", "left": "0"}}},
    "templateParts": [{"name": "header", "title": "Header", "area": "header"}, {"name": "footer", "title": "Footer", "area": "footer"}],
}, indent=2))

open(f"{T}/functions.php", "w").write(r"""<?php
/**
 * Ehrenamt für Darmstadt – Theme-Funktionen.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

/* Version der mitgelieferten Inhalte – bei Änderungen erhöhen */
define( 'EFD_CONTENT_VERSION', 4 );

require_once __DIR__ . '/inc/forms.php';

add_action( 'after_setup_theme', function () {
	add_theme_support( 'title-tag' );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/site.css' );
} );

add_action( 'wp_enqueue_scripts', function () {
	$v = wp_get_theme()->get( 'Version' );
	wp_enqueue_style( 'efd-site', get_theme_file_uri( 'assets/css/site.css' ), array(), $v );
	wp_enqueue_script( 'efd-site', get_theme_file_uri( 'assets/js/site.js' ), array(), $v, array( 'in_footer' => true, 'strategy' => 'defer' ) );
	wp_add_inline_script( 'efd-site', 'window.EFD_THEME=' . wp_json_encode( array(
		'leaflet' => get_theme_file_uri( 'assets/vendor/leaflet/' ),
		'orte'    => json_decode( file_get_contents( get_theme_file_path( 'assets/js/orte.json' ) ), true ),
	) ) . ';', 'before' );
} );

add_action( 'wp_head', function () {
	echo '<link rel="icon" href="' . esc_url( get_theme_file_uri( 'assets/icon.png' ) ) . '">';
	echo '<meta name="theme-color" content="#FFFFFF">';
} );

/* Body-Klassen wie im Original (Flex-Layout, Platz für mobile Leiste) */
add_filter( 'body_class', function ( $c ) {
	return array_merge( $c, array( 'flex', 'min-h-dvh', 'flex-col', 'pb-24', 'sm:pb-0' ) );
} );

/* Pfade aus dem Export auf das Theme bzw. die Seite umbiegen */
function efd_fix_urls( $html ) {
	$assets = get_theme_file_uri( 'assets' );
	$home   = untrailingslashit( home_url() );
	$html   = str_replace( array( '="/images/', '="/downloads/', "url(/images/" ), array( '="' . $assets . '/images/', '="' . $assets . '/downloads/', 'url(' . $assets . '/images/' ), $html );
	// interne Links (href="/seite/") an die Adresse dieser WordPress-Seite anpassen
	$html = preg_replace( '#href="/(?!/)#', 'href="' . $home . '/', $html );
	return $html;
}
add_filter( 'render_block', function ( $content, $block ) {
	return efd_fix_urls( $content );
}, 10, 2 );

/* Aktuelle Seite im Menü hervorheben */
add_filter( 'render_block_core/template-part', function ( $content, $block ) {
	if ( 'header' !== ( $block['attrs']['slug'] ?? '' ) || is_admin() ) { return $content; }
	$url = is_front_page() ? home_url( '/' ) : get_permalink();
	if ( ! $url ) { return $content; }
	$q = preg_quote( 'href="' . esc_url( $url ) . '"', '#' );
	return preg_replace_callback(
		'#class="([^"]*?)text-ink/70 hover:text-ink dark:text-white/70 dark:hover:text-white"\s+' . $q . '#',
		function ( $m ) use ( $url ) {
			$active = false !== strpos( $m[1], 'text-3xl' ) ? 'text-ink dark:text-white' : 'text-ink font-medium dark:text-white';
			return 'aria-current="page" class="' . $m[1] . $active . '" href="' . esc_url( $url ) . '"';
		},
		$content
	);
}, 20, 2 );

/* Beim Aktivieren: Seiten anlegen, Startseite + Permalinks setzen */
function efd_setup_pages() {
	$pages = json_decode( file_get_contents( get_theme_file_path( 'content/pages.json' ) ), true );
	if ( ! $pages ) { return; }
	kses_remove_filters();
	foreach ( $pages as $p ) {
		$existing = get_page_by_path( $p['slug'] );
		$content  = efd_fix_urls( file_get_contents( get_theme_file_path( 'content/' . $p['slug'] . '.html' ) ) );
		if ( $existing ) {
			$id = $existing->ID;
			// Inhalt aktualisieren, wenn eine ältere Theme-Version die Seite angelegt hat
			if ( (int) get_option( 'efd_content_version', 1 ) < EFD_CONTENT_VERSION ) {
				wp_update_post( array( 'ID' => $id, 'post_content' => $content ) );
			}
		} else {
			$id = wp_insert_post( array(
				'post_type'    => 'page',
				'post_status'  => 'publish',
				'post_title'   => $p['title'],
				'post_name'    => $p['slug'],
				'post_content' => $content,
			) );
		}
		if ( ! empty( $p['front'] ) && $id && ! is_wp_error( $id ) ) {
			update_option( 'show_on_front', 'page' );
			update_option( 'page_on_front', $id );
		}
	}
	kses_init_filters();
	update_option( 'blogname', 'Ehrenamt für Darmstadt e.V.' );
	update_option( 'blogdescription', 'Wir helfen, wenn es um Kultur geht.' );
	update_option( 'permalink_structure', '/%postname%/' );
	update_option( 'efd_content_version', EFD_CONTENT_VERSION );
	flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'efd_setup_pages' );

/* Nach einem Theme-Update (Theme ersetzt) die Seiten einmalig auf den neuen Stand bringen */
/* Läuft bei jedem Seitenaufruf (auch im Frontend), damit das Update sofort greift */
add_action( 'init', function () {
	if ( (int) get_option( 'efd_content_version', 1 ) < EFD_CONTENT_VERSION ) {
		efd_setup_pages(); // setzt efd_content_version am Ende selbst
	}
}, 20 );
""")

os.makedirs(f"{T}/inc", exist_ok=True)
HERE = os.path.dirname(os.path.abspath(__file__))
# Theme-Script, Leaflet (lokal, kein CDN) und Kartenpunkte
os.makedirs(f"{T}/assets/js", exist_ok=True)
shutil.copy(os.path.join(HERE, "site.js"), f"{T}/assets/js/site.js")
LEAF = "/home/claude/social-media-planer/ehrenamt-website/node_modules/leaflet/dist"
os.makedirs(f"{T}/assets/vendor/leaflet", exist_ok=True)
for f in ("leaflet.js", "leaflet.css"):
    shutil.copy(f"{LEAF}/{f}", f"{T}/assets/vendor/leaflet/{f}")
shutil.copytree(f"{LEAF}/images", f"{T}/assets/vendor/leaflet/images", dirs_exist_ok=True)
orte_ts = open("/home/claude/social-media-planer/ehrenamt-website/components/map/orte.ts").read()
orte = []
for m in re.finditer(r'\{\s*name:\s*"([^"]+)",\s*lat:\s*([\d.]+),\s*lng:\s*([\d.]+)(?:,\s*anchor:\s*"([^"]+)")?', orte_ts):
    o = {"name": m.group(1), "lat": float(m.group(2)), "lng": float(m.group(3))}
    if m.group(4): o["anchor"] = m.group(4)
    orte.append(o)
assert len(orte) == 9, len(orte)
json.dump(orte, open(f"{T}/assets/js/orte.json", "w"), ensure_ascii=False)
# Interne Hinweise für den Verein (nicht mehr öffentlich auf der Website)
names = {"startseite": "Startseite", "aktiv-werden": "Aktiv werden", "einsatzorte": "Einsatzorte", "aktuelles": "Aktuelles", "ueber-uns": "Über uns", "spenden": "Spenden", "kontakt": "Kontakt", "impressum": "Impressum", "datenschutz": "Datenschutz"}
lines = ["# Offene Punkte für den Verein", "", "Diese Hinweise standen früher als graue Kästen auf der Website. Sie sind jetzt nur noch hier.", ""]
last = None
seen = set()
for slug, text in TODOS:
    key = slug or "startseite"
    text = text.replace("unter /public/downloads/ ablegen", "in WordPress (Medien) hochladen").replace(" – bis dahin ohne Funktion", "")
    if (key, text) in seen:
        continue
    seen.add((key, text))
    if "Netlify" in text or "Decap" in text or "Fotos von Einsätzen" in text or "Bildnachweise ergänzen, sobald" in text or "BIC vom" in text:
        continue  # erledigt bzw. betrifft die WordPress-Version nicht
    if key != last:
        lines += ["", "## " + names.get(key, key)]; last = key
    lines.append("- [ ] " + text)
open(f"{T}/OFFENE-PUNKTE.md", "w").write("\n".join(lines) + "\n")
shutil.copy(os.path.join(os.path.dirname(os.path.abspath(__file__)), "forms.php"), f"{T}/inc/forms.php")
# Startseite heißt im Original "/", WordPress-Slug ist "startseite" -> Links auf "/" funktionieren über die Startseite.
shutil.make_archive("/tmp/ehrenamt-darmstadt-theme", "zip", "/tmp/theme", "ehrenamt-darmstadt")
print("ok", os.path.getsize("/tmp/ehrenamt-darmstadt-theme.zip"))
print([p["title"] for p in pages])
