"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { mapPoints } from "./orte";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-ink-soft">Karte wird geladen …</div>,
});

/**
 * Interaktive Karte. Lädt OpenStreetMap erst nach Klick (Datenschutz: vorher keine Verbindung zu Dritten).
 */
export function EinsatzMap() {
  const [active, setActive] = useState(false);
  return (
    <div className="overflow-hidden rounded-[28px] bg-mist dark:bg-night-raised">
      <div className="relative h-[26rem] sm:h-[32rem]">
        {active ? (
          <LeafletMap />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-12 text-brand dark:text-[#2997ff]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            <p className="max-w-md text-lg text-ink-soft dark:text-white/70">
              {mapPoints.length} Orte auf der Karte. Beim Laden wird eine Verbindung zu OpenStreetMap hergestellt.
            </p>
            <button
              type="button"
              onClick={() => setActive(true)}
              className="inline-flex min-h-12 items-center rounded-full bg-brand px-6 text-[1.05rem] font-medium text-white transition-[background-color,scale] hover:bg-[#0077ed] active:scale-[0.97]"
            >
              Karte anzeigen
            </button>
          </div>
        )}
      </div>
      <ul className="flex flex-wrap gap-2 p-5 text-sm text-ink-soft dark:text-white/60">
        {mapPoints.map((p) => (
          <li key={p.name} className="rounded-full bg-paper px-3 py-1 dark:bg-night">
            {p.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
