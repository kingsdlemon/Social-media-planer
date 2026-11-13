import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

type Variant = "primary" | "secondary" | "ghost" | "inverse";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-brand-deep hover:bg-brand-light shadow-sm shadow-brand-deep/20",
  secondary:
    "bg-brand-dark text-white hover:bg-brand-deep dark:bg-brand-soft dark:text-brand-deep dark:hover:bg-white",
  inverse: "bg-white text-brand-deep hover:bg-brand-soft",
  ghost:
    "border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white dark:border-brand-soft dark:text-brand-soft dark:hover:bg-brand-soft dark:hover:text-brand-deep",
};

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-lg font-bold no-underline " +
  "transition-[color,background-color,border-color,box-shadow,translate,scale] duration-200 ease-out " +
  "hover:shadow-lg hover:shadow-brand-deep/15 motion-safe:hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] " +
  "[&_.icon-arrow]:transition-transform [&_.icon-arrow]:duration-200 motion-safe:hover:[&_.icon-arrow]:translate-x-1";

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

/** Für externe Links, mailto:, tel: und Downloads */
export function ButtonA({ variant = "primary", className = "", ...props }: ComponentProps<"a"> & { variant?: Variant }) {
  return <a className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function PageHero({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <section className="border-b border-mist bg-mist/40 dark:border-night-raised dark:bg-night-raised/40">
      <Container className="py-14 sm:py-20">
        {eyebrow && (
          <p className="mb-4 text-base font-bold uppercase tracking-[0.14em] text-brand-dark dark:text-brand-light">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-4xl text-4xl sm:text-6xl">{title}</h1>
        {children && <div className="mt-6 max-w-3xl text-xl text-ink-soft sm:text-2xl dark:text-paper/80">{children}</div>}
      </Container>
    </section>
  );
}

export function Section({
  id,
  title,
  intro,
  className = "",
  children,
}: {
  id?: string;
  title?: string;
  intro?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`py-14 sm:py-20 ${className}`}>
      <Container>
        {(title || intro) && (
          <div data-reveal>
            {title && <h2 className="text-3xl sm:text-5xl">{title}</h2>}
            {intro && <div className="mt-4 max-w-3xl text-xl text-ink-soft dark:text-paper/80">{intro}</div>}
          </div>
        )}
        <div className={title || intro ? "mt-10" : ""}>{children}</div>
      </Container>
    </section>
  );
}

export function Card({ className = "", reveal = true, children }: { className?: string; reveal?: boolean; children: ReactNode }) {
  return (
    <div
      data-reveal={reveal ? "" : undefined}
      className={`rounded-3xl border border-mist bg-white p-6 transition-[border-color,box-shadow] duration-300 hover:border-brand-light hover:shadow-xl hover:shadow-brand-deep/10 sm:p-8 dark:border-brand-deep dark:bg-night-raised dark:hover:border-brand dark:hover:shadow-black/30 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Sichtbare Markierung für fehlende Informationen.
 * Alle Stellen lassen sich im Code über „TODO“ finden.
 */
export function Todo({ children }: { children: ReactNode }) {
  return (
    <span
      role="note"
      className="my-2 block rounded-xl border-2 border-dashed border-brand bg-brand-light/25 px-4 py-3 text-base hyphens-auto text-brand-dark dark:bg-brand/10 dark:text-brand-light"
    >
      <strong className="mr-1 font-bold">TODO:</strong>
      {children}
    </span>
  );
}

export function DraftNotice({ children }: { children?: ReactNode }) {
  return (
    <div
      role="note"
      className="mb-10 rounded-2xl border-2 border-brand bg-brand-light/30 p-5 text-lg dark:bg-brand/15"
    >
      <p className="font-display text-xl font-bold text-brand-dark dark:text-brand-light">Entwurf</p>
      <p className="mt-1">
        {children ??
          "Dieser Text ist ein Entwurf und wurde noch nicht rechtlich geprüft. Bitte vor der Veröffentlichung vom Vorstand freigeben und ggf. juristisch prüfen lassen."}
      </p>
    </div>
  );
}

export function Icon({ name, className = "size-6" }: { name: "arrow" | "mail" | "phone" | "pin" | "download" | "heart" | "external"; className?: string }) {
  const paths: Record<string, ReactNode> = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    phone: (
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    ),
    pin: (
      <>
        <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </>
    ),
    download: <path d="M12 4v11m-5-5 5 5 5-5M5 20h14" />,
    heart: <path d="M12 20s-7.5-4.6-9.2-9.4A4.8 4.8 0 0 1 12 6.8a4.8 4.8 0 0 1 9.2 3.8C19.5 15.4 12 20 12 20z" />,
    external: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  };
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon-${name} shrink-0 ${className}`}
    >
      {paths[name]}
    </svg>
  );
}
