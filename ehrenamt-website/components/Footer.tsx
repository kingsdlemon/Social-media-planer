import Link from "next/link";
import { legalNav, mailto, mainNav, site } from "@/lib/site";
import { Container } from "./ui";

export function Footer() {
  return (
    <footer className="mt-auto bg-brand-deep text-paper">
      <Container className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-5">
            {/* alt leer: Der Vereinsname steht direkt daneben als Text */}
            <img
              src={site.logo.src}
              alt=""
              width={site.logo.width}
              height={site.logo.height}
              loading="lazy"
              className="size-24 shrink-0 rounded-full bg-white p-1 sm:size-28"
            />
            <p className="font-display text-3xl font-bold text-white">{site.name}</p>
          </div>
          <p className="mt-3 max-w-md text-lg text-paper/85">
            Seit {site.founded} vermitteln wir Ehrenamtliche an Kultureinrichtungen in Darmstadt – parteiübergreifend und
            finanziert ausschließlich über Zuschüsse, Förderbeiträge und Spenden.
          </p>
          <p className="mt-4 text-lg text-paper/85">
            Mitglied im{" "}
            <a href={site.umbrella.url} className="font-bold text-white underline decoration-brand-light decoration-2" rel="noopener">
              {site.umbrella.name}
            </a>
          </p>
        </div>

        <div>
          <h2 className="font-sans text-base font-bold tracking-[0.14em] text-brand-light uppercase">Kontakt</h2>
          <address className="mt-4 space-y-3 text-lg not-italic">
            <p>
              Geschäftsstelle im {site.address.building}
              <br />
              {site.address.street}
              <br />
              {site.address.zip} {site.address.city}
            </p>
            <p>
              <a href={site.phoneHref} className="font-bold text-white underline decoration-brand-light decoration-2">
                {site.phone}
              </a>
              <br />
              <a href={mailto()} className="font-bold break-all text-white underline decoration-brand-light decoration-2">
                {site.email}
              </a>
            </p>
            <p className="text-base text-paper/75">Unser Büro ist nicht regelmäßig besetzt.</p>
          </address>
        </div>

        <div>
          <h2 className="font-sans text-base font-bold tracking-[0.14em] text-brand-light uppercase">Seiten</h2>
          <ul className="mt-4 space-y-2 text-lg">
            {[...mainNav, ...legalNav].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-paper no-underline hover:text-white hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-base text-paper/70 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}</p>
          <p>
            Spendenkonto: {site.bank.name} · IBAN {site.bank.iban}
          </p>
        </Container>
      </div>
    </footer>
  );
}
