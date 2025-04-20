/**
 * Utility functions for financial calculations in the spreadsheet
 */

/**
 * Calculate totals and percentages for the financial data
 * @param {Object} data - Financial data object
 * @returns {Object} Updated data with totals calculated
 */
export const calculateTotals = (data) => {
  if (!data || !data.sales) return data;
  
  // Make a deep copy to avoid modifying the original object
  const updatedData = JSON.parse(JSON.stringify(data));
  
  // Calculate row totals for each category
  if (updatedData.sales) {
    updatedData.sales.forEach(row => {
      row.total = row.months.reduce((sum, val) => sum + (val || 0), 0);
    });
  }
  
  if (updatedData.expenses?.costOfGoods) {
    updatedData.expenses.costOfGoods.forEach(row => {
      row.total = row.months.reduce((sum, val) => sum + (val || 0), 0);
    });
  }
  
  if (updatedData.expenses?.operational) {
    updatedData.expenses.operational.forEach(row => {
      row.total = row.months.reduce((sum, val) => sum + (val || 0), 0);
    });
  }
  
  if (updatedData.expenses?.utilities) {
    updatedData.expenses.utilities.forEach(row => {
      row.total = row.months.reduce((sum, val) => sum + (val || 0), 0);
    });
  }
  
  return updatedData;
};

/**
 * Calculate totals for a specific data array across months
 * @param {Array} dataArray - Array of financial data items
 * @returns {Array} Monthly totals
 */
export const calculateMonthlyTotals = (dataArray) => {
  if (!dataArray || !Array.isArray(dataArray)) return Array(12).fill(0);
  
  const monthlyTotals = Array(12).fill(0);
  
  dataArray.forEach(row => {
    row.months.forEach((val, idx) => {
      monthlyTotals[idx] += val || 0;
    });
  });
  
  return monthlyTotals;
};

/**
 * Calculate the annual total from an array of monthly values
 * @param {Array} monthlyValues - Array of monthly values
 * @returns {number} Annual total
 */
export const calculateAnnualTotal = (monthlyValues) => {
  if (!monthlyValues || !Array.isArray(monthlyValues)) return 0;
  return monthlyValues.reduce((sum, val) => sum + (val || 0), 0);
}; 