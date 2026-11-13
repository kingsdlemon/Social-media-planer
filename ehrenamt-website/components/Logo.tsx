import Link from "next/link";
import { site } from "@/lib/site";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-2 no-underline min-[360px]:gap-3 ${className}`} aria-label={`${site.name} – zur Startseite`}>
      {/* alt leer: Der Link ist über aria-label benannt. Im Dark Mode weißer Kreis, damit die schwarze Schrift lesbar bleibt. */}
      <img
        src={site.logo.src}
        alt=""
        width={site.logo.width}
        height={site.logo.height}
        className="size-10 shrink-0 rounded-full transition-transform duration-300 sm:size-11 dark:bg-white"
      />
      <span className="font-display text-base leading-tight font-semibold text-brand-deep min-[360px]:text-base sm:text-lg dark:text-paper">
        Ehrenamt
        <br />
        für Darmstadt
      </span>
    </Link>
  );
}
