/**
 * Erzeugt optimierte WebP-Versionen der Bilder in public/images/.
 * Aufruf: npm run images
 * Bilder werden nie vergrößert – ist das Original kleiner als die Zielbreite, bleibt die Originalbreite.
 */
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "images");

const jobs = [
  { input: "hero-bg.jpg", output: "hero-bg.webp", width: 1920, quality: 82 },
  { input: "ehrenamt-illustration.jpg", output: "ehrenamt-illustration.webp", width: 1200, quality: 85 },
];

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

for (const job of jobs) {
  const src = path.join(dir, job.input);
  const dest = path.join(dir, job.output);
  const info = await sharp(src)
    .rotate()
    .resize({ width: job.width, withoutEnlargement: true })
    .webp({ quality: job.quality, effort: 6 })
    .toFile(dest);
  const before = (await stat(src)).size;
  console.log(`${job.input} → ${job.output}: ${info.width}×${info.height}, ${kb(before)} → ${kb(info.size)}`);
}
