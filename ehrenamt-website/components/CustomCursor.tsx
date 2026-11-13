"use client";

import { useEffect, useRef, useState } from "react";
import { loadGsap } from "@/lib/motion";

/**
 * Eigener Cursor – nur auf Geräten mit Maus/Trackpad und nur ohne „Bewegung reduzieren“.
 *
 * Ein Ring folgt der Maus mit leichter Verzögerung und wird über Links und Buttons größer.
 * Der System-Mauszeiger bleibt bewusst sichtbar: Viele ältere Menschen nutzen vergrößerte
 * oder kontrastreiche Zeiger aus den Bedienungshilfen ihres Betriebssystems. Wer ihn
 * trotzdem ausblenden möchte, setzt HIDE_NATIVE_CURSOR auf true (dann erscheint zusätzlich ein Punkt).
 */
const HIDE_NATIVE_CURSOR = false;

const ENABLE_QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const INTERACTIVE = "a, button, [role='button'], summary, label, select, [data-cursor='link']";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(ENABLE_QUERY);
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    const root = document.documentElement;

    loadGsap().then(({ gsap }) => {
      const ring = ringRef.current;
      const dot = dotRef.current;
      if (cancelled || !ring) return;

      if (HIDE_NATIVE_CURSOR) root.classList.add("has-custom-cursor");

      const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
      const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });
      let visible = false;

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        if (!visible) {
          gsap.set(ring, { x: e.clientX, y: e.clientY });
          visible = true;
          ring.dataset.visible = "true";
          if (dot) dot.dataset.visible = "true";
        }
        ringX(e.clientX);
        ringY(e.clientY);
        if (dot) gsap.set(dot, { x: e.clientX, y: e.clientY });
      };
      const onOver = (e: PointerEvent) => {
        const target = e.target as Element | null;
        ring.dataset.hover = target?.closest(INTERACTIVE) ? "true" : "false";
      };
      const onDown = () => (ring.dataset.pressed = "true");
      const onUp = () => (ring.dataset.pressed = "false");
      const onLeave = () => {
        visible = false;
        ring.dataset.visible = "false";
        if (dot) dot.dataset.visible = "false";
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerover", onOver, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);

      cleanup = () => {
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerover", onOver);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        root.classList.remove("has-custom-cursor");
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <div
        ref={ringRef}
        data-visible="false"
        className="absolute top-0 left-0 -mt-5 -ml-5 size-10 rounded-full border-2 border-terracotta opacity-0 transition-[opacity,scale,background-color,border-color] duration-300 ease-out data-[hover=true]:scale-150 data-[hover=true]:border-terracotta-dark data-[hover=true]:bg-terracotta/15 data-[pressed=true]:scale-90 data-[visible=true]:opacity-100 dark:border-terracotta-light dark:data-[hover=true]:border-terracotta-light dark:data-[hover=true]:bg-terracotta-light/15"
      />
      {HIDE_NATIVE_CURSOR && (
        <div
          ref={dotRef}
          data-visible="false"
          className="absolute top-0 left-0 -mt-1.5 -ml-1.5 size-3 rounded-full bg-terracotta-dark opacity-0 data-[visible=true]:opacity-100 dark:bg-terracotta-light"
        />
      )}
    </div>
  );
}
