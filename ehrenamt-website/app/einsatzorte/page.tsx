import type { Metadata } from "next";
import { kategorien } from "@/content/einsatzorte";
import { ButtonA, ButtonLink, Card, Container, Icon, PageHero, Todo } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Einsatzorte",
  description: "Museumsshops, Archive, Konzerte, Parks und Denkmäler: Hier sind die Ehrenamtlichen von Ehrenamt für Darmstadt e.V. im Einsatz.",
};

export default function EinsatzortePage() {
  return (
    <>
      <PageHero eyebrow="Einsatzorte" title="Rund 40 Orte, an denen Kultur auf Sie wartet.">
        <p>
          Von einfachen bis zu hoch qualifizierten Aufgaben – immer helfend und immer dort, wo es ohne Ehrenamt nicht ginge.
          Orte, an denen gerade besonders Unterstützung gebraucht wird, sind markiert.
        </p>
      </PageHero>

      <Container className="py-10">
        <nav aria-label="Bereiche auf dieser Seite">
          <ul className="flex flex-wrap gap-3">
            {kategorien.map((k) => (
              <li key={k.id}>
                <a
                  href={`#${k.id}`}
                  className="inline-flex min-h-12 items-center rounded-full border-2 border-teal px-5 text-lg font-bold text-teal no-underline hover:bg-teal hover:text-white dark:border-teal-soft dark:text-teal-soft dark:hover:bg-teal-soft dark:hover:text-teal-dark"
                >
                  {k.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      {kategorien.map((k, i) => (
        <section key={k.id} id={k.id} className={`py-14 sm:py-16 ${i % 2 === 1 ? "bg-cream-dark/50 dark:bg-night-raised/40" : ""}`}>
          <Container>
            <h2 className="text-3xl sm:text-5xl">{k.title}</h2>
            <p className="mt-3 text-xl text-ink-soft dark:text-cream/80">{k.intro}</p>
            <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              {k.orte.map((o) => (
                <li key={o.id} id={o.id}>
                  <Card className="h-full">
                    {o.wanted && (
                      <p className="mb-3 inline-flex rounded-full bg-terracotta px-3 py-1 text-base font-bold text-white">
                        Verstärkung gesucht
                      </p>
                    )}
                    <h3 className="text-2xl">{o.name}</h3>
                    <p className="mt-3 text-lg">{o.about}</p>
                    <p className="mt-4 text-lg">
                      <strong className="text-teal dark:text-teal-soft">Das machen wir dort: </strong>
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
