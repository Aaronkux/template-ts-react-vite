import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return <div className="grid grid-cols-3 gap-x-8">{children}</div>;
}
