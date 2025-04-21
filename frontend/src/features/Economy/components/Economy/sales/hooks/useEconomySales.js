import { useState, useEffect, useCallback } from 'react';
import { salesService } from '../../../../../../common/services';

/**
 * Custom hook for managing sales data and operations
 */
const useEconomySales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Load sales data
  const loadSales = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const salesData = await salesService.getAllSales();
      setSales(salesData || []);
    } catch (err) {
      console.error('Error loading sales:', err);
      setError('Failed to load sales data');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Initialize data
  useEffect(() => {
    loadSales();
  }, [loadSales]);
  
  // Record a sale
  const recordSale = async (saleData, type) => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      // Use the appropriate service method based on sale type
      switch(type) {
        case 'food':
          response = await salesService.recordFoodSale(saleData);
          break;
        case 'coffee':
          response = await salesService.recordCoffeeSale(saleData);
          break;
        case 'cocktail':
          response = await salesService.recordCocktailSale(saleData);
          break;
        case 'drink':
          response = await salesService.recordDrinkSale(saleData);
          break;
        default:
          throw new Error(`Unknown sale type: ${type}`);
      }
      
      // Refresh sales data
      await loadSales();
      return response;
    } catch (err) {
      console.error(`Error recording ${type} sale:`, err);
      setError(`Failed to record ${type} sale`);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    sales,
    loading,
    error,
    loadSales,
    recordSale
  };
};

export default useEconomySales; 