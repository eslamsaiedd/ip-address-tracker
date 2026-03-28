import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import { Globe, ExternalLink } from "lucide-react";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow });
L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
  lat: number;
  lng: number;
  city: string;
  region: string;
  postalCode: string;
  timezone: string;
  country: string;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

function MapView({ location }: { location: Location | null | undefined }) {
  if (!location) return null;

  const lat = parseFloat(location.lat as any);
  const lng = parseFloat(location.lng as any);
  if (isNaN(lat) || isNaN(lng)) return null;

  const position: [number, number] = [lat, lng];
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <div
      className="relative w-full h-[300px] sm:h-[420px] lg:h-[500px] rounded-[16px] overflow-hidden shadow-md"
      role="region"
      aria-label={`Map showing ${location.city}, ${location.country}`}
    >
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        touchZoom={true}
        doubleClickZoom={false}
        dragging={true}
        zoomControl={true}
        keyboard={true}
        scrollWheelZoom={false}
        attributionControl={false}
      >
        <ChangeView center={position} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <strong>{location.city}</strong>, {location.region}
            <br />
            {location.country}
          </Popup>
        </Marker>
      </MapContainer>

      {/* Mobile: stacked bottom bar — both items full width */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] flex sm:hidden flex-col gap-1.5 p-2">
        {/* Geographic Context */}
        <div className="flex items-center gap-2 bg-white dark:bg-[#1e293b] rounded-[10px] px-3 py-2 shadow-lg w-full">
          <div className="w-7 h-7 rounded-full bg-[var(--primary-color)] flex items-center justify-center flex-shrink-0">
            <Globe className="w-3.5 h-3.5 text-white" aria-hidden="true" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-bold text-[var(--black-color)] dark:text-white leading-tight">
              Geographic Context
            </span>
            <span className="text-[10px] text-[#64748b] dark:text-[var(--gray-color)] font-mono leading-tight truncate">
              {lat.toFixed(4)}° N, {Math.abs(lng).toFixed(4)}° {lng >= 0 ? "E" : "W"}
            </span>
          </div>
        </div>

        {/* Open in Google Maps */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-white dark:bg-[#1e293b] rounded-[10px] px-3 py-2 shadow-lg w-full text-[12px] font-semibold text-[var(--black-color)] dark:text-white hover:bg-[var(--primary-color)] hover:text-white dark:hover:bg-[var(--primary-color)] transition-all duration-200 group"
          aria-label={`Open ${location.city}, ${location.country} in Google Maps`}
        >
          Open in Google Maps
          <ExternalLink className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
        </a>
      </div>

      {/* Desktop: side by side overlays */}
      <div className="absolute bottom-3 left-3 z-[1000] hidden sm:flex items-center gap-2.5 bg-white dark:bg-[#1e293b] rounded-[12px] px-3.5 py-2.5 shadow-lg">
        <div className="w-8 h-8 rounded-full bg-[var(--primary-color)] flex items-center justify-center flex-shrink-0">
          <Globe className="w-4 h-4 text-white" aria-hidden="true" />
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] font-bold text-[var(--black-color)] dark:text-white leading-tight">
            Geographic Context
          </span>
          <span className="text-[11px] text-[#64748b] dark:text-[var(--gray-color)] font-mono leading-tight">
            {lat.toFixed(4)}° N, {Math.abs(lng).toFixed(4)}° {lng >= 0 ? "E" : "W"}
          </span>
        </div>
      </div>

      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 z-[1000] hidden sm:flex items-center gap-2 bg-white dark:bg-[#1e293b] rounded-[12px] px-3.5 py-2.5 shadow-lg text-[12px] font-semibold text-[var(--black-color)] dark:text-white hover:bg-[var(--primary-color)] hover:text-white dark:hover:bg-[var(--primary-color)] transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2E5BFF]"
        aria-label={`Open ${location.city}, ${location.country} in Google Maps`}
      >
        Open in Google Maps
        <ExternalLink className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
      </a>
    </div>
  );
}

export default MapView;
