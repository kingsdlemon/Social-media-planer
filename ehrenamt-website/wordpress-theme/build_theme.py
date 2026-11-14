"""Baut aus dem statischen Next.js-Export ein WordPress-Block-Theme (eine ZIP),
das in WordPress Studio hochgeladen und aktiviert werden kann.
Beim Aktivieren legt das Theme alle Seiten an und setzt Startseite + Permalinks."""
import json, os, re, shutil, html as htmlmod

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "out")
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


def block(html_str):
    return "<!-- wp:html -->\n" + html_str + "\n<!-- /wp:html -->"


home = open(f"{OUT}/index.html").read()
body = home[home.index("<body"):]
header_html = clean(body[body.index('<a href="#inhalt"'): body.index("<main")])  # Skip-Link + Header + mobile Leiste
footer_html = clean(part(body, "<footer", "</footer>"))
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
    key = slug or "startseite"
    import sys; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from to_blocks import to_blocks
    open(f"{T}/content/{key}.html", "w").write(to_blocks(main))
    pages.append({"slug": key, "title": "Startseite" if not slug else title, "front": not slug})
json.dump(pages, open(f"{T}/content/pages.json", "w"), ensure_ascii=False, indent=1)

open(f"{T}/style.css", "w").write("""/*
Theme Name: Ehrenamt für Darmstadt
Description: Apple-minimalistisches Theme für Ehrenamt für Darmstadt e.V. Beim Aktivieren werden alle Seiten automatisch angelegt.
Version: 2.0
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
define( 'EFD_CONTENT_VERSION', 2 );

add_action( 'after_setup_theme', function () {
	add_theme_support( 'title-tag' );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/site.css' );
} );

add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style( 'efd-site', get_theme_file_uri( 'assets/css/site.css' ), array(), wp_get_theme()->get( 'Version' ) );
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
add_action( 'admin_init', function () {
	if ( current_user_can( 'edit_pages' ) && (int) get_option( 'efd_content_version', 1 ) < EFD_CONTENT_VERSION ) {
		efd_setup_pages();
	}
} );
""")

# Startseite heißt im Original "/", WordPress-Slug ist "startseite" -> Links auf "/" funktionieren über die Startseite.
shutil.make_archive("/tmp/ehrenamt-darmstadt-theme", "zip", "/tmp/theme", "ehrenamt-darmstadt")
print("ok", os.path.getsize("/tmp/ehrenamt-darmstadt-theme.zip"))
print([p["title"] for p in pages])
