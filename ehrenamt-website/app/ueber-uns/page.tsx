import { getVerein } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { Illustration } from "@/components/Illustration";
import { ButtonA, ButtonLink, Card, Container, Icon, PageHero, Section, Todo } from "@/components/ui";
import { mailto, site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Über uns",
  description:
    "Vorstand, Mitglieder, Finanzierung und Geschichte von Ehrenamt für Darmstadt e.V. – gegründet 1994.",
  path: "/ueber-uns/",
});


const historie = [
  {
    year: "1993",
    title: "Die Idee",
    text: "Das „Haus Deiters“, eines der acht Häuser der Künstlerkolonie auf der Mathildenhöhe, soll aus Kostengründen schließen. Die damalige Stadtverordnete Uta Müller-Merbach will Abhilfe schaffen – mit einem Verein, der Kultureinrichtungen ehrenamtlich unterstützt. Ein erster Artikel im Darmstädter Echo bringt auf Anhieb 70 Interessierte.",
  },
  {
    year: "1994",
    title: "Gründung",
    text: "Mit Unterstützung eines erfahrenen Rechtsbeistands entsteht die Satzung; im Januar wird der Verein gegründet. Uta Müller-Merbach übernimmt den Vorsitz – und behält ihn 26 Jahre lang. Die Vorstandsarbeit beginnt im heimischen Wohnzimmer.",
  },
  {
    year: "Die ersten Jahre",
    title: "Erste Einsatzorte",
    text: "Zu den ersten unterstützten Einrichtungen gehören das Hessische Staatsarchiv, das Hessische Landesmuseum und das Museum Künstlerkolonie. Das Kürzel „EAD“ wird bald in „EfD“ geändert. Die Pressearbeit von Friedrich-Wilhelm Bremer macht den Verein schnell bekannt – mit vielen neuen Mitgliedern und wachsender Nachfrage.",
  },
  {
    year: "1996",
    title: "Museumsshop Mathildenhöhe",
    text: "Die Stadt richtet im Oktogon-Anbau des Museums Künstlerkolonie einen Shop ein – unter der Bedingung, dass er ehrenamtlich betrieben wird. Unsere Mitglieder führen ihn bis heute.",
  },
  {
    year: "Heute",
    title: "Das „Darmstädter Modell“",
    text: "Die Vereinsidee ist über Darmstadt hinaus bekannt geworden und hat in Städten wie Worms, Wiesbaden und Dortmund Nachahmer gefunden. Die Stadt Darmstadt stellt uns im John-F.-Kennedy-Haus (Literaturhaus) Räume für die Geschäftsstelle zur Verfügung.",
  },
  {
    year: "2023",
    title: "30 Jahre & Ludwigs-Tempel",
    text: "Der 1995 zerstörte Ludwigs-Tempel wird dank eines gemeinsamen Spendenprojekts mit Stadtbild Deutschland e.V. rekonstruiert und am 18. Oktober wieder eingeweiht. Im November feiern wir 30 Jahre Ehrenamt für Darmstadt.",
  },
];

const subnav = [
  { href: "#vorstand", label: "Vorstand" },
  { href: "#mitglieder", label: "Mitglieder" },
  { href: "#finanzierung", label: "Finanzierung" },
  { href: "#historie", label: "Historie" },
];

