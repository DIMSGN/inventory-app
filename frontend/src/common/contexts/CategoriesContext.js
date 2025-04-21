import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { API_URL, STORAGE_KEYS } from '../config';
import { categoryService, toastService } from '../services';

const { showSuccess, showError } = toastService;

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
      const response = await categoryService.getCategories();
      setCategories(response.data);
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(response.data));
      return response.data;
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Failed to fetch categories');
      showError(`Error loading categories: ${err.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = useCallback(async (categoryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.addCategory(categoryData);
      setCategories(prev => [...prev, response.data]);
      showSuccess('Category added successfully');
      return response.data;
    } catch (err) {
      console.error('Error adding category:', err);
      setError(err.message || 'Failed to add category');
      showError(`Error adding category: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(async (id, categoryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.updateCategory(id, categoryData);
      const updatedCategory = response.data;
      
      setCategories(prev => 
        prev.map(category => category.id === id ? updatedCategory : category)
      );
      
      showSuccess('Category updated successfully');
      return updatedCategory;
    } catch (err) {
      console.error('Error updating category:', err);
      setError(err.message || 'Failed to update category');
      showError(`Error updating category: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await categoryService.deleteCategory(id);
      setCategories(prev => prev.filter(category => category.id !== id));
      showSuccess('Category deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err.message || 'Failed to delete category');
      showError(`Error deleting category: ${err.message}`);
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
        const cachedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
        if (cachedCategories) {
          setCategories(JSON.parse(cachedCategories));
          console.log("Using cached categories");
        }
      } catch (err) {
        console.error("Error loading cached categories:", err);
      }
      
      // Then fetch fresh data
      await fetchCategories();
    };
    
    loadInitialData();
  }, [fetchCategories]);

  const value = {
    // State
    categories,
    loading,
    error,
    
    // Operations
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