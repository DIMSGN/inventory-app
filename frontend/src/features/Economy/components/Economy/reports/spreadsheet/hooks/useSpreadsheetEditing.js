import { useState, useCallback } from 'react';
import { useEconomy } from '../../../../../contexts/EconomyContext';
import { calculateTotals } from '../utils/calculators';

/**
 * Custom hook for handling spreadsheet cell editing
 * @returns {Object} Editing state and functions
 */
const useSpreadsheetEditing = () => {
  const { saveFinancialData } = useEconomy();
  const [editingCell, setEditingCell] = useState(null);
  const [editingValue, setEditingValue] = useState(null);
  const [saving, setSaving] = useState(false);

  /**
   * Start editing a cell
   * @param {string} rowIndex - Row identifier
   * @param {string} columnKey - Column identifier
   * @param {any} value - Current cell value
   */
  const startEdit = useCallback((rowIndex, columnKey, value) => {
    setEditingCell({ rowIndex, columnKey });
    setEditingValue(value);
  }, []);

  /**
   * Cancel the current edit
   */
  const cancelEdit = useCallback(() => {
    setEditingCell(null);
    setEditingValue(null);
  }, []);

  /**
   * Handle cell edit
   * @param {number} value - New cell value
   * @param {Object} record - Row data
   * @param {string} dataKey - Data category key
   * @param {number} monthIndex - Month index (0-11)
   * @param {Object} financialData - Current financial data
   * @param {number} year - Current year
   */
  const handleCellEdit = useCallback((value, record, dataKey, monthIndex, financialData, year) => {
    // Clone the current data
    const newData = JSON.parse(JSON.stringify(financialData));
    
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
    const updatedData = calculateTotals(newData);
    
    // Save the updated data
    setSaving(true);
    saveFinancialData(updatedData, year)
      .finally(() => {
        setSaving(false);
        setEditingCell(null);
        setEditingValue(null);
      });
  }, [saveFinancialData]);

  return {
    editingCell,
    editingValue,
    saving,
    startEdit,
    cancelEdit,
    handleCellEdit,
    setEditingValue
  };
};

export default useSpreadsheetEditing; 