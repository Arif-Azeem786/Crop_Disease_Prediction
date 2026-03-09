import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false, requireUser = false }) {
  const { user, isAdmin, isUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-12 h-12 border-4 border-leaf-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-slate-500">Checking authentication...</p>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/login" state={{ from: location, admin: true }} replace />;
  }
  if (requireUser && !isUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!requireAdmin && !requireUser && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
