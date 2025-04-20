import { useState, useEffect } from 'react';
import { useAppContext } from '../../../../../../common/contexts/AppContext';
import { message } from 'antd';

/**
 * Custom hook for fetching and managing economy data
 * @returns {Object} Economy data and related functions
 */
const useEconomyData = () => {
  const { products } = useAppContext();
  const [economySummary, setEconomySummary] = useState({
    revenue: 0,
    expenses: 0,
    profit: 0,
    inventoryValue: 0
  });
  const [loading, setLoading] = useState(false);

  // Calculate inventory value based on products
  useEffect(() => {
    const calculateInventoryValue = () => {
      const totalValue = products.reduce((sum, product) => {
        return sum + (product.purchase_price * product.amount);
      }, 0);
      
      setEconomySummary(prev => ({
        ...prev,
        inventoryValue: totalValue
      }));
    };
    
    calculateInventoryValue();
    fetchEconomyData();
  }, [products]);
  
  // Fetch economy data from API
  const fetchEconomyData = async () => {
    setLoading(true);
    try {
      // In a production app, you would fetch real financial data here
      // For now, we're using mock data
      
      // This would be replaced with a real API call, e.g.:
      // const response = await axios.get(`${apiUrl}/financial/summary`);
      // setEconomySummary(response.data);
      
      // Mock data for demonstration
      setTimeout(() => {
        setEconomySummary(prev => ({
          ...prev,
          revenue: 125750.50,
          expenses: 78235.25,
          profit: 47515.25
        }));
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching economy data:', error);
      message.error('Failed to load financial data');
      setLoading(false);
    }
  };

  return {
    economySummary,
    loading,
    fetchEconomyData
  };
};

export { useEconomyData }; 