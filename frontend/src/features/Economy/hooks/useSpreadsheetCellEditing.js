import { useCallback } from 'react';
import { useEconomy } from '../contexts/EconomyContext';

/**
 * Custom hook for handling spreadsheet cell editing operations
 * 
 * This specialized hook focuses exclusively on cell editing operations,
 * separating this concern from the main data management hook.
 * 
 * @example
 * // In a component file:
 * const { 
 *   handleCellEdit,
 *   handleBulkEdit,
 *   recalculateTotals
 * } = useSpreadsheetCellEditing(financialData, year);
 * 
 * @param {Object} financialData - Current financial data
 * @param {string|number} year - Current year
 * @returns {Object} Cell editing methods
 */
const useSpreadsheetCellEditing = (financialData, year) => {
  const { saveFinancialData } = useEconomy();
  
  /**
   * Recalculate all totals for the data
   * @param {Object} data - Financial data to recalculate 
   * @returns {Object} Updated data with recalculated totals
   */
  const recalculateTotals = useCallback((data) => {
    if (!data) return data;
    
    const updatedData = { ...data };
    
    // Calculate totals for sales
    if (updatedData.sales) {
      updatedData.sales.forEach(item => {
        item.total = item.months.reduce((sum, val) => sum + (val || 0), 0);
      });
    }
    
    // Calculate totals for expenses categories
    if (updatedData.expenses) {
      // Cost of goods
      if (updatedData.expenses.costOfGoods) {
        updatedData.expenses.costOfGoods.forEach(item => {
          item.total = item.months.reduce((sum, val) => sum + (val || 0), 0);
        });
      }
      
      // Operational expenses
      if (updatedData.expenses.operational) {
        updatedData.expenses.operational.forEach(item => {
          item.total = item.months.reduce((sum, val) => sum + (val || 0), 0);
        });
      }
      
      // Utilities expenses
      if (updatedData.expenses.utilities) {
        updatedData.expenses.utilities.forEach(item => {
          item.total = item.months.reduce((sum, val) => sum + (val || 0), 0);
        });
      }
    }
    
    // Calculate summary data
    if (!updatedData.summary) {
      updatedData.summary = {};
    }
    
    // Calculate total sales by month
    const totalSalesByMonth = Array(12).fill(0);
    if (updatedData.sales) {
      updatedData.sales.forEach(item => {
        item.months.forEach((val, idx) => {
          totalSalesByMonth[idx] += val || 0;
        });
      });
    }
    
    // Calculate total expenses by month and category
    const totalCOGByMonth = Array(12).fill(0);
    const totalOpexByMonth = Array(12).fill(0);
    const totalUtilitiesByMonth = Array(12).fill(0);
    
    if (updatedData.expenses) {
      // Cost of goods
      if (updatedData.expenses.costOfGoods) {
        updatedData.expenses.costOfGoods.forEach(item => {
          item.months.forEach((val, idx) => {
            totalCOGByMonth[idx] += val || 0;
          });
        });
      }
      
      // Operational expenses
      if (updatedData.expenses.operational) {
        updatedData.expenses.operational.forEach(item => {
          item.months.forEach((val, idx) => {
            totalOpexByMonth[idx] += val || 0;
          });
        });
      }
      
      // Utilities expenses
      if (updatedData.expenses.utilities) {
        updatedData.expenses.utilities.forEach(item => {
          item.months.forEach((val, idx) => {
            totalUtilitiesByMonth[idx] += val || 0;
          });
        });
      }
    }
    
    // Calculate total expenses by month
    const totalExpensesByMonth = totalCOGByMonth.map((val, idx) => 
      val + totalOpexByMonth[idx] + totalUtilitiesByMonth[idx]
    );
    
    // Calculate profit by month
    const profitByMonth = totalSalesByMonth.map((val, idx) => 
      val - totalExpensesByMonth[idx]
    );
    
    // Update summary
    updatedData.summary = {
      ...updatedData.summary,
      totalSales: {
        months: totalSalesByMonth,
        total: totalSalesByMonth.reduce((sum, val) => sum + val, 0)
      },
      totalExpenses: {
        months: totalExpensesByMonth,
        total: totalExpensesByMonth.reduce((sum, val) => sum + val, 0)
      },
      profit: {
        months: profitByMonth,
        total: profitByMonth.reduce((sum, val) => sum + val, 0)
      }
    };
    
    return updatedData;
  }, []);
  
  /**
   * Handle a single cell edit
   * @param {number} value - New cell value
   * @param {Object} record - Data record
   * @param {string} dataKey - Data category key
   * @param {number} monthIndex - Month index (0-11)
   * @returns {Object} Updated financial data
   */
  const handleCellEdit = useCallback((value, record, dataKey, monthIndex) => {
    if (!financialData) return null;
    
    // Clone the current data
    const newData = { ...financialData };
    
    // Update the specific cell value
    if (dataKey === 'sales') {
      const index = newData.sales.findIndex(item => item.id === record.id);
      if (index !== -1) {
        newData.sales[index] = { 
          ...newData.sales[index],
          months: [...newData.sales[index].months]
        };
        newData.sales[index].months[monthIndex] = value;
      }
    } else if (dataKey === 'costOfGoods') {
      const index = newData.expenses.costOfGoods.findIndex(item => item.id === record.id);
      if (index !== -1) {
        newData.expenses.costOfGoods[index] = {
          ...newData.expenses.costOfGoods[index],
          months: [...newData.expenses.costOfGoods[index].months]
        };
        newData.expenses.costOfGoods[index].months[monthIndex] = value;
      }
    } else if (dataKey === 'operational') {
      const index = newData.expenses.operational.findIndex(item => item.id === record.id);
      if (index !== -1) {
        newData.expenses.operational[index] = {
          ...newData.expenses.operational[index],
          months: [...newData.expenses.operational[index].months]
        };
        newData.expenses.operational[index].months[monthIndex] = value;
      }
    } else if (dataKey === 'utilities') {
      const index = newData.expenses.utilities.findIndex(item => item.id === record.id);
      if (index !== -1) {
        newData.expenses.utilities[index] = {
          ...newData.expenses.utilities[index],
          months: [...newData.expenses.utilities[index].months]
        };
        newData.expenses.utilities[index].months[monthIndex] = value;
      }
    }
    
    // Recalculate totals
    const updatedData = recalculateTotals(newData);
    
    // Save the updated data
    if (year) {
      saveFinancialData(updatedData, parseInt(year));
    }
    
    return updatedData;
  }, [financialData, year, recalculateTotals, saveFinancialData]);
  
  /**
   * Handle bulk editing of multiple cells
   * @param {Array<Object>} edits - Array of edit operations
   * @param {Object} edits[].record - Data record
   * @param {string} edits[].dataKey - Data category key
   * @param {number} edits[].monthIndex - Month index
   * @param {number} edits[].value - New value
   * @returns {Object} Updated financial data
   */
  const handleBulkEdit = useCallback((edits) => {
    if (!financialData || !Array.isArray(edits) || edits.length === 0) {
      return financialData;
    }
    
    // Clone the data once
    let newData = { ...financialData };
    
    // Apply all edits
    edits.forEach(({ value, record, dataKey, monthIndex }) => {
      if (dataKey === 'sales') {
        const index = newData.sales.findIndex(item => item.id === record.id);
        if (index !== -1) {
          if (!Array.isArray(newData.sales[index].months)) {
            newData.sales[index].months = Array(12).fill(0);
          }
          newData.sales[index].months[monthIndex] = value;
        }
      } else if (dataKey === 'costOfGoods') {
        const index = newData.expenses.costOfGoods.findIndex(item => item.id === record.id);
        if (index !== -1) {
          if (!Array.isArray(newData.expenses.costOfGoods[index].months)) {
            newData.expenses.costOfGoods[index].months = Array(12).fill(0);
          }
          newData.expenses.costOfGoods[index].months[monthIndex] = value;
        }
      } else if (dataKey === 'operational') {
        const index = newData.expenses.operational.findIndex(item => item.id === record.id);
        if (index !== -1) {
          if (!Array.isArray(newData.expenses.operational[index].months)) {
            newData.expenses.operational[index].months = Array(12).fill(0);
          }
          newData.expenses.operational[index].months[monthIndex] = value;
        }
      } else if (dataKey === 'utilities') {
        const index = newData.expenses.utilities.findIndex(item => item.id === record.id);
        if (index !== -1) {
          if (!Array.isArray(newData.expenses.utilities[index].months)) {
            newData.expenses.utilities[index].months = Array(12).fill(0);
          }
          newData.expenses.utilities[index].months[monthIndex] = value;
        }
      }
    });
    
    // Recalculate totals once after all edits
    newData = recalculateTotals(newData);
    
    // Save the updated data
    if (year) {
      saveFinancialData(newData, parseInt(year));
    }
    
    return newData;
  }, [financialData, year, recalculateTotals, saveFinancialData]);
  
  return {
    handleCellEdit,
    handleBulkEdit,
    recalculateTotals
  };
};

export default useSpreadsheetCellEditing; 