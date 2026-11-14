import { pageMetadata } from "@/lib/seo";
import { KontaktForm } from "@/components/forms/KontaktForm";
import { ButtonA, Card, Icon, PageHero, Section, Todo } from "@/components/ui";
import { mailto, site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Kontakt",
  description:
    "So erreichen Sie Ehrenamt für Darmstadt e.V.: Geschäftsstelle im John-F.-Kennedy-Haus, Kasinostraße 3, Darmstadt.",
  path: "/kontakt/",
});

export default function KontaktPage() {
  return (
    <>
      <PageHero eyebrow="Kontakt" title="Wir freuen uns auf Ihre Nachricht.">
        <p>{site.officeNote}</p>
      </PageHero>

      <Section>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="flex flex-col">
            <Icon name="mail" className="size-10 text-ink dark:text-white" />
            <h2 className="mt-4 text-2xl">E-Mail</h2>
            <p className="mt-2 text-lg">Am schnellsten erreichen Sie uns per E-Mail.</p>
            <div className="mt-auto pt-5">
              <ButtonA href={mailto()} className="w-full break-all">
                {site.email}
              </ButtonA>
            </div>
          </Card>
          <Card className="flex flex-col">
            <Icon name="phone" className="size-10 text-ink dark:text-white" />
            <h2 className="mt-4 text-2xl">Telefon</h2>
            <p className="mt-2 text-lg">Das Büro ist nicht immer besetzt – bei Bedarf rufen wir gern zurück.</p>
            <div className="mt-auto pt-5">
              <ButtonA href={site.phoneHref} variant="secondary" className="w-full">
                {site.phone}
              </ButtonA>
            </div>
          </Card>
          <Card className="flex flex-col">
            <Icon name="pin" className="size-10 text-ink dark:text-white" />
            <h2 className="mt-4 text-2xl">Geschäftsstelle</h2>
            <address className="mt-2 mb-5 text-lg not-italic">
              {site.name}
              <br />
              {site.address.building}
              <br />
              {site.address.street}
              <br />
              {site.address.zip} {site.address.city}
            </address>
            <ButtonA href={site.mapUrl} variant="ghost" className="mt-auto" rel="noopener" target="_blank">
              Auf der Karte zeigen <Icon name="external" className="size-5" />
            </ButtonA>
          </Card>
        </div>
      </Section>

      <section className="px-4 pb-8 sm:px-8">
        <div className="mx-auto max-w-3xl rounded-[36px] bg-mist p-6 sm:p-12 dark:bg-night-raised">
          <h2 className="mb-8 text-4xl sm:text-5xl">Schreiben Sie uns.</h2>
          <KontaktForm />
        </div>
      </section>

      <Section title="Besuch & Sprechzeiten" >
        <img
          src="/images/fotos/kennedyhaus.webp"
          alt="Schriftzug „John-F.-Kennedy-Haus“ an der Fassade der Geschäftsstelle"
          loading="lazy"
          className="mb-10 aspect-[21/9] w-full rounded-[28px] object-cover"
        />
        <div className="prose-efd">
          <p>
            Unsere Geschäftsstelle befindet sich im John-F.-Kennedy-Haus (Literaturhaus) in der Kasinostraße. Die Stadt
            Darmstadt stellt uns die Räume zur Verfügung. Bitte vereinbaren Sie vor einem Besuch einen Termin – telefonisch
            oder per E-Mail.
          </p>
          <Todo>Feste Sprechzeiten (falls vorhanden) ergänzen.</Todo>
          <Todo>Anfahrt mit Bus und Bahn sowie Hinweise zur Barrierefreiheit des Gebäudes ergänzen.</Todo>
          <Todo>Datenschutzerklärung um das Kontaktformular (Netlify Forms) und die Karte (OpenStreetMap) ergänzen.</Todo>
        </div>
      </Section>
    </>
  );
}
