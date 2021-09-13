import React from 'react';
import { useRoutes } from 'react-router-dom';
import routesConfig from '../config/routes';

export default function App() {
  const test = useRoutes(routesConfig);
  return <>{test}</>;
}
