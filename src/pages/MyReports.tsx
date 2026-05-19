import React, { Children } from 'react';
import { motion } from 'framer-motion';
import { FileText, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../context/ReportContext';
import { ReportCard } from '../components/ReportCard';
export function MyReports() {
  const { user } = useAuth();
  const { reports } = useReports();
  const myReports = user ?
  reports.filter(
    (r) => r.reporter_name?.toLowerCase() === user.username.toLowerCase()
  ) :
  [];
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
          My Reports
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl">
          Track the status of the stray animals you've reported.
        </p>
      </div>

      {myReports.length > 0 ?
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
          {myReports.map((report) =>
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
            <FileText size={32} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            No reports yet
          </h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-6">
            You haven't submitted any stray animal reports yet. When you do,
            they will appear here so you can track their status.
          </p>
          <Link
          to="/report"
          className="inline-flex items-center gap-2 bg-[#2D6A4F] hover:bg-[#1b4332] text-white px-6 py-3 rounded-full font-semibold transition-colors shadow-sm">
          
            <PlusCircle size={18} />
            Submit your first report
          </Link>
        </motion.div>
      }
    </div>);

}