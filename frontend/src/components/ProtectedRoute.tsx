import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3" />
        <span>Authenticating session...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth-entry" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-red-400">403 - Permission Denied</h2>
        <p className="text-slate-400 text-sm mt-2">You do not have permission to perform this action or view this page.</p>
        <p className="text-xs text-slate-500 mt-1">Required Role: {allowedRoles.join(', ')} | Your Role: {user.role}</p>
      </div>
    );
  }

  return <>{children}</>;
};
