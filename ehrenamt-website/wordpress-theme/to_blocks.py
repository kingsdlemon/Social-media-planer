"""Wandelt das statische Seiten-HTML in native WordPress-Blöcke um.
Überschriften, Absätze, Listen und Bereiche werden echte Blöcke (direkt editierbar).
Alles, was WordPress nicht 1:1 als Block abbilden kann (SVG-Icons, Bilder mit
Spezial-Layout, Formulare, Karussell-Karten), bleibt als kleiner HTML-Block erhalten."""
import json, sys
from bs4 import BeautifulSoup, NavigableString, Tag, Comment

GROUP_TAGS = {"div", "section", "main", "article", "header", "footer", "aside"}
OK_GROUP_ATTRS = {"class", "id", "data-reveal", "data-parallax-root"}
INLINE = {"a", "strong", "em", "b", "i", "span", "br", "time", "code", "mark", "small", "sub", "sup", "abbr"}
TEXT_OK_ATTRS = {"class", "id"}


def enc(attrs):
    return json.dumps(attrs, ensure_ascii=False, separators=(",", ":")).replace("--", "\\u002d\\u002d")


def cls(el):
    c = el.get("class")
    return " ".join(c) if isinstance(c, list) else (c or "")


def inner(el):
    return "".join(str(x) for x in el.contents)


def is_inline_only(el):
    """Nur Text + einfache Inline-Elemente (keine SVGs, Bilder, Buttons)."""
    for d in el.descendants:
        if isinstance(d, Tag):
            if d.name not in INLINE:
                return False
            if d.name == "a" and d.find(lambda t: isinstance(t, Tag) and t.name not in INLINE):
                return False
    return True


def html_block(s):
    s = s.strip()
    return f"<!-- wp:html -->\n{s}\n<!-- /wp:html -->" if s else ""


def text_block(el):
    """Absatz bzw. Überschrift (Tag bleibt erhalten)."""
    if set(el.attrs) - TEXT_OK_ATTRS or not is_inline_only(el):
        return None
    c, anchor = cls(el), el.get("id")
    if el.name in ("h1", "h2", "h3", "h4", "h5", "h6"):
        a = {"level": int(el.name[1])}
        if anchor: a["anchor"] = anchor
        if c: a["className"] = c
        classes = "wp-block-heading" + (" " + c if c else "")
        idattr = f' id="{anchor}"' if anchor else ""
        return f'<!-- wp:heading {enc(a)} -->\n<{el.name} class="{classes}"{idattr}>{inner(el)}</{el.name}>\n<!-- /wp:heading -->'
    if el.name == "p":
        a = {}
        if anchor: a["anchor"] = anchor
        if c: a["className"] = c
        attrs = (f' id="{anchor}"' if anchor else "") + (f' class="{c}"' if c else "")
        head = f"<!-- wp:paragraph {enc(a)} -->" if a else "<!-- wp:paragraph -->"
        return f"{head}\n<p{attrs}>{inner(el)}</p>\n<!-- /wp:paragraph -->"
    return None


def list_block(el):
    if set(el.attrs) - TEXT_OK_ATTRS:
        return None
    items = [c for c in el.children if not (isinstance(c, NavigableString) and not c.strip())]
    if not items or any(not isinstance(i, Tag) or i.name != "li" or i.attrs or not is_inline_only(i) for i in items):
        return None
    a = {}
    if el.name == "ol": a["ordered"] = True
    c = cls(el)
    if c: a["className"] = c
    classes = "wp-block-list" + (" " + c if c else "")
    lis = "\n".join(f"<!-- wp:list-item -->\n<li>{inner(i)}</li>\n<!-- /wp:list-item -->" for i in items)
    head = f"<!-- wp:list {enc(a)} -->" if a else "<!-- wp:list -->"
    return f'{head}\n<{el.name} class="{classes}">{lis}</{el.name}>\n<!-- /wp:list -->'


def link_paragraph(el):
    """Einzelner Link/Button -> Absatz mit Link (Text direkt editierbar)."""
    if el.name != "a" or el.find(lambda t: isinstance(t, Tag) and t.name not in INLINE | {"svg", "path", "circle"}):
        return None
    if el.find("svg"):
        return None
    return f"<!-- wp:paragraph -->\n<p>{str(el)}</p>\n<!-- /wp:paragraph -->"


def convert(el):
    if isinstance(el, Comment):
        return ""
    if isinstance(el, NavigableString):
        s = str(el).strip()
        return html_block(s) if s else ""
    for fn in (text_block,):
        r = fn(el)
        if r: return r
    if el.name in ("ul", "ol"):
        r = list_block(el)
        if r: return r
    if el.name in ("li", "dt", "dd") and not (set(el.attrs) - OK_GROUP_ATTRS) and is_inline_only(el):
        c = cls(el)
        a = {"className": c} if c else {}
        head = f"<!-- wp:paragraph {enc(a)} -->" if a else "<!-- wp:paragraph -->"
        return f'{head}\n<p{f" class={chr(34)}{c}{chr(34)}" if c else ""}>{inner(el)}</p>\n<!-- /wp:paragraph -->'
    r = link_paragraph(el)
    if r: return r
    if el.name in GROUP_TAGS | {"ul", "ol", "li", "dl", "dt", "dd"} and not (set(el.attrs) - OK_GROUP_ATTRS):
        kids = [k for k in el.children if not (isinstance(k, NavigableString) and not k.strip())]
        # Bereich mit nur Text (kein Absatz drin) -> als Absatz
        if kids and el.name == "div" and is_inline_only(el):
            c = cls(el)
            a = {"className": c} if c else {}
            head = f"<!-- wp:paragraph {enc(a)} -->" if a else "<!-- wp:paragraph -->"
            return f'{head}\n<p{f" class={chr(34)}{c}{chr(34)}" if c else ""}>{inner(el)}</p>\n<!-- /wp:paragraph -->'
        tag = el.name if el.name in GROUP_TAGS else "div"
        a = {}
        if tag != "div": a["tagName"] = tag
        anchor = el.get("id")
        if anchor: a["anchor"] = anchor
        c = cls(el)
        if c: a["className"] = c
        a["layout"] = {"type": "default"}
        classes = "wp-block-group" + (" " + c if c else "")
        idattr = f' id="{anchor}"' if anchor else ""
        body = "\n".join(x for x in (convert(k) for k in kids) if x)
        return f'<!-- wp:group {enc(a)} -->\n<{tag}{idattr} class="{classes}">{body}</{tag}>\n<!-- /wp:group -->'
    return html_block(str(el))


def to_blocks(html):
    soup = BeautifulSoup(html, "html.parser")
    root = soup.find("main")
    return convert(root)


if __name__ == "__main__":
    print(to_blocks(open(sys.argv[1]).read()))
