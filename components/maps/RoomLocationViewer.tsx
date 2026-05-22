"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet marker icons not loading in Next.js
const customIcon = L.divIcon({
  className: "custom-leaflet-marker",
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-md"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

interface RoomLocationViewerProps {
  coordinates: { lat: number; lng: number };
}

export default function RoomLocationViewer({ coordinates }: RoomLocationViewerProps) {
  const sriLankaBounds: L.LatLngBoundsExpression = [
    [5.916667, 79.516667], // Southwest
    [9.833333, 81.833333], // Northeast
  ];

  return (
    <div className="w-full h-[250px] md:h-[350px] rounded-xl overflow-hidden border border-zinc-800 relative z-0">
      <MapContainer 
        center={coordinates} 
        zoom={14} 
        scrollWheelZoom={false} 
        className="w-full h-full"
        maxBounds={sriLankaBounds}
        maxBoundsViscosity={1.0}
        minZoom={7}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker position={coordinates} icon={customIcon} />
      </MapContainer>
    </div>
  );
}
