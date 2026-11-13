import Link from "next/link";
import { kategorien } from "@/content/einsatzorte";
import { CultureIcon, type CultureIconName } from "./CultureIcons";

/**
 * Bento-Übersicht der Einsatzbereiche.
 * Layout ab lg (4 Spalten):
 *   [ Museen (2×2) ][ Archive (2)          ]
 *   [              ][ Musik ][ Parks       ]
 *   [ Bildung (2)  ][ Alle Einsatzorte (2) ]
 */
const layout: Record<string, string> = {
  "museen-shops": "sm:col-span-2 lg:row-span-2",
  "archive-sammlungen": "lg:col-span-2",
  "musik-veranstaltungen": "",
  "parks-denkmaeler": "",
  soziales: "lg:col-span-2",
};

const tileBase =
  "group flex h-full flex-col rounded-3xl p-6 no-underline sm:p-8 focus-visible:outline-offset-4 " +
  "transition-[background-color,border-color,box-shadow,translate] duration-300 ease-out " +
  "hover:shadow-2xl hover:shadow-brand-deep/15 motion-safe:hover:-translate-y-1.5 dark:hover:shadow-black/40";

function IconBadge({ name, featured }: { name: CultureIconName; featured?: boolean }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-2xl transition-transform duration-300 motion-safe:group-hover:-rotate-6 motion-safe:group-hover:scale-110 ${
        featured
          ? "size-20 bg-white/10 text-brand-light"
          : "size-16 bg-brand-soft text-brand-dark dark:bg-brand-deep dark:text-brand-soft"
      }`}
    >
      <CultureIcon name={name} size={featured ? 44 : 34} />
    </span>
  );
}

export function EinsatzBento({ headingLevel = "h3", linkToSections = true }: { headingLevel?: "h2" | "h3"; linkToSections?: boolean }) {
  const Heading = headingLevel;
  const href = (id: string) => (linkToSections ? `/einsatzorte/#${id}` : `#${id}`);

  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {kategorien.map((k) => {
        const featured = k.id === "museen-shops";
        return (
          <li key={k.id} data-reveal className={layout[k.id] ?? ""}>
            <Link
              href={href(k.id)}
              className={`${tileBase} ${
                featured
                  ? "bg-brand-dark text-white hover:bg-brand-deep dark:bg-brand-deep dark:hover:bg-brand-dark"
                  : "border-2 border-mist bg-white hover:border-brand dark:border-brand-deep dark:bg-night-raised dark:hover:border-brand"
              }`}
            >
              <IconBadge name={k.icon} featured={featured} />
              <Heading
                className={`mt-6 ${featured ? "text-3xl text-white sm:text-4xl dark:text-white" : "text-2xl group-hover:text-brand-dark dark:group-hover:text-brand-light"}`}
              >
                {k.title}
              </Heading>
              <p className={`mt-2 text-lg ${featured ? "text-brand-soft sm:text-xl" : "text-ink-soft dark:text-paper/80"}`}>{k.intro}</p>
              {featured && (
                <ul className="mt-6 space-y-1 text-lg text-white/90">
                  {k.orte.slice(0, 4).map((o) => (
                    <li key={o.id} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 rounded-full bg-brand-light" />
                      {o.name}
                    </li>
                  ))}
                </ul>
              )}
              <p
                className={`mt-auto pt-5 text-base font-bold ${featured ? "text-brand-soft" : "text-brand-dark dark:text-brand-soft"}`}
              >
                {k.orte.length} {k.orte.length === 1 ? "Einsatzort" : "Einsatzorte"} ansehen →
              </p>
            </Link>
          </li>
        );
      })}
      <li data-reveal className="sm:col-span-2">
        <Link
          href="/aktiv-werden/"
          className={`${tileBase} bg-brand text-brand-deep hover:bg-brand-light sm:flex-row sm:items-center sm:gap-6`}
        >
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white/40 transition-transform duration-300 motion-safe:group-hover:-rotate-6 motion-safe:group-hover:scale-110">
            <CultureIcon name="theater" size={34} />
          </span>
          <span className="mt-6 block sm:mt-0">
            <Heading className="text-2xl text-brand-deep dark:text-brand-deep">Rund 40 Einrichtungen – eine passt zu Ihnen.</Heading>
            <span className="mt-2 block text-lg font-bold">Jetzt aktiv werden →</span>
          </span>
        </Link>
      </li>
    </ul>
  );
}
