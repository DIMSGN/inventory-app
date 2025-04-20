/**
 * Context for dashboard-specific state
 * @module contexts/DashboardContext
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAppContext } from '../../../common/contexts/AppContext';

// Create context
const DashboardContext = createContext();

/**
 * Hook to use the dashboard context
 * @returns {Object} Dashboard context value
 */
export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
};

/**
 * Provider component for dashboard state
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Context provider
 */
export const DashboardProvider = ({ children }) => {
  // Access global app context
  const { user } = useAppContext();
  
  // Dashboard specific state
  const [dashboardConfig, setDashboardConfig] = useState({
    theme: 'light',
    layout: 'default'
  });
  
  const [notifications, setNotifications] = useState([]);
  
  // Derive values from user object
  const userRole = user?.role || 'user';
  const userName = user?.name || 'Guest';
  
  // Watch for user changes
  useEffect(() => {
    if (user?.preferences?.dashboardConfig) {
      setDashboardConfig(user.preferences.dashboardConfig);
    }
  }, [user]);
  
  // Context value
  const value = {
    dashboardConfig,
    setDashboardConfig,
    notifications,
    setNotifications,
    userRole,
    userName,
    
    // Helper methods
    clearNotifications: () => setNotifications([]),
    addNotification: (notification) => {
      setNotifications(prev => [...prev, { id: Date.now(), ...notification }]);
    }
  };
  
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}; 