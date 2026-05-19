import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  MapPin,
  Calendar,
  User,
  Clock,
  ShieldAlert,
  Home } from
'lucide-react';
import { useReports } from '../context/ReportContext';
import { StatusBadge, ConditionBadge } from '../components/Badge';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { divIcon } from 'leaflet';
import {
  TAGO_BOUNDS,
  TAGO_MIN_ZOOM,
  TAGO_MAX_ZOOM,
  MAP_TILE_URL,
  MAP_TILE_ATTRIBUTION } from
'../data/tagoBounds';
export function ReportDetail() {
  const { id } = useParams<{
    id: string;
  }>();
  const { reports } = useReports();
  const navigate = useNavigate();
  const report = reports.find((r) => r.id === id);
  if (!report) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Report Not Found
        </h2>
        <button
          onClick={() => navigate('/reports')}
          className="text-[#2D6A4F] hover:underline font-medium">
          
          Back to Reports
        </button>
      </div>);

  }
  const date = new Date(report.created_at).toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short'
  });
  const mapIcon = divIcon({
    className: 'custom-leaflet-icon',
    html: `<div class="w-5 h-5 rounded-full bg-[#E76F51] border-2 border-white shadow-[0_0_15px_rgba(231,111,81,0.6)]"></div>`,
    iconSize: [20, 20]
  });
  return (
    <div className="pb-12">
      {/* Hero Image Section */}
      <div className="w-full h-[35vh] min-h-[240px] sm:h-[40vh] sm:min-h-[300px] relative bg-slate-900">
        {report.photo_url ?
        <img
          src={report.photo_url}
          alt="Stray animal"
          className="w-full h-full object-cover opacity-80" /> :


        <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-800">
            No Photo Available
          </div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4">
            <StatusBadge status={report.status} />
            <ConditionBadge condition={report.condition_tag} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white capitalize mb-2 tracking-tight">
            {report.animal_type}
          </h1>
          <p className="text-slate-300 font-mono text-sm">
            Report ID: {report.id}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 bg-white/80 backdrop-blur-md py-3 px-5 rounded-full shadow-sm border border-slate-200/60 inline-flex">
          <Link
            to="/"
            className="hover:text-slate-900 transition-colors flex items-center gap-1">
            
            <Home size={14} /> Home
          </Link>
          <ChevronRight size={14} />
          <Link
            to="/reports"
            className="hover:text-slate-900 transition-colors">
            
            Reports
          </Link>
          <ChevronRight size={14} />
          <span className="text-slate-900 font-medium truncate max-w-[100px]">
            #{report.id.slice(0, 6)}
          </span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                Description
              </h3>
              <p className="text-slate-800 text-lg leading-relaxed whitespace-pre-wrap">
                {report.description}
              </p>
            </div>

            {report.admin_notes &&
            <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-8">
                <div className="flex items-center gap-2 text-blue-800 font-bold mb-3 text-lg">
                  <ShieldAlert size={22} className="text-blue-600" /> Official
                  Admin Notes
                </div>
                <p className="text-blue-900 leading-relaxed">
                  {report.admin_notes}
                </p>
              </div>
            }
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
                Details
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-0.5">
                      Location
                    </p>
                    <p className="text-slate-900 font-semibold">
                      {report.barangay}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-0.5">
                      Date Reported
                    </p>
                    <p className="text-slate-900 font-semibold">{date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-0.5">
                      Reporter
                    </p>
                    <p className="text-slate-900 font-semibold">
                      {report.reporter_name || 'Anonymous'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-0.5">
                      Last Updated
                    </p>
                    <p className="text-slate-900 font-semibold">
                      {new Date(report.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Card */}
            <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-200 overflow-hidden">
              <div className="h-64 w-full rounded-2xl overflow-hidden z-0 relative bg-slate-100">
                <MapContainer
                  center={[report.latitude, report.longitude]}
                  zoom={15}
                  style={{
                    height: '100%',
                    width: '100%'
                  }}
                  scrollWheelZoom={false}
                  maxBounds={TAGO_BOUNDS}
                  maxBoundsViscosity={1.0}
                  minZoom={TAGO_MIN_ZOOM}
                  maxZoom={TAGO_MAX_ZOOM}>
                  
                  <TileLayer
                    attribution={MAP_TILE_ATTRIBUTION}
                    url={MAP_TILE_URL} />
                  
                  <Marker
                    position={[report.latitude, report.longitude]}
                    icon={mapIcon} />
                  
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}