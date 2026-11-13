import { pageMetadata } from "@/lib/seo";
import { ButtonA, ButtonLink, Card, Icon, PageHero, Section, Todo } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Spenden",
  description:
    "Unterstützen Sie Ehrenamt für Darmstadt e.V. mit einer Spende oder als Fördermitglied.",
  path: "/spenden/",
});

export default function SpendenPage() {
  return (
    <>
      <PageHero eyebrow="Spenden" title="Ihre Spende hält Kultur lebendig.">
        <p>
          Wir finanzieren uns ausschließlich über Zuschüsse, Förderbeiträge und Spenden – Mitgliedsbeiträge erheben wir nicht.
          Mit Ihrer Unterstützung sichern Sie unsere Geschäftsstelle und die Vermittlung von Ehrenamtlichen an rund 40
          Kultureinrichtungen.
        </p>
      </PageHero>

      <Section>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <Card className="border-2 border-brand dark:border-brand">
            <h2 className="text-3xl sm:text-4xl">Spendenkonto</h2>
            <dl className="mt-6 grid grid-cols-1 gap-5 text-xl">
              <div>
                <dt className="text-base font-bold tracking-wide text-ink-soft uppercase dark:text-paper/70">Empfänger</dt>
                <dd className="mt-1 font-bold">{site.bank.holder}</dd>
              </div>
              <div>
                <dt className="text-base font-bold tracking-wide text-ink-soft uppercase dark:text-paper/70">IBAN</dt>
                <dd className="mt-1 font-mono text-2xl font-bold tracking-wider break-words text-brand-deep sm:text-3xl dark:text-paper">
                  {site.bank.iban}
                </dd>
              </div>
              <div>
                <dt className="text-base font-bold tracking-wide text-ink-soft uppercase dark:text-paper/70">Bank</dt>
                <dd className="mt-1">{site.bank.name}</dd>
              </div>
              <div>
                <dt className="text-base font-bold tracking-wide text-ink-soft uppercase dark:text-paper/70">BIC</dt>
                <dd className="mt-1">{site.bank.bic ?? <Todo>BIC vom Schatzmeister bestätigen lassen.</Todo>}</dd>
              </div>
              <div>
                <dt className="text-base font-bold tracking-wide text-ink-soft uppercase dark:text-paper/70">Verwendungszweck</dt>
                <dd className="mt-1">„Spende“ – für eine Zuwendungsbestätigung bitte mit Ihrer Anschrift</dd>
              </div>
            </dl>
          </Card>

          <div className="space-y-6">
            <Card>
              <h2 className="text-2xl">Spendenbescheinigung</h2>
              <Todo>
                Angaben zur Gemeinnützigkeit (Finanzamt, Datum des Freistellungsbescheids) und zum Ablauf der
                Zuwendungsbestätigung ergänzen.
              </Todo>
              <p className="mt-3 text-lg">
                Fragen zu Spenden beantwortet unser Schatzmeister:{" "}
                <a href={`mailto:${site.treasurerEmail}?subject=${encodeURIComponent("Spende")}`} className="link break-all">
                  {site.treasurerEmail}
                </a>
              </p>
            </Card>
            <Card>
              <h2 className="text-2xl">Fördermitglied werden</h2>
              <p className="mt-3 text-lg">
                Rund 40 Fördermitglieder unterstützen uns mit einem regelmäßigen Jahresbeitrag – am liebsten per
                Einzugsermächtigung. Das gibt uns Planungssicherheit.
              </p>
              <ButtonA href={site.downloads.beitritt} variant="secondary" className="mt-5" download>
                <Icon name="download" /> Beitrittserklärung (PDF)
              </ButtonA>
            </Card>
          </div>
        </div>
      </Section>

      <Section title="Was Ihre Spende bewirkt" className="bg-mist/50 dark:bg-night-raised/40">
        <div className="prose-efd">
          <p>
            Spenden und Zuschüsse haben den Verein seit seiner Gründung getragen. Sie ermöglichen unsere Geschäftsstelle im
            John-F.-Kennedy-Haus, die Betreuung unserer Mitglieder und besondere Projekte.
          </p>
          <p>
            Ein Beispiel: Dank vieler Spenden aus der Bürgerschaft und von Stiftungen und Unternehmen konnte der 1995 zerstörte
            Ludwigs-Tempel gemeinsam mit Stadtbild Deutschland e.V. rekonstruiert und 2023 wieder eingeweiht werden. Und die
            Bürgerstiftung Darmstadt hat zuletzt neue Bürotechnik für unsere Geschäftsstelle vollständig finanziert.
          </p>
          <p>Allen Förderern, Spenderinnen und Spendern: Herzlichen Dank!</p>
        </div>
        <div className="mt-10">
          <ButtonLink href="/ueber-uns/#finanzierung" variant="ghost">
            Mehr zur Finanzierung
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
