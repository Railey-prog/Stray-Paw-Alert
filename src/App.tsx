import React, { Component } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ReportProvider } from './context/ReportContext';
import { NotificationProvider } from './context/NotificationContext';
// Components
import { Layout } from './components/Layout';
// Pages
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { MapPage } from './pages/MapPage';
import { ReportForm } from './pages/ReportForm';
import { ReportsList } from './pages/ReportsList';
import { ReportDetail } from './pages/ReportDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminDashboard } from './pages/AdminDashboard';
import { MyReports } from './pages/MyReports';
import { AdminUsers } from './pages/AdminUsers';
// Redirect logged-in users away from public/auth pages to the dashboard
function PublicOnly({ children }: {children: ReactNode;}) {
  const { user, isReady } = useAuth();
  if (!isReady) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
// Redirect logged-out users to the landing page
function Protected({ children }: {children: ReactNode;}) {
  const { user, isReady } = useAuth();
  if (!isReady) return null;
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}
// Block non-admins from admin routes
function AdminOnly({ children }: {children: ReactNode;}) {
  const { user, isReady } = useAuth();
  if (!isReady) return null;
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
export function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ReportProvider>
          <BrowserRouter>
            <Routes>
              {/* Public landing + auth pages — no sidebar */}
              <Route
                path="/"
                element={
                <PublicOnly>
                    <Landing />
                  </PublicOnly>
                } />
              
              <Route
                path="/login"
                element={
                <PublicOnly>
                    <Login />
                  </PublicOnly>
                } />
              
              <Route
                path="/register"
                element={
                <PublicOnly>
                    <Register />
                  </PublicOnly>
                } />
              

              {/* App routes — protected, wrapped in dashboard Layout */}
              <Route
                element={
                <Protected>
                    <Layout />
                  </Protected>
                }>
                
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/report" element={<ReportForm />} />
                <Route path="/reports" element={<ReportsList />} />
                <Route path="/reports/:id" element={<ReportDetail />} />
                <Route path="/my-reports" element={<MyReports />} />
                <Route
                  path="/admin"
                  element={
                  <AdminOnly>
                      <AdminDashboard />
                    </AdminOnly>
                  } />
                
                <Route
                  path="/admin/users"
                  element={
                  <AdminOnly>
                      <AdminUsers />
                    </AdminOnly>
                  } />
                
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ReportProvider>
      </NotificationProvider>
    </AuthProvider>);

}