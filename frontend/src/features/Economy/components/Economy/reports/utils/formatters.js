/**
 * Utility functions for formatting values in financial reports
 */

/**
 * Format a number as currency (USD)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Format a decimal as percentage
 * @param {number} value - Value to format (e.g., 0.25 for 25%)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value) => {
  return `${(value * 100).toFixed(2)}%`;
}; 