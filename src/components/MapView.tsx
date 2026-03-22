
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

// Fix default marker icon issue
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

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

// Component to update map center when location changes
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);

  return null;
}

function MapView({ location }: { location: Location | null | undefined }) {

  // Prevent crash if no data yet or invalid coordinates
  if (!location) {
    return (
      <div style={{ height: "400px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f0f0f0", border: "1px solid #ccc" }}>
        <p>Loading map...</p>
      </div>
    );
  }

  // Check if coordinates are valid numbers
  const lat = parseFloat(location.lat as any);
  const lng = parseFloat(location.lng as any);

  if (isNaN(lat) || isNaN(lng)) {
    return (
      <div style={{ height: "400px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f0f0f0", border: "1px solid #ccc" }}>
        <p>Invalid coordinates</p>
      </div>
    );
  }

  const position: [number, number] = [lat, lng];

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        touchZoom={true}
        doubleClickZoom={false}
        dragging={true}
        zoomControl={true}
        keyboard={false}
        scrollWheelZoom={true}
      >
        {/* Update center dynamically */}
        <ChangeView center={position} />

        {/* Map tiles */}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marker */}
        <Marker position={position}>
          <Popup>
            {location.city}, {location.country}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapView;