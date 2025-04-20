/**
 * Dashboard page component
 * @module pages/DashboardPage
 */

import React from 'react';
import Dashboard from '../components/Dashboard';
import { DashboardProvider } from '../contexts/DashboardContext';

/**
 * DashboardPage component that serves as the entry point for the Dashboard feature
 * @returns {JSX.Element} DashboardPage component
 */
const DashboardPage = () => {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  );
};

export default DashboardPage; 