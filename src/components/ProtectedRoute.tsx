import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Arahkan otomatis ke halaman Login jika belum Login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
