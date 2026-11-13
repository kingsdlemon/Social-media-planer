/**
 * Bildaufbereitung – Aufruf: npm run images
 *
 * 1. Logo:  assets/logo-quelle.jpg (weißer Hintergrund) → public/images/logo.png (transparent)
 *    Die beiden Logofarben (Blau, Schwarz) werden automatisch gemessen; jedes Pixel wird als
 *    Mischung aus Weiß und der passenden Logofarbe zerlegt → exakte Farben, weiche Kanten.
 * 2. Fotos/Grafiken → WebP (nie vergrößert). Optional `recolor`: Gradient-Map in die
 *    Markenfarben aus styles/globals.css (Helligkeit bleibt, Farbton wird ersetzt).
 */
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const imgDir = path.join(root, "public", "images");
const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

/* ---------- Farben aus globals.css ---------- */
const css = await readFile(path.join(root, "styles", "globals.css"), "utf8");
const theme = Object.fromEntries([...css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));
const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

/* ---------- OKLab (für weiche Farbverläufe) ---------- */
const toLin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toSrgb = (c) => 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.max(c, 0) ** (1 / 2.4) - 0.055);
function rgbToOklab([r, g, b]) {
  [r, g, b] = [r, g, b].map(toLin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
function oklabToRgb([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => Math.round(Math.min(255, Math.max(0, toSrgb(v)))));
}

/* ---------- 1. Logo freistellen ---------- */
async function makeLogo(input, output) {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = [];
  for (let i = 0; i < data.length; i += 3) px.push([data[i], data[i + 1], data[i + 2]]);

  const median = (arr) => [0, 1, 2].map((k) => arr.map((p) => p[k]).sort((a, b) => a - b)[arr.length >> 1]);
  const isBlue = (p) => Math.max(...p) > 150 && Math.max(...p) - Math.min(...p) > 120;
  // Nur Kernpixel (alle Nachbarn ebenfalls blau) – JPEG-Kanten verfälschen die Farbe
  const W = info.width;
  const core = px.filter((p, i) => {
    if (!isBlue(p)) return false;
    const x = i % W, y = (i / W) | 0;
    if (x < 1 || y < 1 || x >= W - 1 || y >= info.height - 1) return false;
    for (const d of [-W - 1, -W, -W + 1, -1, 1, W - 1, W, W + 1]) if (!isBlue(px[i + d])) return false;
    return true;
  });
  const measured = median(core);
  // Liegt die gemessene Farbe nah an der Markenfarbe, exakt diese verwenden (Logo = Website-Blau)
  const brand = hexToRgb(theme.brand);
  const blue = Math.hypot(...measured.map((c, k) => c - brand[k])) < 24 ? brand : measured;
  const black = median(px.filter((p) => Math.max(...p) < 40));
  const inks = [blue, black];

  const out = Buffer.alloc(info.width * info.height * 4);
  px.forEach((p, i) => {
    const v = p.map((c) => 255 - c); // Abstand zu Weiß
    let best = { t: 0, ink: inks[0], err: Infinity };
    for (const ink of inks) {
      const d = ink.map((c) => 255 - c);
      const t = Math.min(1, Math.max(0, (v[0] * d[0] + v[1] * d[1] + v[2] * d[2]) / (d[0] ** 2 + d[1] ** 2 + d[2] ** 2)));
      const err = Math.hypot(v[0] - t * d[0], v[1] - t * d[1], v[2] - t * d[2]);
      if (err < best.err) best = { t, ink, err };
    }
    let a = best.t < 0.08 ? 0 : best.t > 0.92 ? 1 : best.t; // JPEG-Rauschen weg, Flächen deckend
    out.set([...best.ink, Math.round(a * 255)], i * 4);
  });

  const trimmed = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer()
    .then((b) => sharp(b).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true }));
  const size = Math.round(Math.max(trimmed.info.width, trimmed.info.height) * 1.06);
  await sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: trimmed.data, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(output);

  const hex = (c) => "#" + c.map((x) => x.toString(16).padStart(2, "0")).join("").toUpperCase();
  console.log(`logo: ${path.basename(input)} → ${path.basename(output)} (${size}×${size}, Blau gemessen ${hex(measured)} → ${hex(blue)}, Schwarz ${hex(black)}, ${kb((await stat(output)).size)})`);
}

/* ---------- 2. WebP (+ optional Gradient-Map) ---------- */
function gradientMap(stops) {
  const labStops = stops.map(([pos, name]) => [pos, rgbToOklab(hexToRgb(theme[name]))]).sort((a, b) => a[0] - b[0]);
  return (rgb) => {
    const L = rgbToOklab(rgb)[0];
    if (L <= labStops[0][0]) return oklabToRgb(labStops[0][1]);
    for (let i = 1; i < labStops.length; i++) {
      const [p1, c1] = labStops[i];
      if (L <= p1) {
        const [p0, c0] = labStops[i - 1];
        const t = (L - p0) / (p1 - p0);
        return oklabToRgb(c0.map((v, k) => v + (c1[k] - v) * t));
      }
    }
    return oklabToRgb(labStops.at(-1)[1]);
  };
}

const jobs = [
  {
    input: "hero-bg.jpg",
    output: "hero-bg.webp",
    width: 1920,
    quality: 82,
    // Farbverlauf in Markenfarben: dunkel → brand-deep, mittel → brand-dark, hell → paper
    // (bewusst nicht das volle Logo-Blau: sonst gehen die blauen 3D-Objekte davor unter)
    recolor: [
      [0.3, "brand-deep"],
      [0.62, "brand-dark"],
      [0.95, "paper"],
    ],
  },
  { input: "ehrenamt-illustration.jpg", output: "ehrenamt-illustration.webp", width: 1200, quality: 85 },
];

await makeLogo(path.join(root, "assets", "logo-quelle.jpg"), path.join(imgDir, "logo.png"));

for (const job of jobs) {
  const src = path.join(imgDir, job.input);
  const dest = path.join(imgDir, job.output);
  let pipeline = sharp(src).rotate().resize({ width: job.width, withoutEnlargement: true });
  if (job.recolor) {
    const map = gradientMap(job.recolor);
    const { data, info } = await pipeline.removeAlpha().raw().toBuffer({ resolveWithObject: true });
    for (let i = 0; i < data.length; i += 3) data.set(map([data[i], data[i + 1], data[i + 2]]), i);
    pipeline = sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } });
  }
  const info = await pipeline.webp({ quality: job.quality, effort: 6 }).toFile(dest);
  const before = (await stat(src)).size;
  console.log(`${job.input} → ${job.output}: ${info.width}×${info.height}, ${kb(before)} → ${kb(info.size)}${job.recolor ? " (umgefärbt)" : ""}`);
}
