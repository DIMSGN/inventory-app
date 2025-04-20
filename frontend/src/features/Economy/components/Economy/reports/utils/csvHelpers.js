/**
 * Utility functions for handling CSV exports in financial reports
 */

/**
 * Prepare data for CSV export
 * @param {Array} data - Financial data rows
 * @param {boolean} isMonthly - Whether the data is monthly (true) or daily (false)
 * @returns {Array} Formatted data for CSV export
 */
export const prepareCsvData = (data, isMonthly) => {
  return data.map(row => ({
    Date: isMonthly ? `${row.year}-${String(row.month).padStart(2, '0')}` : row.date,
    "Total Revenue": row.total_revenue,
    "Product Cost": row.product_cost,
    "Gross Profit": row.gross_profit,
    "Gross Margin %": (row.gross_profit / row.total_revenue).toFixed(4),
    "Operating Expenses": row.operating_expenses,
    "Payroll Expenses": row.payroll_expenses,
    "Total Expenses": row.operating_expenses + row.payroll_expenses,
    "Net Profit": row.net_profit,
    "Net Margin %": (row.net_profit / row.total_revenue).toFixed(4)
  }));
}; 