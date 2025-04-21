/**
 * Chef main page container component
 * @module pages/ChefPage
 */

import React from 'react';
import ChefDashboard from '../components/ChefDashboard/ChefDashboard';
import { ChefProvider } from '../contexts/ChefContext';

/**
 * ChefPage component that wraps the dashboard with necessary providers
 * @returns {JSX.Element} ChefPage component
 */
const ChefPage = () => {
  return (
    <ChefProvider>
      <ChefDashboard />
    </ChefProvider>
  );
};

export default ChefPage; 