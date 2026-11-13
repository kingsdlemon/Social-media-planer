/**
 * Meldungen für „Aktuelles“. Neueste zuerst.
 * Quelle: Seiten „Aktuelles“ und „Archiv“ der bisherigen Website.
 * `date` im ISO-Format (für Sortierung); `dateLabel` für die Anzeige, falls nur Monat/Jahr bekannt.
 */

export type Meldung = {
  id: string;
  date: string | null;
  dateLabel: string;
  title: string;
  text: string[];
  links?: { href: string; label: string }[];
  todo?: string;
};

export const meldungen: Meldung[] = [
  {
    id: "mv-2026",
    date: null,
    dateLabel: "2026",
    title: "Mitgliederversammlung 2026",
    text: ["Die nächste Mitgliederversammlung findet 2026 statt. Alle Mitglieder erhalten rechtzeitig eine Einladung."],
    todo: "Datum und Ergebnisse der Mitgliederversammlung 2026 ergänzen.",
  },
  {
    id: "buergerstiftung-it",
    date: null,
    dateLabel: "Neu",
    title: "Bürgerstiftung fördert neue Technik für unsere Geschäftsstelle",
    text: [
      "Die Computer und Drucker in unserer Geschäftsstelle waren teils über zehn Jahre alt, für den Kopierer gab es keine Ersatzteile mehr, und nach der Wiedereröffnung des Literaturhauses waren Festnetz und Internetanschluss verloren.",
      "Deshalb haben wir moderne, sparsame Geräte angeschafft, die uns die nächsten Jahre gut begleiten werden. Die Bürgerstiftung Darmstadt hat diese Investition in voller Höhe gefördert – dafür sagen wir herzlich Danke!",
    ],
    links: [{ href: "https://www.buergerstiftung-darmstadt.de", label: "Bürgerstiftung Darmstadt" }],
    todo: "Datum der Meldung ergänzen.",
  },
  {
    id: "buergerstiftung-art",
    date: null,
    dateLabel: "Neu",
    title: "Kunst digital erleben: Zusammenarbeit mit buergerstiftung.art",
    text: [
      "Auf buergerstiftung.art macht die Bürgerstiftung Darmstadt Kunst und Fotografie aus Darmstadt und der Region für alle zugänglich – beginnend mit Fotografien von Hilde Roth und Werken von Roma Engelmann, die bisher in Archiven verborgen waren.",
      "Unsere Ehrenamtlichen pflegen und aktualisieren die digitalisierten Inhalte. So wächst die Sammlung stetig – für alle, jederzeit, von überall.",
    ],
    links: [
      {
        href: "https://www.buergerstiftung.art/die-projektbeteiligten/ehrenamt-fuer-darmstadt-ev",
        label: "Unser Eintrag auf buergerstiftung.art",
      },
    ],
    todo: "Datum der Meldung ergänzen.",
  },
  {
    id: "mv-2025",
    date: "2025-02-23",
    dateLabel: "23. Februar 2025",
    title: "Mitgliederversammlung 2025",
    text: [
      "Dr. Marjam Schellhaas, die den Vorsitz niederlegte, blickte auf das Jahr 2024 zurück und stellte die aktuellen Einsatzorte vor. Die Mitglieder entlasteten den Vorstand und bestätigten Beatrice Wesp als zweite Vorsitzende, Marion Mojzis als Schriftführerin und Peter Kailing als Schatzmeister. Erika Rehm wurde als Kassenprüferin bestätigt, Günter Muth neu gewählt.",
      "Wir danken Marjam Schellhaas für ihren großen Einsatz: Viele Projekte – etwa die Pflege von Gräbern und Denkmälern, der Dachverband Kultur oder die Rekonstruktion des Ludwigs-Tempels – wurden dank ihres Engagements angestoßen und umgesetzt. Unser Dank gilt auch Ruth Bothe, die das Amt der Kassenprüferin an Günter Muth übergeben hat – und allen Ehrenamtlichen, die Kultur in Darmstadt lebendig halten.",
    ],
  },
  {
    id: "denkmalschutzpreis",
    date: null,
    dateLabel: "28. August",
    title: "Hessischer Denkmalschutzpreis: Ehrenamtspreis für den Ludwigs-Tempel",
    text: [
      "Mit dem Ehrenamtspreis des Hessischen Denkmalschutzpreises wird gemeinschaftliches Engagement für ein Kulturdenkmal ausgezeichnet. Die Wiederherstellung des 1995 mutwillig zerstörten Ludwigs-Tempels – ein Gemeinschaftsprojekt unseres Vereins, des Vereins Stadtbild Deutschland e.V. (Ortsverband Darmstadt) und des Rotary Clubs Darmstadt – gehört zu den drei Preisträgerprojekten.",
      "„Diejenigen, die wir heute mit dem Ehrenamtspreis ausgezeichnet haben, sind ein großes Glück für die hessische Denkmalpflege“, sagte Staatssekretär Benedikt Kuhn, Chef der Hessischen Staatskanzlei. Wir nehmen die Auszeichnung zum Anlass, allen unseren Mitgliedern für ihr Engagement zu danken – ganz gleich, wo sie sich einbringen.",
    ],
    todo: "Jahr der Preisverleihung ergänzen (vermutlich 2024).",
  },
  {
    id: "mobil",
    date: null,
    dateLabel: "Hinweis",
    title: "Neue Telefonnummer: Wir sind mobil erreichbar",
    text: [
      "Die Telefonanlage im Literaturhaus ist dauerhaft defekt. Unsere Geschäftsstelle erreichen Sie deshalb unter 0151 43308044 – und natürlich weiterhin per E-Mail an info@ehrenamt-darmstadt.de. Bitte beachten Sie, dass unser Büro nicht regelmäßig besetzt ist.",
    ],
  },
  {
    id: "engagement-tag-2024",
    date: "2024-06-15",
    dateLabel: "15. Juni 2024",
    title: "Selbsthilfe- und Engagement-Tag auf dem Friedensplatz",
    text: [
      "Von 10 bis 15 Uhr waren wir mit einem Stand vertreten und haben über unsere Ziele, die Mitgliedschaft und die vielen Möglichkeiten der Mitarbeit in Darmstädter Kulturinstitutionen informiert.",
    ],
  },
  {
    id: "broschuere-2024",
    date: "2024-01-01",
    dateLabel: "2024",
    title: "Broschüre „Projekte 2024“",
    text: ["Alle unsere derzeitigen Aktivitäten auf einen Blick – in unserer aktualisierten Projektbroschüre."],
    links: [{ href: "/downloads/broschuere-projekte.pdf", label: "Broschüre herunterladen (PDF, ca. 9 MB)" }],
  },
  {
    id: "jubilaeum",
    date: "2023-11-28",
    dateLabel: "28. November 2023",
    title: "30 Jahre Ehrenamt für Darmstadt",
    text: ["Unser Verein feierte sein 30-jähriges Jubiläum im Ernst-Ludwig-Saal in Eberstadt."],
  },
  {
    id: "ludwigstempel",
    date: "2023-10-18",
    dateLabel: "18. Oktober 2023",
    title: "Der Ludwigs-Tempel steht wieder",
    text: [
      "Der Pavillon wurde 1877 von Valentin Justus Noack gestiftet und in der damaligen „Anlage am Exerzierplatz“ – der heutigen Albert-Schweitzer-Anlage – aufgestellt. Am 22. September 1995 wurde das denkmalgeschützte Bauwerk mutwillig zerstört; die Denkmalschutzbehörde lagerte die Bruchstücke ein.",
      "Gemeinsam mit dem Verein Stadtbild Deutschland e.V. – Ortsverband Darmstadt – haben wir Spenden gesammelt, die die Rekonstruktion unter Verwendung der Originalteile ermöglichten. Fast drei Jahrzehnte nach der Zerstörung wurde der Ludwigs-Tempel am 18. Oktober 2023 wieder eingeweiht.",
      "Gefördert von: Bauverein AG, Bormuth Götz Metallbauer, Bürgerstiftung Darmstadt, ENTEGA Stiftung, Jubiläumsstiftung der Sparkasse Darmstadt, Merck’sche Gesellschaft für Kunst und Wissenschaft, Rotary Club Darmstadt, Armin Schwarm, Sparkasse Darmstadt, Uhland GmbH Schreinerei, Wissenschaftsstadt Darmstadt sowie zahlreiche Spenden aus der Bürgerschaft.",
    ],
    links: [{ href: "https://www.darmstadt-stadtbild-deutschland.de/", label: "Stadtbild Deutschland e.V. – Ortsverband Darmstadt" }],
  },
  {
    id: "engagement-tag-2023",
    date: "2023-07-15",
    dateLabel: "15. Juli 2023",
    title: "Gut besuchter Stand beim Engagement-Tag",
    text: ["Unser Stand beim Selbsthilfe- und Engagement-Tag auf dem Friedensplatz war gut besucht – vielen Dank für die vielen Gespräche!"],
  },
  {
    id: "stammtisch",
    date: "2023-06-07",
    dateLabel: "Juni 2023",
    title: "Stammtisch der Denkmalreinigungsgruppe",
    text: [
      "Die Gruppe, die sich um die Denkmäler auf dem Alten Friedhof kümmert, trifft sich wieder zum Stammtisch: jeden ersten Mittwoch im Monat ab 18 Uhr in der Pizzeria Rosso e Bianco, Winkelschneise 9, Darmstadt.",
    ],
    todo: "Prüfen, ob der Stammtisch noch zu diesen Bedingungen stattfindet.",
  },
  {
    id: "mv-2023",
    date: "2023-03-26",
    dateLabel: "26. März 2023",
    title: "32. Mitgliederversammlung",
    text: [
      "20 Mitglieder kamen ins Literaturhaus. Wir haben die Entwicklung der Mitgliederzahlen vorgestellt, über die Führungen für Mitglieder berichtet und aktuelle wie künftige Projekte präsentiert. Neu gewählt wurden die zweite Vorsitzende und die Schriftführerin. Der Kassenbericht wurde angenommen und der Vorstand entlastet.",
    ],
  },
  {
    id: "shop-25",
    date: "2021-10-29",
    dateLabel: "29. Oktober 2021",
    title: "25 Jahre Museumsshop auf der Mathildenhöhe",
    text: [
      "Im Oktober 1996 beschloss die Stadt Darmstadt, im kleinen Oktogon-Anbau des heutigen Museums Künstlerkolonie einen Museumsshop einzurichten – unter der Bedingung, dass er ehrenamtlich betrieben wird. Seitdem führen unsere Mitglieder den Shop. Anfangs gehörte auch der Einkauf dazu, heute konzentrieren sie sich auf Beratung und Verkauf.",
    ],
  },
];

/**
 * Jahresberichte und Vereinszeitschriften aus dem Archiv der alten Website.
 * TODO: PDFs von der alten Website sichern und unter /public/downloads/ ablegen, dann hier verlinken.
 */
export const archivDokumente = [
  "Jahresbericht 2022",
  "Jahresbericht 2021",
  "Jahresbericht 2020",
  "Vereinszeitschrift 2015–2019 (mehrere Ausgaben)",
];
