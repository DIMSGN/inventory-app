/**
 * Utility functions for formatting values in Invoice components
 */

/**
 * Format a date as a localized string
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Format a number as currency (USD)
 * @param {number} value - Value to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return '-';
  return `$${parseFloat(value).toFixed(2)}`;
};

/**
 * Calculate the total price for an invoice item
 * @param {Object} item - Invoice item with quantity and unit_price
 * @returns {number} Total price
 */
export const calculateItemTotal = (item) => {
  if (!item) return 0;
  return item.quantity * item.unit_price;
}; 