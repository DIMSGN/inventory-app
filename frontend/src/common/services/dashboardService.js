import apiClient from './api';
import { toastService } from './index';

const { showError } = toastService;

const DASHBOARD_URL = '/dashboard';

/**
 * Service for dashboard data and statistics
 */
const dashboardService = {
  /**
   * Get overall dashboard statistics
   * @returns {Promise} Promise with dashboard statistics
   */
  getStats: async () => {
    try {
      const response = await apiClient.get(`${DASHBOARD_URL}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      showError('Failed to load dashboard statistics');
      throw error;
    }
  },

  /**
   * Get recent activity for the dashboard
   * @param {number} limit - Number of activities to retrieve
   * @returns {Promise} Promise with recent activity data
   */
  getRecentActivity: async (limit = 10) => {
    try {
      const response = await apiClient.get(`${DASHBOARD_URL}/recent-activity`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      showError('Failed to load recent activity');
      throw error;
    }
  },

  /**
   * Get inventory alerts (low stock, expiring items)
   * @returns {Promise} Promise with inventory alerts
   */
  getInventoryAlerts: async () => {
    try {
      const response = await apiClient.get(`${DASHBOARD_URL}/inventory-alerts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory alerts:', error);
      showError('Failed to load inventory alerts');
      throw error;
    }
  },

  /**
   * Get sales trends data for charts
   * @param {string} period - Time period (day, week, month, year)
   * @returns {Promise} Promise with sales trend data
   */
  getSalesTrends: async (period = 'week') => {
    try {
      const response = await apiClient.get(`${DASHBOARD_URL}/sales-trends`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching sales trends:', error);
      showError('Failed to load sales trends');
      throw error;
    }
  },

  /**
   * Get inventory value summary
   * @returns {Promise} Promise with inventory value data
   */
  getInventoryValue: async () => {
    try {
      const response = await apiClient.get(`${DASHBOARD_URL}/inventory-value`);
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory value:', error);
      showError('Failed to load inventory value data');
      throw error;
    }
  }
};

export default dashboardService; 