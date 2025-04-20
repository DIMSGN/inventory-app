import { useState, useCallback } from 'react';

/**
 * Custom hook for managing cell editing state in spreadsheets
 * @returns {Object} Cell editing state and methods
 */
const useCellEditing = () => {
  const [editingCell, setEditingCell] = useState(null);
  const [editingValue, setEditingValue] = useState(null);
  
  /**
   * Start editing a cell
   * @param {string|number} recordId - ID of the record being edited
   * @param {number|string} columnIndex - Column index or key
   * @param {any} value - Current value of the cell
   */
  const startEdit = useCallback((recordId, columnIndex, value) => {
    setEditingCell({ recordId, columnIndex });
    setEditingValue(value);
  }, []);
  
  /**
   * Save the edited cell value
   * @param {Function} saveHandler - Function to call with editing data
   */
  const saveEdit = useCallback((saveHandler) => {
    if (!editingCell) return;
    
    if (typeof saveHandler === 'function') {
      saveHandler(editingValue, editingCell.recordId, editingCell.columnIndex);
    }
    
    // Reset editing state
    setEditingCell(null);
    setEditingValue(null);
  }, [editingCell, editingValue]);
  
  /**
   * Cancel editing without saving
   */
  const cancelEdit = useCallback(() => {
    setEditingCell(null);
    setEditingValue(null);
  }, []);
  
  /**
   * Update the current editing value
   * @param {any} value - New editing value
   */
  const updateEditingValue = useCallback((value) => {
    setEditingValue(value);
  }, []);
  
  /**
   * Check if a specific cell is currently being edited
   * @param {string|number} recordId - ID of the record
   * @param {number|string} columnIndex - Column index or key
   * @returns {boolean} Whether the cell is being edited
   */
  const isEditing = useCallback((recordId, columnIndex) => {
    return Boolean(
      editingCell && 
      editingCell.recordId === recordId && 
      editingCell.columnIndex === columnIndex
    );
  }, [editingCell]);
  
  return {
    editingCell,
    editingValue,
    startEdit,
    saveEdit,
    cancelEdit,
    updateEditingValue,
    isEditing
  };
};

export default useCellEditing; 