import Link from "next/link";
import { legalNav, mailto, mainNav, site } from "@/lib/site";
import { Container } from "./ui";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line/60 bg-mist text-ink-soft dark:border-white/10 dark:bg-night-raised dark:text-ink dark:text-white/60">
      <Container className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-6">
            {/* alt leer: Der Vereinsname steht direkt daneben als Text */}
            <img
              src={site.logo.src}
              alt=""
              width={site.logo.width}
              height={site.logo.height}
              loading="lazy"
              className="size-16 shrink-0 rounded-full bg-white p-0.5"
            />
            <p className="font-display text-2xl font-semibold text-ink dark:text-white">{site.name}</p>
          </div>
          <p className="mt-3 max-w-md text-base text-ink-soft dark:text-ink dark:text-white/60">
            Seit {site.founded} vermitteln wir Ehrenamtliche an Kultureinrichtungen in Darmstadt – parteiübergreifend und
            finanziert ausschließlich über Zuschüsse, Förderbeiträge und Spenden.
          </p>
          <p className="mt-4 text-base text-ink-soft dark:text-ink dark:text-white/60">
            Mitglied im{" "}
            <a href={site.umbrella.url} className="text-brand-dark no-underline hover:underline dark:text-[#2997ff]" rel="noopener">
              {site.umbrella.name}
            </a>
          </p>
        </div>

        <div>
          <h2 className="font-sans text-sm font-semibold text-ink dark:text-white">Kontakt</h2>
          <address className="mt-4 space-y-3 text-base not-italic">
            <p>
              Geschäftsstelle im {site.address.building}
              <br />
              {site.address.street}
              <br />
              {site.address.zip} {site.address.city}
            </p>
            <p>
              <a href={site.phoneHref} className="text-brand-dark no-underline hover:underline dark:text-[#2997ff]">
                {site.phone}
              </a>
              <br />
              <a href={mailto()} className="break-all text-brand-dark no-underline hover:underline dark:text-[#2997ff]">
                {site.email}
              </a>
            </p>
            <p className="text-base text-ink-soft dark:text-white/50">Unser Büro ist nicht regelmäßig besetzt.</p>
          </address>
        </div>

        <div>
          <h2 className="font-sans text-sm font-semibold text-ink dark:text-white">Seiten</h2>
          <ul className="mt-4 space-y-2 text-base">
            {[...mainNav, ...legalNav].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink-soft no-underline hover:text-ink hover:underline dark:text-white/60 dark:hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <div className="border-t border-line dark:border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-sm text-ink-soft dark:text-white/50 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}</p>
          <p>
            Spendenkonto: {site.bank.name} · IBAN {site.bank.iban}
          </p>
        </Container>
      </div>
    </footer>
  );
}
