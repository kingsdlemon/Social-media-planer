/**
 * Markenfarben für Canvas/WebGL. Quelle der Wahrheit ist das @theme in styles/globals.css;
 * die Werte hier sind nur Rückfall, falls die CSS-Variablen (noch) nicht verfügbar sind.
 */
export const brandFallback = {
  terracotta: "#C26B48",
  "terracotta-dark": "#A55333",
  "terracotta-light": "#E8B59E",
  cream: "#F6F1EA",
  "cream-dark": "#EAE0D2",
  teal: "#17565C",
  "teal-dark": "#0F3D42",
  "teal-light": "#4C878D",
  "teal-soft": "#DCE9EA",
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
