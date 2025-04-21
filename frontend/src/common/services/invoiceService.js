import apiClient from './api';
import { toastService } from './index';

const { showSuccess, showError } = toastService;

const INVOICES_URL = '/invoices';

/**
 * Service for invoice management
 */
const invoiceService = {
  /**
   * Get all invoices with optional filters
   * @param {Object} filters - Optional filters (date range, status, etc.)
   * @returns {Promise} Promise with invoices data
   */
  getInvoices: async (filters = {}) => {
    try {
      // Convert filters to query params if any
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await apiClient.get(`${INVOICES_URL}${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      showError('Failed to load invoices');
      throw error;
    }
  },

  /**
   * Get invoice by ID
   * @param {number} id - Invoice ID
   * @returns {Promise} Promise with invoice data
   */
  getInvoiceById: async (id) => {
    try {
      const response = await apiClient.get(`${INVOICES_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching invoice #${id}:`, error);
      showError(`Failed to load invoice details`);
      throw error;
    }
  },

  /**
   * Create a new invoice
   * @param {Object} invoiceData - Invoice data including items
   * @returns {Promise} Promise with created invoice
   */
  createInvoice: async (invoiceData) => {
    try {
      const response = await apiClient.post(INVOICES_URL, invoiceData);
      showSuccess('Invoice created successfully');
      return response.data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      showError('Failed to create invoice');
      throw error;
    }
  },

  /**
   * Update an existing invoice
   * @param {number} id - Invoice ID
   * @param {Object} invoiceData - Updated invoice data
   * @returns {Promise} Promise with updated invoice
   */
  updateInvoice: async (id, invoiceData) => {
    try {
      const response = await apiClient.put(`${INVOICES_URL}/${id}`, invoiceData);
      showSuccess('Invoice updated successfully');
      return response.data;
    } catch (error) {
      console.error(`Error updating invoice #${id}:`, error);
      showError('Failed to update invoice');
      throw error;
    }
  },

  /**
   * Delete an invoice
   * @param {number} id - Invoice ID
   * @returns {Promise} Promise with deletion result
   */
  deleteInvoice: async (id) => {
    try {
      const response = await apiClient.delete(`${INVOICES_URL}/${id}`);
      showSuccess('Invoice deleted successfully');
      return response.data;
    } catch (error) {
      console.error(`Error deleting invoice #${id}:`, error);
      showError('Failed to delete invoice');
      throw error;
    }
  },
  
  /**
   * Generate PDF for an invoice
   * @param {number} id - Invoice ID
   * @returns {Promise} Promise with PDF data or download URL
   */
  generatePdf: async (id) => {
    try {
      const response = await apiClient.get(`${INVOICES_URL}/${id}/pdf`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error(`Error generating PDF for invoice #${id}:`, error);
      showError('Failed to generate invoice PDF');
      throw error;
    }
  }
};

export default invoiceService; 