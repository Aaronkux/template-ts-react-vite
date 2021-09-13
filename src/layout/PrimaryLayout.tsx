import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import mainRoutes from '#/config/mainRoutes';

export default function PrimaryLayout() {
  const mainRoutesElements = useRoutes(mainRoutes);
  return (
    <Suspense fallback={<>suspense for primary layout</>}>
      {mainRoutesElements}
    </Suspense>
  );
}
