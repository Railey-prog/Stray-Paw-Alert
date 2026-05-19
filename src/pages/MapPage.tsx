import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StrayMap } from '../components/StrayMap';
import { useReports } from '../context/ReportContext';
import { Filter, Layers } from 'lucide-react';
const legendItems = [
{
  color: 'bg-red-500',
  label: 'Aggressive'
},
{
  color: 'bg-orange-500',
  label: 'Injured'
},
{
  color: 'bg-blue-500',
  label: 'Roaming'
},
{
  color: 'bg-purple-500',
  label: 'Needs Rescue'
},
{
  color: 'bg-emerald-500',
  label: 'Resolved'
}];

export function MapPage() {
  const { reports } = useReports();
  const [filter, setFilter] = useState('all');
  const filteredReports = reports.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'open') return r.status === 'open';
    if (filter === 'resolved') return r.status === 'resolved';
    return r.condition_tag === filter;
  });
  return (
    <div className="relative flex-grow flex flex-col h-[calc(100vh-64px)] lg:h-screen overflow-hidden">
      {/* Full bleed map */}
      <div className="absolute inset-0 z-0">
        <StrayMap reports={filteredReports} height="100%" />
      </div>

      {/* Combined floating control bar — landscape, bottom centered */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0.2
        }}
        className="absolute bottom-2 sm:bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 z-[1000] glass rounded-xl sm:rounded-2xl shadow-lg border border-white/40 px-2.5 py-2 sm:px-4 sm:py-3 flex flex-col lg:flex-row items-stretch lg:items-center gap-2 sm:gap-3 lg:gap-4 w-[min(95vw,720px)] lg:w-auto lg:max-w-[min(95vw,860px)]">
        
        {/* Title + count + filter */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Layers size={14} className="text-[#2D6A4F] sm:w-4 sm:h-4" />
            <div className="leading-tight">
              <p className="text-xs sm:text-sm font-bold text-slate-900">
                Live Map
              </p>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium">
                {filteredReports.length} report
                {filteredReports.length === 1 ? '' : 's'} in Tago
              </p>
            </div>
          </div>

          <div className="relative shrink-0">
            <Filter
              size={11}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filter view"
              className="bg-white/70 border border-slate-200/60 rounded-md sm:rounded-lg text-[11px] sm:text-xs py-1 sm:py-1.5 pl-6 sm:pl-7 pr-6 sm:pr-7 focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] outline-none transition-all backdrop-blur-sm shadow-sm text-slate-700 font-semibold appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: `right 0.35rem center`,
                backgroundRepeat: `no-repeat`,
                backgroundSize: `1em 1em`
              }}>
              
              <option value="all">All Reports</option>
              <optgroup label="By Status">
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>
              </optgroup>
              <optgroup label="By Condition">
                <option value="aggressive">Aggressive</option>
                <option value="injured">Injured</option>
                <option value="roaming">Roaming</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px self-stretch bg-slate-200/60"></div>
        <div className="lg:hidden h-px w-full bg-slate-200/60"></div>

        {/* Horizontal legend */}
        <div className="flex items-center flex-wrap gap-x-2 sm:gap-x-3 gap-y-1 sm:gap-y-1.5 min-w-0">
          {legendItems.map((item) =>
          <div
            key={item.label}
            className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            
              <span
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shadow-sm border border-white ${item.color}`}>
            </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-700 whitespace-nowrap">
                {item.label}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </div>);

}