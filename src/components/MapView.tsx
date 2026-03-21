
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
  // Prevent crash if no data yet
  if (!location) return null;

  const position: [number, number] = [location.lat, location.lng];

  return (
    <div style={{ height: "500px", width: "100%", touchAction: "none" }}>
      <MapContainer
        center={position}
        zoom={13}
        touchZoom={true}         
        doubleClickZoom={false}  
        dragging={true}          
        zoomControl={false}    
        keyboard={false}       
        scrollWheelZoom={true}
        style={{ height: "100vh", width: "100%" }}
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