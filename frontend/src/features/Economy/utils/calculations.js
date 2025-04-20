/**
 * Utility functions for financial calculations in the Economy feature
 */

/**
 * Calculate the sum of an array of numbers
 * 
 * @param {Array<number>} values - Array of numbers to sum
 * @returns {number} The sum of all values
 */
export const sum = (values) => {
  if (!Array.isArray(values)) return 0;
  return values.reduce((total, value) => total + (Number(value) || 0), 0);
};

/**
 * Calculate percentage of one value relative to another
 * 
 * @param {number} part - The part value
 * @param {number} total - The total value
 * @param {number} fallback - Fallback value if calculation is not possible (division by zero)
 * @returns {number} The percentage value
 */
export const calculatePercentage = (part, total, fallback = 0) => {
  if (!total) return fallback;
  return (part / total) * 100;
};

/**
 * Calculate gross profit
 * 
 * @param {number} revenue - Total revenue
 * @param {number} costOfGoods - Cost of goods sold
 * @returns {number} Gross profit
 */
export const calculateGrossProfit = (revenue, costOfGoods) => {
  return (Number(revenue) || 0) - (Number(costOfGoods) || 0);
};

/**
 * Calculate gross profit margin
 * 
 * @param {number} revenue - Total revenue
 * @param {number} costOfGoods - Cost of goods sold
 * @returns {number} Gross profit margin as a percentage
 */
export const calculateGrossProfitMargin = (revenue, costOfGoods) => {
  if (!revenue) return 0;
  const grossProfit = calculateGrossProfit(revenue, costOfGoods);
  return (grossProfit / revenue) * 100;
};

/**
 * Calculate net profit
 * 
 * @param {number} revenue - Total revenue
 * @param {number} totalExpenses - Total expenses (COGS + operating expenses)
 * @returns {number} Net profit
 */
export const calculateNetProfit = (revenue, totalExpenses) => {
  return (Number(revenue) || 0) - (Number(totalExpenses) || 0);
};

/**
 * Calculate net profit margin
 * 
 * @param {number} revenue - Total revenue
 * @param {number} totalExpenses - Total expenses
 * @returns {number} Net profit margin as a percentage
 */
export const calculateNetProfitMargin = (revenue, totalExpenses) => {
  if (!revenue) return 0;
  const netProfit = calculateNetProfit(revenue, totalExpenses);
  return (netProfit / revenue) * 100;
};

/**
 * Calculate total expenses
 * 
 * @param {number} costOfGoods - Cost of goods sold
 * @param {number} operatingExpenses - Operating expenses
 * @param {number} payrollExpenses - Payroll expenses
 * @param {number} otherExpenses - Other expenses
 * @returns {number} Total expenses
 */
export const calculateTotalExpenses = (costOfGoods, operatingExpenses, payrollExpenses, otherExpenses) => {
  return (
    (Number(costOfGoods) || 0) + 
    (Number(operatingExpenses) || 0) + 
    (Number(payrollExpenses) || 0) + 
    (Number(otherExpenses) || 0)
  );
};

// Export all calculation utilities
export default {
  sum,
  calculatePercentage,
  calculateGrossProfit,
  calculateGrossProfitMargin,
  calculateNetProfit,
  calculateNetProfitMargin,
  calculateTotalExpenses
}; 