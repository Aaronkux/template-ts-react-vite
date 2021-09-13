import NavBar from '@/components/NavBar';
import React from 'react';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[url('@/assets/form_bg.avif')] bg-no-repeat bg-[length:70%] bg-right-top">
      <NavBar />
      <Outlet />
    </div>
  );
}
