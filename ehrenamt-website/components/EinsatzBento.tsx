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
  "group flex h-full flex-col rounded-3xl p-6 no-underline transition-colors sm:p-8 focus-visible:outline-offset-4";

function IconBadge({ name, featured }: { name: CultureIconName; featured?: boolean }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-2xl transition-transform group-hover:-rotate-6 ${
        featured
          ? "size-20 bg-white/10 text-terracotta-light"
          : "size-16 bg-teal-soft text-teal dark:bg-teal-dark dark:text-teal-soft"
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
          <li key={k.id} className={layout[k.id] ?? ""}>
            <Link
              href={href(k.id)}
              className={`${tileBase} ${
                featured
                  ? "bg-teal text-white hover:bg-teal-dark dark:bg-teal-dark dark:hover:bg-teal"
                  : "border-2 border-cream-dark bg-white hover:border-terracotta dark:border-teal-dark dark:bg-night-raised dark:hover:border-terracotta"
              }`}
            >
              <IconBadge name={k.icon} featured={featured} />
              <Heading
                className={`mt-6 ${featured ? "text-3xl text-white sm:text-4xl dark:text-white" : "text-2xl group-hover:text-terracotta-dark dark:group-hover:text-terracotta-light"}`}
              >
                {k.title}
              </Heading>
              <p className={`mt-2 text-lg ${featured ? "text-teal-soft sm:text-xl" : "text-ink-soft dark:text-cream/80"}`}>{k.intro}</p>
              {featured && (
                <ul className="mt-6 space-y-1 text-lg text-white/90">
                  {k.orte.slice(0, 4).map((o) => (
                    <li key={o.id} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 rounded-full bg-terracotta-light" />
                      {o.name}
                    </li>
                  ))}
                </ul>
              )}
              <p
                className={`mt-auto pt-5 text-base font-bold ${featured ? "text-terracotta-light" : "text-teal dark:text-teal-soft"}`}
              >
                {k.orte.length} {k.orte.length === 1 ? "Einsatzort" : "Einsatzorte"} ansehen →
              </p>
            </Link>
          </li>
        );
      })}
      <li className="sm:col-span-2">
        <Link
          href="/aktiv-werden/"
          className={`${tileBase} bg-terracotta text-white hover:bg-terracotta-dark sm:flex-row sm:items-center sm:gap-6`}
        >
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white/15 transition-transform group-hover:-rotate-6">
            <CultureIcon name="theater" size={34} />
          </span>
          <span className="mt-6 block sm:mt-0">
            <Heading className="text-2xl text-white dark:text-white">Rund 40 Einrichtungen – eine passt zu Ihnen.</Heading>
            <span className="mt-2 block text-lg text-white/90">Jetzt aktiv werden →</span>
          </span>
        </Link>
      </li>
    </ul>
  );
}
