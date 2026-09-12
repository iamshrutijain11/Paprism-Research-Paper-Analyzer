import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import PaprismLogo from './PaprismLogo';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoadingAuth } = useUser();
  const location = useLocation();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen w-full bg-[#F7FBF9] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00A878] to-[#C8F3E4] flex items-center justify-center text-[#003F36] shadow-md animate-pulse mb-4">
          <span className="text-xl font-bold">✦</span>
        </div>
        <p className="text-xs font-semibold text-[#006B57] tracking-wider uppercase">
          Verifying Session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
