import apiClient from './api';
import { API_URL } from '../config';
import { toastService } from './index';

const { showSuccess, showError } = toastService;

const SUPPLIERS_URL = '/suppliers';

/**
 * Service for supplier management
 */
const supplierService = {
  /**
   * Get all suppliers
   * @returns {Promise} Promise with suppliers data
   */
  getSuppliers: () => {
    return apiClient.get(SUPPLIERS_URL);
  },

  /**
   * Get supplier by ID
   * @param {number} id - Supplier ID
   * @returns {Promise} Promise with supplier data
   */
  getSupplierById: (id) => {
    return apiClient.get(`${SUPPLIERS_URL}/${id}`);
  },

  /**
   * Create a new supplier
   * @param {Object} supplierData - Supplier data
   * @returns {Promise} Promise with created supplier
   */
  addSupplier: (supplier) => {
    return apiClient.post(SUPPLIERS_URL, supplier);
  },

  /**
   * Update an existing supplier
   * @param {number} id - Supplier ID
   * @param {Object} supplierData - Updated supplier data
   * @returns {Promise} Promise with updated supplier
   */
  updateSupplier: (id, supplier) => {
    return apiClient.put(`${SUPPLIERS_URL}/${id}`, supplier);
  },

  /**
   * Delete a supplier
   * @param {number} id - Supplier ID
   * @returns {Promise} Promise with deletion result
   */
  deleteSupplier: (id) => {
    return apiClient.delete(`${SUPPLIERS_URL}/${id}`);
  }
};

export default supplierService; 