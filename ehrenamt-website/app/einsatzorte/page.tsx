import { pageMetadata } from "@/lib/seo";
import { getKategorien } from "@/lib/content";
import { CultureIcon } from "@/components/CultureIcons";
import { EinsatzMap } from "@/components/map/EinsatzMap";
import { ButtonA, ButtonLink, Card, Container, Icon, PageHero, Todo } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Einsatzorte",
  description:
    "Museumsshops, Archive, Konzerte, Parks und Denkmäler: Hier sind die Ehrenamtlichen von Ehrenamt für Darmstadt e.V. im Einsatz.",
  path: "/einsatzorte/",
});

export default function EinsatzortePage() {
  return (
    <>
      <PageHero eyebrow="Einsatzorte" title="Rund 40 Orte, an denen Kultur auf Sie wartet.">
        <p>
          Von einfachen bis zu hoch qualifizierten Aufgaben – immer helfend und immer dort, wo es ohne Ehrenamt nicht ginge.
          Orte, an denen gerade besonders Unterstützung gebraucht wird, sind markiert.
        </p>
      </PageHero>

      <nav aria-label="Bereiche auf dieser Seite" className="glass sticky top-[3.6rem] z-40 border-y border-black/5 dark:border-white/10">
        <ul className="snap-row !py-3">
          {getKategorien().map((k) => (
            <li key={k.id}>
              <a
                href={`#${k.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-mist px-4 py-2 text-base whitespace-nowrap text-ink no-underline transition-colors hover:bg-line/60 dark:bg-night-raised dark:text-white"
              >
                <CultureIcon name={k.icon} size={18} /> {k.title}
              </a>
            </li>
          ))}
          <li>
            <a href="#karte" className="inline-flex items-center rounded-full bg-mist px-4 py-2 text-base whitespace-nowrap text-ink no-underline hover:bg-line/60 dark:bg-night-raised dark:text-white">
              Karte
            </a>
          </li>
        </ul>
      </nav>

      {getKategorien().map((k) => (
        <section key={k.id} id={k.id} className="scroll-mt-28 py-12 sm:py-24">
          <Container>
            <div data-reveal className="flex items-center gap-4">
              <CultureIcon name={k.icon} size={40} className="shrink-0 text-ink dark:text-white" />
              <h2 className="text-3xl sm:text-5xl">{k.title}</h2>
            </div>
            <p className="mt-3 text-xl text-ink-soft dark:text-white/70">{k.intro}</p>
            <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              {k.orte.map((o) => (
                <li key={o.id} id={o.id} className="scroll-mt-28">
                  <Card className="h-full">
                    {o.wanted && (
                      <p className="mb-3 inline-flex rounded-full bg-mist px-3 py-1 text-sm font-medium text-ink dark:bg-night-raised dark:text-white">
                        Verstärkung gesucht
                      </p>
                    )}
                    <h3 className="text-2xl">{o.name}</h3>
                    <p className="mt-3 text-lg">{o.about}</p>
                    <p className="mt-4 text-lg">
                      <strong className="font-semibold">Das machen wir dort: </strong>
                      {o.tasks}
                    </p>
                    {o.note && <Todo>{o.note.replace(/^TODO:\s*/, "")}</Todo>}
                  </Card>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ))}

      <section id="karte" className="scroll-mt-28 py-12 sm:py-24">
        <Container>
          <h2 data-reveal className="text-4xl sm:text-6xl">Auf der Karte.</h2>
          <p className="mt-3 mb-10 max-w-xl text-xl text-ink-soft dark:text-white/70">Ausgewählte Einsatzorte in Darmstadt.</p>
          <EinsatzMap />
          <Todo>Kartenpunkte sind ungefähre Lagen – vom Verein prüfen lassen und weitere Orte ergänzen.</Todo>
        </Container>
      </section>

      <Container className="py-14">
        <Todo>
          Die Liste umfasst bisher nur die auf der alten Website beschriebenen Einsatzorte. Weitere der rund 40 Einrichtungen
          aus der Projektbroschüre ergänzen.
        </Todo>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <ButtonLink href="/aktiv-werden/#wir-suchen">
            Aktuelle Gesuche <Icon name="arrow" />
          </ButtonLink>
          <ButtonA href={site.downloads.broschuere} variant="ghost">
            <Icon name="download" /> Projektbroschüre (PDF, ca. 9 MB)
          </ButtonA>
        </div>
      </Container>
    </>
  );
}
