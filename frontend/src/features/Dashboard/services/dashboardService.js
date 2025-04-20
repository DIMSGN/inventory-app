/**
 * Service for dashboard-related API calls
 * @module services/dashboardService
 */

import { 
  FaChartLine, 
  FaShoppingCart, 
  FaUserFriends, 
  FaCalendarAlt 
} from 'react-icons/fa';

/**
 * Fetch dashboard data for the specified user
 * @param {string|number} userId - User ID
 * @returns {Promise<Object>} Promise resolving to dashboard data
 */
export const fetchDashboardData = async (userId) => {
  // In a real implementation, this would make an API call
  try {
    // Simulating API delay
    return await new Promise(resolve => {
      setTimeout(() => {
        // Return mock data
        resolve({
          stats: [
            {
              label: 'Πωλήσεις',
              value: '€1,245',
              type: 'sales',
              color: '#3498db'
            },
            {
              label: 'Πελάτες',
              value: '54',
              type: 'users',
              color: '#2ecc71'
            },
            {
              label: 'Κρατήσεις',
              value: '12',
              type: 'events',
              color: '#9b59b6'
            },
            {
              label: 'Αποθέματα',
              value: '145',
              type: 'inventory',
              color: '#f39c12'
            }
          ],
          recentItems: [],
          notifications: []
        });
      }, 500);
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}; 