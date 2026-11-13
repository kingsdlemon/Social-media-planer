"use client";

import { useEffect, useState } from "react";
import { THEME_STORAGE_KEY as STORAGE_KEY } from "@/lib/theme";

type Theme = "system" | "light" | "dark";
const order: Theme[] = ["system", "light", "dark"];
const labels: Record<Theme, string> = { system: "Automatisch", light: "Hell", dark: "Dunkel" };

function readStored(): Theme {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

function apply(theme: Theme) {
  const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeToggle({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(readStored());
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (readStored() === "system") apply("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const cycle = () => {
    const next = order[(order.indexOf(theme ?? "system") + 1) % order.length];
    try {
      if (next === "system") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* Speichern nicht möglich – Einstellung gilt nur für diese Seite */
    }
    // Weicher Übergang hell↔dunkel (kein harter Helligkeitssprung), nicht bei „Bewegung reduzieren“
    const root = document.documentElement;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("theme-fade");
      window.setTimeout(() => root.classList.remove("theme-fade"), 300);
    }
    apply(next);
    setTheme(next);
  };

  const current = theme ?? "system";
  const next = order[(order.indexOf(current) + 1) % order.length];

  return (
    <button
      type="button"
      hidden={theme === null /* ohne JavaScript (z. B. WordPress-Import) nicht anzeigen */}
      onClick={cycle}
      className={`inline-flex min-h-10 items-center gap-2 rounded-full ${compact ? "w-10 justify-center" : "px-4 bg-mist dark:bg-night-raised"} text-base font-medium text-ink/70 hover:text-ink dark:text-white/70 dark:hover:text-white ${className}`}
      aria-label={`Darstellung: ${labels[current]}. Wechseln zu ${labels[next]}.`}
      title={`Darstellung: ${labels[current]}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6">
        {current === "light" ? (
          <>
            <circle cx="12" cy="12" r="4.5" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
          </>
        ) : current === "dark" ? (
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" strokeLinejoin="round" />
        ) : (
          <>
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 3.5v17a8.5 8.5 0 0 0 0-17z" fill="currentColor" />
          </>
        )}
      </svg>
      <span className={compact ? "sr-only" : undefined}>{labels[current]}</span>
    </button>
  );
}
