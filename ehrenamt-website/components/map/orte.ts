/**
 * Kartenpunkte. Koordinaten sind ungefähre Lagen (Stand: Demo).
 * TODO: Koordinaten vom Verein prüfen lassen und weitere Einsatzorte ergänzen.
 */
export type MapPoint = { name: string; lat: number; lng: number; anchor?: string };

export const mapPoints: MapPoint[] = [
  { name: "Geschäftsstelle – John-F.-Kennedy-Haus", lat: 49.8738, lng: 8.6467 },
  { name: "Hessisches Landesmuseum (Museumsshop)", lat: 49.8742, lng: 8.6552, anchor: "museumsshop-des-hessischen-landesmuseums" },
  { name: "Mathildenhöhe (Museumsshop)", lat: 49.8771, lng: 8.6667, anchor: "museumsshop-auf-der-mathildenhoehe" },
  { name: "Zoo Vivarium (Zooshop)", lat: 49.8685, lng: 8.6826, anchor: "zooshop-im-zoo-vivarium" },
  { name: "Kunsthalle Darmstadt", lat: 49.8767, lng: 8.648, anchor: "kunsthalle-darmstadt" },
  { name: "Park Rosenhöhe & Spanischer Turm", lat: 49.8799, lng: 8.6765, anchor: "foerderverein-park-rosenhoehe-e-v" },
  { name: "Haus der Geschichte (Staats- & Stadtarchiv)", lat: 49.8752, lng: 8.6573, anchor: "hessisches-staatsarchiv-und-stadtarchiv-darmstadt" },
  { name: "Residenzschloss (Residenzfestspiele)", lat: 49.8728, lng: 8.6556, anchor: "darmstaedter-residenzfestspiele" },
  { name: "Jazzinstitut Darmstadt", lat: 49.8618, lng: 8.656, anchor: "jazzinstitut-darmstadt" },
];
