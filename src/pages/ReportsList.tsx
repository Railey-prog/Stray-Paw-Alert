import React, { useState, Children } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { useReports } from '../context/ReportContext';
import { ReportCard } from '../components/ReportCard';
export function ReportsList() {
  const { reports } = useReports();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [conditionFilter, setConditionFilter] = useState('all');
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
    report.barangay.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
    statusFilter === 'all' || report.status === statusFilter;
    const matchesCondition =
    conditionFilter === 'all' || report.condition_tag === conditionFilter;
    return matchesSearch && matchesStatus && matchesCondition;
  });
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    show: {
      opacity: 1,
      y: 0
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
          Stray Animal Reports
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl">
          Browse, search, and monitor reports submitted by the community across
          Tago.
        </p>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-16 lg:top-0 z-40 bg-[#F8FAFB]/90 backdrop-blur-md py-4 mb-8 border-b border-slate-200/60 flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-slate-400" size={18} />
          </div>
          <input
            type="text"
            placeholder="Search by barangay or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] shadow-sm transition-all" />
          
        </div>

        {/* Pill Filters */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto items-center">
          <div className="flex items-center gap-2 text-slate-500 mr-2 hidden lg:flex">
            <SlidersHorizontal size={16} />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] shadow-sm appearance-none font-medium cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: `right 0.75rem center`,
              backgroundRepeat: `no-repeat`,
              backgroundSize: `1.2em 1.2em`,
              paddingRight: '2.5rem'
            }}>
            
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] shadow-sm appearance-none font-medium cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: `right 0.75rem center`,
              backgroundRepeat: `no-repeat`,
              backgroundSize: `1.2em 1.2em`,
              paddingRight: '2.5rem'
            }}>
            
            <option value="all">All Conditions</option>
            <option value="aggressive">Aggressive</option>
            <option value="injured">Injured</option>
            <option value="roaming">Roaming</option>
            <option value="needs_rescue">Needs Rescue</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filteredReports.length > 0 ?
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
          {filteredReports.map((report) =>
        <motion.div
          key={report.id}
          variants={itemVariants}
          className="h-full">
          
              <ReportCard report={report} />
            </motion.div>
        )}
        </motion.div> :

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm">
        
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            No reports found
          </h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            We couldn't find any reports matching your current filters or search
            term.
          </p>
          <button
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
            setConditionFilter('all');
          }}
          className="mt-6 text-[#2D6A4F] font-semibold hover:underline">
          
            Clear all filters
          </button>
        </motion.div>
      }
    </div>);

}