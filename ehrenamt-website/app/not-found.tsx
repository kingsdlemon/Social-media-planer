import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-24">
      <p className="text-lg font-semibold text-ink-soft">Fehler 404</p>
      <h1 className="mt-4 text-4xl sm:text-6xl">Diese Seite gibt es leider nicht.</h1>
      <p className="mt-6 max-w-2xl text-xl">
        Vielleicht hat sich die Adresse geändert. Über die Navigation oben finden Sie alle Inhalte – oder Sie starten auf der
        Startseite.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <ButtonLink href="/">Zur Startseite</ButtonLink>
        <ButtonLink href="/kontakt/" variant="ghost">
          Kontakt
        </ButtonLink>
      </div>
    </Container>
  );
}
