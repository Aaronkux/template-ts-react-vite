import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div>
      <Suspense fallback={<>suspense for public layout</>}>
        <Outlet />
      </Suspense>
    </div>
  );
}
