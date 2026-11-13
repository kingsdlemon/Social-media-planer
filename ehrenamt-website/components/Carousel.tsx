"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { prefersReducedMotion, project, rubberband, spring, type SpringHandle } from "@/lib/spring";

/**
 * Apple-Style Swipe-Karussell.
 *
 * - Touch (Handy/Tablet): natives Scrollen mit Scroll-Snap – das System liefert selbst
 *   1:1-Tracking, Schwung und Gummiband (auf dem iPhone exakt das iOS-Gefühl).
 * - Maus (Desktop): Ziehen mit 1:1-Tracking, Gummiband am Rand, beim Loslassen
 *   Momentum-Projektion → nächste Karte → Feder mit übergebener Wischgeschwindigkeit.
 * - Jede Bewegung ist unterbrechbar: erneut greifen stoppt die Feder an der aktuellen Position.
 * - Pfeile: Feder (kritisch gedämpft, kein Nachschwingen).
 * - „Bewegung reduzieren“: sofortiger Sprung statt Animation.
 */
export function Carousel({ label, children }: { label: string; children: ReactNode }) {
  const row = useRef<HTMLDivElement>(null);
  const anim = useRef<SpringHandle | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [ready, setReady] = useState(false);

  const update = useCallback(() => {
    const el = row.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth > el.scrollWidth - 8);
  }, []);

  /** Snap-Punkte = linke Kante jeder Karte (relativ zum Scroll-Padding) */
  const snapPoints = useCallback(() => {
    const el = row.current!;
    const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
    const max = el.scrollWidth - el.clientWidth;
    return Array.from(el.children).map((c) => Math.min(max, Math.max(0, (c as HTMLElement).offsetLeft - pad)));
  }, []);

  /** Feder auf scrollLeft; Snap währenddessen aus, sonst kämpft der Browser gegen die Feder */
  const springTo = useCallback((target: number, velocity = 0, dampingRatio = 1) => {
    const el = row.current;
    if (!el) return;
    anim.current?.stop();
    if (prefersReducedMotion()) {
      el.scrollLeft = target;
      return;
    }
    el.style.scrollSnapType = "none";
    anim.current = spring(
      el.scrollLeft,
      target,
      (x) => (el.scrollLeft = x),
      { dampingRatio, response: 0.4, velocity },
      () => {
        el.style.scrollSnapType = "";
        anim.current = null;
      },
    );
  }, []);

  useEffect(() => {
    setReady(true);
    update();
    const el = row.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    // --- Maus-Ziehen (Touch bleibt nativ) ---
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;
    let history: { x: number; t: number }[] = [];

    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      const v = anim.current?.stop(); // unterbrechen: ab aktueller Position weiter
      anim.current = null;
      void v;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      history = [{ x: e.clientX, t: e.timeStamp }];
      el.style.scrollSnapType = "none";
    };

    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!moved) {
        if (Math.abs(dx) < 10) return; // Hysterese: erst ab ~10px als Ziehen werten
        moved = true;
        el.setPointerCapture(e.pointerId);
        el.classList.add("is-dragging");
      }
      history.push({ x: e.clientX, t: e.timeStamp });
      if (history.length > 6) history.shift();
      const max = el.scrollWidth - el.clientWidth;
      const wanted = startScroll - dx;
      if (wanted < 0) {
        el.scrollLeft = 0;
        el.style.transform = `translateX(${rubberband(-wanted, el.clientWidth)}px)`;
      } else if (wanted > max) {
        el.scrollLeft = max;
        el.style.transform = `translateX(${-rubberband(wanted - max, el.clientWidth)}px)`;
      } else {
        el.scrollLeft = wanted;
        el.style.transform = "";
      }
    };

    const up = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove("is-dragging");
      if (!moved) {
        el.style.scrollSnapType = "";
        return;
      }
      // Geschwindigkeit aus den letzten Bewegungen (px/s, in Scroll-Richtung)
      const first = history[0];
      const lastP = history[history.length - 1];
      const dt = Math.max(1, lastP.t - first.t);
      const velocity = e.timeStamp - lastP.t > 80 ? 0 : (-(lastP.x - first.x) / dt) * 1000;

      // Gummiband zurückfedern lassen
      const offset = parseFloat(el.style.transform.replace(/[^-\d.]/g, "")) || 0;
      if (offset) {
        spring(offset, 0, (x) => (el.style.transform = x ? `translateX(${x}px)` : ""), { dampingRatio: 1, response: 0.35 });
      }

      // Momentum projizieren → nächste Karte am projizierten Endpunkt
      const projected = el.scrollLeft + project(velocity);
      const points = snapPoints();
      const target = points.reduce((a, b) => (Math.abs(b - projected) < Math.abs(a - projected) ? b : a), points[0] ?? 0);
      // Nachschwingen nur, weil vorher geworfen wurde
      springTo(target, velocity, Math.abs(velocity) > 300 ? 0.85 : 1);
    };

    // Klick auf Karte nach dem Ziehen verhindern
    const click = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("click", click, true);
    // Touch/Trackpad unterbricht laufende Feder sofort
    const interrupt = () => {
      if (anim.current) {
        anim.current.stop();
        anim.current = null;
        el.style.scrollSnapType = "";
      }
    };
    el.addEventListener("touchstart", interrupt, { passive: true });
    el.addEventListener("wheel", interrupt, { passive: true });

    return () => {
      anim.current?.stop();
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("click", click, true);
      el.removeEventListener("touchstart", interrupt);
      el.removeEventListener("wheel", interrupt);
    };
  }, [update, snapPoints, springTo]);

  const go = (dir: 1 | -1) => {
    const el = row.current;
    if (!el) return;
    const points = snapPoints();
    const cur = el.scrollLeft;
    const target =
      dir === 1 ? (points.find((p) => p > cur + 4) ?? points[points.length - 1]) : ([...points].reverse().find((p) => p < cur - 4) ?? 0);
    springTo(target);
  };

  const btn =
    "grid size-11 place-items-center rounded-full bg-mist text-ink transition-[background-color,opacity,scale] duration-100 ease-out hover:bg-line/70 active:scale-[0.92] disabled:opacity-35 disabled:hover:bg-mist dark:bg-night-raised dark:text-white";

  return (
    <div role="region" aria-roledescription="Karussell" aria-label={label} className="relative" data-reveal>
      <div ref={row} className="snap-row cursor-grab [&.is-dragging]:cursor-grabbing [&.is-dragging]:select-none" tabIndex={0}>
        {children}
      </div>
      {/* Pfeile nur mit JavaScript – ohne (WordPress-Import) wird einfach gewischt/gescrollt */}
      <div hidden={!ready} className="mx-auto flex max-w-6xl justify-end gap-3 px-5 sm:px-8">
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
  return <div className={`w-[82vw] max-w-[25rem] sm:w-[23rem] ${className}`}>{children}</div>;
}
