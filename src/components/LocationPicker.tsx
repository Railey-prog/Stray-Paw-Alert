import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { MapPin } from 'lucide-react';
import {
  TAGO_CENTER,
  MAP_TILE_URL,
  MAP_TILE_ATTRIBUTION } from
'../data/tagoBounds';
interface LocationPickerProps {
  position: [number, number] | null;
  onChange: (pos: [number, number]) => void;
}
// Re-center the map whenever the position changes (e.g. after GPS lock)
function FlyTo({ position }: {position: [number, number] | null;}) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 17, {
        duration: 1.2
      });
    }
  }, [position, map]);
  return null;
}
function LocationMarker({ position }: {position: [number, number] | null;}) {
  const icon = divIcon({
    className: 'custom-leaflet-icon',
    html: `<div class="w-5 h-5 rounded-full bg-[#E76F51] border-2 border-white shadow-[0_0_15px_rgba(231,111,81,0.6)] animate-bounce"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
  return position === null ? null : <Marker position={position} icon={icon} />;
}
export function LocationPicker({ position, onChange }: LocationPickerProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const handleGetLocation = () => {
    setIsLocating(true);
    setLocationError('');
    if (!('geolocation' in navigator)) {
      onChange(TAGO_CENTER);
      setLocationError(
        "Geolocation isn't available in this browser. We've pinned Tago town center — please adjust the barangay below if needed."
      );
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange([pos.coords.latitude, pos.coords.longitude]);
        setIsLocating(false);
      },
      (err) => {
        console.error('Error getting location:', err);
        // Graceful fallback: pin Tago town center so the form can still be submitted
        onChange(TAGO_CENTER);
        setLocationError(
          err.code === 1 ?
          "Location access is blocked. We've pinned Tago town center as a fallback — please choose the correct barangay below." :
          "We couldn't get your exact location. Pinned Tago town center as a fallback — please choose the correct barangay below."
        );
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0
      }
    );
  };
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-bold text-slate-700">
          Location Pin
        </label>
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={isLocating}
          className="text-sm flex items-center gap-1.5 text-[#2D6A4F] hover:text-[#1b4332] font-semibold transition-colors disabled:opacity-60">
          
          <MapPin size={16} />
          {isLocating ? 'Locating...' : 'Use My Location'}
        </button>
      </div>

      <div className="h-64 w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm relative z-0 bg-slate-100">
        <MapContainer
          center={position || TAGO_CENTER}
          zoom={14}
          style={{
            height: '100%',
            width: '100%'
          }}>
          
          <TileLayer attribution={MAP_TILE_ATTRIBUTION} url={MAP_TILE_URL} />
          <LocationMarker position={position} />
          <FlyTo position={position} />
        </MapContainer>
      </div>

      {locationError ?
      <p className="text-xs text-amber-700 font-medium bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          {locationError}
        </p> :

      <p className="text-xs text-slate-500">
          Tap{' '}
          <span className="font-semibold text-[#2D6A4F]">Use My Location</span>{' '}
          to drop a pin at your current spot. You can pan and zoom the map, but
          the pin is set automatically.
        </p>
      }
    </div>);

}