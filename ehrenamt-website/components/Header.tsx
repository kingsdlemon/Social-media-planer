"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { mainNav } from "@/lib/site";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href.replace(/\/$/, ""));
}

export function Header() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const menuId = useId();

  // Menü schließen, wenn die Seite wechselt oder Escape gedrückt wird
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const navLinks = mainNav.filter((item) => item.href !== "/aktiv-werden/");

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-mist bg-paper/95 backdrop-blur dark:border-night-raised dark:bg-night/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3 sm:px-8">
        <Logo />

        <nav aria-label="Hauptnavigation" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full px-3 py-2 text-lg font-bold whitespace-nowrap no-underline transition-colors ${
                      active
                        ? "bg-brand-soft text-brand-deep dark:bg-brand-deep dark:text-paper"
                        : "text-ink hover:bg-mist dark:text-paper dark:hover:bg-night-raised"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden xl:block">
            <ThemeToggle compact />
          </div>
          {/* Ab Tablet-Breite im Header, auf dem Handy als feste Leiste unten */}
          <Link
            href="/aktiv-werden/"
            aria-current={isActive(pathname, "/aktiv-werden/") ? "page" : undefined}
            className="hidden min-h-12 items-center rounded-full bg-brand px-6 text-lg font-bold whitespace-nowrap text-brand-deep no-underline shadow-sm transition-[background-color,color,box-shadow,translate] duration-200 hover:bg-brand-light hover:shadow-lg motion-safe:hover:-translate-y-0.5 sm:inline-flex"
          >
            Aktiv werden
          </Link>
          <button
            type="button"
            className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-brand-dark px-4 text-base font-bold text-brand-dark xl:hidden dark:border-brand-soft dark:text-brand-soft"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((o) => !o)}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
            <span>{open ? "Schließen" : "Menü"}</span>
          </button>
        </div>
      </div>

      <div id={menuId} hidden={!open} className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain border-t border-mist pb-24 sm:pb-0 xl:hidden dark:border-night-raised">
        <nav aria-label="Hauptnavigation (mobil)" className="mx-auto max-w-6xl px-5 pt-3 pb-6 sm:px-8">
          <ul className="grid grid-cols-1 gap-1">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-14 items-center rounded-2xl px-4 font-display text-2xl font-bold no-underline ${
                      active
                        ? "bg-brand-soft text-brand-deep dark:bg-brand-deep dark:text-paper"
                        : "text-brand-deep hover:bg-mist dark:text-paper dark:hover:bg-night-raised"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex items-center justify-between gap-4 border-t border-mist pt-4 dark:border-night-raised">
            <span className="text-base font-bold">Darstellung</span>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-mist bg-paper/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:hidden dark:border-night-raised dark:bg-night/95">
        <Link
          href="/aktiv-werden/"
          aria-current={isActive(pathname, "/aktiv-werden/") ? "page" : undefined}
          className="flex min-h-14 items-center justify-center rounded-full bg-brand text-xl font-bold text-brand-deep no-underline shadow-md hover:bg-brand-light"
        >
          Aktiv werden
        </Link>
      </div>
    </>
  );
}
