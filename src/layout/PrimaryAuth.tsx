import { useAuth } from '@/hooks/useAuth';
import React, { Suspense } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// interface PrimaryAuthProps {
//   access?: string[];
// }

export default function PrimaryAuth() {
  const { user } = useAuth();
  const location = useLocation();
  if (user) {
    return (
      <Suspense fallback={<>suspense for primary layout</>}>
        <Outlet />
      </Suspense>
    );
  }
  return <Navigate to="/login" state={{ from: location }} replace />;
}
