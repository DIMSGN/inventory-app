/**
 * Common formatting utilities for financial spreadsheets
 */

/**
 * Format a number as currency (EUR)
 * @param {number} value - Value to format
 * @param {string} currency - Currency code (default: EUR)
 * @param {string} locale - Locale for formatting (default: el-GR)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'EUR', locale = 'el-GR') => {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format a number as percentage
 * @param {number} value - Value to format (0-100)
 * @param {string} locale - Locale for formatting (default: el-GR)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, locale = 'el-GR') => {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};

/**
 * Format a date for display
 * @param {Date|string} date - Date to format
 * @param {string} format - Format string (default: DD/MM/YYYY)
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'long') {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return dateObj.toLocaleDateString(undefined, options);
  }
  
  // Basic formatting for day/month/year
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Format a number with thousand separators
 * @param {number} value - Value to format
 * @param {string} locale - Locale for formatting (default: el-GR)
 * @returns {string} Formatted number string
 */
export const formatNumber = (value, locale = 'el-GR') => {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat(locale).format(value);
}; 