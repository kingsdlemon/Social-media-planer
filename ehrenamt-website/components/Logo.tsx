import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-3 no-underline ${className}`} aria-label="Ehrenamt für Darmstadt – zur Startseite">
      <span
        aria-hidden="true"
        className="grid size-12 shrink-0 place-items-center rounded-2xl bg-terracotta font-display text-lg font-bold text-white transition-transform group-hover:-rotate-6"
      >
        EfD
      </span>
      <span className="font-display text-lg leading-tight font-bold text-teal-dark sm:text-xl dark:text-cream">
        Ehrenamt
        <br />
        für Darmstadt
      </span>
    </Link>
  );
}
