import { useState } from 'react';

/**
 * Custom hook for managing cell editing state
 * @returns {Object} Cell editing state and methods
 */
const useCellEditing = () => {
  // Currently editing cell ID (format: `${recordId}_${monthIndex}`)
  const [editingCell, setEditingCell] = useState(null);
  
  // Current value being edited
  const [editingValue, setEditingValue] = useState(null);
  
  /**
   * Start editing a cell
   * @param {string} cellId - Unique ID for the cell
   * @param {any} initialValue - Initial value of the cell
   */
  const startEdit = (cellId, initialValue) => {
    setEditingCell(cellId);
    setEditingValue(initialValue);
  };
  
  /**
   * Save the current edit
   * @param {Function} callback - Callback function to execute after saving
   * @returns {Object|null} Edited information or null if not editing
   */
  const saveEdit = (callback) => {
    const result = callback ? callback() : null;
    setEditingCell(null);
    setEditingValue(null);
    return result;
  };
  
  /**
   * Cancel the current edit
   */
  const cancelEdit = () => {
    setEditingCell(null);
    setEditingValue(null);
  };
  
  /**
   * Update the editing value
   * @param {any} value - New value
   */
  const updateEditingValue = (value) => {
    setEditingValue(value);
  };
  
  /**
   * Check if a cell is currently being edited
   * @param {string} cellId - Cell ID to check
   * @returns {boolean} True if the cell is being edited
   */
  const isEditing = (cellId) => {
    return editingCell === cellId ? editingValue : false;
  };
  
  return {
    startEdit,
    saveEdit,
    cancelEdit,
    updateEditingValue,
    isEditing,
    editingCell,
    editingValue
  };
};

export default useCellEditing; 