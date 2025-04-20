/**
 * Utility functions for transforming financial data
 */

/**
 * Groups sales data by categories
 * @param {Array} salesData - Array of sales records
 * @returns {Object} - Data grouped by category with totals
 */
export const groupSalesByCategory = (salesData) => {
  if (!salesData || !salesData.length) return {};

  return salesData.reduce((acc, sale) => {
    const categoryName = sale.category?.name || 'Uncategorized';
    
    if (!acc[categoryName]) {
      acc[categoryName] = {
        total: 0,
        count: 0,
        items: []
      };
    }
    
    acc[categoryName].total += Number(sale.amount || 0);
    acc[categoryName].count += 1;
    acc[categoryName].items.push(sale);
    
    return acc;
  }, {});
};

/**
 * Groups expenses data by categories
 * @param {Array} expensesData - Array of expense records
 * @returns {Object} - Data grouped by category with totals
 */
export const groupExpensesByCategory = (expensesData) => {
  if (!expensesData || !expensesData.length) return {};

  return expensesData.reduce((acc, expense) => {
    const categoryName = expense.category?.name || 'Uncategorized';
    
    if (!acc[categoryName]) {
      acc[categoryName] = {
        total: 0,
        count: 0,
        items: []
      };
    }
    
    acc[categoryName].total += Number(expense.amount || 0);
    acc[categoryName].count += 1;
    acc[categoryName].items.push(expense);
    
    return acc;
  }, {});
};

/**
 * Groups financial data by date
 * @param {Array} data - Array of financial records with date field
 * @param {string} dateField - Name of the date field
 * @returns {Object} - Data grouped by date (YYYY-MM-DD)
 */
export const groupByDate = (data, dateField = 'date') => {
  if (!data || !data.length) return {};

  return data.reduce((acc, item) => {
    if (!item[dateField]) return acc;
    
    const date = new Date(item[dateField]);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    
    acc[dateKey].push(item);
    
    return acc;
  }, {});
};

/**
 * Creates a time series array from financial data
 * @param {Array} data - Array of financial records
 * @param {string} dateField - Name of the date field
 * @param {string} valueField - Name of the value field
 * @param {Date} startDate - Start date for the series
 * @param {Date} endDate - End date for the series
 * @returns {Array} - Array of [date, value] pairs for time series
 */
export const createTimeSeries = (data, dateField, valueField, startDate, endDate) => {
  if (!data || !data.length) return [];

  // Group data by date
  const groupedByDate = data.reduce((acc, item) => {
    if (!item[dateField]) return acc;
    
    const date = new Date(item[dateField]);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    if (!acc[dateKey]) {
      acc[dateKey] = 0;
    }
    
    acc[dateKey] += Number(item[valueField] || 0);
    
    return acc;
  }, {});

  // Create array for each day in the date range
  const result = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dateKey = currentDate.toISOString().split('T')[0];
    result.push([
      new Date(currentDate), // Date object
      groupedByDate[dateKey] || 0 // Value for this date or 0
    ]);
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return result;
};

/**
 * Merges sales and expenses data by date for comparison
 * @param {Array} salesData - Array of sales records
 * @param {Array} expensesData - Array of expense records
 * @param {string} salesDateField - Name of the date field in sales
 * @param {string} expensesDateField - Name of the date field in expenses
 * @param {Date} startDate - Start date for the comparison
 * @param {Date} endDate - End date for the comparison
 * @returns {Array} - Array of objects with date, sales, and expenses
 */
export const mergeSalesAndExpensesByDate = (
  salesData,
  expensesData,
  salesDateField = 'date',
  expensesDateField = 'date',
  startDate,
  endDate
) => {
  if (!startDate || !endDate) {
    // Default to last 30 days if dates not provided
    endDate = new Date();
    startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
  }

  // Group sales by date
  const salesByDate = salesData.reduce((acc, sale) => {
    if (!sale[salesDateField]) return acc;
    
    const date = new Date(sale[salesDateField]);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!acc[dateKey]) {
      acc[dateKey] = 0;
    }
    
    acc[dateKey] += Number(sale.amount || 0);
    
    return acc;
  }, {});

  // Group expenses by date
  const expensesByDate = expensesData.reduce((acc, expense) => {
    if (!expense[expensesDateField]) return acc;
    
    const date = new Date(expense[expensesDateField]);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!acc[dateKey]) {
      acc[dateKey] = 0;
    }
    
    acc[dateKey] += Number(expense.amount || 0);
    
    return acc;
  }, {});

  // Create array for each day in the date range
  const result = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dateKey = currentDate.toISOString().split('T')[0];
    
    result.push({
      date: new Date(currentDate),
      dateString: dateKey,
      sales: salesByDate[dateKey] || 0,
      expenses: expensesByDate[dateKey] || 0,
      profit: (salesByDate[dateKey] || 0) - (expensesByDate[dateKey] || 0)
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return result;
};

/**
 * Creates data for financial charts
 * @param {Array} data - Merged financial data (from mergeSalesAndExpensesByDate)
 * @param {string} groupBy - Grouping interval ('day', 'week', 'month')
 * @returns {Object} - Formatted data for charts
 */
export const createChartData = (data, groupBy = 'day') => {
  if (!data || !data.length) return { labels: [], datasets: [] };

  const groupedData = {};
  
  // Group data by the specified interval
  data.forEach(item => {
    const date = new Date(item.date);
    let key;
    
    switch(groupBy) {
      case 'week':
        const weekNum = Math.ceil((((date - new Date(date.getFullYear(), 0, 1)) / 86400000) + 1) / 7);
        key = `Week ${weekNum}`;
        break;
      case 'month':
        key = date.toLocaleString('default', { month: 'short' });
        break;
      case 'day':
      default:
        key = item.dateString;
    }
    
    if (!groupedData[key]) {
      groupedData[key] = {
        sales: 0,
        expenses: 0,
        profit: 0
      };
    }
    
    groupedData[key].sales += item.sales;
    groupedData[key].expenses += item.expenses;
    groupedData[key].profit += item.profit;
  });
  
  // Format data for charts
  const labels = Object.keys(groupedData);
  const salesData = labels.map(label => groupedData[label].sales);
  const expensesData = labels.map(label => groupedData[label].expenses);
  const profitData = labels.map(label => groupedData[label].profit);
  
  return {
    labels,
    datasets: [
      {
        label: 'Sales',
        data: salesData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
      {
        label: 'Expenses',
        data: expensesData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Profit',
        data: profitData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      }
    ]
  };
};

/**
 * Extracts top performing products or categories from sales data
 * @param {Array} salesData - Array of sales records
 * @param {string} groupByField - Field to group by (e.g., 'product', 'category')
 * @param {number} limit - Number of top items to return
 * @returns {Array} - Array of top performing items with name and total
 */
export const extractTopPerformers = (salesData, groupByField = 'product', limit = 5) => {
  if (!salesData || !salesData.length) return [];

  // Group sales by the specified field
  const grouped = salesData.reduce((acc, sale) => {
    const key = sale[groupByField]?.name || sale[groupByField] || 'Uncategorized';
    
    if (!acc[key]) {
      acc[key] = {
        name: key,
        total: 0,
        count: 0
      };
    }
    
    acc[key].total += Number(sale.amount || 0);
    acc[key].count += 1;
    
    return acc;
  }, {});
  
  // Convert to array and sort by total
  return Object.values(grouped)
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}; 