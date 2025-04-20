import { useCallback, useState } from 'react';
import { message } from 'antd';
import { exportToExcel } from '../utils/exportHelpers';

/**
 * Custom hook for handling spreadsheet export operations
 * @returns {Object} Export functions and state
 */
const useSpreadsheetExport = () => {
  const [exporting, setExporting] = useState(false);
  const [printing, setPrinting] = useState(false);
  
  /**
   * Export the financial data to Excel
   * @param {Object} data - Financial data to export
   * @param {number} year - The year of the data
   */
  const handleExport = useCallback((data, year) => {
    if (!data) {
      message.error('No data available to export');
      return;
    }
    
    setExporting(true);
    
    try {
      exportToExcel(data, year);
      message.success('Financial data exported successfully');
    } catch (error) {
      console.error('Error exporting financial data:', error);
      message.error('Failed to export financial data');
    } finally {
      setExporting(false);
    }
  }, []);
  
  /**
   * Print the financial spreadsheet
   */
  const handlePrint = useCallback(() => {
    setPrinting(true);
    
    try {
      // Add a special class to the body for print styling
      document.body.classList.add('printing-spreadsheet');
      
      // Use browser print function
      window.print();
      
      message.success('Print job sent successfully');
    } catch (error) {
      console.error('Error printing financial data:', error);
      message.error('Failed to print financial data');
    } finally {
      // Remove the special class after printing
      document.body.classList.remove('printing-spreadsheet');
      setPrinting(false);
    }
  }, []);
  
  /**
   * Save the financial data
   * @param {Object} data - Financial data to save
   * @param {number} year - The year of the data
   * @param {Function} saveFinancialData - Function to save the data
   */
  const handleSave = useCallback(async (data, year, saveFinancialData) => {
    if (!data || !saveFinancialData) {
      message.error('Cannot save: missing data or save function');
      return;
    }
    
    try {
      await saveFinancialData(data, year);
      message.success('Financial data saved successfully');
    } catch (error) {
      console.error('Error saving financial data:', error);
      message.error('Failed to save financial data');
    }
  }, []);
  
  return {
    exporting,
    printing,
    handleExport,
    handlePrint,
    handleSave
  };
};

export default useSpreadsheetExport; 