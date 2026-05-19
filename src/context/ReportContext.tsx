import React, { useEffect, useState, createContext, useContext } from 'react';
import { Report, ReportStatus } from '../types';
import { api } from '../lib/api';

interface ReportContextType {
  reports: Report[];
  loading: boolean;
  addReport: (report: Omit<Report, 'id' | 'created_at' | 'updated_at' | 'status'>, userId?: string) => Promise<string>;
  updateReportStatus: (id: string, status: ReportStatus, notes?: string) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  bulkUpdateStatus: (ids: string[], status: ReportStatus, notes?: string) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
  refreshReports: () => Promise<void>;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export function ReportProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshReports = async () => {
    try {
      const data = await api.get<Report[]>('/reports');
      setReports(data);
    } catch (err) {
      console.error('Failed to load reports:', err);
    }
  };

  useEffect(() => {
    refreshReports().finally(() => setLoading(false));
  }, []);

  const addReport = async (
    reportData: Omit<Report, 'id' | 'created_at' | 'updated_at' | 'status'>,
    _userId?: string
  ): Promise<string> => {
    const created = await api.post<Report>('/reports', reportData);
    setReports((prev) => [created, ...prev]);
    return created.id;
  };

  const updateReportStatus = async (id: string, status: ReportStatus, notes?: string) => {
    const updated = await api.patch<Report>(`/reports/${id}/status`, { status, admin_notes: notes });
    setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
  };

  const deleteReport = async (id: string) => {
    await api.delete(`/reports/${id}`);
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  const bulkUpdateStatus = async (ids: string[], status: ReportStatus, notes?: string) => {
    await api.patch('/reports/bulk/status', { ids, status, admin_notes: notes });
    setReports((prev) =>
      prev.map((r) =>
        ids.includes(r.id)
          ? { ...r, status, admin_notes: notes ?? r.admin_notes, updated_at: new Date().toISOString() }
          : r
      )
    );
  };

  const bulkDelete = async (ids: string[]) => {
    await api.delete('/reports/bulk/delete', { ids });
    setReports((prev) => prev.filter((r) => !ids.includes(r.id)));
  };

  return (
    <ReportContext.Provider value={{ reports, loading, addReport, updateReportStatus, deleteReport, bulkUpdateStatus, bulkDelete, refreshReports }}>
      {children}
    </ReportContext.Provider>
  );
}

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) throw new Error('useReports must be used within a ReportProvider');
  return context;
};
