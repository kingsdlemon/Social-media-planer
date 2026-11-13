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

/**
 * Ruft `cb` bei der ersten Interaktion auf (Scrollen, Maus, Touch, Taste) – oder sofort, wenn es
 * schon eine gab. So laden Animations- und 3D-Bibliotheken erst, wenn jemand die Seite benutzt,
 * und blockieren den Seitenstart auf langsamen Geräten nicht.
 */
let interacted = false;
const INTERACTION_EVENTS = ["pointermove", "pointerdown", "touchstart", "wheel", "scroll", "keydown"] as const;
export function onFirstInteraction(cb: () => void): () => void {
  if (interacted) {
    cb();
    return () => {};
  }
  const fire = () => {
    interacted = true;
    remove();
    cb();
  };
  const remove = () => INTERACTION_EVENTS.forEach((e) => window.removeEventListener(e, fire, { capture: true }));
  INTERACTION_EVENTS.forEach((e) => window.addEventListener(e, fire, { capture: true, passive: true }));
  return remove;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** Läuft vor dem ersten Rendern: markiert <html> mit .motion-ok, wenn Animationen erlaubt sind. */
export const motionInitScript = `(function(){try{if(!window.matchMedia("${REDUCED_MOTION_QUERY}").matches)document.documentElement.classList.add("motion-ok");}catch(e){}})();`;
