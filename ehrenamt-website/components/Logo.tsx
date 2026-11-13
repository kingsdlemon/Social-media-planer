import Link from "next/link";
import { site } from "@/lib/site";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-3 no-underline ${className}`} aria-label={`${site.name} – zur Startseite`}>
      {/* alt leer: Der Link ist über aria-label benannt. Im Dark Mode weißer Kreis, damit die schwarze Schrift lesbar bleibt. */}
      <img
        src={site.logo.src}
        alt=""
        width={site.logo.width}
        height={site.logo.height}
        className="size-12 shrink-0 rounded-full transition-transform duration-300 motion-safe:group-hover:-rotate-6 sm:size-14 dark:bg-white"
      />
      <span className="font-display text-lg leading-tight font-bold text-brand-deep sm:text-xl dark:text-paper">
        Ehrenamt
        <br />
        für Darmstadt
      </span>
    </Link>
  );
}
