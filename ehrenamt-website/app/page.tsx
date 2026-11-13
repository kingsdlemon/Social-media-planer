import Link from "next/link";
import { meldungen } from "@/content/aktuelles";
import { kategorien } from "@/content/einsatzorte";
import { gesuche } from "@/content/gesucht";
import { ButtonLink, Card, Container, Icon, Section, Todo } from "@/components/ui";
import { site } from "@/lib/site";

const zahlen = [
  { value: "1994", label: "gegründet" },
  { value: "200+", label: "aktive Mitglieder" },
  { value: "≈ 40", label: "Kultureinrichtungen" },
  { value: "30.000", label: "Stunden Ehrenamt im Jahr (bis zu)" },
];

const schritte = [
  {
    title: "Fragebogen ausfüllen",
    text: "Erzählen Sie uns, was Sie interessiert und wie viel Zeit Sie haben – per E-Mail oder per Post.",
  },
  {
    title: "Kennenlernen",
    text: "Wir laden Sie zu einem persönlichen Gespräch ein und schauen gemeinsam, was zu Ihnen passt.",
  },
  {
    title: "Loslegen",
    text: "Wir vermitteln Sie an eine Kultureinrichtung und sind auch danach für Sie da.",
  },
];

export default function HomePage() {
  const aktuell = meldungen.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 size-[28rem] rounded-full bg-terracotta-light/50 blur-2xl dark:bg-terracotta/20" />
          <div className="absolute -bottom-32 -left-20 size-[22rem] rounded-full bg-teal-soft dark:bg-teal-dark/60" />
        </div>
        <Container className="relative py-16 sm:py-28">
          <p className="text-base font-bold tracking-[0.14em] text-terracotta-dark uppercase dark:text-terracotta-light">
            {site.name} · seit {site.founded}
          </p>
          <h1 className="mt-5 max-w-5xl text-5xl leading-[1.02] sm:text-7xl lg:text-8xl">
            Wir helfen, wenn es um <span className="text-terracotta">Kultur</span> geht.
          </h1>
          <p className="mt-8 max-w-2xl text-xl text-ink-soft sm:text-2xl dark:text-cream/85">
            Wir bringen Menschen, die ihre Zeit schenken möchten, mit Darmstädter Museen, Archiven, Parks und Festivals
            zusammen – dort, wo Kultur ohne Ehrenamt nicht möglich wäre.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <ButtonLink href="/aktiv-werden/" className="text-xl">
              Jetzt aktiv werden <Icon name="arrow" />
            </ButtonLink>
            <ButtonLink href="/einsatzorte/" variant="ghost" className="text-xl">
              Einsatzorte entdecken
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Zahlen */}
      <section aria-label="Der Verein in Zahlen" className="bg-teal text-white dark:bg-teal-dark">
        <Container className="grid grid-cols-2 gap-8 py-12 lg:grid-cols-4">
          {zahlen.map((z) => (
            <div key={z.label}>
              <p className="font-display text-5xl font-bold sm:text-6xl">{z.value}</p>
              <p className="mt-2 text-lg text-teal-soft">{z.label}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* Vorstellung */}
      <Section title="Wir stellen uns vor">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="prose-efd">
            <p>
              Der Verein „Ehrenamt für Darmstadt e.V.“ wurde 1994 gegründet, um öffentliche und gemeinnützige
              Kultureinrichtungen in Darmstadt zu unterstützen – parteiübergreifend und spendenfinanziert. Auslöser war die
              zunehmende Knappheit der Mittel im Kulturbereich.
            </p>
            <p>
              Heute engagieren sich über 200 aktive Mitglieder in rund 40 Einrichtungen; viele weitere unterstützen uns
              finanziell oder ideell. Sie arbeiten dort, wo Angebote ohne ihre Hilfe nicht möglich wären.
            </p>
            <p>
              Unser ehrenamtlicher Vorstand und die Koordinatorinnen und Koordinatoren vermitteln die Einsätze und sind
              Ansprechpartner bei Fragen, Wünschen oder Problemen – für die Ehrenamtlichen ebenso wie für die
              Einrichtungen. Unser Ziel: Bedarf und Angebot sollen immer gut zueinander passen.
            </p>
          </div>
          <Card className="self-start bg-teal-soft/60 dark:bg-night-raised">
            <p className="font-display text-2xl font-bold text-teal-dark dark:text-cream">Gut zu wissen</p>
            <ul className="mt-4 space-y-3 text-lg">
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-2 size-2.5 shrink-0 rounded-full bg-terracotta" />
                Mitgliedsbeiträge erheben wir nicht.
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-2 size-2.5 shrink-0 rounded-full bg-terracotta" />
                Auch gelegentliche, kurzfristige Einsätze sind möglich.
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-2 size-2.5 shrink-0 rounded-full bg-terracotta" />
                <span>
                  Wir sind Mitglied im{" "}
                  <a href={site.umbrella.url} className="link" rel="noopener">
                    Dachverband Kultur Darmstadt
                  </a>
                  .
                </span>
              </li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* So geht's */}
      <Section
        title="In drei Schritten zum Ehrenamt"
        className="bg-cream-dark/50 dark:bg-night-raised/40"
        intro="Sie müssen nichts mitbringen außer Neugier und ein wenig Zeit."
      >
        <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {schritte.map((s, i) => (
            <li key={s.title}>
              <Card className="h-full">
                <span className="grid size-14 place-items-center rounded-full bg-terracotta font-display text-2xl font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-2xl">{s.title}</h3>
                <p className="mt-3 text-lg">{s.text}</p>
              </Card>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <ButtonLink href="/aktiv-werden/">
            Alles zum Mitmachen <Icon name="arrow" />
          </ButtonLink>
        </div>
      </Section>

      {/* Einsatzorte */}
      <Section title="Wo unsere Ehrenamtlichen wirken" intro="Eine Auswahl unserer Einsatzbereiche in Darmstadt.">
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {kategorien.map((k) => (
            <li key={k.id}>
              <Link
                href={`/einsatzorte/#${k.id}`}
                className="group block h-full rounded-3xl border-2 border-cream-dark bg-white p-6 no-underline transition-colors hover:border-terracotta dark:border-teal-dark dark:bg-night-raised dark:hover:border-terracotta"
              >
                <h3 className="text-2xl group-hover:text-terracotta-dark dark:group-hover:text-terracotta-light">{k.title}</h3>
                <p className="mt-2 text-lg text-ink-soft dark:text-cream/80">{k.intro}</p>
                <p className="mt-4 text-base font-bold text-teal dark:text-teal-soft">
                  {k.orte.length} {k.orte.length === 1 ? "Einsatzort" : "Einsatzorte"} ansehen →
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Wir suchen */}
      <Section title="Aktuell gesucht" className="bg-teal-soft/60 dark:bg-teal-dark/40">
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {gesuche.slice(0, 3).map((g) => (
            <li key={g.id}>
              <Card className="h-full">
                <p className="text-base font-bold text-terracotta-dark dark:text-terracotta-light">{g.place}</p>
                <h3 className="mt-2 text-2xl">{g.title}</h3>
              </Card>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <ButtonLink href="/aktiv-werden/#wir-suchen" variant="secondary">
            Alle {gesuche.length} Gesuche ansehen <Icon name="arrow" />
          </ButtonLink>
        </div>
      </Section>

      {/* Aktuelles */}
      <Section title="Aktuelles">
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {aktuell.map((m) => (
            <li key={m.id}>
              <Card className="h-full">
                <p className="text-base font-bold text-terracotta-dark dark:text-terracotta-light">{m.dateLabel}</p>
                <h3 className="mt-2 text-2xl">{m.title}</h3>
                <p className="mt-3 line-clamp-3 text-lg">{m.text[0]}</p>
              </Card>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <ButtonLink href="/aktuelles/" variant="ghost">
            Alle Meldungen
          </ButtonLink>
        </div>
      </Section>

      {/* Spenden */}
      <section className="bg-terracotta text-white">
        <Container className="grid grid-cols-1 gap-8 py-16 sm:py-20 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center">
          <div>
            <h2 className="text-4xl text-white sm:text-5xl">Kultur braucht Unterstützung.</h2>
            <p className="mt-5 max-w-2xl text-xl text-white/90">
              Wir finanzieren uns ausschließlich über Zuschüsse, Förderbeiträge und Spenden. Jeder Beitrag hilft, unsere
              Geschäftsstelle und die Vermittlung am Laufen zu halten.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
            <ButtonLink
              href="/spenden/"
              variant="inverse"
              className="text-xl"
            >
              <Icon name="heart" /> Jetzt spenden
            </ButtonLink>
          </div>
        </Container>
      </section>

      <Container className="py-10">
        <Todo>Fotos von Einsätzen (mit Einverständnis der abgebildeten Personen) für Startseite und Einsatzorte bereitstellen.</Todo>
      </Container>
    </>
  );
}
