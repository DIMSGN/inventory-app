import { useState, useCallback } from 'react';
import axios from 'axios';
import { ECONOMY_ENDPOINTS } from '../utils/config';

/**
 * Hook for managing expenses operations (operating and payroll)
 * @param {Object} options - Configuration options
 * @param {string} options.type - The expense type ('operating' or 'payroll')
 * @returns {Object} - Expense data and utility functions
 */
const useExpenses = ({ type = 'operating' } = {}) => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch all expenses of the specified type
  const fetchExpenses = useCallback(async (month, year) => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = `${ECONOMY_ENDPOINTS.FINANCIAL_DATA}/${type}`;
      const params = {};
      
      if (month) params.month = month;
      if (year) params.year = year;
      
      const response = await axios.get(endpoint, { params });
      setExpenses(response.data || []);
    } catch (err) {
      setError(err.message || `Failed to fetch ${type} expenses`);
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  // Fetch expense categories
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const response = await axios.get(`${ECONOMY_ENDPOINTS.EXPENSE_CATEGORIES}?type=${type}`);
      setCategories(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch expense categories');
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  // Add a new expense
  const addExpense = useCallback(async (expenseData) => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = `${ECONOMY_ENDPOINTS.FINANCIAL_DATA}/${type}`;
      const response = await axios.post(endpoint, expenseData);
      
      // Update the local state with the new expense
      setExpenses(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to add expense');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  // Update an existing expense
  const updateExpense = useCallback(async (id, expenseData) => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = `${ECONOMY_ENDPOINTS.FINANCIAL_DATA}/${type}/${id}`;
      const response = await axios.put(endpoint, expenseData);
      
      // Update the local state with the updated expense
      setExpenses(prev => 
        prev.map(expense => 
          expense.id === id ? response.data : expense
        )
      );
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to update expense');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  // Delete an expense
  const deleteExpense = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = `${ECONOMY_ENDPOINTS.FINANCIAL_DATA}/${type}/${id}`;
      await axios.delete(endpoint);
      
      // Remove the deleted expense from local state
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete expense');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  // Calculate totals by category
  const calculateTotalsByCategory = useCallback(() => {
    const totals = {};
    
    expenses.forEach(expense => {
      const category = expense.category || 'Uncategorized';
      if (!totals[category]) {
        totals[category] = 0;
      }
      totals[category] += Number(expense.amount || 0);
    });
    
    return totals;
  }, [expenses]);

  // Add a new category
  const addCategory = useCallback(async (categoryData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${ECONOMY_ENDPOINTS.EXPENSE_CATEGORIES}`, {
        ...categoryData,
        type
      });
      
      // Update the local state with the new category
      setCategories(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to add category');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  return {
    expenses,
    categories,
    isLoading,
    error,
    fetchExpenses,
    fetchCategories,
    addExpense,
    updateExpense,
    deleteExpense,
    calculateTotalsByCategory,
    addCategory
  };
};

export default useExpenses; 