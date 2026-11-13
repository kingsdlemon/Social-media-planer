"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { onFirstInteraction, REDUCED_MOTION_QUERY } from "@/lib/motion";
import { HeroStatic } from "./HeroStatic";

// Three.js & Co. erst laden, wenn die Szene wirklich gebraucht wird (eigenes JS-Paket)
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const SIMPLE_QUERY = "(max-width: 1023px), (pointer: coarse)";

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Dekorativer 3D-Bereich im Hero.
 * - Bei „Bewegung reduzieren“ oder ohne WebGL: statisches Bild (HeroStatic)
 * - Sonst wird die Szene nachgeladen, sobald jemand mit der Seite interagiert (Maus, Scrollen, Touch),
 *   der Bereich sichtbar ist und der Browser Zeit hat – bis dahin steht das statische Bild da
 * - Handys/Tablets bekommen eine vereinfachte Szene
 * - Außerhalb des Sichtbereichs wird nicht gerendert (spart Akku)
 */
export function Hero3D() {
  const ref = useRef<HTMLDivElement>(null);
  const [allowed, setAllowed] = useState(false);
  const [simplified, setSimplified] = useState(true);
  const [inView, setInView] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [interacted, setInteracted] = useState(false);

  useEffect(() => onFirstInteraction(() => setInteracted(true)), []);

  useEffect(() => {
    const reduce = window.matchMedia(REDUCED_MOTION_QUERY);
    const simple = window.matchMedia(SIMPLE_QUERY);
    const webgl = supportsWebGL();
    const update = () => {
      setAllowed(webgl && !reduce.matches);
      setSimplified(simple.matches);
    };
    update();
    reduce.addEventListener("change", update);
    simple.addEventListener("change", update);
    return () => {
      reduce.removeEventListener("change", update);
      simple.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!allowed || !inView || !interacted || shouldLoad) return;
    const start = () => setShouldLoad(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 300);
    return () => clearTimeout(id);
  }, [allowed, inView, interacted, shouldLoad]);

  const show3D = allowed && shouldLoad && ready;

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none relative size-full select-none">
      <HeroStatic className={`transition-opacity duration-700 ${show3D ? "opacity-0" : "opacity-100"}`} />
      {allowed && shouldLoad && (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
          <HeroScene simplified={simplified} active={inView} onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}
