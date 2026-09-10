import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

/**
 * ProtectedRoute Wrapper
 * Enforces role-based access to portals:
 * - FARMER can only access Farmer portal (/farmer/*)
 * - STAFF can only access Centre portal (/centre/*, /staff/*)
 * - ADMIN can only access Admin portal (/admin/*)
 * Mismatched roles or unauthenticated users are safely redirected.
 */
export const ProtectedRoute = ({ role, children }) => {
  const { currentUser } = useAppContext();
  
  if (!currentUser) {
    const loginPath = role === 'STAFF' ? '/centre/login' : `/${role.toLowerCase()}/login`;
    return <Navigate to={loginPath} replace />;
  }
  
  if (currentUser.role !== role) {
    // Redirect to their actual role dashboard if they try to access wrong portal
    const targetDashboard = 
      currentUser.role === 'FARMER' ? '/farmer/dashboard' :
      currentUser.role === 'STAFF' ? '/centre/dashboard' :
      currentUser.role === 'ADMIN' ? '/admin/dashboard' :
      '/';
    return <Navigate to={targetDashboard} replace />;
  }

  return children;
};

export default ProtectedRoute;
