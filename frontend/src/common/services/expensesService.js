import apiClient from './api';
import { toastService } from './index';

const { showSuccess, showError } = toastService;

// Update URLs to match backend routes
const EXPENSES_URL = '/expenses';
const OPERATING_EXPENSES_URL = '/operating-expenses';
const PAYROLL_EXPENSES_URL = '/payroll-expenses';

// Mock data to use when API returns 404
const MOCK_OPERATING_EXPENSES = [];
const MOCK_PAYROLL_EXPENSES = [];
const MOCK_EXPENSE_CATEGORIES = [];

/**
 * Service for expense management
 */
const expensesService = {
  /**
   * Get operating expenses
   * @param {Object} filters - Optional filters (date range, category, etc)
   * @returns {Promise} Promise with operating expenses data
   */
  getOperatingExpenses: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      // Use the dedicated operating-expenses endpoint
      const response = await apiClient.get(`${OPERATING_EXPENSES_URL}${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching operating expenses:', error);
      showError('Failed to load operating expenses');
      
      // If it's a 404 error, return mock data instead of throwing
      if (error.response && error.response.status === 404) {
        console.warn('Operating expenses endpoint not found, using mock data');
        return MOCK_OPERATING_EXPENSES;
      }
      
      throw error;
    }
  },
  
  /**
   * Record an operating expense
   * @param {Object} expense - Operating expense data
   * @returns {Promise} Promise with recorded expense data
   */
  recordOperatingExpense: async (expense) => {
    try {
      // Use the dedicated operating-expenses endpoint
      const response = await apiClient.post(`${OPERATING_EXPENSES_URL}`, expense);
      showSuccess('Operating expense recorded successfully');
      return response.data;
    } catch (error) {
      console.error('Error recording operating expense:', error);
      showError('Failed to record operating expense');
      
      // If it's a 404 error, return a mock success response
      if (error.response && error.response.status === 404) {
        console.warn('Operating expenses endpoint not found, simulating success');
        return { success: true, message: 'Mock operating expense recorded (demo mode)' };
      }
      
      throw error;
    }
  },
  
  /**
   * Update an operating expense
   * @param {number} id - Expense ID
   * @param {Object} expense - Updated expense data
   * @returns {Promise} Promise with updated expense data
   */
  updateOperatingExpense: async (id, expense) => {
    try {
      // Use the dedicated operating-expenses endpoint
      const response = await apiClient.put(`${OPERATING_EXPENSES_URL}/${id}`, expense);
      showSuccess('Operating expense updated successfully');
      return response.data;
    } catch (error) {
      console.error(`Error updating operating expense #${id}:`, error);
      showError('Failed to update operating expense');
      
      // If it's a 404 error, return a mock success response
      if (error.response && error.response.status === 404) {
        console.warn('Operating expenses endpoint not found, simulating success');
        return { success: true, message: 'Mock operating expense updated (demo mode)' };
      }
      
      throw error;
    }
  },
  
  /**
   * Delete an operating expense
   * @param {number} id - Expense ID
   * @returns {Promise} Promise with deletion result
   */
  deleteOperatingExpense: async (id) => {
    try {
      // Use the dedicated operating-expenses endpoint
      const response = await apiClient.delete(`${OPERATING_EXPENSES_URL}/${id}`);
      showSuccess('Operating expense deleted successfully');
      return response.data;
    } catch (error) {
      console.error(`Error deleting operating expense #${id}:`, error);
      showError('Failed to delete operating expense');
      
      // If it's a 404 error, return a mock success response
      if (error.response && error.response.status === 404) {
        console.warn('Operating expenses endpoint not found, simulating success');
        return { success: true, message: 'Mock operating expense deleted (demo mode)' };
      }
      
      throw error;
    }
  },
  
  /**
   * Get payroll expenses
   * @param {Object} filters - Optional filters (date range, employee, etc)
   * @returns {Promise} Promise with payroll expenses data
   */
  getPayrollExpenses: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      // Use the dedicated payroll-expenses endpoint
      const response = await apiClient.get(`${PAYROLL_EXPENSES_URL}${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payroll expenses:', error);
      showError('Failed to load payroll expenses');
      
      // If it's a 404 error, return mock data instead of throwing
      if (error.response && error.response.status === 404) {
        console.warn('Payroll expenses endpoint not found, using mock data');
        return MOCK_PAYROLL_EXPENSES;
      }
      
      throw error;
    }
  },
  
  /**
   * Record a payroll expense
   * @param {Object} expense - Payroll expense data
   * @returns {Promise} Promise with recorded expense data
   */
  recordPayrollExpense: async (expense) => {
    try {
      // Use the dedicated payroll-expenses endpoint
      const response = await apiClient.post(`${PAYROLL_EXPENSES_URL}`, expense);
      showSuccess('Payroll expense recorded successfully');
      return response.data;
    } catch (error) {
      console.error('Error recording payroll expense:', error);
      showError('Failed to record payroll expense');
      
      // If it's a 404 error, return a mock success response
      if (error.response && error.response.status === 404) {
        console.warn('Payroll expenses endpoint not found, simulating success');
        return { success: true, message: 'Mock payroll expense recorded (demo mode)' };
      }
      
      throw error;
    }
  },
  
  /**
   * Update a payroll expense
   * @param {number} id - Expense ID
   * @param {Object} expense - Updated expense data
   * @returns {Promise} Promise with updated expense data
   */
  updatePayrollExpense: async (id, expense) => {
    try {
      // Use the dedicated payroll-expenses endpoint
      const response = await apiClient.put(`${PAYROLL_EXPENSES_URL}/${id}`, expense);
      showSuccess('Payroll expense updated successfully');
      return response.data;
    } catch (error) {
      console.error(`Error updating payroll expense #${id}:`, error);
      showError('Failed to update payroll expense');
      
      // If it's a 404 error, return a mock success response
      if (error.response && error.response.status === 404) {
        console.warn('Payroll expenses endpoint not found, simulating success');
        return { success: true, message: 'Mock payroll expense updated (demo mode)' };
      }
      
      throw error;
    }
  },
  
  /**
   * Delete a payroll expense
   * @param {number} id - Expense ID
   * @returns {Promise} Promise with deletion result
   */
  deletePayrollExpense: async (id) => {
    try {
      const response = await apiClient.delete(`${EXPENSES_URL}/payroll/${id}`);
      showSuccess('Payroll expense deleted successfully');
      return response.data;
    } catch (error) {
      console.error(`Error deleting payroll expense #${id}:`, error);
      showError('Failed to delete payroll expense');
      
      // If it's a 404 error, return a mock success response
      if (error.response && error.response.status === 404) {
        console.warn('Payroll expenses endpoint not found, simulating success');
        return { success: true, message: 'Mock payroll expense deleted (demo mode)' };
      }
      
      throw error;
    }
  },
  
  /**
   * Get expense categories
   * @returns {Promise} Promise with expense categories
   */
  getExpenseCategories: async () => {
    try {
      const response = await apiClient.get(`${EXPENSES_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching expense categories:', error);
      showError('Failed to load expense categories');
      
      // If it's a 404 error, return mock data instead of throwing
      if (error.response && error.response.status === 404) {
        console.warn('Expense categories endpoint not found, using mock data');
        return MOCK_EXPENSE_CATEGORIES;
      }
      
      throw error;
    }
  }
};

export default expensesService; 