export default function UeberUnsPage() {
  const { vorstand, koordination, kassenpruefung, todo } = getVerein();
  return (
    <>
      <PageHero eyebrow="Über uns" title="Seit 1994 für die Kultur in Darmstadt.">
        <p>
          Zweck unseres Vereins ist die Förderung kultureller Einrichtungen durch personelle Unterstützung. Wir arbeiten
          überparteilich, ehrenamtlich und unabhängig – bis zu 30.000 Stunden im Jahr.
        </p>
      </PageHero>

      <Illustration
        alt="Illustration: Ehrenamtliche mit Namensschildern im Einsatz in Darmstädter Kultureinrichtungen – sie begrüßen eine Familie vor der Theaterbühne, weisen bei einem Orchesterkonzert den Weg, beraten ein älteres Paar am Infotresen, verkaufen Eintrittskarten und erklären Skulpturen in einer Ausstellung."
        caption="Über 200 Ehrenamtliche unterstützen rund 40 Kultureinrichtungen in Darmstadt."
      />

      <Container className="py-10">
        <nav aria-label="Bereiche auf dieser Seite">
          <ul className="flex flex-wrap gap-3">
            {subnav.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  className="inline-flex min-h-12 items-center rounded-full border-2 border-brand-dark px-5 text-lg font-bold text-brand-dark no-underline hover:bg-brand-dark hover:text-white dark:border-brand-soft dark:text-brand-soft dark:hover:bg-brand-soft dark:hover:text-brand-deep"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <Section id="vorstand" title="Vorstand" intro="Alle Vorstandsmitglieder arbeiten ehrenamtlich.">
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vorstand.map((v) => (
            <li key={`${v.role}-${v.name}`}>
              <Card className="h-full">
                <p className="text-base font-bold tracking-wide text-brand-dark uppercase dark:text-brand-light">{v.role}</p>
                {v.name ? (
                  <p className="mt-2 font-display text-2xl font-bold text-brand-deep dark:text-paper">{v.name}</p>
                ) : (
                  <>
                    <p className="mt-2 font-display text-2xl font-bold text-brand-deep dark:text-paper">Zurzeit unbesetzt</p>
                    <p className="mt-2 text-lg">
                      <a href="/aktiv-werden/#wir-suchen" className="link">
                        Wir suchen Sie!
                      </a>
                    </p>
                  </>
                )}
              </Card>
            </li>
          ))}
        </ul>

        <h3 className="mt-16 text-2xl sm:text-3xl">Unsere Koordinatorinnen und Koordinatoren</h3>
        <p className="mt-3 max-w-3xl text-lg">
          Sie sind vor Ort die ersten Ansprechpersonen für unsere Ehrenamtlichen und die Einrichtungen.
        </p>
        <dl className="mt-8 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
          {koordination.map((k) => (
            <div key={`${k.area}-${k.name}`} data-reveal className="border-l-4 border-brand pl-4">
              <dt className="text-lg text-ink-soft dark:text-paper/75">{k.area}</dt>
              <dd className="font-display text-xl font-bold text-brand-deep dark:text-paper">{k.name}</dd>
            </div>
          ))}
        </dl>

        {kassenpruefung && (
          <>
            <h3 className="mt-16 text-2xl sm:text-3xl">Kassenprüfung</h3>
            <p className="mt-3 text-lg">{kassenpruefung}</p>
          </>
        )}
        {todo && <Todo>{todo}</Todo>}
      </Section>

      <Section id="mitglieder" title="Mitglieder" className="bg-mist/50 dark:bg-night-raised/40">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="prose-efd">
            <p>
              Unsere Mitglieder sind die wertvollste Ressource des Vereins. Über 200 aktive Mitglieder sind in rund 40
              Einrichtungen tätig, weitere unterstützen uns als Fördermitglieder finanziell oder ideell.
            </p>
            <p>Vorstand und Beisitzer legen deshalb großen Wert auf eine gute Betreuung. Wir bieten Ihnen:</p>
            <ul>
              <li>ein Kennenlerngespräch vor dem Eintritt, in dem wir Ihre Interessen und den Bedarf der Einrichtungen abstimmen</li>
              <li>die Vermittlung an geeignete Einrichtungen</li>
              <li>Hilfe bei Problemen, die sich aus Ihrem Einsatz ergeben</li>
              <li>regelmäßige Informationen per E-Mail und unter „Aktuelles“</li>
              <li>Tagesausflüge, Stammtische und Führungen</li>
            </ul>
          </div>
          <Card className="self-start">
            <p className="font-display text-2xl font-bold text-brand-deep dark:text-paper">Mitglied werden</p>
            <p className="mt-3 text-lg">Als aktives Mitglied oder als Fördermitglied – Mitgliedsbeiträge erheben wir nicht.</p>
            <div className="mt-6 flex flex-col gap-3">
              <ButtonLink href="/aktiv-werden/">
                So werden Sie aktiv <Icon name="arrow" />
              </ButtonLink>
              <ButtonA href={site.downloads.beitritt} variant="ghost" download>
                <Icon name="download" /> Beitrittserklärung (PDF)
              </ButtonA>
            </div>
          </Card>
        </div>
      </Section>

      <Section id="finanzierung" title="Finanzierung">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="prose-efd">
            <p>
              Ehrenamt für Darmstadt finanziert sich ausschließlich über Zuschüsse, Förderbeiträge und Spenden. Mitglieder und
              Vorstand arbeiten ausschließlich ehrenamtlich. So bleiben wir unabhängig und können wirksam arbeiten.
            </p>
            <p>
              Rund 40 Fördermitglieder unterstützen uns mit regelmäßigen Jahresbeiträgen – viele davon per
              Einzugsermächtigung. Damit sichern sie die Arbeit unserer Geschäftsstelle. Ihnen allen gilt unser ganz besonderer
              Dank!
            </p>
            <p>
              Vielfältige Sach- und Geldspenden von Firmen, Ämtern, Stiftungen und Privatpersonen haben den Aufbau des Vereins
              erst möglich gemacht – zuletzt etwa die Förderung neuer Bürotechnik durch die Bürgerstiftung Darmstadt.
            </p>
            <Todo>Liste der aktuellen Förderer und Zuschussgeber (mit Einverständnis, ggf. mit Logos) ergänzen.</Todo>
          </div>
          <Card className="self-start bg-brand-light/30 dark:bg-night-raised">
            <p className="font-display text-2xl font-bold text-brand-deep dark:text-paper">Spendenkonto</p>
            <dl className="mt-4 space-y-2 text-lg">
              <div>
                <dt className="inline font-bold">Bank: </dt>
                <dd className="inline">{site.bank.name}</dd>
              </div>
              <div>
                <dt className="inline font-bold">IBAN: </dt>
                <dd className="inline font-mono tracking-wide">{site.bank.iban}</dd>
              </div>
            </dl>
            <ButtonLink href="/spenden/" className="mt-6">
              <Icon name="heart" /> Mehr zum Spenden
            </ButtonLink>
          </Card>
        </div>
      </Section>

      <Section id="historie" title="Historie" className="bg-brand-soft/60 dark:bg-brand-deep/40">
        <ol className="relative max-w-4xl border-l-4 border-brand pl-8">
          {historie.map((h) => (
            <li key={h.title} data-reveal className="relative pb-12 last:pb-0">
              <span aria-hidden="true" className="absolute top-1.5 -left-[2.65rem] size-5 rounded-full border-4 border-brand bg-paper dark:bg-night" />
              <p className="font-display text-xl font-bold text-brand-dark dark:text-brand-light">{h.year}</p>
              <h3 className="mt-1 text-2xl sm:text-3xl">{h.title}</h3>
              <p className="mt-3 text-lg">{h.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Gut vernetzt">
        <div className="prose-efd">
          <p>
            Ehrenamt für Darmstadt e.V. ist Mitglied im{" "}
            <a href={site.umbrella.url} rel="noopener">
              {site.umbrella.name}
            </a>
            . Wir arbeiten eng mit Partnern wie der Bürgerstiftung Darmstadt, der Stadtbibliothek, dem Denkmalamt und dem
            Grünflächenamt zusammen.
          </p>
          <p>
            Fragen zum Verein?{" "}
            <a href={mailto()} className="break-all">
              {site.email}
            </a>
          </p>
        </div>
      </Section>
    </>
  );
}
