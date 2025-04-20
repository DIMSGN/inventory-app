/**
 * Custom hook for dashboard data management
 * @module hooks/useDashboardData
 */

import { useState, useEffect } from 'react';
import { useAppContext } from '../../../common/contexts/AppContext';
import { fetchDashboardData } from '../services/dashboardService';

/**
 * Hook for loading and managing dashboard data
 * 
 * @param {Object} options - Hook options
 * @param {boolean} [options.autoLoad=true] - Automatically load data on mount
 * @returns {Object} Dashboard data and state management functions
 */
const useDashboardData = ({ autoLoad = true } = {}) => {
  const { user } = useAppContext();
  const [data, setData] = useState({
    stats: [],
    recentItems: [],
    notifications: []
  });
  const [isLoading, setIsLoading] = useState(autoLoad);
  const [error, setError] = useState(null);

  // Load dashboard data
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const dashboardData = await fetchDashboardData(user?.id);
      setData(dashboardData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-load data on mount if enabled
  useEffect(() => {
    if (autoLoad) {
      loadData();
    }
  }, [autoLoad, user?.id]);

  return {
    ...data,
    isLoading,
    error,
    refresh: loadData
  };
};

export default useDashboardData; 