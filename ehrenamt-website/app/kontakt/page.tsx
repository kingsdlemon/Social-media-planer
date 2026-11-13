import type { Metadata } from "next";
import { ButtonA, Card, Icon, PageHero, Section, Todo } from "@/components/ui";
import { mailto, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "So erreichen Sie Ehrenamt für Darmstadt e.V.: Geschäftsstelle im John-F.-Kennedy-Haus, Kasinostraße 3, Darmstadt.",
};

export default function KontaktPage() {
  return (
    <>
      <PageHero eyebrow="Kontakt" title="Wir freuen uns auf Ihre Nachricht.">
        <p>{site.officeNote}</p>
      </PageHero>

      <Section>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="flex flex-col">
            <Icon name="mail" className="size-10 text-terracotta" />
            <h2 className="mt-4 text-2xl">E-Mail</h2>
            <p className="mt-2 text-lg">Am schnellsten erreichen Sie uns per E-Mail.</p>
            <div className="mt-auto pt-5">
              <ButtonA href={mailto()} className="w-full break-all">
                {site.email}
              </ButtonA>
            </div>
          </Card>
          <Card className="flex flex-col">
            <Icon name="phone" className="size-10 text-terracotta" />
            <h2 className="mt-4 text-2xl">Telefon</h2>
            <p className="mt-2 text-lg">Das Büro ist nicht immer besetzt – bei Bedarf rufen wir gern zurück.</p>
            <div className="mt-auto pt-5">
              <ButtonA href={site.phoneHref} variant="secondary" className="w-full">
                {site.phone}
              </ButtonA>
            </div>
          </Card>
          <Card className="flex flex-col">
            <Icon name="pin" className="size-10 text-terracotta" />
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

      <Section title="Besuch & Sprechzeiten" className="bg-cream-dark/50 dark:bg-night-raised/40">
        <div className="prose-efd">
          <p>
            Unsere Geschäftsstelle befindet sich im John-F.-Kennedy-Haus (Literaturhaus) in der Kasinostraße. Die Stadt
            Darmstadt stellt uns die Räume zur Verfügung. Bitte vereinbaren Sie vor einem Besuch einen Termin – telefonisch
            oder per E-Mail.
          </p>
          <Todo>Feste Sprechzeiten (falls vorhanden) ergänzen.</Todo>
          <Todo>Anfahrt mit Bus und Bahn sowie Hinweise zur Barrierefreiheit des Gebäudes ergänzen.</Todo>
          <Todo>Optional: Kontaktformular (z. B. über Netlify Forms) – vorher Datenschutzerklärung anpassen.</Todo>
        </div>
      </Section>
    </>
  );
}
