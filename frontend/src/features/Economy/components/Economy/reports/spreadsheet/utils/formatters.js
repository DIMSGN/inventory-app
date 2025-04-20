/**
 * Utility functions for formatting values in the financial spreadsheet
 */

/**
 * Format a number as currency (SEK)
 * 
 * @param {number} value - Value to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return '-';
  
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format a date string as YYYY-MM-DD
 * 
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '-';
  
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Format a month and year as a string
 * 
 * @param {number} year - Year
 * @param {number} month - Month (0-11)
 * @returns {string} Formatted month and year
 */
export const formatMonthYear = (year, month) => {
  const months = [
    'Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
    'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'
  ];
  
  return `${months[month]} ${year}`;
};

/**
 * Format a percentage value
 * 
 * @param {number} value - Value to format
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value) => {
  if (value === null || value === undefined) return '-';
  
  return `${(value * 100).toFixed(1)}%`;
};

/**
 * Format a timestamp in a human-readable format
 * 
 * @param {string|Date} timestamp - Timestamp to format
 * @returns {string} Formatted timestamp
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  
  const d = new Date(timestamp);
  
  return new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

/**
 * Get the Greek name of a month
 * @param {number} month - Month index (0-11)
 * @returns {string} Greek month name
 */
export const getMonthName = (month) => {
  const months = [
    'ΙΑΝΟΥΑΡΙΟΣ', 'ΦΕΒΡΟΥΑΡΙΟΣ', 'ΜΑΡΤΙΟΣ', 'ΑΠΡΙΛΙΟΣ', 'ΜΑΙΟΣ', 'ΙΟΥΝΙΟΣ',
    'ΙΟΥΛΙΟΣ', 'ΑΥΓΟΥΣΤΟΣ', 'ΣΕΠΤΕΜΒΡΙΟΣ', 'ΟΚΤΩΒΡΙΟΣ', 'ΝΟΕΜΒΡΙΟΣ', 'ΔΕΚΕΜΒΡΙΟΣ'
  ];
  return months[month];
};

/**
 * Format a date to a human-readable string with Greek locale
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string with time
 */
export const formatDateTimeGR = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('el-GR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}; 