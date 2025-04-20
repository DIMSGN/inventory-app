/**
 * Common calculation utilities for financial spreadsheets
 */

/**
 * Sum an array of values, handling null/undefined values
 * @param {Array<number>} values - Array of values to sum
 * @returns {number} The sum of all values
 */
export const sumValues = (values) => {
  if (!Array.isArray(values)) return 0;
  return values.reduce((sum, val) => sum + (val || 0), 0);
};

/**
 * Calculate percentage of one value relative to another
 * @param {number} value - The value to calculate percentage of
 * @param {number} total - The total value
 * @returns {number} The percentage (0-100)
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return (value / total) * 100;
};

/**
 * Calculate the average of an array of values
 * @param {Array<number>} values - Array of values
 * @returns {number} The average value
 */
export const calculateAverage = (values) => {
  if (!Array.isArray(values) || values.length === 0) return 0;
  const sum = sumValues(values);
  return sum / values.length;
};

/**
 * Calculate the total for each row
 * @param {Array<Object>} data - Array of data objects with months array
 * @returns {Array<Object>} Data with totals added
 */
export const calculateRowTotals = (data) => {
  if (!Array.isArray(data)) return [];
  
  return data.map(row => ({
    ...row,
    total: Array.isArray(row.months) 
      ? sumValues(row.months)
      : 0
  }));
};

/**
 * Calculate column totals for data with months arrays
 * @param {Array<Object>} data - Array of data objects with months array
 * @param {number} numMonths - Number of months (default: 12)
 * @returns {Array<number>} Array of column totals
 */
export const calculateColumnTotals = (data, numMonths = 12) => {
  if (!Array.isArray(data) || data.length === 0) {
    return Array(numMonths).fill(0);
  }
  
  const totals = Array(numMonths).fill(0);
  
  data.forEach(row => {
    if (Array.isArray(row.months)) {
      row.months.forEach((val, idx) => {
        if (idx < numMonths) {
          totals[idx] += val || 0;
        }
      });
    }
  });
  
  return totals;
}; 