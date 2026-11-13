import Link from "next/link";
import { Carousel, Slide } from "@/components/Carousel";
import { CountUp } from "@/components/CountUp";
import { CultureIcon } from "@/components/CultureIcons";
import { ButtonLink, Container, Icon, MoreLink, Todo } from "@/components/ui";
import { getGesuche, getKategorien, getMeldungen } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({ path: "/" });

const zahlen = [
  { to: 1994, from: 1960, grouping: false, label: "gegründet" },
  { to: 200, suffix: "+", label: "aktive Ehrenamtliche" },
  { to: 40, prefix: "≈ ", label: "Einsatzorte" },
  { to: 30000, label: "Stunden im Jahr" },
];

const schritte = [
  { title: "Fragebogen ausfüllen", text: "Erzählen Sie uns, was Sie interessiert und wie viel Zeit Sie haben." },
  { title: "Kennenlernen", text: "Im persönlichen Gespräch finden wir gemeinsam heraus, was zu Ihnen passt." },
  { title: "Loslegen", text: "Wir vermitteln Sie an eine Kultureinrichtung – und bleiben für Sie da." },
];

/** Überschrift einer Karussell-Sektion: groß, links, mit Textlink rechts */
function RowHeading({ title, intro, href, linkLabel }: { title: string; intro?: string; href?: string; linkLabel?: string }) {
  return (
    <Container className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between" >
      <div data-reveal>
        <h2 className="text-4xl sm:text-6xl">{title}</h2>
        {intro && <p className="mt-3 max-w-xl text-xl text-ink-soft dark:text-white/70">{intro}</p>}
      </div>
      {href && linkLabel && <MoreLink href={href} className="shrink-0">{linkLabel}</MoreLink>}
    </Container>
  );
}

