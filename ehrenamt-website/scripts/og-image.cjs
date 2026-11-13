/**
 * Erzeugt das Vorschaubild für soziale Netzwerke: public/og-image.png (1200×630).
 * Aufruf: node scripts/og-image.cjs
 * Benötigt Playwright mit Chromium (einmalig: npm i -D playwright && npx playwright install chromium).
 * Farben kommen aus styles/globals.css, Schriften aus node_modules, Logo aus public/images/logo.png.
 */
const fs = require("node:fs");
const path = require("node:path");

let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error("Playwright fehlt: npm i -D playwright && npx playwright install chromium");
  process.exit(1);
}

const root = path.join(__dirname, "..");
const css = fs.readFileSync(path.join(root, "styles/globals.css"), "utf8");
const c = Object.fromEntries([...css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));
const b64 = (p) => fs.readFileSync(path.join(root, p)).toString("base64");
const fraunces = b64("node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2");
const atkinson = b64("node_modules/@fontsource-variable/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-wght-normal.woff2");
const logo = b64("public/images/logo.png");

const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
@font-face{font-family:F;src:url(data:font/woff2;base64,${fraunces}) format("woff2");font-weight:100 900}
@font-face{font-family:A;src:url(data:font/woff2;base64,${atkinson}) format("woff2");font-weight:200 800}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;background:${c["brand-deep"]};font-family:A,sans-serif;position:relative}
.glow{position:absolute;border-radius:50%;filter:blur(70px);opacity:.55}
.g1{width:520px;height:520px;background:${c.brand};right:-140px;top:-170px}
.g2{width:420px;height:420px;background:${c["brand-dark"]};left:-120px;bottom:-200px;opacity:.7}
.wrap{position:relative;display:flex;align-items:center;gap:64px;height:100%;padding:0 84px}
.seal{flex:none;width:300px;height:300px;border-radius:50%;background:#fff;display:grid;place-items:center;box-shadow:0 24px 60px rgba(0,0,0,.35)}
.seal img{width:270px;height:270px}
.eyebrow{font-weight:700;letter-spacing:.14em;text-transform:uppercase;font-size:24px;color:${c["brand-light"]}}
h1{font-family:F,serif;font-weight:700;font-size:76px;line-height:1.02;letter-spacing:-.01em;color:${c.paper};margin-top:18px}
h1 span{color:${c.brand}}
.sub{margin-top:26px;font-size:28px;line-height:1.35;color:${c["brand-soft"]}}
.bar{width:96px;height:8px;border-radius:4px;background:${c.brand};margin-top:30px}
</style></head><body><div class="glow g1"></div><div class="glow g2"></div>
<div class="wrap"><div class="seal"><img src="data:image/png;base64,${logo}" alt=""></div>
<div><p class="eyebrow">Ehrenamt für Darmstadt e.V. · seit 1994</p>
<h1>Wir helfen, wenn es um <span>Kultur</span> geht.</h1>
<p class="sub">Ehrenamtliche für rund 40 Kultureinrichtungen in Darmstadt</p><div class="bar"></div></div></div></body></html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);
  const out = path.join(root, "public/og-image.png");
  await page.screenshot({ path: out });
  await browser.close();
  console.log(`og-image.png geschrieben (${(fs.statSync(out).size / 1024).toFixed(0)} KB)`);
})();
