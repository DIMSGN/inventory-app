import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useEconomy } from './EconomyContext';

/**
 * Context for financial spreadsheet state management
 * 
 * This context provides specialized state management for financial spreadsheets,
 * including cell editing state, display formatting, and selection state.
 */
const SpreadsheetContext = createContext();

/**
 * Provider for the SpreadsheetContext
 * 
 * @param {Object} props - Props
 * @param {React.ReactNode} props.children - Child components
 */
export const SpreadsheetProvider = ({ children }) => {
  const { financialData, saveFinancialData } = useEconomy();
  
  // Editing state
  const [editingCell, setEditingCell] = useState(null);
  const [editingValue, setEditingValue] = useState(null);
  
  // Selection state
  const [selectedCells, setSelectedCells] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  
  // Display options
  const [displayOptions, setDisplayOptions] = useState({
    showTotals: true,
    showPercentages: true,
    highlightNegative: true,
    currencyFormat: 'EUR'
  });
  
  /**
   * Start editing a cell
   * @param {string} recordId - Record ID
   * @param {number} columnIndex - Column index
   * @param {any} value - Current value
   */
  const startCellEdit = useCallback((recordId, columnIndex, value) => {
    setEditingCell({ recordId, columnIndex });
    setEditingValue(value);
  }, []);
  
  /**
   * Cancel cell editing
   */
  const cancelCellEdit = useCallback(() => {
    setEditingCell(null);
    setEditingValue(null);
  }, []);
  
  /**
   * Save edited cell value
   * @param {any} value - New value
   * @param {Object} record - Data record
   * @param {string} dataKey - Data category
   * @param {number} monthIndex - Month index
   */
  const saveCellEdit = useCallback((value, record, dataKey, monthIndex) => {
    if (!financialData) return;
    
    // Clone the current data
    const newData = { ...financialData };
    
    // Update specific cell value based on data category
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
    
    // Save the updated data
    saveFinancialData(newData);
    
    // Clear editing state
    setEditingCell(null);
    setEditingValue(null);
  }, [financialData, saveFinancialData]);
  
  /**
   * Check if a cell is being edited
   * @param {string} recordId - Record ID
   * @param {number} columnIndex - Column index
   * @returns {boolean} Is editing
   */
  const isCellEditing = useCallback((recordId, columnIndex) => {
    return Boolean(
      editingCell && 
      editingCell.recordId === recordId && 
      editingCell.columnIndex === columnIndex
    );
  }, [editingCell]);
  
  /**
   * Toggle cell selection
   * @param {string} recordId - Record ID
   * @param {number} columnIndex - Column index
   */
  const toggleCellSelection = useCallback((recordId, columnIndex) => {
    setSelectedCells(prevSelected => {
      const cellKey = `${recordId}-${columnIndex}`;
      const isSelected = prevSelected.some(
        cell => cell.recordId === recordId && cell.columnIndex === columnIndex
      );
      
      if (isSelected) {
        return prevSelected.filter(
          cell => !(cell.recordId === recordId && cell.columnIndex === columnIndex)
        );
      } else {
        return [...prevSelected, { recordId, columnIndex }];
      }
    });
  }, []);
  
  /**
   * Clear all selected cells
   */
  const clearSelection = useCallback(() => {
    setSelectedCells([]);
  }, []);
  
  /**
   * Toggle selection mode
   */
  const toggleSelectionMode = useCallback(() => {
    setSelectionMode(prev => !prev);
    if (selectionMode) {
      clearSelection();
    }
  }, [selectionMode, clearSelection]);
  
  /**
   * Update display options
   * @param {Object} options - New options
   */
  const updateDisplayOptions = useCallback((options) => {
    setDisplayOptions(prev => ({
      ...prev,
      ...options
    }));
  }, []);
  
  // Create context value
  const contextValue = useMemo(() => ({
    // Editing state
    editingCell,
    editingValue,
    setEditingValue,
    startCellEdit,
    cancelCellEdit,
    saveCellEdit,
    isCellEditing,
    
    // Selection state
    selectedCells,
    selectionMode,
    toggleCellSelection,
    toggleSelectionMode,
    clearSelection,
    
    // Display options
    displayOptions,
    updateDisplayOptions
  }), [
    editingCell,
    editingValue,
    setEditingValue,
    startCellEdit,
    cancelCellEdit,
    saveCellEdit,
    isCellEditing,
    selectedCells,
    selectionMode,
    toggleCellSelection,
    toggleSelectionMode,
    clearSelection,
    displayOptions,
    updateDisplayOptions
  ]);
  
  return (
    <SpreadsheetContext.Provider value={contextValue}>
      {children}
    </SpreadsheetContext.Provider>
  );
};

SpreadsheetProvider.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * Hook to use the SpreadsheetContext
 * @returns {Object} Spreadsheet context value
 */
export const useSpreadsheet = () => {
  const context = useContext(SpreadsheetContext);
  if (!context) {
    throw new Error('useSpreadsheet must be used within a SpreadsheetProvider');
  }
  return context;
};

export default SpreadsheetContext; 