export default function HomePage() {
  const aktuell = getMeldungen().slice(0, 6);
  const gesuche = getGesuche();
  const kategorien = getKategorien();

  return (
    <>
      {/* Hero – zentriert, ruhig, große Typo */}
      <section className="overflow-hidden bg-paper dark:bg-night">
        <Container className="pt-16 text-center sm:pt-24">
          <p className="text-lg font-semibold text-brand-dark dark:text-[#2997ff]">
            {site.name} · seit {site.founded}
          </p>
          <h1 className="mx-auto mt-4 max-w-5xl text-[2.9rem] leading-[1.04] sm:text-8xl">
            Wir helfen, wenn es um Kultur geht.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-ink-soft sm:text-2xl dark:text-white/70">
            Wir bringen Menschen, die ihre Zeit schenken möchten, mit Darmstädter Museen, Archiven, Parks und Festivals
            zusammen.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <ButtonLink href="/aktiv-werden/" className="w-full sm:w-auto">
              Jetzt aktiv werden
            </ButtonLink>
            <MoreLink href="/einsatzorte/">Einsatzorte entdecken</MoreLink>
          </div>
        </Container>
        <Container className="mt-14 sm:mt-20">
          <div data-parallax-root className="overflow-hidden rounded-[28px] sm:rounded-[36px]">
            <img
              src="/images/ehrenamt-illustration.webp"
              alt="Illustration: Ehrenamtliche begrüßen Gäste im Theater, beraten im Museum, weisen bei Konzerten den Weg und verkaufen Eintrittskarten."
              width={1200}
              height={670}
              fetchPriority="high"
              decoding="async"
              data-parallax="0.04"
              className="h-auto w-full in-[.motion-ok]:scale-[1.06] dark:brightness-90"
            />
          </div>
        </Container>
      </section>

      {/* Zahlen */}
      <section aria-label="Der Verein in Zahlen" className="py-12 sm:py-24">
        <Container className="grid grid-cols-2 gap-x-6 gap-y-10 text-center lg:grid-cols-4">
          {zahlen.map((z) => (
            <div key={z.label} data-reveal>
              <p className="font-display text-4xl font-semibold tracking-tight whitespace-nowrap sm:text-6xl">
                <CountUp to={z.to} from={z.from} prefix={z.prefix} suffix={z.suffix} grouping={z.grouping} />
              </p>
              <p className="mt-2 text-lg text-ink-soft dark:text-white/60">{z.label}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* Einsatzbereiche – Swipe */}
      <section className="bg-mist py-12 sm:py-24 dark:bg-night-raised/50">
        <RowHeading title="Wo Sie wirken können." intro="Wischen Sie durch unsere Einsatzbereiche." href="/einsatzorte/" linkLabel="Alle Einsatzorte" />
        <Carousel label="Einsatzbereiche">
          {kategorien.map((k) => (
            <Slide key={k.id}>
              <Link
                href={`/einsatzorte/#${k.id}`}
                className="group flex h-[26rem] flex-col rounded-[28px] bg-paper p-6 sm:p-8 no-underline transition-[box-shadow,scale] duration-300 ease-out hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] motion-safe:hover:scale-[1.015] dark:bg-night"
              >
                <CultureIcon name={k.icon} size={44} className="text-brand dark:text-[#2997ff]" />
                <h3 className="mt-auto text-3xl">{k.title}</h3>
                <p className="mt-3 text-lg text-ink-soft dark:text-white/70">{k.intro}</p>
                <p className="mt-5 text-lg text-brand-dark dark:text-[#2997ff]">
                  {k.orte.length} {k.orte.length === 1 ? "Einsatzort" : "Einsatzorte"} ›
                </p>
              </Link>
            </Slide>
          ))}
        </Carousel>
      </section>

      {/* So geht's */}
      <section className="py-12 sm:py-24">
        <Container>
          <div data-reveal className="text-center">
            <h2 className="text-4xl sm:text-6xl">In drei Schritten dabei.</h2>
            <p className="mx-auto mt-4 max-w-xl text-xl text-ink-soft dark:text-white/70">
              Sie brauchen nichts mitzubringen außer Neugier und ein wenig Zeit.
            </p>
          </div>
          <ol className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {schritte.map((s, i) => (
              <li key={s.title} data-reveal className="rounded-[28px] bg-mist p-6 sm:p-8 dark:bg-night-raised">
                <span className="font-display text-5xl font-semibold text-brand dark:text-[#2997ff]">{i + 1}</span>
                <h3 className="mt-6 text-2xl">{s.title}</h3>
                <p className="mt-2 text-lg text-ink-soft dark:text-white/70">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <ButtonLink href="/aktiv-werden/">
              Alles zum Mitmachen <Icon name="arrow" className="size-5" />
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* Gesucht – Swipe, dunkel */}
      <section className="bg-black py-16 text-white sm:py-24">
        <Container className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div data-reveal>
            <h2 className="text-4xl text-white sm:text-6xl dark:text-white">Aktuell gesucht.</h2>
            <p className="mt-3 max-w-xl text-xl text-white/60">Diese Einrichtungen freuen sich gerade besonders über Hilfe.</p>
          </div>
          <Link href="/aktiv-werden/#wir-suchen" className="shrink-0 text-lg text-[#2997ff] no-underline hover:underline">
            Alle {gesuche.length} Gesuche ›
          </Link>
        </Container>
        <Carousel label="Aktuelle Gesuche">
          {gesuche.map((g) => (
            <Slide key={g.id}>
              <Link
                href={`/aktiv-werden/#gesucht-${g.id}`}
                className="flex h-[19rem] flex-col rounded-[28px] bg-[#1c1c1e] p-6 sm:p-8 text-white no-underline transition-[background-color] duration-300 hover:bg-[#2c2c2e]"
              >
                <p className="text-base text-white/50">{g.place}</p>
                <h3 className="mt-auto text-2xl text-white dark:text-white">{g.title}</h3>
                <p className="mt-4 text-lg text-[#2997ff]">Mehr erfahren ›</p>
              </Link>
            </Slide>
          ))}
        </Carousel>
      </section>

      {/* Aktuelles – Swipe */}
      <section className="py-12 sm:py-24">
        <RowHeading title="Aktuelles." href="/aktuelles/" linkLabel="Alle Meldungen" />
        <Carousel label="Aktuelle Meldungen">
          {aktuell.map((m) => (
            <Slide key={m.id} className="self-stretch">
              <Link
                href={`/aktuelles/#${m.id}`}
                className="flex h-full min-h-[20rem] flex-col rounded-[28px] bg-mist p-6 sm:p-8 no-underline transition-[box-shadow] duration-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:bg-night-raised"
              >
                <p className="text-base text-ink-soft dark:text-white/50">{m.dateLabel}</p>
                <h3 className="mt-3 text-2xl">{m.title}</h3>
                <p className="mt-3 line-clamp-3 text-lg text-ink-soft dark:text-white/70">{m.text[0]}</p>
                <p className="mt-auto pt-4 text-lg text-brand-dark dark:text-[#2997ff]">Weiterlesen ›</p>
              </Link>
            </Slide>
          ))}
        </Carousel>
      </section>

      {/* Spenden */}
      <section className="px-4 pb-16 sm:px-8 sm:pb-24">
        <div data-reveal className="mx-auto max-w-6xl rounded-[36px] bg-mist px-6 py-16 text-center sm:py-24 dark:bg-night-raised">
          <Icon name="heart" className="mx-auto size-12 text-brand dark:text-[#2997ff]" />
          <h2 className="mx-auto mt-6 max-w-3xl text-4xl sm:text-6xl">Kultur braucht Unterstützung.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-xl text-ink-soft dark:text-white/70">
            Wir finanzieren uns ausschließlich über Zuschüsse, Förderbeiträge und Spenden. Jeder Beitrag hält die
            Vermittlung am Laufen.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <ButtonLink href="/spenden/">Jetzt spenden</ButtonLink>
            <MoreLink href="/ueber-uns/#finanzierung">Wie wir uns finanzieren</MoreLink>
          </div>
        </div>
      </section>

      <Container className="pb-10">
        <Todo>Fotos von Einsätzen (mit Einverständnis der abgebildeten Personen) für Startseite und Einsatzorte bereitstellen.</Todo>
      </Container>
    </>
  );
}
