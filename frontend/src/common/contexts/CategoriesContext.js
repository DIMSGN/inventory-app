import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CategoriesContext = createContext();

export const useCategories = () => useContext(CategoriesContext);

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
      toast.error(`Error loading categories: ${err.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = useCallback(async (categoryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/categories', categoryData);
      setCategories(prev => [...prev, response.data]);
      toast.success('Category added successfully');
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to add category');
      toast.error(`Error adding category: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(async (id, categoryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/categories/${id}`, categoryData);
      const updatedCategory = response.data;
      
      setCategories(prev => 
        prev.map(category => category.id === id ? updatedCategory : category)
      );
      
      toast.success('Category updated successfully');
      return updatedCategory;
    } catch (err) {
      setError(err.message || 'Failed to update category');
      toast.error(`Error updating category: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/categories/${id}`);
      setCategories(prev => prev.filter(category => category.id !== id));
      toast.success('Category deleted successfully');
    } catch (err) {
      setError(err.message || 'Failed to delete category');
      toast.error(`Error deleting category: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const value = {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};

export default CategoriesContext; 