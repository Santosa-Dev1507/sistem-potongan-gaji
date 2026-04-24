import React, { useState, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { DataGuruView } from './views/DataGuruView';
import { ImportGajiView } from './views/ImportGajiView';
import { RiwayatPotonganView } from './views/RiwayatPotonganView';
import { RincianPotonganView } from './views/RincianPotonganView';
import { DistribusiPotonganView } from './views/DistribusiPotonganView';

function AppContent() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route path="*" element={
        <ProtectedRoute>
          <div className="bg-surface text-on-surface min-h-screen font-sans flex">
            {/* Mobile Overlay Backdrop */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
                onClick={closeSidebar}
              />
            )}
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen overflow-x-hidden">
              <Header onMenuToggle={toggleSidebar} />
              <main className="flex-1 p-4 md:p-8">
                <Routes>
                  {user?.role === 'admin' && (
                    <>
                      <Route path="/" element={<DashboardView />} />
                      <Route path="/guru" element={<DataGuruView />} />
                      <Route path="/import" element={<ImportGajiView />} />
                      <Route path="/distribusi" element={<DistribusiPotonganView />} />
                    </>
                  )}
                  {user?.role === 'guru' && (
                    <Route path="/" element={<Navigate to="/rincian" replace />} />
                  )}
                  <Route path="/riwayat" element={<RiwayatPotonganView />} />
                  <Route path="/rincian" element={<RincianPotonganView />} />
                  <Route path="*" element={<Navigate to={user?.role === 'guru' ? '/rincian' : '/'} />} />
                </Routes>
              </main>
            </div>
          </div>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
