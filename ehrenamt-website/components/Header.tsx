"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav } from "@/lib/site";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href.replace(/\/$/, ""));
}

export function Header() {
  const pathname = usePathname() ?? "/";
  const menu = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);

  // Menü ist ein natives <details>: funktioniert auch ohne JavaScript (z. B. im WordPress-Import).
  // Mit JavaScript: beim Seitenwechsel schließen, Escape schließt und gibt den Fokus zurück.
  useEffect(() => {
    if (menu.current) menu.current.open = false;
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !menu.current) return;
      menu.current.open = false;
      menu.current.querySelector("summary")?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const navLinks = mainNav.filter((item) => item.href !== "/aktiv-werden/");

  return (
    <>
    <header className="glass sticky top-0 z-50 shadow-[0_1px_0_rgba(0,0,0,0.06)] dark:shadow-[0_1px_0_rgba(255,255,255,0.08)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 min-[360px]:px-5 sm:px-8">
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
                    className={`rounded-full px-3 py-1.5 text-[0.95rem] whitespace-nowrap no-underline transition-colors ${
                      active
                        ? "text-ink font-medium dark:text-white"
                        : "text-ink/70 hover:text-ink dark:text-white/70 dark:hover:text-white"
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
            className="hidden min-h-10 items-center rounded-full bg-brand px-5 text-[0.95rem] font-medium whitespace-nowrap text-white no-underline transition-[background-color,scale] duration-200 hover:bg-[#0077ed] active:scale-[0.97] sm:inline-flex"
          >
            Aktiv werden
          </Link>
          <details ref={menu} className="menu xl:hidden" onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}>
            <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full px-3 text-base font-medium text-ink select-none dark:text-white [&::-webkit-details-marker]:hidden">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path className="menu-icon-open" d="M4 7h16M4 12h16M4 17h16" />
                <path className="menu-icon-close" d="M6 6l12 12M18 6 6 18" />
              </svg>
              <span className="menu-label-open">Menü</span>
              <span className="menu-label-close">Schließen</span>
            </summary>
            <div className="menu-sheet absolute inset-x-0 top-full h-[calc(100dvh-3.6rem)] overflow-y-auto bg-paper dark:bg-night overscroll-contain pb-24 shadow-[0_12px_30px_rgba(0,0,0,0.08)] sm:pb-0">
            <nav aria-label="Hauptnavigation (mobil)" className="mx-auto max-w-6xl px-5 pt-3 pb-6 sm:px-8">
              <ul className="grid grid-cols-1 gap-1">
                {mainNav.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex min-h-14 items-center rounded-2xl px-4 font-display text-3xl font-semibold tracking-tight no-underline ${
                          active
                            ? "text-ink dark:text-white"
                            : "text-ink/70 hover:text-ink dark:text-white/70 dark:hover:text-white"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 flex items-center justify-between gap-4 has-[button[hidden]]:hidden border-t border-black/5 pt-4 dark:border-white/10">
                <span className="text-base font-semibold">Darstellung</span>
                <ThemeToggle />
              </div>
            </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
      <div className="glass fixed inset-x-0 bottom-0 z-50 border-t border-black/5 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden dark:border-white/10">
        <Link
          href="/aktiv-werden/"
          aria-current={isActive(pathname, "/aktiv-werden/") ? "page" : undefined}
          className="flex min-h-13 items-center justify-center rounded-full bg-brand text-lg font-medium text-white no-underline active:scale-[0.98]"
        >
          Aktiv werden
        </Link>
      </div>
    </>
  );
}
