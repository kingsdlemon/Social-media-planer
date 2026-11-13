/**
 * Einsatzorte unserer Ehrenamtlichen.
 * Quelle: Seite „Einsatzorte“ der bisherigen Website. Texte gekürzt und vereinheitlicht.
 * TODO: Laut Vereinsangaben sind wir in rund 40 Institutionen tätig – hier stehen bisher
 * nur die Orte, die auf der alten Website beschrieben waren. Liste mit der Broschüre abgleichen.
 */

export type Einsatzort = {
  id: string;
  name: string;
  /** Kurze Beschreibung der Einrichtung */
  about: string;
  /** Was unsere Mitglieder dort tun */
  tasks: string;
  /** Hinweis, wenn dort aktuell Verstärkung gesucht wird */
  wanted?: boolean;
  note?: string;
};

export type Kategorie = {
  id: string;
  title: string;
  intro: string;
  orte: Einsatzort[];
};

export const kategorien: Kategorie[] = [
  {
    id: "museen-shops",
    title: "Museen & Museumsshops",
    intro: "Beraten, verkaufen, Gäste empfangen – mitten im Kulturbetrieb.",
    orte: [
      {
        id: "shop-hlmd",
        name: "Museumsshop des Hessischen Landesmuseums",
        about:
          "Der Shop bietet Wissen, Unterhaltung und Inspiration. Das breite Sortiment spiegelt die Vielfalt des Universalmuseums wider.",
        tasks:
          "Der Museumsshop wird von unseren Mitgliedern getragen und könnte ohne diese Unterstützung nicht bestehen.",
        wanted: true,
      },
      {
        id: "shop-mathildenhoehe",
        name: "Museumsshop auf der Mathildenhöhe",
        about:
          "Der Shop im Oktogon direkt neben dem Museum Künstlerkolonie bietet ein breites Sortiment rund um den Jugendstil. Seit 1996 wird er ehrenamtlich betrieben.",
        tasks: "Gemeinsam mit den Mitarbeiterinnen des Museums übernehmen unsere Mitglieder Beratung und Verkauf.",
      },
      {
        id: "zooshop-vivarium",
        name: "Zooshop im Zoo Vivarium",
        about:
          "Plüsch- und Holztiere, Postkarten mit Tieren aus dem Vivarium, Spielzeug, T-Shirts, Tassen und ein Kinderzoo-Führer – alles rund um „Tiere“ und „Natur“.",
        tasks: "Unsere Mitglieder beraten, verkaufen, bedienen die Kasse und übernehmen die Abrechnung.",
        wanted: true,
      },
      {
        id: "kunsthalle",
        name: "Kunsthalle Darmstadt",
        about:
          "Getragen von einem der ältesten Kunstvereine Deutschlands, fördert die Kunsthalle das Neue und sucht das Gemeinsame – für die Menschen der Stadt, der Region und Gäste von weither.",
        tasks:
          "Unterstützung bei Ausstellungen, am Empfang und im Büro sowie beim „First Friday“ einmal im Monat.",
      },
      {
        id: "spanischer-turm",
        name: "Ausstellungen am Spanischen Turm (Rosenhöhe)",
        about: "Wechselnde Ausstellungen rund um den Spanischen Turm im Park Rosenhöhe.",
        tasks:
          "Ausstellungsbetreuung am Wochenende: Besucherinnen und Besucher informieren und Flyer verteilen.",
      },
    ],
  },
  {
    id: "archive-sammlungen",
    title: "Archive & Sammlungen",
    intro: "Erschließen, digitalisieren, bewahren – oft mit viel Liebe zum Detail.",
    orte: [
      {
        id: "staatsarchiv",
        name: "Hessisches Staatsarchiv und Stadtarchiv Darmstadt",
        about:
          "Das Staatsarchiv ist die zentrale Anlaufstelle für die Geschichte Hessens; das Stadtarchiv bewahrt Unterlagen der städtischen Ämter, Sammlungsgut und Kunstwerke zur Stadtgeschichte.",
        tasks:
          "Quellentexte aus dem Lateinischen, Englischen oder Französischen übersetzen, Bestände reinigen, Ausstellungen betreuen und bei der Digitalisierung helfen.",
      },
      {
        id: "jazzinstitut",
        name: "Jazzinstitut Darmstadt",
        about:
          "Europas größte öffentliche Jazzsammlung – seit 1997 im barocken Bessunger Kavaliershaus. Im Gewölbekeller finden intime Konzerte statt.",
        tasks: "Betreuung der Fotosammlung und des CD-Archivs sowie Video-Digitalisierung.",
      },
      {
        id: "kunst-archiv",
        name: "Kunst Archiv Darmstadt e.V.",
        about: "Die Dokumentationsstelle für die gesamte bildende Kunst im Raum Darmstadt.",
        tasks:
          "Archivieren, digitalisieren, Bestände erfassen, die Bibliothek beaufsichtigen und Mitglieder betreuen. Wegen neuer Ausstellungen, Schenkungen und eines Umzugs wird Verstärkung gesucht.",
        note: "TODO: Prüfen, ob hier aktuell noch Verstärkung gesucht wird (auf der alten Website erwähnt, aber nicht unter „Wir suchen“ gelistet).",
      },
      {
        id: "hfv",
        name: "Hessische familiengeschichtliche Vereinigung (Haus der Geschichte)",
        about:
          "Seit 1921 pflegt die HfV die Familienkunde. Ihre Bibliothek umfasst rund 5.500 Bände, etwa Ortsfamilienbücher und Ortsliteratur.",
        tasks: "Hilfe bei der schrittweisen Digitalisierung der Materialien.",
        note: "TODO: Prüfen, ob hier aktuell noch Verstärkung gesucht wird (auf der alten Website erwähnt, aber nicht unter „Wir suchen“ gelistet).",
      },
      {
        id: "dbges",
        name: "Deutsch-Baltische Gesellschaft e.V.",
        about:
          "Die Gesellschaft bewahrt das kulturelle Erbe der Deutschen aus Estland und Lettland. Ihre Baltische Landeskundliche Sammlung umfasst über 6.000 Bücher, Karten sowie Audio- und Videomedien.",
        tasks: "Datenerfassung, Datenpflege und Datensicherung sowie Hilfe bei Konzertveranstaltungen.",
      },
      {
        id: "buergerstiftung-art",
        name: "buergerstiftung.art – Kunst digital",
        about:
          "Die Bürgerstiftung Darmstadt macht Kunst und Fotografie aus Darmstadt online zugänglich, beginnend mit Werken der Fotografin Hilde Roth und der Künstlerin Roma Engelmann.",
        tasks: "Pflege und Aktualisierung der digitalisierten Inhalte auf der Plattform.",
      },
    ],
  },
  {
    id: "musik-veranstaltungen",
    title: "Musik, Theater & Veranstaltungen",
    intro: "Für alle, die gern dabei sind, wenn sich der Vorhang hebt.",
    orte: [
      {
        id: "konzertchor",
        name: "Konzertchor Darmstadt",
        about:
          "1977 von Wolfgang Seeliger gegründet, gehört der Konzertchor heute zu den bekanntesten Chören Deutschlands.",
        tasks: "Einlass- und Ticketkontrolle, Sitzplatzzuteilung, Programmausgabe und Kontakt zur Bühne.",
      },
      {
        id: "residenzfestspiele",
        name: "Darmstädter Residenzfestspiele",
        about:
          "Das Musikfestival findet jedes Jahr im Juli und August an historischen Spielstätten statt – seit 2001, heute veranstaltet vom Verein Darmstädter Residenzfestspiele e.V.",
        tasks: "Mitarbeit in der Geschäftsstelle und Bürotätigkeiten.",
      },
      {
        id: "papiertheater",
        name: "Papiertheatersammlung Walter Röhler",
        about:
          "Theater für die „kleinen Leute“: Mit flachen Pappfiguren wurden auf kleinen Bühnen Opern, Schauspiele und Märchen aufgeführt – das „Fernsehgerät“ unserer Urgroßeltern.",
        tasks:
          "Gesucht werden Spielerinnen und Spieler mit Fingerfertigkeit und Freude am Sprechen sowie eine Person für Organisatorisches.",
        note: "TODO: Prüfen, ob hier aktuell noch Verstärkung gesucht wird (auf der alten Website erwähnt, aber nicht unter „Wir suchen“ gelistet).",
      },
      {
        id: "waldkunstpfad",
        name: "Internationaler Waldkunstpfad",
        about:
          "Seit 2002 veranstaltet der Verein für Internationale Waldkunst alle zwei Jahre den Waldkunstpfad – Kunst, die den Wald neu erleben lässt.",
        tasks: "Verkauf von Buttons, Hilfe beim Flohmarkt und einzelne Führungen über das Gelände.",
      },
    ],
  },
  {
    id: "parks-denkmaeler",
    title: "Parks, Gärten & Denkmäler",
    intro: "Draußen anpacken – für Darmstadts grüne und steinerne Schätze.",
    orte: [
      {
        id: "rosenhoehe",
        name: "Förderverein Park Rosenhöhe e.V.",
        about:
          "Von Mai bis November blühen im Rosarium mehr als 10.000 Rosen in über 200 Sorten. Mit Hochzeitsturm und Mathildenhöhe bildet der Park ein Darmstädter Gesamtkunstwerk.",
        tasks: "Gartenarbeit wie Rosenschnitt und Unkraut jäten – allein oder im kleinen Team.",
        wanted: true,
      },
      {
        id: "graeber",
        name: "Reinigung historischer Gräber",
        about:
          "In Abstimmung mit dem Grünflächenamt, Abteilung Friedhöfe, pflegen wir denkmalgeschützte Gräber – etwa das Grab des Komponisten Arnold Mendelssohn auf dem Bessunger Friedhof.",
        tasks:
          "Eine feste Gruppe trifft sich regelmäßig und freut sich über neue Leute. Termine kommen über den Mailverteiler; Teilnahme nach Anmeldung.",
        wanted: true,
      },
      {
        id: "denkmalreinigung",
        name: "Denkmalreinigung",
        about:
          "In Abstimmung mit dem Denkmalamt helfen wir, die Denkmäler der Stadt zu erhalten – zum Beispiel die Urne der Großen Landgräfin Karoline im Herrngarten.",
        tasks: "Termine über den Mailverteiler der Abrufgruppe; Teilnahme nach vorheriger Anmeldung.",
      },
      {
        id: "denkmalfotos",
        name: "Fotografieren für das Denkmalamt",
        about: "Zu vorhandenen Schwarz-Weiß-Aufnahmen aus der Denkmaltopographie von 1994 entstehen neue Farbfotos.",
        tasks: "Denkmäler fotografieren und so ihren aktuellen Zustand dokumentieren.",
      },
      {
        id: "friedhofsbuecher",
        name: "Transkription von Friedhofsbüchern",
        about: "Gemeinsam mit Grünflächenamt und Friedhofsverwaltung werden alte Friedhofsbücher lesbar gemacht.",
        tasks: "Alte Handschriften abschreiben (transkribieren).",
      },
    ],
  },
  {
    id: "soziales",
    title: "Bildung & Nachbarschaft",
    intro: "Kultur zu den Menschen bringen.",
    orte: [
      {
        id: "bibliothekskurier",
        name: "Darmstädter Bibliothekskurier",
        about:
          "Ein gemeinsames Projekt von Bürgerstiftung Darmstadt, Stadtbibliothek und Ehrenamt für Darmstadt für Menschen, die nicht mehr selbst zur Bibliothek kommen können.",
        tasks:
          "Bestellte Bücher und Medien mit dem Carsharing-Auto nach Hause bringen. Die Bürgerstiftung trägt die Kosten, die Stadtbibliothek organisiert die Ausleihe.",
      },
      {
        id: "lesepaten",
        name: "Lesepatenschaften mit Mentor e.V.",
        about: "Mentor e.V. arbeitet mit neun Darmstädter Grundschulen zusammen.",
        tasks:
          "Einmal pro Woche rund 45 Minuten mit einem Kind lesen – vor Ort oder online, möglichst ein ganzes Schuljahr lang.",
        wanted: true,
      },
    ],
  },
];

export const anzahlBeschrieben = kategorien.reduce((n, k) => n + k.orte.length, 0);
