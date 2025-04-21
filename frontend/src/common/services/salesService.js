import apiClient from './api';
import { toastService } from './index';

const { showSuccess, showError } = toastService;

// Update URLs to match backend routes
const SALES_URL = '/sales';
const DAILY_ECONOMY_URL = '/daily-economy';

// Mock data to use when API returns 404
const MOCK_SALES_DATA = [];
const MOCK_DAILY_SUMMARY = [];
const MOCK_MONTHLY_SUMMARY = [];

/**
 * Service for sales records and operations
 */
const salesService = {
  /**
   * Get all sales records
   * @param {Object} filters - Optional filters (date range, type, etc)
   * @returns {Promise} Promise with sales data
   */
  getAllSales: async (filters = {}) => {
    try {
      // Convert filters to query params if any
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await apiClient.get(`${SALES_URL}${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales:', error);
      showError('Failed to load sales data');
      
      // If it's a 404 error, return mock data instead of throwing
      if (error.response && error.response.status === 404) {
        console.warn('Sales endpoint not found, using mock data');
        return MOCK_SALES_DATA;
      }
      
      throw error;
    }
  },

  /**
   * Get daily sales summary
   * @param {string} date - Optional date string (defaults to today)
   * @returns {Promise} Promise with daily summary data
   */
  getDailySummary: async (date) => {
    try {
      const params = date ? { date } : {};
      // Use the daily-economy URL instead
      const response = await apiClient.get(`${DAILY_ECONOMY_URL}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching daily sales summary:', error);
      showError('Failed to load daily sales summary');
      
      // If it's a 404 error, return mock data instead of throwing
      if (error.response && error.response.status === 404) {
        console.warn('Daily sales endpoint not found, using mock data');
        return MOCK_DAILY_SUMMARY;
      }
      
      throw error;
    }
  },

  /**
   * Get monthly sales summary
   * @param {number} year - Optional year (defaults to current year)
   * @param {number} month - Optional month (defaults to current month)
   * @returns {Promise} Promise with monthly summary data
   */
  getMonthlySummary: async (year, month) => {
    try {
      const params = {};
      if (year) params.year = year;
      if (month) params.month = month;
      
      // Use the financial URL for monthly data
      const response = await apiClient.get(`/financial/monthly`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly sales summary:', error);
      showError('Failed to load monthly sales summary');
      
      // If it's a 404 error, return mock data instead of throwing
      if (error.response && error.response.status === 404) {
        console.warn('Monthly sales endpoint not found, using mock data');
        return MOCK_MONTHLY_SUMMARY;
      }
      
      throw error;
    }
  },

  /**
   * Record a food sale
   * @param {Object} sale - Food sale data
   * @returns {Promise} Promise with sale record
   */
  recordFoodSale: async (sale) => {
    try {
      const response = await apiClient.post(`${SALES_URL}/food`, sale);
      showSuccess('Food sale recorded successfully');
      return response.data;
    } catch (error) {
      console.error('Error recording food sale:', error);
      showError('Failed to record food sale');
      
      // If it's a 404 error, return a mock success response
      if (error.response && error.response.status === 404) {
        console.warn('Food sales endpoint not found, simulating success');
        return { success: true, message: 'Mock food sale recorded (demo mode)' };
      }
      
      throw error;
    }
  },

  /**
   * Record a coffee/beverage sale
   * @param {Object} sale - Coffee sale data
   * @returns {Promise} Promise with sale record
   */
  recordCoffeeSale: async (sale) => {
    try {
      const response = await apiClient.post(`${SALES_URL}/coffee`, sale);
      showSuccess('Coffee sale recorded successfully');
      return response.data;
    } catch (error) {
      console.error('Error recording coffee sale:', error);
      showError('Failed to record coffee sale');
      
      // If it's a 404 error, return a mock success response
      if (error.response && error.response.status === 404) {
        console.warn('Coffee sales endpoint not found, simulating success');
        return { success: true, message: 'Mock coffee sale recorded (demo mode)' };
      }
      
      throw error;
    }
  },

  /**
   * Record a cocktail sale
   * @param {Object} sale - Cocktail sale data
   * @returns {Promise} Promise with sale record
   */
  recordCocktailSale: async (sale) => {
    try {
      const response = await apiClient.post(`${SALES_URL}/cocktail`, sale);
      showSuccess('Cocktail sale recorded successfully');
      return response.data;
    } catch (error) {
      console.error('Error recording cocktail sale:', error);
      showError('Failed to record cocktail sale');
      
      // If it's a 404 error, return a mock success response
      if (error.response && error.response.status === 404) {
        console.warn('Cocktail sales endpoint not found, simulating success');
        return { success: true, message: 'Mock cocktail sale recorded (demo mode)' };
      }
      
      throw error;
    }
  },

  /**
   * Record a drink sale
   * @param {Object} sale - Drink sale data
   * @returns {Promise} Promise with sale record
   */
  recordDrinkSale: async (sale) => {
    try {
      const response = await apiClient.post(`${SALES_URL}/drink`, sale);
      showSuccess('Drink sale recorded successfully');
      return response.data;
    } catch (error) {
      console.error('Error recording drink sale:', error);
      showError('Failed to record drink sale');
      
      // If it's a 404 error, return a mock success response
      if (error.response && error.response.status === 404) {
        console.warn('Drink sales endpoint not found, simulating success');
        return { success: true, message: 'Mock drink sale recorded (demo mode)' };
      }
      
      throw error;
    }
  }
};

export default salesService; 