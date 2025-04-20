import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

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
      const response = await axios.get('/api/suppliers');
      setSuppliers(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch suppliers');
      toast.error(`Error loading suppliers: ${err.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addSupplier = useCallback(async (supplierData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/suppliers', supplierData);
      setSuppliers(prev => [...prev, response.data]);
      toast.success('Supplier added successfully');
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to add supplier');
      toast.error(`Error adding supplier: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSupplier = useCallback(async (id, supplierData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/suppliers/${id}`, supplierData);
      const updatedSupplier = response.data;
      
      setSuppliers(prev => 
        prev.map(supplier => supplier.id === id ? updatedSupplier : supplier)
      );
      
      toast.success('Supplier updated successfully');
      return updatedSupplier;
    } catch (err) {
      setError(err.message || 'Failed to update supplier');
      toast.error(`Error updating supplier: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSupplier = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/suppliers/${id}`);
      setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
      toast.success('Supplier deleted successfully');
    } catch (err) {
      setError(err.message || 'Failed to delete supplier');
      toast.error(`Error deleting supplier: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const value = {
    suppliers,
    loading,
    error,
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