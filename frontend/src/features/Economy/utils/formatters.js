/**
 * Utility functions for formatting data in the Economy feature
 */

/**
 * Format a number as currency (Euros)
 * 
 * @param {number} value - The value to format
 * @param {boolean} showSymbol - Whether to show the € symbol
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, showSymbol = true) => {
  if (value === undefined || value === null) return '0,00';
  
  const formatter = new Intl.NumberFormat('el-GR', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return formatter.format(value);
};

/**
 * Format a percentage value
 * 
 * @param {number} value - The percentage value (e.g., 25 for 25%)
 * @param {boolean} includeSymbol - Whether to include the % symbol
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, includeSymbol = true) => {
  if (value === undefined || value === null) return '0';
  
  const formatter = new Intl.NumberFormat('el-GR', {
    style: 'decimal',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });
  
  return `${formatter.format(value)}${includeSymbol ? '%' : ''}`;
};

/**
 * Get the Greek month name
 * 
 * @param {number} month - Month number (0-11)
 * @param {boolean} uppercase - Whether to return the name in uppercase
 * @returns {string} Greek month name
 */
export const getGreekMonthName = (month, uppercase = true) => {
  const months = [
    'Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος',
    'Μάιος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος',
    'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'
  ];
  
  const name = months[month];
  return uppercase ? name.toUpperCase() : name;
};

/**
 * Format a date in Greek format
 * 
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const formatter = new Intl.DateTimeFormat('el-GR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  return formatter.format(new Date(date));
};

// Export all formatters
export default {
  formatCurrency,
  formatPercentage,
  getGreekMonthName,
  formatDate
}; 