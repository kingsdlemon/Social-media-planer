import { defaultDescription, siteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

/** schema.org-Daten (JSON-LD): Verein als NGO/Organization und die Website */
export function StructuredData() {
  const orgId = `${siteUrl}/#verein`;
  const address = {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    postalCode: site.address.zip,
    addressLocality: site.address.city,
    addressRegion: "Hessen",
    addressCountry: "DE",
  };
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["NGO", "Organization"],
        "@id": orgId,
        name: site.name,
        legalName: site.name,
        alternateName: [site.shortName, site.abbreviation],
        url: `${siteUrl}/`,
        logo: { "@type": "ImageObject", url: `${siteUrl}${site.logo.src}`, width: site.logo.width, height: site.logo.height },
        image: `${siteUrl}/og-image.png`,
        description: defaultDescription,
        slogan: site.claim,
        foundingDate: "1994-01",
        founder: { "@type": "Person", name: "Uta Müller-Merbach" },
        email: site.email,
        telephone: "+49 151 43308044",
        address,
        location: { "@type": "Place", name: site.address.building, address },
        areaServed: { "@type": "City", name: "Darmstadt" },
        memberOf: { "@type": "Organization", name: site.umbrella.name, url: site.umbrella.url },
        identifier: { "@type": "PropertyValue", propertyID: `Vereinsregister ${site.register.court}`, value: site.register.number },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Geschäftsstelle",
          email: site.email,
          telephone: "+49 151 43308044",
          availableLanguage: "de",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: site.name,
        inLanguage: "de-DE",
        publisher: { "@id": orgId },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      // „<“ maskieren, damit der Inhalt das Script-Tag nie beenden kann
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
