/**
 * Markenfarben für Canvas/WebGL. Quelle der Wahrheit ist das @theme in styles/globals.css;
 * die Werte hier sind nur Rückfall, falls die CSS-Variablen (noch) nicht verfügbar sind.
 */
export const brandFallback = {
  brand: "#0AB3EF",
  "brand-light": "#9FDAFA",
  "brand-soft": "#E8F6FE",
  "brand-dark": "#046F95",
  "brand-deep": "#012E41",
  paper: "#F8FBFC",
  mist: "#DDE4E8",
  ink: "#1C2327",
  night: "#05161F",
} as const;

export type BrandColorName = keyof typeof brandFallback;
export type BrandColors = Record<BrandColorName, string>;

export function readBrandColors(): BrandColors {
  const result = { ...brandFallback } as BrandColors;
  if (typeof window === "undefined") return result;
  const styles = getComputedStyle(document.documentElement);
  for (const name of Object.keys(brandFallback) as BrandColorName[]) {
    const value = styles.getPropertyValue(`--color-${name}`).trim();
    if (/^#[0-9a-f]{3,8}$/i.test(value)) result[name] = value;
  }
  return result;
}
