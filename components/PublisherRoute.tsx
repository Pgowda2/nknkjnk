import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { Loader2 } from 'lucide-react';

export const PublisherRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-500 tracking-wide uppercase">Verifying Publisher Access...</p>
      </div>
    );
  }

  if (!user || user.role !== 'publisher') {
    return <Navigate to="/publisher/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
