/**
 * Formatting utilities for financial data display
 */

/**
 * Format a number as currency (EUR)
 * @param {number} value - Number to format
 * @param {boolean} withSymbol - Whether to include the € symbol
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, withSymbol = true) => {
  if (value === undefined || value === null) return '';
  
  const options = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  
  if (withSymbol) {
    options.style = 'currency';
    options.currency = 'EUR';
  }
  
  return new Intl.NumberFormat('el-GR', options).format(value);
};

/**
 * Format a number as percentage
 * @param {number} value - Number to format (should already be in percentage, e.g. 25 for 25%)
 * @param {boolean} withSymbol - Whether to include the % symbol
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, withSymbol = true) => {
  if (value === undefined || value === null) return '';
  
  const formatted = new Intl.NumberFormat('el-GR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  
  return withSymbol ? `${formatted}%` : formatted;
};

/**
 * Determine cell style based on value type and sign
 * @param {number|string} value - Cell value
 * @param {Object} options - Options for styling
 * @param {boolean} options.isProfit - Whether the value represents profit
 * @param {boolean} options.isPercentage - Whether the value is a percentage
 * @returns {Object} CSS styles object
 */
export const getCellStyle = (value, { isProfit = false, isPercentage = false } = {}) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (numValue === undefined || numValue === null || isNaN(numValue)) {
    return {};
  }
  
  const style = {};
  
  // Apply color based on sign (positive/negative)
  if (isProfit || isPercentage) {
    if (numValue > 0) {
      style.color = '#52c41a'; // Green for positive values
    } else if (numValue < 0) {
      style.color = '#f5222d'; // Red for negative values
    }
  }
  
  // Add text alignment
  style.textAlign = 'right';
  
  return style;
};

/**
 * Format a value for display in the spreadsheet
 * @param {number|string} value - Value to format
 * @param {Object} options - Formatting options
 * @param {boolean} options.isPercentage - Whether the value is a percentage
 * @param {boolean} options.withSymbol - Whether to include the currency/percentage symbol
 * @returns {string} Formatted value
 */
export const formatValue = (value, { isPercentage = false, withSymbol = true } = {}) => {
  if (value === undefined || value === null) return '';
  
  if (isPercentage) {
    return formatPercentage(value, withSymbol);
  } else {
    return formatCurrency(value, withSymbol);
  }
}; 