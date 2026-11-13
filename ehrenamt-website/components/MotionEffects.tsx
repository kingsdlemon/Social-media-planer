"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { loadGsap, onFirstInteraction, REDUCED_MOTION_QUERY } from "@/lib/motion";

/**
 * Scroll-Animationen für die ganze Website (eingebunden im Root-Layout):
 *
 * - [data-reveal]            → blendet beim Hineinscrollen ein und gleitet nach oben
 * - [data-parallax="0.1"]    → Parallax; Wert = Verschiebung relativ zur Elementhöhe.
 *                              Bezugsrahmen ist das nächste [data-parallax-root].
 * - [data-countup]           → zählt hoch (siehe components/CountUp.tsx)
 *
 * GSAP lädt erst bei der ersten Interaktion. Was beim Start schon sichtbar ist, wird nie versteckt –
 * eingeblendet werden nur Elemente weiter unten (kein Aufblitzen, schnelles Largest Contentful Paint).
 *
 * Bei „Bewegung reduzieren“ passiert nichts – alle Inhalte stehen statisch da.
 * Wechselt die Einstellung zur Laufzeit, räumt gsap.matchMedia alles auf.
 */
export function MotionEffects() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    let revert: (() => void) | undefined;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    const stopWaiting = onFirstInteraction(() => loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      const root = document.documentElement;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        root.classList.add("motion-ok");
        setupReveal(gsap, ScrollTrigger);
        setupParallax(gsap);
        const finishCountUps = setupCountUps(gsap);
        return () => finishCountUps();
      });

      mm.add(REDUCED_MOTION_QUERY, () => {
        root.classList.remove("motion-ok");
      });

      // Nach dem Laden von Schriften verschieben sich Höhen minimal → Positionen neu berechnen
      document.fonts?.ready.then(() => !cancelled && ScrollTrigger.refresh());
      revert = () => mm.revert();
    }));

    return () => {
      cancelled = true;
      stopWaiting();
      revert?.();
    };
  }, [pathname]);

  return null;
}

type Gsap = Awaited<ReturnType<typeof loadGsap>>["gsap"];
type ST = Awaited<ReturnType<typeof loadGsap>>["ScrollTrigger"];

function setupReveal(gsap: Gsap, ScrollTrigger: ST) {
  // Bereits (teilweise) sichtbare Elemente bleiben, wie sie sind
  const elements = gsap.utils.toArray<HTMLElement>("[data-reveal]:not([data-revealed])").filter((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.setAttribute("data-revealed", "");
      return false;
    }
    return true;
  });
  if (!elements.length) return;

  gsap.set(elements, { opacity: 0, y: 28 });

  const reveal = (batch: Element[]) => {
    const pending = batch.filter((el) => !el.hasAttribute("data-revealed"));
    if (!pending.length) return;
    gsap.to(pending, {
      opacity: 1,
      y: 0,
      duration: 0.75,
      ease: "power2.out",
      stagger: 0.08,
      overwrite: true,
      onComplete() {
        for (const el of pending) {
          el.setAttribute("data-revealed", "");
          gsap.set(el, { clearProps: "opacity,transform" });
        }
      },
    });
  };

  ScrollTrigger.batch(elements, {
    start: "top 92%",
    // onLeave fängt Elemente ab, die per Sprunglink oder beim Neuladen übersprungen wurden
    onEnter: reveal,
    onLeave: reveal,
    onEnterBack: reveal,
  });
}

function setupParallax(gsap: Gsap) {
  for (const el of gsap.utils.toArray<HTMLElement>("[data-parallax]")) {
    const amount = Number(el.dataset.parallax) || 0.1;
    const container = el.closest<HTMLElement>("[data-parallax-root]") ?? el.parentElement ?? el;
    // Steht der Bereich beim Laden schon im Bild (z. B. Hero), startet der Effekt bei 0
    const visibleOnLoad = container.getBoundingClientRect().top < window.innerHeight;
    gsap.fromTo(
      el,
      { yPercent: visibleOnLoad ? 0 : -amount * 100 },
      {
        yPercent: amount * 100,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: visibleOnLoad ? 0 : "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      },
    );
  }
}

function setupCountUps(gsap: Gsap) {
  const items = gsap.utils.toArray<HTMLElement>("[data-countup]").map((el) => {
    const to = Number(el.dataset.countup);
    const from = Number(el.dataset.countupFrom ?? 0);
    const nf = new Intl.NumberFormat("de-DE", { useGrouping: el.dataset.countupGrouping !== "false" });
    const format = (n: number) => `${el.dataset.countupPrefix ?? ""}${nf.format(Math.round(n))}${el.dataset.countupSuffix ?? ""}`;
    return { el, to, from, format };
  });

  for (const { el, to, from, format } of items) {
    // Schon deutlich sichtbare Zahlen nicht zurücksetzen (sonst springt der Wert sichtbar)
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) continue;
    const state = { value: from };
    el.textContent = format(from);
    gsap.to(state, {
      value: to,
      duration: 2.2,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = format(state.value);
      },
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  }

  // Beim Aufräumen immer den Endwert stehen lassen
  return () => {
    for (const { el, to, format } of items) el.textContent = format(to);
  };
}
