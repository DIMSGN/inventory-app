/**
 * Format a currency value according to the specified locale
 * 
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @param {string} locale - Locale identifier (default: 'en-US')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Format a date string to a localized date format
 * 
 * @param {string} dateString - ISO date string
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  };
  
  return new Date(dateString).toLocaleDateString(
    undefined, 
    { ...defaultOptions, ...options }
  );
};

/**
 * Calculate total amount from an array of expense objects
 * 
 * @param {Array} expenses - Array of expense objects
 * @param {string} key - Object property to use for calculation (default: 'amount')
 * @returns {number} Total amount
 */
export const calculateTotal = (expenses, key = 'amount') => {
  if (!Array.isArray(expenses)) return 0;
  return expenses.reduce((total, expense) => total + Number(expense[key] || 0), 0);
};

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 * 
 * @returns {string} Today's date in YYYY-MM-DD format
 */
export const getTodayISOString = () => {
  return new Date().toISOString().split('T')[0];
}; 