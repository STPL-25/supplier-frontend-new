// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, allowedRoles, children }) => {
  // Check if the user is authenticated and has the required role
  console.log( user, allowedRoles, children)
  if (user?.status === 'diamond' && allowedRoles.includes(user?.role)) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;