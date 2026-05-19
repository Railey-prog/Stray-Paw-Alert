import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { MapPin } from 'lucide-react';
import {
  TAGO_CENTER,
  TAGO_BOUNDS,
  TAGO_MIN_ZOOM,
  MAP_TILE_URL,
  MAP_TILE_ATTRIBUTION,
  isWithinTago } from
'../data/tagoBounds';

interface LocationPickerProps {
  position: [number, number] | null;
  onChange: (pos: [number, number]) => void;
}

function FlyTo({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 17, { duration: 1.2 });
    }
  }, [position, map]);
  return null;
}

function LocationMarker({ position }: { position: [number, number] | null }) {
  const icon = divIcon({
    className: 'custom-leaflet-icon',
    html: `<div class="w-5 h-5 rounded-full bg-[#E76F51] border-2 border-white shadow-[0_0_15px_rgba(231,111,81,0.6)] animate-bounce"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
  return position === null ? null : <Marker position={position} icon={icon} />;
}

function MapClickHandler({
  onChange,
  onOutOfBounds
}: {
  onChange: (pos: [number, number]) => void;
  onOutOfBounds: () => void;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      if (isWithinTago(lat, lng)) {
        onChange([lat, lng]);
      } else {
        onOutOfBounds();
      }
    }
  });
  return null;
}

export function LocationPicker({ position, onChange }: LocationPickerProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [clickWarning, setClickWarning] = useState(false);

  const handleGetLocation = () => {
    setIsLocating(true);
    setLocationError('');
    setClickWarning(false);
    if (!('geolocation' in navigator)) {
      onChange(TAGO_CENTER);
      setLocationError(
        "Geolocation isn't available in this browser. Please tap on the map to drop a pin within Tago."
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
        onChange(TAGO_CENTER);
        setLocationError(
          err.code === 1
            ? "Location access is blocked. Please tap on the map to drop a pin within Tago."
            : "Couldn't get your exact location. Please tap on the map to drop a pin within Tago."
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  const handleOutOfBounds = () => {
    setClickWarning(true);
    setTimeout(() => setClickWarning(false), 3000);
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
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          maxBounds={TAGO_BOUNDS}
          maxBoundsViscosity={1.0}
          minZoom={TAGO_MIN_ZOOM}>
          <TileLayer attribution={MAP_TILE_ATTRIBUTION} url={MAP_TILE_URL} />
          <LocationMarker position={position} />
          <FlyTo position={position} />
          <MapClickHandler onChange={onChange} onOutOfBounds={handleOutOfBounds} />
        </MapContainer>
      </div>

      {clickWarning ? (
        <p className="text-xs text-red-700 font-medium bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          That spot is outside Tago Municipality. Please tap within the covered area.
        </p>
      ) : locationError ? (
        <p className="text-xs text-amber-700 font-medium bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          {locationError}
        </p>
      ) : (
        <p className="text-xs text-slate-500">
          Tap anywhere on the map to drop a pin, or use{' '}
          <span className="font-semibold text-[#2D6A4F]">Use My Location</span>{' '}
          for GPS. Only locations within Tago Municipality can be pinned.
        </p>
      )}
    </div>
  );
}
