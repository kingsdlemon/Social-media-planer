import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

type Variant = "primary" | "secondary" | "ghost" | "inverse";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-[#0077ed] motion-safe:hover:scale-[1.02]",
  secondary: "bg-ink text-white hover:bg-black dark:bg-white dark:text-ink dark:hover:bg-mist",
  inverse: "bg-white text-ink hover:bg-mist",
  ghost: "text-brand-dark ring-1 ring-brand-dark/40 hover:bg-brand-dark hover:text-white dark:text-[#2997ff] dark:ring-[#2997ff]/50 dark:hover:bg-[#2997ff] dark:hover:text-black",
};

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-[1.05rem] font-medium no-underline " +
  "transition-[color,background-color,box-shadow,scale] duration-200 ease-out active:scale-[0.97] " +
  "[&_.icon-arrow]:transition-transform [&_.icon-arrow]:duration-200 motion-safe:hover:[&_.icon-arrow]:translate-x-0.5";

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
    <section className="bg-paper dark:bg-night">
      <Container className="pt-16 pb-12 text-center sm:pt-24 sm:pb-16">
        {eyebrow && <p className="mb-4 text-lg font-semibold text-ink-soft dark:text-white/60">{eyebrow}</p>}
        <h1 className="mx-auto max-w-4xl text-[2.6rem] sm:text-7xl">{title}</h1>
        {children && <div className="mx-auto mt-6 max-w-2xl text-xl text-ink-soft sm:text-2xl dark:text-white/70">{children}</div>}
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
    <section id={id} className={`py-12 sm:py-24 ${className}`}>
      <Container>
        {(title || intro) && (
          <div data-reveal>
            {title && <h2 className="text-4xl sm:text-6xl">{title}</h2>}
            {intro && <div className="mt-4 max-w-2xl text-xl text-ink-soft dark:text-white/70">{intro}</div>}
          </div>
        )}
        <div className={title || intro ? "mt-12" : ""}>{children}</div>
      </Container>
    </section>
  );
}

export function Card({ className = "", reveal = true, children }: { className?: string; reveal?: boolean; children: ReactNode }) {
  return (
    <div
      data-reveal={reveal ? "" : undefined}
      className={`rounded-[28px] bg-mist p-6 transition-[box-shadow,scale] duration-300 ease-out hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-12 dark:bg-night-raised ${className}`}
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
      className="my-2 block rounded-2xl border border-dashed border-line bg-mist px-4 py-3 text-base hyphens-auto text-ink-soft dark:border-white/20 dark:bg-night-raised dark:text-white/70"
    >
      <strong className="mr-1 font-semibold">TODO:</strong>
      {children}
    </span>
  );
}

export function DraftNotice({ children }: { children?: ReactNode }) {
  return (
    <div
      role="note"
      className="mb-10 rounded-[28px] bg-mist p-6 text-lg dark:bg-night-raised"
    >
      <p className="font-display text-xl font-semibold text-ink dark:text-white">Entwurf</p>
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
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon-${name} shrink-0 ${className}`}
    >
      {paths[name]}
    </svg>
  );
}

/** Apple-Style Textlink: „Mehr erfahren ›“ */
export function MoreLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-1 text-lg text-brand-dark no-underline hover:underline dark:text-[#2997ff] ${className}`}>
      {children}
      <span aria-hidden="true" className="transition-transform duration-200 motion-safe:group-hover:translate-x-0.5">›</span>
    </Link>
  );
}
