import { MusicNotesIcon, OpenBookIcon, PaintbrushIcon, TheaterMaskIcon } from "@/components/CultureIcons";

/**
 * Statisches Gegenstück zur 3D-Szene: dieselben vier Kultur-Objekte als ruhige Komposition.
 * Wird angezeigt bei „Bewegung reduzieren“, ohne WebGL und solange die 3D-Szene lädt.
 */
export function HeroStatic({ className = "" }: { className?: string }) {
  const tile = "absolute grid place-items-center rounded-[28%] shadow-xl shadow-teal-dark/20";
  return (
    <div className={`absolute inset-0 ${className}`}>
      <div className={`${tile} top-[6%] left-[8%] size-28 -rotate-8 bg-terracotta text-cream sm:size-32 lg:top-[14%] lg:left-[10%] lg:size-44`}>
        <TheaterMaskIcon className="size-[58%]" />
      </div>
      <div className={`${tile} top-[18%] right-[10%] size-20 rotate-10 bg-terracotta-light text-teal-dark sm:size-24 lg:top-[22%] lg:right-[8%] lg:size-32`}>
        <MusicNotesIcon className="size-[58%]" />
      </div>
      <div className={`${tile} bottom-[8%] left-[38%] size-24 rotate-6 bg-teal-light text-cream sm:size-28 lg:bottom-[18%] lg:left-[18%] lg:size-36`}>
        <OpenBookIcon className="size-[58%]" />
      </div>
      <div className={`${tile} right-[4%] bottom-[14%] size-16 -rotate-12 bg-cream text-terracotta-dark sm:size-20 lg:right-[14%] lg:bottom-[22%] lg:size-28`}>
        <PaintbrushIcon className="size-[58%]" />
      </div>
    </div>
  );
}
