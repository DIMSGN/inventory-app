import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import axios from 'axios';
import { API_URL } from '../../../config';

// Mock data for when API fails
import { MOCK_FINANCIAL_DATA } from '../utils/mockData';

/**
 * Custom hook for managing financial spreadsheet data
 * 
 * @param {number} initialYear - Initial year to load data for
 * @returns {Object} Financial spreadsheet state and functions
 */
const useFinancialSpreadsheet = (initialYear = new Date().getFullYear()) => {
  const [financialData, setFinancialData] = useState({
    sales: [],
    expenses: {
      costOfGoods: [],
      operational: [],
      payroll: [],
      utilities: [],
      otherExpenses: [],
    },
    summary: {},
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentYear, setCurrentYear] = useState(initialYear);
  const [apiErrorCount, setApiErrorCount] = useState(0);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const [editingCell, setEditingCell] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  /**
   * Fetch financial data for a specific year
   * 
   * @param {number} year - Year to fetch data for
   * @returns {Object} The financial data
   */
  const fetchFinancialData = useCallback(async (year = currentYear) => {
    // If we've had multiple API errors, use mock data without trying API
    if (apiErrorCount > 2) {
      console.log('Using mock data due to repeated API failures');
      
      if (!isUsingMockData) {
        message.warning('Using demo data due to server issues', 3);
        setIsUsingMockData(true);
      }
      
      setFinancialData(MOCK_FINANCIAL_DATA);
      setLoading(false);
      return MOCK_FINANCIAL_DATA;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/financial/annual/${year}`);
      setFinancialData(response.data);
      setApiErrorCount(0); // Reset error count on success
      setIsUsingMockData(false);
      setLastUpdated(new Date());
      
      return response.data;
    } catch (err) {
      console.error('Error fetching financial data:', err);
      setError('Failed to load financial data');
      
      // Increment API error count
      setApiErrorCount(prev => prev + 1);
      
      // Show appropriate message based on error count
      if (apiErrorCount === 0) {
        message.error('Failed to load financial data from server.', 3);
      } else if (apiErrorCount === 1) {
        message.warning('Still having trouble connecting to server. Will use demo data if issues persist.', 3);
      } else {
        message.info('Using demo data now. You can still interact with the spreadsheet.', 3);
        setIsUsingMockData(true);
        
        // Use mock data after multiple failures
        setFinancialData(MOCK_FINANCIAL_DATA);
        return MOCK_FINANCIAL_DATA;
      }
      
      // Return empty data structure
      const emptyData = {
        sales: [],
        expenses: {
          costOfGoods: [],
          operational: [],
          payroll: [],
          utilities: [],
          otherExpenses: [],
        },
        summary: {},
      };
      
      setFinancialData(emptyData);
      return emptyData;
    } finally {
      setLoading(false);
    }
  }, [apiErrorCount, currentYear, isUsingMockData]);

  /**
   * Save financial data for a specific year
   * 
   * @param {Object} data - Financial data to save
   * @param {number} year - Year to save data for
   * @returns {boolean} Success status
   */
  const saveFinancialData = useCallback(async (data, year = currentYear) => {
    // If using mock data, just update local state without API call
    if (isUsingMockData) {
      setFinancialData(data);
      message.success('Changes saved to demo data (local only)');
      return true;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put(`${API_URL}/financial/annual/${year}`, data);
      
      if (response.data.success) {
        message.success('Financial data saved successfully');
        await fetchFinancialData(year); // Refresh data
        return true;
      } else {
        throw new Error(response.data.error || 'Failed to save data');
      }
    } catch (err) {
      console.error('Error saving financial data:', err);
      setError('Failed to save financial data');
      message.error('Failed to save financial data');
      
      // Increment API error count
      setApiErrorCount(prev => prev + 1);
      
      return false;
    } finally {
      setLoading(false);
    }
  }, [apiErrorCount, currentYear, fetchFinancialData, isUsingMockData]);

  /**
   * Handle cell editing 
   * 
   * @param {number|string} value - New cell value
   * @param {Object} record - Record being edited
   * @param {string} dataKey - Data key to update (e.g., "sales", "expenses.operational")
   * @param {number} monthIndex - Month index (0-11)
   */
  const handleCellEdit = useCallback((value, record, dataKey, monthIndex) => {
    // Create deep copy of financial data to avoid direct state mutation
    const updatedData = JSON.parse(JSON.stringify(financialData));
    
    // Parse the dataKey to navigate the data structure
    const keys = dataKey.split('.');
    
    // Navigate to the correct array within the data structure
    let dataArray = updatedData;
    keys.forEach((key, index) => {
      if (index < keys.length - 1) {
        dataArray = dataArray[key];
      }
    });
    
    // Get the actual array from the last key
    dataArray = dataArray[keys[keys.length - 1]];
    
    // Find the record to update
    const recordIndex = dataArray.findIndex(item => item.id === record.id);
    if (recordIndex === -1) {
      console.error('Record not found for editing');
      return;
    }
    
    // Update the month value
    dataArray[recordIndex].months[monthIndex] = parseFloat(value) || 0;
    
    // Recalculate row total
    dataArray[recordIndex].total = dataArray[recordIndex].months.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    
    // Set the updated data
    setFinancialData(updatedData);
  }, [financialData]);

  /**
   * Change the current year and fetch data for that year
   * 
   * @param {number} year - Year to change to
   */
  const changeYear = useCallback(async (year) => {
    setCurrentYear(year);
    await fetchFinancialData(year);
  }, [fetchFinancialData]);

  /**
   * Start editing a cell
   * 
   * @param {number} rowIndex - Row index
   * @param {string} columnKey - Column key
   * @param {*} value - Current cell value
   */
  const startEdit = useCallback((rowIndex, columnKey, value) => {
    setEditingCell({ rowIndex, columnKey, value });
  }, []);

  /**
   * Save cell edits
   */
  const saveEdit = useCallback(() => {
    setEditingCell(null);
  }, []);

  /**
   * Cancel cell editing
   */
  const cancelEdit = useCallback(() => {
    setEditingCell(null);
  }, []);

  // Load financial data on component mount or when year changes
  useEffect(() => {
    fetchFinancialData(currentYear);
  }, [currentYear, fetchFinancialData]);

  return {
    financialData,
    loading,
    error,
    currentYear,
    isUsingMockData,
    editingCell,
    fetchFinancialData,
    saveFinancialData,
    handleCellEdit,
    changeYear,
    startEdit,
    saveEdit,
    cancelEdit
  };
};

export default useFinancialSpreadsheet; 