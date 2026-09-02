import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export const PublicOnlyRoute: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    if (user.role === 'seeker') return <Navigate to="/dashboard/seeker" replace />;
    if (user.role === 'recruiter') return <Navigate to="/dashboard/recruiter" replace />;
    if (user.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
  }

  return <Outlet />;
};
