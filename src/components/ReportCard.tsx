import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Image as ImageIcon } from 'lucide-react';
import { Report } from '../types';
import { StatusBadge, ConditionBadge } from './Badge';
import { motion } from 'framer-motion';
interface ReportCardProps {
  report: Report;
}
export function ReportCard({ report }: ReportCardProps) {
  // Calculate relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };
  return (
    <motion.div
      whileHover={{
        y: -4
      }}
      transition={{
        duration: 0.2
      }}
      className="h-full">
      
      <Link to={`/reports/${report.id}`} className="block h-full group">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
          {/* Image Section */}
          <div className="relative h-48 bg-slate-100 overflow-hidden">
            {report.photo_url ?
            <>
                <img
                src={report.photo_url}
                alt={`${report.animal_type} reported in ${report.barangay}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-60"></div>
              </> :

            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                <ImageIcon size={40} strokeWidth={1.5} />
              </div>
            }

            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              <ConditionBadge condition={report.condition_tag} />
              <StatusBadge status={report.status} />
            </div>

            {/* Bottom Image Info */}
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
              <h3 className="font-semibold capitalize text-lg drop-shadow-md">
                {report.animal_type === 'other' && report.other_animal_type
                  ? report.other_animal_type
                  : report.animal_type}
              </h3>
              <span className="text-xs font-medium bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md">
                #{report.id.slice(0, 6)}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-5 flex flex-col flex-grow">
            <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-grow leading-relaxed">
              {report.description}
            </p>

            <div className="flex items-center justify-between text-xs text-slate-500 mt-auto pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5 font-medium">
                <MapPin size={14} className="text-slate-400" />
                <span className="truncate max-w-[120px]">
                  {report.barangay || 'Unknown'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Clock size={14} className="text-slate-400" />
                <span>{getRelativeTime(report.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>);

}