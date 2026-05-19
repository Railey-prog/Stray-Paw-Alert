import React, { useEffect, useState, createContext, useContext } from 'react';
import { Report, ReportStatus } from '../types';
import { mockReports } from '../data/mockData';
const REPORTS_KEY = 'straypaw:reports';
interface ReportContextType {
  reports: Report[];
  addReport: (
  report: Omit<Report, 'id' | 'created_at' | 'updated_at' | 'status'>,
  userId?: string)
  => string;
  updateReportStatus: (id: string, status: ReportStatus, notes?: string) => void;
  deleteReport: (id: string) => void;
  bulkUpdateStatus: (
  ids: string[],
  status: ReportStatus,
  notes?: string)
  => void;
  bulkDelete: (ids: string[]) => void;
}
const ReportContext = createContext<ReportContextType | undefined>(undefined);
function loadReports(): Report[] {
  try {
    const raw = window.localStorage.getItem(REPORTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {

    /* ignore */}
  return mockReports;
}
export function ReportProvider({ children }: {children: React.ReactNode;}) {
  const [reports, setReports] = useState<Report[]>(loadReports);
  useEffect(() => {
    try {
      window.localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
    } catch {

      /* ignore */}
  }, [reports]);
  const addReport = (
  reportData: Omit<Report, 'id' | 'created_at' | 'updated_at' | 'status'>,
  userId?: string) =>
  {
    const newId = `r${Date.now()}`;
    const newReport: Report = {
      ...reportData,
      id: newId,
      status: 'open',
      reporter_user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setReports((prev) => [newReport, ...prev]);
    return newId;
  };
  const updateReportStatus = (
  id: string,
  status: ReportStatus,
  notes?: string) =>
  {
    setReports((prev) =>
    prev.map((report) =>
    report.id === id ?
    {
      ...report,
      status,
      admin_notes: notes !== undefined ? notes : report.admin_notes,
      updated_at: new Date().toISOString()
    } :
    report
    )
    );
  };
  const deleteReport = (id: string) => {
    setReports((prev) => prev.filter((report) => report.id !== id));
  };
  const bulkUpdateStatus = (
  ids: string[],
  status: ReportStatus,
  notes?: string) =>
  {
    setReports((prev) =>
    prev.map((report) =>
    ids.includes(report.id) ?
    {
      ...report,
      status,
      admin_notes: notes !== undefined ? notes : report.admin_notes,
      updated_at: new Date().toISOString()
    } :
    report
    )
    );
  };
  const bulkDelete = (ids: string[]) => {
    setReports((prev) => prev.filter((report) => !ids.includes(report.id)));
  };
  return (
    <ReportContext.Provider
      value={{
        reports,
        addReport,
        updateReportStatus,
        deleteReport,
        bulkUpdateStatus,
        bulkDelete
      }}>
      
      {children}
    </ReportContext.Provider>);

}
export const useReports = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};