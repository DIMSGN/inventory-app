/**
 * Utility functions for formatting values in the Financial Spreadsheet
 */

/**
 * Format a number as currency (EUR)
 * @param {number} value - Value to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format a number as percentage
 * @param {number} value - Value to format (0-100)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value) => {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('el-GR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
}; 