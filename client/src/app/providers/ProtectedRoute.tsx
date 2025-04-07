import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/entities/user/hooks/useUser';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps): React.JSX.Element {
  const { user } = useUser();
  const location = useLocation();

  if (requireAuth && !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!requireAuth && user) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
} 