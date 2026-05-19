import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { Report } from '../types';
import { Link } from 'react-router-dom';
import { StatusBadge, ConditionBadge } from './Badge';
import {
  TAGO_CENTER,
  MAP_TILE_URL,
  MAP_TILE_ATTRIBUTION } from
'../data/tagoBounds';
interface StrayMapProps {
  reports: Report[];
  height?: string;
  center?: [number, number];
  zoom?: number;
}
export function StrayMap({
  reports,
  height = '100%',
  center = TAGO_CENTER,
  zoom = 13
}: StrayMapProps) {
  const getMarkerColor = (report: Report) => {
    if (report.status === 'resolved')
    return 'bg-[#A3E635] shadow-[0_0_15px_rgba(163,230,53,0.6)]';
    switch (report.condition_tag) {
      case 'aggressive':
        return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]';
      case 'injured':
        return 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)]';
      case 'roaming':
        return 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]';
      case 'needs_rescue':
        return 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)]';
      default:
        return 'bg-zinc-500';
    }
  };
  const createCustomIcon = (report: Report) => {
    const colorClass = getMarkerColor(report);
    return divIcon({
      className: 'custom-leaflet-icon',
      html: `<div class="w-4 h-4 rounded-full border-2 border-zinc-900 ${colorClass}"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  };
  return (
    <div
      style={{
        height,
        width: '100%',
        zIndex: 0
      }}
      className="relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900">
      
      <MapContainer
        center={center}
        zoom={zoom}
        style={{
          height: '100%',
          width: '100%'
        }}
        scrollWheelZoom={true}>
        
        <TileLayer attribution={MAP_TILE_ATTRIBUTION} url={MAP_TILE_URL} />
        {reports.map((report) =>
        <Marker
          key={report.id}
          position={[report.latitude, report.longitude]}
          icon={createCustomIcon(report)}>
          
            <Popup className="rounded-xl">
              <div className="w-48">
                {report.photo_url &&
              <img
                src={report.photo_url}
                alt="Stray animal"
                className="w-full h-24 object-cover rounded-t-lg mb-2" />

              }
                <div className="px-1 pb-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold capitalize text-zinc-100 m-0">
                      {report.animal_type}
                    </h4>
                  </div>
                  <div className="flex gap-1.5 mb-3 flex-wrap">
                    <StatusBadge status={report.status} />
                    <ConditionBadge condition={report.condition_tag} />
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2 mb-3 m-0">
                    {report.description}
                  </p>
                  <Link
                  to={`/reports/${report.id}`}
                  className="block text-center bg-white/10 text-white text-xs py-2 rounded-lg hover:bg-white/20 transition-colors font-medium border border-white/5">
                  
                    View Details
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>);

}