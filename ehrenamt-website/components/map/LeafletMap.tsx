"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { mapPoints } from "./orte";

// Schlichter, runder Marker im Apple-Blau (keine externen Marker-Bilder nötig)
const dot = L.divIcon({
  className: "",
  html: '<span style="display:block;width:18px;height:18px;border-radius:9999px;background:#0071e3;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3)"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export default function LeafletMap() {
  return (
    <MapContainer center={[49.873, 8.66]} zoom={14} scrollWheelZoom={false} className="h-full w-full" attributionControl>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mapPoints.map((p) => (
        <Marker key={p.name} position={[p.lat, p.lng]} icon={dot} title={p.name}>
          <Popup>
            <strong>{p.name}</strong>
            {p.anchor && (
              <>
                <br />
                <a href={`#${p.anchor}`}>Mehr erfahren ›</a>
              </>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
