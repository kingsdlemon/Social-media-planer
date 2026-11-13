import { pageMetadata } from "@/lib/seo";
import { Container, DraftNotice, PageHero, Todo } from "@/components/ui";
import { mailto, site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Datenschutz",
  description:
    "Datenschutzerklärung von Ehrenamt für Darmstadt e.V.: Welche Daten wir auf der Website und als Verein verarbeiten und welche Rechte Sie haben.",
  path: "/datenschutz/",
});

export default function DatenschutzPage() {
  return (
    <>
      <PageHero title="Datenschutzerklärung" />
      <Container className="py-14">
        <DraftNotice>
          Diese Datenschutzerklärung ist ein Entwurf. Teil B übernimmt die bisherigen Mitgliederinformationen (Stand August
          2024), Teil A wurde für die neue Website ergänzt. Bitte vor Veröffentlichung vom Vorstand freigeben und rechtlich
          prüfen lassen.
        </DraftNotice>
        <div className="prose-efd">
          <h2>Verantwortlicher</h2>
          <p>
            {site.name}, gesetzlich vertreten durch den Vorstand nach § 26 BGB
            <br />
            {site.address.street}, {site.address.zip} {site.address.city}
            <br />
            E-Mail: <a href={mailto("Datenschutz")}>{site.email}</a>
          </p>
          <Todo>
            Vertretungsberechtigte Personen aktualisieren – in der alten Fassung noch Dr. Marjam Schellhaas (Vorsitz, inzwischen
            niedergelegt) und Beatrice Wesp (Stellvertreterin).
          </Todo>

          <h3>Datenschutzbeauftragter</h3>
          <p>
            Entfällt. Wir sind nicht verpflichtet, eine Datenschutzbeauftragte oder einen Datenschutzbeauftragten zu benennen,
            da weniger als 20 Personen ständig mit der Verarbeitung personenbezogener Daten beschäftigt sind (§ 38 BDSG).
          </p>

          <h2>A. Nutzung dieser Website</h2>

          <h3>Hosting und Server-Logfiles</h3>
          <p>
            Diese Website wird bei Netlify, Inc., 101 2nd Street, San Francisco, CA 94105, USA, gehostet. Beim Aufruf der Seiten
            verarbeitet der Hoster technisch notwendige Daten (u. a. IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Browser
            und Betriebssystem), um die Website auszuliefern und ihre Sicherheit zu gewährleisten. Rechtsgrundlage ist unser
            berechtigtes Interesse an einem sicheren und stabilen Betrieb (Art. 6 Abs. 1 lit. f DSGVO).
          </p>
          <Todo>
            Auftragsverarbeitungsvertrag (DPA) mit Netlify abschließen; Angaben zur Datenübermittlung in die USA (EU-US Data
            Privacy Framework / Standardvertragsklauseln) und Speicherdauer der Logfiles prüfen und ergänzen.
          </Todo>

          <h3>Keine Cookies, kein Tracking</h3>
          <p>
            Wir setzen keine Cookies, keine Analyse- oder Tracking-Werkzeuge und keine eingebetteten Inhalte Dritter (z. B.
            Karten, Videos oder Social-Media-Plugins) ein. Schriftarten werden von unserem eigenen Server geladen, nicht von
            Drittanbietern.
          </p>

          <h3>Lokale Speicherung der Darstellung</h3>
          <p>
            Wenn Sie die Darstellung (hell oder dunkel) selbst wählen, speichert Ihr Browser diese Einstellung lokal
            („localStorage“). Die Information verlässt Ihr Gerät nicht und wird nicht an uns übertragen. Sie können sie jederzeit
            über die Einstellungen Ihres Browsers löschen.
          </p>

          <h3>Kontakt per E-Mail oder Telefon</h3>
          <p>
            Wenn Sie uns per E-Mail oder Telefon kontaktieren oder uns den Fragebogen bzw. die Beitrittserklärung schicken,
            verarbeiten wir Ihre Angaben, um Ihr Anliegen zu bearbeiten und eine Mitgliedschaft vorzubereiten (Art. 6 Abs. 1 lit.
            b DSGVO). Wir löschen die Daten, sobald sie dafür nicht mehr erforderlich sind und keine gesetzlichen
            Aufbewahrungspflichten bestehen.
          </p>

          <h3>Externe Links</h3>
          <p>
            Diese Website enthält Links zu Angeboten anderer Anbieter (z. B. OpenStreetMap, Bürgerstiftung Darmstadt). Erst wenn
            Sie einen solchen Link anklicken, werden Daten an den jeweiligen Anbieter übertragen. Dort gelten dessen
            Datenschutzbestimmungen.
          </p>

          <h3>Redaktionszugang</h3>
          <Todo>
            Redaktionszugang unter /admin/ (Decap CMS) ergänzen: Anmeldung der Redakteurinnen und Redakteure über GitHub und
            Netlify, Programmcode wird von jsDelivr geladen. Betrifft nur Personen, die Inhalte pflegen.
          </Todo>

          <h2>B. Informationen für Mitglieder (Art. 13 und 14 DSGVO)</h2>

          <h3>Zwecke der Verarbeitung</h3>
          <p>
            Wir verarbeiten personenbezogene Daten unserer Mitglieder ausschließlich für vereinsinterne Zwecke zur Durchführung
            des Mitgliedschaftsverhältnisses – etwa für Einladungen zu Veranstaltungen und Mitgliederversammlungen,
            Informationsbriefe oder den Versand von Publikationen. Zur Erfüllung satzungsgemäßer Aufgaben können Daten an von uns
            beauftragte Dienstleister weitergegeben werden. Im Zusammenhang mit Veranstaltungen können personenbezogene Daten,
            einschließlich Fotos, in der Berichterstattung auf unserer Website, in sozialen Medien sowie gegenüber lokalen,
            regionalen und überregionalen Medien veröffentlicht werden.
          </p>

          <h3>Rechtsgrundlagen</h3>
          <ul>
            <li>Erfüllung des Mitgliedschaftsverhältnisses: Art. 6 Abs. 1 lit. b DSGVO</li>
            <li>Verarbeitungen darüber hinaus nur mit Ihrer Einwilligung: Art. 6 Abs. 1 lit. a i. V. m. Art. 7 DSGVO</li>
            <li>
              Berichterstattung über unsere Aktivitäten in Internet und Medien: berechtigtes Interesse an der Information der
              Öffentlichkeit, Art. 6 Abs. 1 lit. f DSGVO
            </li>
          </ul>

          <h3>Empfänger</h3>
          <p>
            Personenbezogene Daten der Mitglieder werden zur Erfüllung satzungsgemäßer Aufgaben z. B. an Druckereien für den
            Druck der Vereinszeitschrift oder für Mailings weitergegeben.
          </p>

          <h3>Speicherdauer</h3>
          <p>
            Wir speichern die Daten für die Dauer der Mitgliedschaft. Nach dem Ende der Mitgliedschaft bewahren wir die Daten
            gemäß den gesetzlichen Fristen weitere zehn Jahre eingeschränkt auf und löschen sie dann. Für die Vereinschronik
            können Vorname, Nachname, Zugehörigkeit zu Gremien sowie die Teilnahme an Veranstaltungen und Aktionen im
            Vereinsarchiv gespeichert werden (berechtigtes Interesse an der zeitgeschichtlichen Dokumentation). Alle übrigen
            Daten, etwa Anschrift, Kontaktdaten und Geburtsdatum, löschen wir mit Ende der Mitgliedschaft.
          </p>

          <h3>Herkunft der Daten</h3>
          <p>Die Daten erheben wir grundsätzlich beim Erwerb der Mitgliedschaft.</p>

          <h2>Ihre Rechte</h2>
          <p>Ihnen stehen unter den jeweiligen gesetzlichen Voraussetzungen folgende Rechte zu:</p>
          <ul>
            <li>Auskunft (Art. 15 DSGVO)</li>
            <li>Berichtigung (Art. 16 DSGVO)</li>
            <li>Löschung (Art. 17 DSGVO)</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch (Art. 21 DSGVO)</li>
            <li>Widerruf einer Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
            <li>
              Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO), z. B. beim Hessischen Beauftragten für Datenschutz und
              Informationsfreiheit
            </li>
          </ul>

          <Todo>„Stand“-Datum nach Freigabe eintragen.</Todo>
        </div>
      </Container>
    </>
  );
}
