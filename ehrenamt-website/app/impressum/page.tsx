import type { Metadata } from "next";
import { Container, DraftNotice, PageHero, Todo } from "@/components/ui";
import { mailto, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false },
};

export default function ImpressumPage() {
  return (
    <>
      <PageHero title="Impressum" />
      <Container className="py-14">
        <DraftNotice />
        <div className="prose-efd">
          <h2>Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)</h2>
          <p>
            <strong>{site.name}</strong>
            <br />
            Geschäftsstelle im {site.address.building}
            <br />
            {site.address.street}
            <br />
            {site.address.zip} {site.address.city}
          </p>

          <h3>Kontakt</h3>
          <p>
            Telefon: <a href={site.phoneHref}>{site.phone}</a>
            <br />
            E-Mail: <a href={mailto()}>{site.email}</a>
          </p>
          <p>Bitte beachten Sie, dass unser Büro nicht regelmäßig besetzt ist.</p>

          <h3>Vertretungsberechtigter Vorstand</h3>
          <p>Der Verein wird gemäß § 26 BGB durch den Vorstand vertreten.</p>
          <Todo>
            Vertretungsberechtigte Vorstandsmitglieder laut Satzung namentlich nennen (1. Vorsitz derzeit unbesetzt; 2.
            Vorsitzende: Beatrice Wesp).
          </Todo>

          <h3>Registereintrag</h3>
          <p>
            Eingetragen im Vereinsregister
            <br />
            Registergericht: {site.register.court}
            <br />
            Registernummer: {site.register.number}
          </p>

          <h3>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h3>
          <p>
            Beatrice Wesp
            <br />
            {site.name}
            <br />
            {site.address.street}, {site.address.zip} {site.address.city}
          </p>
          <Todo>Verantwortliche Person bestätigen.</Todo>

          <h3>Steuerliche Angaben</h3>
          <Todo>Ggf. Angaben zur Gemeinnützigkeit (zuständiges Finanzamt, Steuernummer) ergänzen.</Todo>

          <h3>Bildnachweis</h3>
          <Todo>Bildnachweise ergänzen, sobald Fotos eingebunden sind.</Todo>

          <h2>Haftung für Links</h2>
          <p>
            Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt
            der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
          </p>

          <h2>Urheberrecht</h2>
          <p>
            Die Inhalte dieser Website sind urheberrechtlich geschützt. Die Verwendung von Texten und Abbildungen ist mit
            Quellenangabe gegen Beleg gern gestattet.
          </p>

          <h2>Verbraucherstreitbeilegung</h2>
          <p>
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>
        </div>
      </Container>
    </>
  );
}
