import React, { Children } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Map as MapIcon,
  List,
  ArrowRight,
  PlusCircle,
  Activity,
  CheckCircle2,
  Clock,
  ShieldAlert,
  MapPin } from
'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../context/ReportContext';
import { ReportCard } from '../components/ReportCard';
export function Dashboard() {
  const { user } = useAuth();
  const { reports } = useReports();
  const isAdmin = user?.role === 'admin';
  const recentReports = reports.slice(0, 3);
  const stats = {
    total: reports.length,
    open: reports.filter((r) => r.status === 'open').length,
    inProgress: reports.filter((r) => r.status === 'in-progress').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
    barangays: new Set(reports.map((r) => r.barangay)).size,
  };
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
        staggerChildren: 0.08
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 16
    },
    show: {
      opacity: 1,
      y: 0
    }
  };
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();
  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Welcome header */}
      <motion.header
        initial={{
          opacity: 0,
          y: -10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.3
        }}
        className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        
        <div>
          <p className="text-sm font-semibold text-[#2D6A4F] mb-2 tracking-wide">
            {greeting},
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {user?.username ?? 'Welcome'} 👋
          </h1>
          <p className="text-slate-600 mt-2 text-base sm:text-lg max-w-xl">
            Here's what's happening with strays in Tago today.
          </p>
        </div>
      </motion.header>

      {/* Stat cards */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-5 mb-10">
        
        {[
        {
          label: 'Total Reports',
          value: stats.total,
          icon: Activity,
          tint: 'text-slate-700 bg-slate-50',
          accent: 'border-l-slate-300'
        },
        {
          label: 'Open',
          value: stats.open,
          icon: AlertTriangle,
          tint: 'text-amber-600 bg-amber-50',
          accent: 'border-l-amber-400'
        },
        {
          label: 'In Progress',
          value: stats.inProgress,
          icon: Clock,
          tint: 'text-blue-600 bg-blue-50',
          accent: 'border-l-blue-400'
        },
        {
          label: 'Resolved',
          value: stats.resolved,
          icon: CheckCircle2,
          tint: 'text-emerald-600 bg-emerald-50',
          accent: 'border-l-emerald-400'
        },
        {
          label: 'Barangays Active',
          value: stats.barangays,
          icon: MapPin,
          tint: 'text-purple-600 bg-purple-50',
          accent: 'border-l-purple-400'
        }].
        map((s) =>
        <motion.div
          key={s.label}
          variants={itemVariants}
          className={`bg-white rounded-2xl border border-slate-200 border-l-4 ${s.accent} p-4 sm:p-5 shadow-sm`}>
          
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-tight">
                {s.label}
              </span>
              <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.tint}`}>
              
                <s.icon size={16} />
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {s.value}
            </p>
          </motion.div>
        )}
      </motion.section>

      {/* Quick actions */}
      <section className="mb-12">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {!isAdmin &&
          <Link
            to="/report"
            className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-[#E76F51]/40 hover:shadow-md transition-all flex items-center gap-4">
            
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#E76F51] flex items-center justify-center shrink-0">
                <PlusCircle size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900">Submit a report</p>
                <p className="text-sm text-slate-500">
                  Photo, location, and a quick description.
                </p>
              </div>
              <ArrowRight
              size={18}
              className="text-slate-400 group-hover:text-[#E76F51] group-hover:translate-x-1 transition-all" />
            
            </Link>
          }

          {isAdmin &&
          <Link
            to="/admin"
            className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-[#2D6A4F]/40 hover:shadow-md transition-all flex items-center gap-4">
            
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#2D6A4F] flex items-center justify-center shrink-0">
                <ShieldAlert size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900">Admin panel</p>
                <p className="text-sm text-slate-500">
                  Update status and manage cases.
                </p>
              </div>
              <ArrowRight
              size={18}
              className="text-slate-400 group-hover:text-[#2D6A4F] group-hover:translate-x-1 transition-all" />
            
            </Link>
          }

          <Link
            to="/map"
            className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-[#2D6A4F]/40 hover:shadow-md transition-all flex items-center gap-4">
            
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#2D6A4F] flex items-center justify-center shrink-0">
              <MapIcon size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900">View live map</p>
              <p className="text-sm text-slate-500">
                See active reports across Tago.
              </p>
            </div>
            <ArrowRight
              size={18}
              className="text-slate-400 group-hover:text-[#2D6A4F] group-hover:translate-x-1 transition-all" />
            
          </Link>

          <Link
            to="/reports"
            className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-slate-400 hover:shadow-md transition-all flex items-center gap-4">
            
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center shrink-0">
              <List size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900">Browse all reports</p>
              <p className="text-sm text-slate-500">
                Search, filter, and follow up.
              </p>
            </div>
            <ArrowRight
              size={18}
              className="text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all" />
            
          </Link>
        </div>
      </section>

      {/* My contributions — only for non-admin users */}
      {user && !isAdmin &&
      <section className="mb-12">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border border-green-100 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-green-100 flex items-center justify-center text-[#2D6A4F] shrink-0">
              <ShieldAlert size={26} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#2D6A4F] uppercase tracking-wider mb-1">
                Your contribution
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                {myReports.length === 0 ?
              "You haven't filed any reports yet." :
              `You've filed ${myReports.length} report${myReports.length === 1 ? '' : 's'}.`}
              </h3>
              <p className="text-slate-600 mt-1 text-sm sm:text-base">
                {myReports.length === 0 ?
              'Every report helps officials respond faster.' :
              'Thank you for helping keep our community safe.'}
              </p>
            </div>
            <Link
            to="/report"
            className="inline-flex items-center gap-2 bg-[#2D6A4F] hover:bg-[#1b4332] text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-colors shadow-sm w-full sm:w-auto justify-center">
            
              <PlusCircle size={16} />
              File another
            </Link>
          </div>
        </section>
      }

      {/* Recent reports */}
      <section>
        <div className="flex items-end justify-between mb-5 gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Recent reports
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              The latest submissions from across Tago.
            </p>
          </div>
          <Link
            to="/reports"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#2D6A4F] transition-colors group">
            
            View all
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform" />
            
          </Link>
        </div>

        {recentReports.length > 0 ?
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
            {recentReports.map((report) =>
          <motion.div key={report.id} variants={itemVariants}>
                <ReportCard report={report} />
              </motion.div>
          )}
          </motion.div> :

        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <p className="text-slate-500">No reports yet.</p>
          </div>
        }
      </section>
    </div>);

}