import Link from "next/link";
import { meldungen } from "@/content/aktuelles";
import { gesuche } from "@/content/gesucht";
import { CountUp } from "@/components/CountUp";
import { EinsatzBento } from "@/components/EinsatzBento";
import { Hero3D } from "@/components/hero/Hero3D";
import { ButtonLink, Card, Container, Icon, Section, Todo } from "@/components/ui";
import { site } from "@/lib/site";

const zahlen = [
  { to: 1994, from: 1960, grouping: false, label: "gegründet – seit über 30 Jahren aktiv" },
  { to: 200, suffix: "+", label: "aktive Ehrenamtliche" },
  { to: 40, prefix: "≈ ", label: "Einsatzorte in Kultureinrichtungen" },
  { to: 30000, label: "Stunden Ehrenamt im Jahr (bis zu)" },
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
      <section data-parallax-root className="relative isolate overflow-hidden">
        {/* Dekorativer Farbverlauf als Hintergrund – daher leerer Alt-Text */}
        <img
          src="/images/hero-bg.webp"
          alt=""
          aria-hidden="true"
          width={1376}
          height={768}
          fetchPriority="high"
          decoding="async"
          data-parallax="0.1"
          className="absolute inset-x-0 -top-[15%] -z-20 h-[130%] w-full object-cover"
        />
        {/* Aufhellung links für gut lesbaren Text */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-cream via-cream/85 to-cream/10 dark:from-night dark:via-night/85 dark:to-night/30"
        />
        <Container className="relative py-16 sm:py-24 lg:py-28">
          <div data-parallax="0.12" className="relative z-10 lg:max-w-[58%]">
          <p className="text-base font-bold tracking-[0.14em] text-terracotta-dark uppercase dark:text-terracotta-light">
            {site.name} · seit {site.founded}
          </p>
          <h1 className="mt-5 text-5xl leading-[1.02] sm:text-7xl xl:text-8xl">
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
          </div>
          {/* 3D-Szene: mobil unter dem Text, ab Desktop rechts daneben */}
          <div className="mt-10 h-64 sm:h-80 lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:h-auto lg:w-[44%]">
            <Hero3D />
          </div>
        </Container>
      </section>

      {/* Zahlen */}
      <section aria-label="Der Verein in Zahlen" className="bg-teal text-white dark:bg-teal-dark">
        <Container className="grid grid-cols-2 gap-8 py-12 lg:grid-cols-4">
          {zahlen.map((z) => (
            <div key={z.label} data-reveal>
              <p className="font-display text-5xl font-bold sm:text-6xl">
                <CountUp to={z.to} from={z.from} prefix={z.prefix} suffix={z.suffix} grouping={z.grouping} />
              </p>
              <p className="mt-2 text-lg text-teal-soft">{z.label}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* Vorstellung */}
      <Section title="Wir stellen uns vor">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="prose-efd" data-reveal>
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
        <EinsatzBento />
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
          <div data-reveal>
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
