"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Apple-Style Swipe-Karussell.
 * Handy/Tablet: mit dem Finger wischen (natives Scroll-Snap, kein JS nötig).
 * Desktop: Pfeil-Buttons unten rechts. Tastatur: Tab durch die Karten, Pfeiltasten scrollen.
 */
export function Carousel({ label, children }: { label: string; children: ReactNode }) {
  const row = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = row.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth > el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    update();
    const el = row.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const go = (dir: 1 | -1) => {
    const el = row.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  };

  const btn =
    "grid size-11 place-items-center rounded-full bg-mist text-ink transition-[background-color,opacity] duration-200 hover:bg-line/70 disabled:opacity-35 disabled:hover:bg-mist dark:bg-night-raised dark:text-white";

  return (
    <div role="region" aria-roledescription="Karussell" aria-label={label} className="relative" data-reveal>
      <div ref={row} className="snap-row" tabIndex={0}>
        {children}
      </div>
      <div className="mx-auto flex max-w-6xl justify-end gap-3 px-5 sm:px-8">
        <button type="button" className={btn} onClick={() => go(-1)} disabled={atStart} aria-label="Zurück">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button type="button" className={btn} onClick={() => go(1)} disabled={atEnd} aria-label="Weiter">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/** Einzelne Karte im Karussell – feste, responsive Breite */
export function Slide({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`w-[82vw] max-w-[25rem] sm:w-[23rem] ${className}`}>
      {children}
    </div>
  );
}
