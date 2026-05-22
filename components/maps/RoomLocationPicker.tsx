"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";

// Fix for default Leaflet marker icons not loading in Next.js
const customIcon = L.divIcon({
  className: "custom-leaflet-marker",
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-md"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

interface RoomLocationPickerProps {
  defaultLocation?: { lat: number; lng: number };
  onChange: (location: { lat: number; lng: number }) => void;
}

// Sub-component to handle map clicks and move the marker
function LocationMarker({ position, setPosition, onChange }: { 
  position: L.LatLng | null; 
  setPosition: (pos: L.LatLng) => void;
  onChange: (pos: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={customIcon} />
  );
}

function SearchField({ setPosition, onChange }: { 
  setPosition: (pos: L.LatLng) => void; 
  onChange: (pos: { lat: number; lng: number }) => void 
}) {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider({
      params: {
        countrycodes: 'lk', // Limit search to Sri Lanka
      },
    });
    
    // @ts-ignore - GeoSearchControl types might not be perfectly aligned
    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'bar',
      showMarker: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
      searchLabel: 'Enter address, city, or area...',
    });

    map.addControl(searchControl);

    const handleLocation = (result: any) => {
      if (result && result.location) {
        const pos = L.latLng(result.location.y, result.location.x);
        setPosition(pos);
        onChange({ lat: pos.lat, lng: pos.lng });
      }
    };

    map.on('geosearch/showlocation', handleLocation);

    return () => {
      map.removeControl(searchControl);
      map.off('geosearch/showlocation', handleLocation);
    };
  }, [map, setPosition, onChange]);

  return null;
}

export default function RoomLocationPicker({ defaultLocation, onChange }: RoomLocationPickerProps) {
  // Center defaults to Colombo, Sri Lanka if no default is provided
  const center = defaultLocation || { lat: 6.9271, lng: 79.8612 };
  
  const [position, setPosition] = useState<L.LatLng | null>(
    defaultLocation ? L.latLng(defaultLocation.lat, defaultLocation.lng) : null
  );

  const sriLankaBounds: L.LatLngBoundsExpression = [
    [5.916667, 79.516667], // Southwest
    [9.833333, 81.833333], // Northeast
  ];

  return (
    <div className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden border border-zinc-800 relative z-0">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true} 
        className="w-full h-full"
        maxBounds={sriLankaBounds}
        maxBoundsViscosity={1.0}
        minZoom={7}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <LocationMarker 
          position={position} 
          setPosition={setPosition} 
          onChange={onChange} 
        />
        <SearchField 
          setPosition={setPosition} 
          onChange={onChange} 
        />
      </MapContainer>
      
      {/* Overlay hint */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] pointer-events-none">
        <div className="bg-zinc-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-700/50 shadow-xl">
          <span className="text-xs font-semibold text-zinc-200">
            Click on the map to place a pin
          </span>
        </div>
      </div>
    </div>
  );
}
