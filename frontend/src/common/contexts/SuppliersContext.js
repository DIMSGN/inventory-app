import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { API_URL, STORAGE_KEYS } from '../config';
import { toastService } from '../services';
import supplierService from '../services/supplierService';

const { showSuccess, showError } = toastService;

const SuppliersContext = createContext();

export const useSuppliers = () => useContext(SuppliersContext);

export const SuppliersProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await supplierService.getSuppliers();
      setSuppliers(response.data);
      localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(response.data));
      return response.data;
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError(err.message || 'Failed to fetch suppliers');
      showError(`Error loading suppliers: ${err.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addSupplier = useCallback(async (supplierData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await supplierService.addSupplier(supplierData);
      setSuppliers(prev => [...prev, response.data]);
      showSuccess('Supplier added successfully');
      return response.data;
    } catch (err) {
      console.error('Error adding supplier:', err);
      setError(err.message || 'Failed to add supplier');
      showError(`Error adding supplier: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSupplier = useCallback(async (id, supplierData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await supplierService.updateSupplier(id, supplierData);
      const updatedSupplier = response.data;
      
      setSuppliers(prev => 
        prev.map(supplier => supplier.id === id ? updatedSupplier : supplier)
      );
      
      showSuccess('Supplier updated successfully');
      return updatedSupplier;
    } catch (err) {
      console.error('Error updating supplier:', err);
      setError(err.message || 'Failed to update supplier');
      showError(`Error updating supplier: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSupplier = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await supplierService.deleteSupplier(id);
      setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
      showSuccess('Supplier deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting supplier:', err);
      setError(err.message || 'Failed to delete supplier');
      showError(`Error deleting supplier: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Try to use cached data first for faster initial render
        const cachedSuppliers = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
        if (cachedSuppliers) {
          setSuppliers(JSON.parse(cachedSuppliers));
          console.log("Using cached suppliers");
        }
      } catch (err) {
        console.error("Error loading cached suppliers:", err);
      }
      
      // Then fetch fresh data
      await fetchSuppliers();
    };
    
    loadInitialData();
  }, [fetchSuppliers]);

  const value = {
    // State
    suppliers,
    loading,
    error,
    
    // Operations
    fetchSuppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier
  };

  return (
    <SuppliersContext.Provider value={value}>
      {children}
    </SuppliersContext.Provider>
  );
};

export default SuppliersContext; 