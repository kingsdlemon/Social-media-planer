/* Ehrenamt für Darmstadt – kleine Helfer fürs Theme (ohne Abhängigkeiten).
   Alles funktioniert auch ohne dieses Script; es macht nur Pfeile und Karte nutzbar. */
(function () {
	'use strict';

	/* Karussell-Pfeile: einblenden und mit dem Wisch-Bereich verbinden */
	function setupCarousels() {
		document.querySelectorAll('button[aria-label="Weiter"]').forEach(function (next) {
			var bar = next.parentElement;
			var prev = bar.querySelector('button[aria-label="Zurück"]');
			var root = bar.parentElement;
			var track = null;
			root.querySelectorAll('*').forEach(function (el) {
				if (track || bar.contains(el)) { return; }
				var ox = getComputedStyle(el).overflowX;
				if ((ox === 'auto' || ox === 'scroll') && el.scrollWidth > el.clientWidth) { track = el; }
			});
			if (!track || !prev) { return; }
			bar.hidden = false;
			function step() {
				var card = track.firstElementChild;
				var gap = parseFloat(getComputedStyle(track).columnGap) || 16;
				return card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
			}
			function update() {
				prev.disabled = track.scrollLeft <= 2;
				next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
			}
			var smooth = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
			prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: smooth }); });
			next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: smooth }); });
			track.addEventListener('scroll', update, { passive: true });
			window.addEventListener('resize', update);
			update();
		});
	}

	/* Karte erst nach Klick laden (Datenschutz: vorher keine Verbindung zu OpenStreetMap) */
	function loadLeaflet(base, done) {
		if (window.L) { done(); return; }
		var css = document.createElement('link');
		css.rel = 'stylesheet'; css.href = base + 'leaflet.css';
		document.head.appendChild(css);
		var js = document.createElement('script');
		js.src = base + 'leaflet.js'; js.onload = done;
		document.head.appendChild(js);
	}

	function setupMap() {
		var cfg = window.EFD_THEME || {};
		document.querySelectorAll('button').forEach(function (btn) {
			if (btn.textContent.trim() !== 'Karte anzeigen') { return; }
			btn.addEventListener('click', function () {
				var box = btn.closest('.relative') || btn.parentElement;
				btn.disabled = true; btn.textContent = 'Karte wird geladen …';
				loadLeaflet(cfg.leaflet, function () {
					box.innerHTML = '';
					var el = document.createElement('div');
					el.style.cssText = 'position:absolute;inset:0;z-index:0';
					el.setAttribute('role', 'region');
					el.setAttribute('aria-label', 'Karte der Einsatzorte');
					box.appendChild(el);
					var map = L.map(el, { scrollWheelZoom: false }).setView([49.873, 8.66], 14);
					L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
						maxZoom: 19,
						attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
					}).addTo(map);
					var dot = L.divIcon({
						className: '',
						html: '<span style="display:block;width:18px;height:18px;border-radius:9999px;background:#0071e3;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3)"></span>',
						iconSize: [18, 18], iconAnchor: [9, 9]
					});
					(cfg.orte || []).forEach(function (o) {
						var html = '<strong>' + o.name + '</strong>';
						if (o.anchor) { html += '<br><a href="#' + o.anchor + '">Mehr erfahren ›</a>'; }
						L.marker([o.lat, o.lng], { icon: dot, title: o.name }).addTo(map).bindPopup(html);
					});
				});
			});
		});
	}

	function init() { setupCarousels(); setupMap(); }
	if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
