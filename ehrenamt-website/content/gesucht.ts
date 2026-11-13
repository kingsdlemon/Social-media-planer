/**
 * Aktuelle Gesuche („Wir suchen“).
 * Quelle: Seite „Wir suchen“ der bisherigen Website.
 * TODO: Aktualität aller Gesuche mit dem Vorstand abstimmen; ggf. Datum „Stand“ pflegen.
 */

export type Gesuch = {
  id: string;
  title: string;
  place: string;
  text: string[];
  facts?: string[];
};

export const gesuche: Gesuch[] = [
  {
    id: "vorsitz",
    title: "Erste Vorsitzende / erster Vorsitzender (m/w/d)",
    place: "In eigener Sache – Vorstand Ehrenamt für Darmstadt",
    text: [
      "Der Vorsitz unseres Vereins ist derzeit unbesetzt. Die Aufgabe gibt Ihnen einen tiefen Einblick in die Kunst- und Kulturinstitutionen Darmstadts und eröffnet Raum für neue Projekte, die sich ehrenamtlich stemmen lassen.",
      "Ein Netzwerk mit Verantwortlichen in der Kultur und darüber hinaus aufzubauen und zu pflegen, gehört wünschenswert dazu. Wie intensiv Sie den Verein führen und voranbringen, gestalten Sie selbst. Ein engagiertes ehrenamtliches Vorstandsteam steht Ihnen zur Seite – Teamfähigkeit setzen wir voraus, eine Einarbeitung ist Ehrensache.",
    ],
  },
  {
    id: "shop-hlmd",
    title: "Verkäuferinnen und Verkäufer",
    place: "Museumsshop im Hessischen Landesmuseum (HLMD)",
    text: [
      "Der Museumsshop bietet mit seinen Produkten Wissen, Unterhaltung und Inspiration. Das breite Sortiment spiegelt die Vielfalt des Universalmuseums wider.",
    ],
    facts: ["Sorgfältige Einarbeitung"],
  },
  {
    id: "zooshop",
    title: "Verkäuferinnen und Verkäufer",
    place: "Shop im Zoo Vivarium",
    text: [
      "Der Zooshop bietet großen und kleinen Gästen ein abwechslungsreiches Sortiment rund um „Tiere“ und „Natur“. Wenn Ihnen Beratung und Verkauf Spaß machen, freuen wir uns über Ihre Nachricht.",
    ],
  },
  {
    id: "rosenhoehe",
    title: "Gartenhelferinnen und Gartenhelfer",
    place: "Park Rosenhöhe (Förderverein Park Rosenhöhe)",
    text: [
      "Die Rosenhöhe ist einer der beliebtesten Parks in Südhessen – und will gepflegt sein. Sie unterstützen die Gärtnerinnen und Gärtner der Stadt Darmstadt, vor allem beim Unkrautjäten und Rosenschneiden. Besonderes Wissen ist nicht nötig: Die leitende Gärtnerin der Stadt weist Sie ein und betreut Sie.",
      "Sie bekommen einen kleinen eigenen Pflegebereich. Wann und wie lange Sie arbeiten, bestimmen Sie selbst. Gern auch als kleines Team mit anschließendem Kaffeeplausch – oder allein, um in schöner Umgebung den Kopf frei zu bekommen. Auf Wunsch sind Sie zu den Treffen und Feiern der Ehrenamtlichen des Fördervereins eingeladen.",
    ],
    facts: ["Ein paar Stunden pro Woche oder alle 14 Tage", "Keine Vorkenntnisse nötig", "Bei längerer Abwesenheit kurz Bescheid geben"],
  },
  {
    id: "lesepaten",
    title: "Lesepatinnen und Lesepaten",
    place: "Grundschulen in Darmstadt (mit Mentor e.V.)",
    text: [
      "Mentor e.V. arbeitet mit neun Darmstädter Grundschulen zusammen und vermittelt Lesepatenschaften. Jede Patin, jeder Pate begleitet ein Kind – in der Schule oder online. Bitte schreiben Sie uns, was Ihnen lieber ist; wir koordinieren die Anfragen und schicken Ihnen alle organisatorischen Informationen.",
    ],
    facts: [
      "Einmal pro Woche, ca. 45 Minuten",
      "Möglichst mindestens ein Schuljahr",
      "Erweitertes Führungszeugnis nötig – mit Bestätigung von Mentor e.V. kostenlos",
    ],
  },
  {
    id: "grabsteine",
    title: "Pflegerinnen und Pfleger für historische Grabsteine",
    place: "Alter Friedhof Darmstadt",
    text: [
      "Gemeinsam mit anderen reinigen Sie unter fachlicher Anleitung historische Grabsteine denkmalgerecht von Algen, Flechten und Schmutz. So bleiben die Steine länger erhalten und die Inschriften werden wieder lesbar.",
    ],
    facts: ["Arbeit im Freien, in der Gruppe", "Anleitung zur denkmalgerechten Reinigung"],
  },
];
