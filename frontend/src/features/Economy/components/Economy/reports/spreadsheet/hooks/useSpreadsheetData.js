import { useState, useEffect, useCallback } from 'react';
import { useEconomy } from '../../../../../contexts/EconomyContext';
import { calculateTotals } from '../utils/calculators';

/**
 * Custom hook for managing financial spreadsheet data
 * @param {number} initialYear - Initial year to load
 * @returns {Object} Spreadsheet data and related functions
 */
const useSpreadsheetData = (initialYear) => {
  const { 
    financialData,
    loading,
    error,
    currentYear, 
    fetchFinancialData,
    saveFinancialData,
    isUsingMockData
  } = useEconomy();
  
  const [yearMonth, setYearMonth] = useState(() => {
    const year = initialYear || currentYear || new Date().getFullYear();
    return `${year}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  });
  
  const [displayData, setDisplayData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Update yearMonth when currentYear changes
  useEffect(() => {
    if (currentYear) {
      setYearMonth(`${currentYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
    }
  }, [currentYear]);
  
  // Fetch financial data when year changes
  useEffect(() => {
    const year = yearMonth.split('-')[0];
    if (year && !isNaN(parseInt(year))) {
      fetchFinancialData(parseInt(year));
    }
  }, [yearMonth.split('-')[0], fetchFinancialData]);
  
  // Process data for display when financialData changes
  useEffect(() => {
    if (financialData) {
      const processedData = processDataForDisplay(financialData);
      setDisplayData(processedData);
      setLastUpdated(new Date());
    }
  }, [financialData]);
  
  // Function to process data for display
  const processDataForDisplay = useCallback((data) => {
    if (!data) return null;
    // Apply any transformations needed for display
    return calculateTotals(data);
  }, []);
  
  // Function to handle year/month changes
  const handleYearMonthChange = useCallback((date) => {
    if (date) {
      const year = date.year();
      const month = date.month() + 1;
      setYearMonth(`${year}-${String(month).padStart(2, '0')}`);
    }
  }, []);
  
  return {
    yearMonth,
    displayData,
    lastUpdated,
    loading,
    error,
    isUsingMockData,
    handleYearMonthChange
  };
};

export default useSpreadsheetData; 