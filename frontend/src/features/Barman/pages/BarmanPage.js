import React from 'react';
import BarmanDashboard from '../components/BarmanDashboard/BarmanDashboard';
import { BarmanProvider } from '../contexts/BarmanContext';

/**
 * Main Barman page component
 * Serves as the entry point for the Barman feature
 */
const BarmanPage = () => {
  return (
    <BarmanProvider>
      <BarmanDashboard />
    </BarmanProvider>
  );
};

export default BarmanPage; 