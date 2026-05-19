import React, { useState, createElement } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  Edit,
  Save,
  X,
  Download,
  Filter } from
'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../context/ReportContext';
import { useNotifications } from '../context/NotificationContext';
import { StatusBadge, ConditionBadge } from '../components/Badge';
import { ReportStatus, Report } from '../types';
import { TAGO_BARANGAYS } from '../data/tagoBounds';
import { Toaster, toast } from 'sonner';
export function AdminDashboard() {
  const { user } = useAuth();
  const {
    reports,
    updateReportStatus,
    deleteReport,
    bulkUpdateStatus,
    bulkDelete
  } = useReports();
  const { addNotification } = useNotifications();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<ReportStatus>('open');
  const [editNotes, setEditNotes] = useState('');
  const [barangayFilter, setBarangayFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<ReportStatus>('open');
  const [bulkNotes, setBulkNotes] = useState('');
  // Protect route
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  const filteredReports = reports.filter((r) => {
    if (barangayFilter === 'all') return true;
    return r.barangay === barangayFilter;
  });
  // Stats
  const total = filteredReports.length;
  const openCount = filteredReports.filter((r) => r.status === 'open').length;
  const inProgressCount = filteredReports.filter(
    (r) => r.status === 'in-progress'
  ).length;
  const resolvedCount = filteredReports.filter(
    (r) => r.status === 'resolved'
  ).length;
  const handleEditClick = (report: any) => {
    setEditingId(report.id);
    setEditStatus(report.status);
    setEditNotes(report.admin_notes || '');
  };
  const handleSave = async (id: string) => {
    const report = reports.find((r) => r.id === id);
    try {
      await updateReportStatus(id, editStatus, editNotes);
      if (report && report.status !== editStatus && report.reporter_user_id) {
        await addNotification({
          user_id: report.reporter_user_id,
          report_id: report.id,
          type: 'status_change',
          title: 'Report Status Updated',
          body: `Your report for a ${report.animal_type} in ${report.barangay} is now ${editStatus}.`
        });
      }
      setEditingId(null);
      toast.success('Report updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update report');
    }
  };
  const toggleSelection = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);else
    next.add(id);
    setSelectedIds(next);
  };
  const toggleAll = () => {
    if (selectedIds.size === filteredReports.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredReports.map((r) => r.id)));
    }
  };
  const handleBulkUpdate = async () => {
    const ids = Array.from(selectedIds);
    try {
      await bulkUpdateStatus(ids, bulkStatus, bulkNotes);
      for (const id of ids) {
        const report = reports.find((r) => r.id === id);
        if (report && report.status !== bulkStatus && report.reporter_user_id) {
          await addNotification({
            user_id: report.reporter_user_id,
            report_id: report.id,
            type: 'status_change',
            title: 'Report Status Updated',
            body: `Your report for a ${report.animal_type} in ${report.barangay} is now ${bulkStatus}.`
          });
        }
      }
      setShowBulkUpdate(false);
      setSelectedIds(new Set());
      setBulkNotes('');
      toast.success(`${ids.length} reports updated`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update reports');
    }
  };
  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} reports?`)) {
      try {
        await bulkDelete(Array.from(selectedIds));
        setSelectedIds(new Set());
        toast.success('Reports deleted');
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete reports');
      }
    }
  };
  const handleExportCSV = () => {
    const headers = [
    'ID',
    'Date',
    'Animal Type',
    'Condition',
    'Barangay',
    'Status',
    'Description',
    'Admin Notes'];

    const csvContent = [
    headers.join(','),
    ...filteredReports.map((r) =>
    [
    r.id,
    new Date(r.created_at).toLocaleDateString(),
    r.animal_type,
    r.condition_tag,
    `"${r.barangay}"`,
    r.status,
    `"${r.description.replace(/"/g, '""')}"`,
    `"${(r.admin_notes || '').replace(/"/g, '""')}"`].
    join(',')
    )].
    join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `straypaw_reports_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-10">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-[#2D6A4F] text-white p-2.5 sm:p-3 rounded-2xl shadow-sm shrink-0">
            <Shield className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium">
              Manage and update stray animal reports.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="text-slate-400" size={16} />
            </div>
            <select
              value={barangayFilter}
              onChange={(e) => setBarangayFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] shadow-sm appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: `right 0.5rem center`,
                backgroundRepeat: `no-repeat`,
                backgroundSize: `1.2em 1.2em`
              }}>
              
              <option value="all">All Barangays</option>
              {TAGO_BARANGAYS.map((brgy) =>
              <option key={brgy.name} value={brgy.name}>
                  {brgy.name}
                </option>
              )}
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm shrink-0">
            
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-10">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-slate-400 flex flex-col">
          <span className="text-slate-500 text-xs sm:text-sm font-bold uppercase tracking-wider mb-1 sm:mb-2">
            Total
          </span>
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
            {total}
          </span>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-amber-500 flex flex-col">
          <div className="flex items-center gap-1.5 sm:gap-2 text-amber-600 text-xs sm:text-sm font-bold uppercase tracking-wider mb-1 sm:mb-2">
            <AlertCircle size={14} className="sm:w-4 sm:h-4" /> Open
          </div>
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
            {openCount}
          </span>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-blue-500 flex flex-col">
          <div className="flex items-center gap-1.5 sm:gap-2 text-blue-600 text-xs sm:text-sm font-bold uppercase tracking-wider mb-1 sm:mb-2">
            <Clock size={14} className="sm:w-4 sm:h-4" /> In Progress
          </div>
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
            {inProgressCount}
          </span>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-500 flex flex-col">
          <div className="flex items-center gap-1.5 sm:gap-2 text-emerald-600 text-xs sm:text-sm font-bold uppercase tracking-wider mb-1 sm:mb-2">
            <CheckCircle size={14} className="sm:w-4 sm:h-4" /> Resolved
          </div>
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
            {resolvedCount}
          </span>
        </div>
      </div>

      {/* Reports Table */}
      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 &&
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[min(95vw,640px)] bg-slate-900 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-2xl shadow-2xl flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          <span className="font-bold text-sm sm:text-base">
            {selectedIds.size} selected
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
            onClick={() => setShowBulkUpdate(true)}
            className="bg-white/20 hover:bg-white/30 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors">
            
              Update Status
            </button>
            <button
            onClick={handleBulkDelete}
            className="bg-red-500/20 text-red-300 hover:bg-red-500/30 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors">
            
              Delete
            </button>
            <button
            onClick={() => setSelectedIds(new Set())}
            className="text-slate-400 hover:text-white px-2 py-2 text-xs sm:text-sm transition-colors">
            
              Clear
            </button>
          </div>
        </div>
      }

      {/* Bulk Update Modal */}
      {showBulkUpdate &&
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 overflow-hidden">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Bulk Update Status
            </h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  New Status
                </label>
                <select
                value={bulkStatus}
                onChange={(e) =>
                setBulkStatus(e.target.value as ReportStatus)
                }
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] outline-none font-medium">
                
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">
                  Admin Notes (Optional)
                </label>
                <textarea
                value={bulkNotes}
                onChange={(e) => setBulkNotes(e.target.value)}
                placeholder="Add notes to all selected reports..."
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] outline-none resize-none"
                rows={3} />
              
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
              onClick={() => setShowBulkUpdate(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
              
                Cancel
              </button>
              <button
              onClick={handleBulkUpdate}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#2D6A4F] hover:bg-[#1b4332] rounded-xl transition-colors shadow-sm">
              
                Update {selectedIds.size} Reports
              </button>
            </div>
          </div>
        </div>
      }

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap md:whitespace-normal">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    checked={
                    filteredReports.length > 0 &&
                    selectedIds.size === filteredReports.length
                    }
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-slate-300 text-[#2D6A4F] focus:ring-[#2D6A4F]" />
                  
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  ID / Date
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status & Notes
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map((report) =>
              <tr
                key={report.id}
                className={`hover:bg-slate-50/50 transition-colors group ${selectedIds.has(report.id) ? 'bg-slate-50' : ''}`}>
                
                  <td className="px-6 py-5 align-top">
                    <input
                    type="checkbox"
                    checked={selectedIds.has(report.id)}
                    onChange={() => toggleSelection(report.id)}
                    className="w-4 h-4 rounded border-slate-300 text-[#2D6A4F] focus:ring-[#2D6A4F]" />
                  
                  </td>
                  <td className="px-6 py-5 align-top">
                    <div className="font-mono text-xs font-medium text-slate-500 bg-slate-100 inline-block px-2 py-1 rounded mb-2">
                      {report.id}
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      {new Date(report.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top max-w-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-slate-900 capitalize">
                        {report.animal_type}
                      </span>
                      <ConditionBadge condition={report.condition_tag} />
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {report.description}
                    </p>
                  </td>
                  <td className="px-6 py-5 align-top text-sm font-medium text-slate-700">
                    {report.barangay}
                  </td>
                  <td className="px-6 py-5 align-top min-w-[250px]">
                    {editingId === report.id ?
                  <div className="space-y-3">
                        <select
                      value={editStatus}
                      onChange={(e) =>
                      setEditStatus(e.target.value as ReportStatus)
                      }
                      className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] outline-none font-medium">
                      
                          <option value="open">Open</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                        <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Add official admin notes..."
                      className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2D6A4F]/20 focus:border-[#2D6A4F] outline-none resize-none"
                      rows={3} />
                    
                      </div> :

                  <div>
                        <div className="mb-2">
                          <StatusBadge status={report.status} />
                        </div>
                        {report.admin_notes &&
                    <div className="text-xs text-blue-700 bg-blue-50 p-2.5 rounded-lg border border-blue-100 leading-relaxed">
                            <span className="font-bold block mb-1">
                              Admin Note:
                            </span>
                            {report.admin_notes}
                          </div>
                    }
                      </div>
                  }
                  </td>
                  <td className="px-6 py-5 align-top text-right">
                    {editingId === report.id ?
                  <div className="flex justify-end gap-2">
                        <button
                      onClick={() => setEditingId(null)}
                      className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors"
                      title="Cancel">
                      
                          <X size={18} />
                        </button>
                        <button
                      onClick={() => handleSave(report.id)}
                      className="p-2 text-white bg-[#2D6A4F] hover:bg-[#1b4332] rounded-lg transition-colors shadow-sm"
                      title="Save Changes">
                      
                          <Save size={18} />
                        </button>
                      </div> :

                  <div className="flex justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                      onClick={() => handleEditClick(report)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Status & Notes">
                      
                          <Edit size={18} />
                        </button>
                        <button
                      onClick={() => {
                        if (
                        window.confirm(
                          'Are you sure you want to delete this report? This action cannot be undone.'
                        ))
                        {
                          deleteReport(report.id).catch((err: any) => toast.error(err.message || 'Delete failed'));
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Report">
                      
                          <Trash2 size={18} />
                        </button>
                      </div>
                  }
                  </td>
                </tr>
              )}
              {filteredReports.length === 0 &&
              <tr>
                  <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-slate-500">
                  
                    <div className="flex flex-col items-center justify-center">
                      <Shield size={32} className="text-slate-300 mb-3" />
                      <p className="font-medium text-lg text-slate-900">
                        No reports found
                      </p>
                      <p>There are currently no reports in the system.</p>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}