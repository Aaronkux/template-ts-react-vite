import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '@/hooks/useAuth';

// interface RequireAuthProps {
//   access?: string[];
//   children: React.ReactNode;
//   redirect?: string;
//   fallback?: JSX.Element;
// }
/**
 * when access is not granted,
 * redirect will be checked first, if it is not provided, then fallback will be used
 * @param children normal return
 * @param redirect redirect to this path if access is not granted
 * @param fallback fallback if access is not granted
 * @param access permissions required to access this page
 */
// export default function RequireAuth({
//   children,
//   access,
//   redirect,
//   fallback,
// }: RequireAuthProps) {
//   const auth = useAuth();
//   const location = useLocation();

//   if (access && !auth.user?.permissions?.find((p) => access.includes(p))) {
//     if (redirect) {
//       return <Navigate to={redirect} state={{ from: location }} />;
//     }
//     if (fallback) {
//       return fallback;
//     }
//     return null;
//   }

//   return <>{children}</>;
// }

export default function RequireAuth() {
  return <div>test</div>;
}
