import axios from 'axios';
import { API_URL } from '../../../config/constants';
import { MOCK_FINANCIAL_DATA } from '../utils/mockData';

const financialService = {
  /**
   * Get financial data for a specific year
   * @param {number} year - The year to fetch data for
   * @returns {Promise<Object>} - Financial data for the specified year
   */
  getFinancialData: async (year) => {
    try {
      const response = await axios.get(`${API_URL}/financial-data/${year}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching financial data:', error);
      // For development/testing, return mock data
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock financial data for development');
        return MOCK_FINANCIAL_DATA;
      }
      throw error;
    }
  },

  /**
   * Save financial data for a specific year
   * @param {number} year - The year to save data for
   * @param {Object} data - The financial data to save
   * @returns {Promise<Object>} - Response from the API
   */
  saveFinancialData: async (year, data) => {
    try {
      const response = await axios.put(`${API_URL}/financial-data/${year}`, data);
      return response.data;
    } catch (error) {
      console.error('Error saving financial data:', error);
      throw error;
    }
  },

  /**
   * Get monthly expense breakdown
   * @param {number} year - The year to fetch data for
   * @param {number} month - The month (1-12) to fetch data for
   * @returns {Promise<Object>} - Expense breakdown for the specified month
   */
  getMonthlyExpenseBreakdown: async (year, month) => {
    try {
      const response = await axios.get(`${API_URL}/expenses/${year}/${month}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly expense breakdown:', error);
      throw error;
    }
  },

  /**
   * Get monthly revenue breakdown
   * @param {number} year - The year to fetch data for
   * @param {number} month - The month (1-12) to fetch data for
   * @returns {Promise<Object>} - Revenue breakdown for the specified month
   */
  getMonthlyRevenueBreakdown: async (year, month) => {
    try {
      const response = await axios.get(`${API_URL}/revenue/${year}/${month}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly revenue breakdown:', error);
      throw error;
    }
  },

  /**
   * Get financial reports
   * @param {Object} params - Parameters for report generation
   * @param {string} params.type - Report type (profit-loss, balance-sheet, cash-flow)
   * @param {number} params.year - The year to generate report for
   * @param {number} [params.month] - Optional month for monthly reports
   * @param {string} [params.format] - Output format (json, pdf, excel)
   * @returns {Promise<Object|Blob>} - Report data or file
   */
  getFinancialReport: async (params) => {
    try {
      const { type, year, month, format = 'json' } = params;
      
      let url = `${API_URL}/reports/${type}/${year}`;
      if (month) url += `/${month}`;
      
      if (format === 'json') {
        const response = await axios.get(url);
        return response.data;
      } else {
        const response = await axios.get(`${url}?format=${format}`, {
          responseType: 'blob'
        });
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching financial report:', error);
      throw error;
    }
  },

  /**
   * Get daily logs for a specific date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Array>} - Daily logs for the date range
   */
  getDailyLogs: async (startDate, endDate) => {
    try {
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];
      
      const response = await axios.get(
        `${API_URL}/daily-logs?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching daily logs:', error);
      throw error;
    }
  },

  /**
   * Create a new daily log entry
   * @param {Object} logData - Daily log data
   * @returns {Promise<Object>} - Created daily log
   */
  createDailyLog: async (logData) => {
    try {
      const response = await axios.post(`${API_URL}/daily-logs`, logData);
      return response.data;
    } catch (error) {
      console.error('Error creating daily log:', error);
      throw error;
    }
  },

  /**
   * Update an existing daily log entry
   * @param {string} logId - ID of the log to update
   * @param {Object} logData - Updated daily log data
   * @returns {Promise<Object>} - Updated daily log
   */
  updateDailyLog: async (logId, logData) => {
    try {
      const response = await axios.put(`${API_URL}/daily-logs/${logId}`, logData);
      return response.data;
    } catch (error) {
      console.error('Error updating daily log:', error);
      throw error;
    }
  },

  /**
   * Delete a daily log entry
   * @param {string} logId - ID of the log to delete
   * @returns {Promise<Object>} - Response from the API
   */
  deleteDailyLog: async (logId) => {
    try {
      const response = await axios.delete(`${API_URL}/daily-logs/${logId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting daily log:', error);
      throw error;
    }
  }
};

export default financialService; 