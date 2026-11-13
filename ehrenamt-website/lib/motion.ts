/** Gemeinsame Helfer für Animationen (GSAP wird nur bei Bedarf nachgeladen). */

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type GsapModules = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

let gsapPromise: Promise<GsapModules> | null = null;

export function loadGsap(): Promise<GsapModules> {
  gsapPromise ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
    g.gsap.registerPlugin(st.ScrollTrigger);
    return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
  });
  return gsapPromise;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * Läuft vor dem ersten Rendern: markiert <html> mit .motion-ok, wenn Animationen erlaubt sind.
 * Sicherheitsnetz: Ist GSAP nach 4 s nicht bereit (.motion-ready), wird alles wieder sichtbar.
 */
export const motionInitScript = `(function(){try{var d=document.documentElement;if(!window.matchMedia("${REDUCED_MOTION_QUERY}").matches){d.classList.add("motion-ok");setTimeout(function(){if(!d.classList.contains("motion-ready"))d.classList.remove("motion-ok");},4000);}}catch(e){}})();`;
