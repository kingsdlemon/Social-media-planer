import type { Metadata } from "next";
import { archivDokumente, meldungen } from "@/content/aktuelles";
import { Card, Container, Icon, PageHero, Section, Todo } from "@/components/ui";

export const metadata: Metadata = {
  title: "Aktuelles",
  description: "Neuigkeiten, Termine und Berichte von Ehrenamt für Darmstadt e.V.",
};

export default function AktuellesPage() {
  return (
    <>
      <PageHero eyebrow="Aktuelles" title="Neuigkeiten aus dem Verein.">
        <p>Berichte, Termine und Hinweise rund um unsere Arbeit in Darmstadt.</p>
      </PageHero>

      <Container className="py-14 sm:py-20">
        <ol className="grid grid-cols-1 max-w-4xl gap-8">
          {meldungen.map((m) => (
            <li key={m.id} id={m.id}>
              <Card>
                <article>
                  <p className="text-base font-bold text-brand-dark dark:text-brand-light">
                    {m.date ? <time dateTime={m.date}>{m.dateLabel}</time> : m.dateLabel}
                  </p>
                  <h2 className="mt-2 text-2xl sm:text-3xl">{m.title}</h2>
                  <div className="mt-4 space-y-4 text-lg">
                    {m.text.map((t) => (
                      <p key={t.slice(0, 32)}>{t}</p>
                    ))}
                  </div>
                  {m.links && (
                    <ul className="mt-5 space-y-2 text-lg">
                      {m.links.map((l) => (
                        <li key={l.href}>
                          <a href={l.href} className="link inline-flex items-center gap-2" rel={l.href.startsWith("http") ? "noopener" : undefined}>
                            <Icon name={l.href.endsWith(".pdf") ? "download" : "external"} className="size-5" />
                            {l.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                  {m.todo && <Todo>{m.todo}</Todo>}
                </article>
              </Card>
            </li>
          ))}
        </ol>
      </Container>

      <Section id="archiv" title="Archiv" className="bg-mist/50 dark:bg-night-raised/40" intro="Jahresberichte und frühere Ausgaben unserer Vereinszeitschrift.">
        <ul className="max-w-3xl space-y-2 text-lg">
          {archivDokumente.map((d) => (
            <li key={d} className="flex gap-3">
              <span aria-hidden="true" className="mt-2.5 size-2.5 shrink-0 rounded-full bg-brand" />
              {d}
            </li>
          ))}
        </ul>
        <Todo>
          PDFs der Jahresberichte und Zeitschriften von der alten Website sichern, unter /public/downloads/ ablegen und hier
          verlinken.
        </Todo>
      </Section>
    </>
  );
}
