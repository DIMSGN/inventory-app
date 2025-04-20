import { useState, useCallback } from 'react';
import axios from 'axios';
import { ECONOMY_ENDPOINTS } from '../utils/config';

/**
 * Hook for managing sales data operations
 * @param {Object} options - Configuration options
 * @returns {Object} - Sales data and utility functions
 */
const useSales = () => {
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [salesCategories, setSalesCategories] = useState([]);

  // Fetch sales data
  const fetchSales = useCallback(async (month, year) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {};
      if (month) params.month = month;
      if (year) params.year = year;
      
      const response = await axios.get(ECONOMY_ENDPOINTS.SALES, { params });
      setSales(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch sales data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch sales categories
  const fetchSalesCategories = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const response = await axios.get(ECONOMY_ENDPOINTS.SALES_CATEGORIES);
      setSalesCategories(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch sales categories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add a new sale record
  const addSale = useCallback(async (saleData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(ECONOMY_ENDPOINTS.SALES, saleData);
      
      // Update the local state with the new sale
      setSales(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to add sale');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update an existing sale record
  const updateSale = useCallback(async (id, saleData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(`${ECONOMY_ENDPOINTS.SALES}/${id}`, saleData);
      
      // Update the local state with the updated sale
      setSales(prev => 
        prev.map(sale => 
          sale.id === id ? response.data : sale
        )
      );
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to update sale');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete a sale record
  const deleteSale = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      await axios.delete(`${ECONOMY_ENDPOINTS.SALES}/${id}`);
      
      // Remove the deleted sale from local state
      setSales(prev => prev.filter(sale => sale.id !== id));
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete sale');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Calculate total sales
  const calculateTotalSales = useCallback(() => {
    return sales.reduce((total, sale) => total + Number(sale.amount || 0), 0);
  }, [sales]);

  // Calculate sales by day
  const calculateSalesByDay = useCallback(() => {
    const salesByDay = {};
    
    sales.forEach(sale => {
      const date = sale.date ? new Date(sale.date).toISOString().split('T')[0] : 'Unknown';
      if (!salesByDay[date]) {
        salesByDay[date] = 0;
      }
      salesByDay[date] += Number(sale.amount || 0);
    });
    
    return salesByDay;
  }, [sales]);

  // Calculate sales by category
  const calculateSalesByCategory = useCallback(() => {
    const salesByCategory = {};
    
    sales.forEach(sale => {
      const category = sale.category || 'Uncategorized';
      if (!salesByCategory[category]) {
        salesByCategory[category] = 0;
      }
      salesByCategory[category] += Number(sale.amount || 0);
    });
    
    return salesByCategory;
  }, [sales]);

  // Add a new sales category
  const addSalesCategory = useCallback(async (categoryData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(ECONOMY_ENDPOINTS.SALES_CATEGORIES, categoryData);
      
      // Update the local state with the new category
      setSalesCategories(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to add sales category');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    sales,
    salesCategories,
    isLoading,
    error,
    fetchSales,
    fetchSalesCategories,
    addSale,
    updateSale,
    deleteSale,
    calculateTotalSales,
    calculateSalesByDay,
    calculateSalesByCategory,
    addSalesCategory
  };
};

export default useSales; 