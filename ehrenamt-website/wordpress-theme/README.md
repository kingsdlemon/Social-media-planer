# WordPress-Theme bauen

Erzeugt aus dem statischen Export (`out/`) ein WordPress-Block-Theme mit allen Seiten als native Blöcke.

```bash
npm run build                       # erzeugt out/
python3 wordpress-theme/build_theme.py   # erzeugt /tmp/ehrenamt-darmstadt-theme.zip
```

Installation: WordPress → Design → Themes → Theme hochladen → aktivieren. Beim Aktivieren werden alle Seiten angelegt,
Startseite und Permalinks gesetzt. Bei neuer Inhaltsversion `EFD_CONTENT_VERSION` in `build_theme.py` erhöhen.
