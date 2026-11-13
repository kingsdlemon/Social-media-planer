import type { Metadata } from "next";
import { gesuche } from "@/content/gesucht";
import { ButtonA, ButtonLink, Card, Icon, PageHero, Section } from "@/components/ui";
import { mailto, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aktiv werden",
  description: "So werden Sie ehrenamtlich in Darmstädter Kultureinrichtungen aktiv: Fragebogen, Kennenlerngespräch, Vermittlung.",
};

const angebote = [
  "ein persönliches Kennenlerngespräch vor Ihrem Eintritt, in dem wir Ihre Interessen mit dem Bedarf der Einrichtungen zusammenbringen",
  "die Vermittlung an eine passende Kultureinrichtung",
  "Unterstützung, falls es bei Ihrem Einsatz einmal hakt",
  "regelmäßige Informationen per E-Mail und hier unter „Aktuelles“",
  "Tagesausflüge, Stammtische und Führungen für Mitglieder",
];

export default function AktivWerdenPage() {
  return (
    <>
      <PageHero eyebrow="Mach mit!" title="Schenken Sie Darmstadt ein wenig Zeit.">
        <p>
          Sie sind herzlich willkommen! Ob regelmäßig oder ab und zu, im Museumsshop oder im Rosengarten – wir finden
          gemeinsam mit Ihnen eine Aufgabe, die zu Ihren Interessen und Ihrem Zeitbudget passt.
        </p>
      </PageHero>

      <Section id="so-gehts" title="So einfach geht’s">
        <ol className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <li>
            <Card className="h-full">
              <span className="grid size-14 place-items-center rounded-full bg-terracotta font-display text-2xl font-bold text-white">1</span>
              <h3 className="mt-5 text-2xl">Fragebogen ausfüllen</h3>
              <p className="mt-3 text-lg">
                Füllen Sie den Fragebogen am Computer aus, speichern Sie ihn und schicken Sie ihn per E-Mail an{" "}
                <a href={mailto("Fragebogen")} className="link break-all">
                  {site.email}
                </a>
                . Oder drucken Sie ihn aus und senden ihn per Post an unsere Geschäftsstelle.
              </p>
              <ButtonA href={site.downloads.fragebogen} variant="secondary" className="mt-6" download>
                <Icon name="download" /> Fragebogen (PDF)
              </ButtonA>
            </Card>
          </li>
          <li>
            <Card className="h-full">
              <span className="grid size-14 place-items-center rounded-full bg-terracotta font-display text-2xl font-bold text-white">2</span>
              <h3 className="mt-5 text-2xl">Kennenlerngespräch</h3>
              <p className="mt-3 text-lg">
                Anhand Ihrer Antworten suchen wir passende Einsatzmöglichkeiten. Danach laden wir Sie zu einem persönlichen
                Gespräch ein.
              </p>
            </Card>
          </li>
          <li>
            <Card className="h-full">
              <span className="grid size-14 place-items-center rounded-full bg-terracotta font-display text-2xl font-bold text-white">3</span>
              <h3 className="mt-5 text-2xl">Mitglied werden</h3>
              <p className="mt-3 text-lg">
                Drucken Sie die Beitrittserklärung aus, unterschreiben Sie sie und schicken Sie sie per Post – oder
                eingescannt per E-Mail. Gern können Sie sie uns auch beim Kennenlerngespräch übergeben.
              </p>
              <ButtonA href={site.downloads.beitritt} variant="secondary" className="mt-6" download>
                <Icon name="download" /> Beitrittserklärung (PDF)
              </ButtonA>
            </Card>
          </li>
        </ol>
        <p className="mt-8 max-w-3xl text-lg">
          Die Beitrittserklärung gilt für aktive Mitglieder und für Fördermitglieder. <strong>Mitgliedsbeiträge erheben wir nicht.</strong>
        </p>
        <address className="mt-6 max-w-3xl text-lg not-italic">
          <strong>Postanschrift:</strong> {site.name}, {site.address.street}, {site.address.zip} {site.address.city}
        </address>
      </Section>

      <Section title="Lieber spontan helfen?" className="bg-cream-dark/50 dark:bg-night-raised/40">
        <div className="prose-efd">
          <p>
            Auch wenn Sie sich nicht dauerhaft binden möchten, können Sie dabei sein: Für kurzfristige Einsätze – etwa bei
            Veranstaltungen oder Reinigungsaktionen – fragen wir unsere Mitglieder per E-Mail an. Sie entscheiden jedes Mal
            neu, ob Sie Zeit haben.
          </p>
        </div>
      </Section>

      <Section
        id="wir-suchen"
        title="Wir suchen"
        intro={
          <>
            Hier wird gerade besonders dringend Unterstützung gebraucht. Interesse? Schreiben Sie uns an{" "}
            <a href={mailto("Interesse an einem Ehrenamt")} className="link break-all">
              {site.email}
            </a>
            .
          </>
        }
      >
        <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {gesuche.map((g) => (
            <li key={g.id} id={`gesucht-${g.id}`}>
              <Card className="h-full">
                <p className="text-base font-bold text-terracotta-dark dark:text-terracotta-light">{g.place}</p>
                <h3 className="mt-2 text-2xl sm:text-3xl">{g.title}</h3>
                <div className="mt-4 space-y-4 text-lg">
                  {g.text.map((t) => (
                    <p key={t.slice(0, 24)}>{t}</p>
                  ))}
                </div>
                {g.facts && (
                  <ul className="mt-5 space-y-2 text-lg">
                    {g.facts.map((f) => (
                      <li key={f} className="flex gap-3">
                        <span aria-hidden="true" className="mt-2 size-2.5 shrink-0 rounded-full bg-terracotta" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                <ButtonA href={mailto(`Interesse: ${g.title} – ${g.place}`)} variant="ghost" className="mt-6">
                  <Icon name="mail" /> Interesse melden
                </ButtonA>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Was wir Ihnen bieten" className="bg-teal-soft/60 dark:bg-teal-dark/40">
        <div className="prose-efd">
          <p>Unsere Mitglieder sind das Wertvollste, was der Verein hat. Deshalb kümmern wir uns gut um Sie:</p>
          <ul>
            {angebote.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <ButtonLink href="/einsatzorte/">
            Einsatzorte ansehen <Icon name="arrow" />
          </ButtonLink>
          <ButtonLink href="/kontakt/" variant="ghost">
            Fragen? Kontakt aufnehmen
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
