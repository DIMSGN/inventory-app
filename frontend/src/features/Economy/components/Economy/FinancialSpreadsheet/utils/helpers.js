/**
 * Helper functions for financial spreadsheet
 */

/**
 * Checks if a value is a number
 * @param {*} value - The value to check
 * @returns {boolean} True if the value is a number, false otherwise
 */
export const isNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Formats a number as a currency
 * @param {number} value - The number to format
 * @param {string} currencySymbol - The currency symbol to use
 * @returns {string} The formatted currency string
 */
export const formatSimpleCurrency = (value, currencySymbol = '$') => {
  if (!isNumber(value)) return '';
  return `${currencySymbol}${parseFloat(value).toFixed(2)}`;
};

/**
 * Formats a number as a percentage
 * @param {number} value - The number to format (e.g., 0.25 for 25%)
 * @returns {string} The formatted percentage string
 */
export const formatPercent = (value) => {
  if (!isNumber(value)) return '';
  return `${(parseFloat(value) * 100).toFixed(2)}%`;
};

/**
 * Gets the current date in YYYY-MM-DD format
 * @returns {string} The formatted date string
 */
export const getCurrentDate = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
}; 