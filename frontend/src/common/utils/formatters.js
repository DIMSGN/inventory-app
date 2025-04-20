/**
 * Common formatting utility functions
 */

/**
 * Format a number as currency (USD)
 * @param {number} amount - The amount to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, decimals = 2) => {
  if (amount === null || amount === undefined) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount);
};

/**
 * Format a number with commas as thousands separators
 * @param {number} num - The number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Format a date to YYYY-MM-DD
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Format a date to a localized format like "Jan 1, 2023"
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDateLong = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format a percentage value
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined) return '0%';
  
  return `${value.toFixed(decimals)}%`;
};

export default {
  formatCurrency,
  formatNumber,
  formatDate,
  formatDateLong,
  formatPercentage
}; 