import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../../../config';
import { MOCK_FINANCIAL_DATA } from '../utils/mockData';
import { generateFinancialSummary } from '../utils/financialCalculations';
import { ECONOMY_ENDPOINTS, FEATURE_FLAGS } from '../utils/config';
import { useEconomy } from '../contexts/EconomyContext';
import { calculateTotals, processDataForDisplay } from '../components/Economy/FinancialSpreadsheet/utils';

/**
 * Custom hook for managing financial data in spreadsheets
 * 
 * This hook centralizes all financial data operations for spreadsheet components,
 * including data fetching, cell editing, saving, and formatting for display.
 * 
 * @example
 * // In a component file:
 * const {
 *   displayData,
 *   handleCellEdit,
 *   handleSave,
 *   // other values and methods...
 * } = useFinancialData(2023);
 * 
 * @param {number} initialYear - Initial year to load
 * @returns {Object} Financial data and related methods
 */
const useFinancialData = (initialYear) => {
  const { 
    financialData,
    loading,
    error,
    setLoading,
    fetchFinancialData,
    saveFinancialData,
    isUsingMockData,
    currentYear
  } = useEconomy();
  
  const [saving, setSaving] = useState(false);
  const [yearMonth, setYearMonth] = useState(() => {
    const year = initialYear || currentYear || new Date().getFullYear();
    return `${year}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [displayData, setDisplayData] = useState(null);
  
  // Update yearMonth when currentYear changes
  useEffect(() => {
    if (currentYear) {
      setYearMonth(`${currentYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
    }
  }, [currentYear]);
  
  // Fetch financial data on component mount and when year changes
  useEffect(() => {
    const year = yearMonth.split('-')[0];
    if (year && !isNaN(parseInt(year))) {
      fetchFinancialData(parseInt(year));
    }
  }, [yearMonth.split('-')[0], fetchFinancialData]);
  
  // Process data for display when financialData changes
  useEffect(() => {
    setDisplayData(processDataForDisplay(financialData));
    setLastUpdated(new Date());
  }, [financialData]);
  
  /**
   * Handle cell edit
   * @param {number} value - New cell value
   * @param {Object} record - Data record
   * @param {string} dataKey - Data category key
   * @param {number} monthIndex - Month index (0-11)
   */
  const handleCellEdit = useCallback((value, record, dataKey, monthIndex) => {
    // Clone the current data
    if (!financialData) return;
    
    const newData = { ...financialData };
    
    // Update the specific cell value
    if (dataKey === 'sales') {
      const index = newData.sales.findIndex(item => item.id === record.id);
      if (index !== -1) {
        newData.sales[index].months[monthIndex] = value;
      }
    } else if (dataKey === 'costOfGoods') {
      const index = newData.expenses.costOfGoods.findIndex(item => item.id === record.id);
      if (index !== -1) {
        newData.expenses.costOfGoods[index].months[monthIndex] = value;
      }
    } else if (dataKey === 'operational') {
      const index = newData.expenses.operational.findIndex(item => item.id === record.id);
      if (index !== -1) {
        newData.expenses.operational[index].months[monthIndex] = value;
      }
    } else if (dataKey === 'utilities') {
      const index = newData.expenses.utilities.findIndex(item => item.id === record.id);
      if (index !== -1) {
        newData.expenses.utilities[index].months[monthIndex] = value;
      }
    }
    
    // Recalculate totals
    calculateTotals(newData);
    
    // Save the updated data to the context
    saveFinancialData(newData, parseInt(yearMonth.split('-')[0]));
  }, [financialData, yearMonth, saveFinancialData]);
  
  /**
   * Handle save button click - save to server
   * @returns {Promise<boolean>} Success status
   */
  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      await saveFinancialData(financialData, parseInt(yearMonth.split('-')[0]));
      setSaving(false);
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      setSaving(false);
      return false;
    }
  }, [financialData, yearMonth, saveFinancialData]);
  
  /**
   * Handle year change
   * @param {string|number} year - New year value
   */
  const handleYearChange = useCallback((year) => {
    // Keep the existing month
    const month = yearMonth.split('-')[1];
    setYearMonth(`${year}-${month}`);
  }, [yearMonth]);
  
  /**
   * Refresh data for current year
   * @returns {Promise} - Promise that resolves when data is refreshed
   */
  const refreshData = useCallback(() => {
    const year = yearMonth.split('-')[0];
    if (year && !isNaN(parseInt(year))) {
      return fetchFinancialData(parseInt(year));
    }
    return Promise.resolve();
  }, [yearMonth, fetchFinancialData]);

  return {
    yearMonth,
    lastUpdated,
    displayData,
    financialData,
    loading,
    saving,
    error,
    isUsingMockData,
    handleCellEdit,
    handleSave,
    handleYearChange,
    refreshData,
    currentYear: yearMonth.split('-')[0]
  };
};

export default useFinancialData; 