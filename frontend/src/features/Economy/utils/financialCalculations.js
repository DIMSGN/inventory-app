/**
 * Utility functions for financial calculations and data processing
 */

/**
 * Calculates total revenue for a given month or year
 * @param {Object} financialData - The financial data object
 * @param {number} [month] - Optional month number (1-12). If not provided, calculates for the whole year
 * @returns {number} The total revenue amount
 */
export const calculateTotalRevenue = (financialData, month = null) => {
  try {
    let total = 0;
    const salesCategory = financialData.categories.sales;
    
    Object.keys(salesCategory.subcategories).forEach(subcatKey => {
      const subcategory = salesCategory.subcategories[subcatKey];
      if (month) {
        total += subcategory.values[month] || 0;
      } else {
        // Sum all months
        Object.values(subcategory.values).forEach(value => {
          total += value || 0;
        });
      }
    });
    
    return total;
  } catch (error) {
    console.error('Error calculating total revenue:', error);
    return 0;
  }
};

/**
 * Calculates total cost of goods for a given month or year
 * @param {Object} financialData - The financial data object
 * @param {number} [month] - Optional month number (1-12). If not provided, calculates for the whole year
 * @returns {number} The total cost of goods amount
 */
export const calculateTotalCostOfGoods = (financialData, month = null) => {
  try {
    let total = 0;
    const costsCategory = financialData.categories.costs;
    
    Object.keys(costsCategory.subcategories).forEach(subcatKey => {
      const subcategory = costsCategory.subcategories[subcatKey];
      if (month) {
        total += subcategory.values[month] || 0;
      } else {
        // Sum all months
        Object.values(subcategory.values).forEach(value => {
          total += value || 0;
        });
      }
    });
    
    return total;
  } catch (error) {
    console.error('Error calculating total cost of goods:', error);
    return 0;
  }
};

/**
 * Calculates total labor costs for a given month or year
 * @param {Object} financialData - The financial data object
 * @param {number} [month] - Optional month number (1-12). If not provided, calculates for the whole year
 * @returns {number} The total labor costs amount
 */
export const calculateTotalLaborCosts = (financialData, month = null) => {
  try {
    let total = 0;
    const laborCategory = financialData.categories.labor;
    
    Object.keys(laborCategory.subcategories).forEach(subcatKey => {
      const subcategory = laborCategory.subcategories[subcatKey];
      if (month) {
        total += subcategory.values[month] || 0;
      } else {
        // Sum all months
        Object.values(subcategory.values).forEach(value => {
          total += value || 0;
        });
      }
    });
    
    return total;
  } catch (error) {
    console.error('Error calculating total labor costs:', error);
    return 0;
  }
};

/**
 * Calculates total operating expenses for a given month or year
 * @param {Object} financialData - The financial data object
 * @param {number} [month] - Optional month number (1-12). If not provided, calculates for the whole year
 * @returns {number} The total operating expenses amount
 */
export const calculateTotalOperatingExpenses = (financialData, month = null) => {
  try {
    let total = 0;
    const operatingCategory = financialData.categories.operating;
    
    Object.keys(operatingCategory.subcategories).forEach(subcatKey => {
      const subcategory = operatingCategory.subcategories[subcatKey];
      if (month) {
        total += subcategory.values[month] || 0;
      } else {
        // Sum all months
        Object.values(subcategory.values).forEach(value => {
          total += value || 0;
        });
      }
    });
    
    return total;
  } catch (error) {
    console.error('Error calculating total operating expenses:', error);
    return 0;
  }
};

/**
 * Calculates total expenses for a given month or year
 * @param {Object} financialData - The financial data object
 * @param {number} [month] - Optional month number (1-12). If not provided, calculates for the whole year
 * @returns {number} The total expenses amount
 */
export const calculateTotalExpenses = (financialData, month = null) => {
  const costOfGoods = calculateTotalCostOfGoods(financialData, month);
  const laborCosts = calculateTotalLaborCosts(financialData, month);
  const operatingExpenses = calculateTotalOperatingExpenses(financialData, month);
  
  return costOfGoods + laborCosts + operatingExpenses;
};

/**
 * Calculates gross profit for a given month or year
 * @param {Object} financialData - The financial data object
 * @param {number} [month] - Optional month number (1-12). If not provided, calculates for the whole year
 * @returns {number} The gross profit amount
 */
export const calculateGrossProfit = (financialData, month = null) => {
  const revenue = calculateTotalRevenue(financialData, month);
  const costOfGoods = calculateTotalCostOfGoods(financialData, month);
  
  return revenue - costOfGoods;
};

/**
 * Calculates net profit for a given month or year
 * @param {Object} financialData - The financial data object
 * @param {number} [month] - Optional month number (1-12). If not provided, calculates for the whole year
 * @returns {number} The net profit amount
 */
export const calculateNetProfit = (financialData, month = null) => {
  const revenue = calculateTotalRevenue(financialData, month);
  const expenses = calculateTotalExpenses(financialData, month);
  
  return revenue - expenses;
};

/**
 * Calculates gross profit margin as a percentage for a given month or year
 * @param {Object} financialData - The financial data object
 * @param {number} [month] - Optional month number (1-12). If not provided, calculates for the whole year
 * @returns {number} The gross profit margin as a percentage (0-100)
 */
export const calculateGrossProfitMargin = (financialData, month = null) => {
  const revenue = calculateTotalRevenue(financialData, month);
  const grossProfit = calculateGrossProfit(financialData, month);
  
  if (revenue === 0) return 0;
  return (grossProfit / revenue) * 100;
};

/**
 * Calculates net profit margin as a percentage for a given month or year
 * @param {Object} financialData - The financial data object
 * @param {number} [month] - Optional month number (1-12). If not provided, calculates for the whole year
 * @returns {number} The net profit margin as a percentage (0-100)
 */
export const calculateNetProfitMargin = (financialData, month = null) => {
  const revenue = calculateTotalRevenue(financialData, month);
  const netProfit = calculateNetProfit(financialData, month);
  
  if (revenue === 0) return 0;
  return (netProfit / revenue) * 100;
};

/**
 * Generates a summary of financial data with totals and metrics for each month and year
 * @param {Object} financialData - The financial data object
 * @returns {Object} A summary object with financial metrics
 */
export const generateFinancialSummary = (financialData) => {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const summary = {
    totalSales: { months: {}, total: 0 },
    totalCostOfGoods: { months: {}, total: 0 },
    totalLaborCosts: { months: {}, total: 0 },
    totalOperatingExpenses: { months: {}, total: 0 },
    totalExpenses: { months: {}, total: 0 },
    grossProfit: { months: {}, total: 0 },
    netProfit: { months: {}, total: 0 },
    grossProfitMargin: { months: {}, total: 0 },
    netProfitMargin: { months: {}, total: 0 }
  };
  
  // Calculate monthly totals
  months.forEach(month => {
    summary.totalSales.months[month] = calculateTotalRevenue(financialData, month);
    summary.totalCostOfGoods.months[month] = calculateTotalCostOfGoods(financialData, month);
    summary.totalLaborCosts.months[month] = calculateTotalLaborCosts(financialData, month);
    summary.totalOperatingExpenses.months[month] = calculateTotalOperatingExpenses(financialData, month);
    summary.totalExpenses.months[month] = calculateTotalExpenses(financialData, month);
    summary.grossProfit.months[month] = calculateGrossProfit(financialData, month);
    summary.netProfit.months[month] = calculateNetProfit(financialData, month);
    summary.grossProfitMargin.months[month] = calculateGrossProfitMargin(financialData, month);
    summary.netProfitMargin.months[month] = calculateNetProfitMargin(financialData, month);
  });
  
  // Calculate yearly totals
  summary.totalSales.total = calculateTotalRevenue(financialData);
  summary.totalCostOfGoods.total = calculateTotalCostOfGoods(financialData);
  summary.totalLaborCosts.total = calculateTotalLaborCosts(financialData);
  summary.totalOperatingExpenses.total = calculateTotalOperatingExpenses(financialData);
  summary.totalExpenses.total = calculateTotalExpenses(financialData);
  summary.grossProfit.total = calculateGrossProfit(financialData);
  summary.netProfit.total = calculateNetProfit(financialData);
  summary.grossProfitMargin.total = calculateGrossProfitMargin(financialData);
  summary.netProfitMargin.total = calculateNetProfitMargin(financialData);
  
  return summary;
};

/**
 * Formats currency values for display
 * @param {number} value - The currency value to format
 * @param {string} [locale='el-GR'] - The locale to use for formatting
 * @param {string} [currency='EUR'] - The currency code
 * @returns {string} The formatted currency string
 */
export const formatCurrency = (value, locale = 'el-GR', currency = 'EUR') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Formats percentages for display
 * @param {number} value - The percentage value to format
 * @param {string} [locale='el-GR'] - The locale to use for formatting
 * @returns {string} The formatted percentage string
 */
export const formatPercentage = (value, locale = 'el-GR') => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};

/**
 * Calculates monthly comparison data between two years
 * @param {Object} currentYearData - The financial data for the current year
 * @param {Object} previousYearData - The financial data for the previous year
 * @param {number} month - The month to compare (1-12)
 * @returns {Object} An object with comparison metrics
 */
export const calculateMonthlyComparison = (currentYearData, previousYearData, month) => {
  const currentRevenue = calculateTotalRevenue(currentYearData, month);
  const previousRevenue = calculateTotalRevenue(previousYearData, month);
  
  const currentExpenses = calculateTotalExpenses(currentYearData, month);
  const previousExpenses = calculateTotalExpenses(previousYearData, month);
  
  const currentProfit = calculateNetProfit(currentYearData, month);
  const previousProfit = calculateNetProfit(previousYearData, month);
  
  const revenueDifference = currentRevenue - previousRevenue;
  const expensesDifference = currentExpenses - previousExpenses;
  const profitDifference = currentProfit - previousProfit;
  
  const revenuePercentChange = previousRevenue === 0 ? 100 : (revenueDifference / previousRevenue) * 100;
  const expensesPercentChange = previousExpenses === 0 ? 100 : (expensesDifference / previousExpenses) * 100;
  const profitPercentChange = previousProfit === 0 ? 100 : (profitDifference / previousProfit) * 100;
  
  return {
    revenue: {
      current: currentRevenue,
      previous: previousRevenue,
      difference: revenueDifference,
      percentChange: revenuePercentChange
    },
    expenses: {
      current: currentExpenses,
      previous: previousExpenses,
      difference: expensesDifference,
      percentChange: expensesPercentChange
    },
    profit: {
      current: currentProfit,
      previous: previousProfit,
      difference: profitDifference,
      percentChange: profitPercentChange
    }
  };
};

/**
 * Converts daily logs to monthly data format
 * @param {Array} dailyLogs - Array of daily log entries
 * @param {number} year - The year to filter logs for
 * @returns {Object} Financial data object in the standard format
 */
export const convertDailyLogsToMonthlyData = (dailyLogs, year) => {
  // Filter logs for the specific year
  const yearLogs = dailyLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate.getFullYear() === year;
  });
  
  // Create a template for the year
  const result = {
    year,
    categories: {
      sales: {
        name: 'ΠΩΛΗΣΕΙΣ',
        subcategories: {
          food: { name: 'FOOD', values: {} },
          wine: { name: 'WINE', values: {} },
          drinks: { name: 'ΠΟΤΑ', values: {} },
          beer: { name: 'ΜΠΥΡΕΣ', values: {} },
          cafe: { name: 'CAFE', values: {} }
        }
      }
    },
    updatedAt: new Date().toISOString()
  };
  
  // Initialize all months to 0
  for (let month = 1; month <= 12; month++) {
    Object.keys(result.categories.sales.subcategories).forEach(subcatKey => {
      result.categories.sales.subcategories[subcatKey].values[month] = 0;
    });
  }
  
  // Aggregate daily logs by month
  yearLogs.forEach(log => {
    const logDate = new Date(log.date);
    const month = logDate.getMonth() + 1; // JavaScript months are 0-indexed
    
    // Add sales data from each log
    if (log.sales) {
      Object.keys(log.sales).forEach(salesKey => {
        if (result.categories.sales.subcategories[salesKey]) {
          result.categories.sales.subcategories[salesKey].values[month] += log.sales[salesKey] || 0;
        }
      });
    }
  });
  
  return result;
};

/**
 * Utility function to calculate net profit from total sales and expenses directly
 * @param {number} totalSales - Total sales amount
 * @param {number} totalExpenses - Total expenses amount 
 * @returns {number} - Net profit
 */
export const calculateSimpleNetProfit = (totalSales, totalExpenses) => {
  return totalSales - totalExpenses;
};

/**
 * Simple formatting of currency with just a symbol
 * @param {number} value - The value to format
 * @param {string} currencySymbol - The currency symbol to use
 * @returns {string} Formatted currency string
 */
export const formatSimpleCurrency = (value, currencySymbol = '$') => {
  if (value === null || value === undefined) return '-';
  return `${currencySymbol}${parseFloat(value).toFixed(2)}`;
};

/**
 * Calculate profit margin as a percentage
 * @param {number} totalSales - Total sales amount
 * @param {number} totalExpenses - Total expenses amount
 * @returns {number} - Profit margin percentage
 */
export const calculateProfitMargin = (totalSales, totalExpenses) => {
  if (!totalSales) return 0;
  return ((totalSales - totalExpenses) / totalSales) * 100;
};

/**
 * Calculate monthly growth percentage
 * @param {number} currentValue - Current month value
 * @param {number} previousValue - Previous month value
 * @returns {number} - Growth percentage
 */
export const calculateMonthlyGrowth = (currentValue, previousValue) => {
  if (!previousValue) return currentValue ? 100 : 0;
  return ((currentValue - previousValue) / previousValue) * 100;
};

/**
 * Calculate monthly projected revenue based on current data
 * @param {number} currentRevenue - Current revenue
 * @param {number} daysInMonth - Total days in month
 * @param {number} currentDay - Current day of month
 * @returns {number} - Projected revenue for the whole month
 */
export const calculateMonthlyProjection = (currentRevenue, daysInMonth, currentDay) => {
  if (!currentDay || currentDay > daysInMonth) return currentRevenue;
  return (currentRevenue / currentDay) * daysInMonth;
};

/**
 * Calculate compound annual growth rate (CAGR)
 * @param {number} beginningValue - Beginning value
 * @param {number} endingValue - Ending value
 * @param {number} numberOfYears - Number of years
 * @returns {number} - CAGR as a percentage
 */
export const calculateCAGR = (beginningValue, endingValue, numberOfYears) => {
  if (!beginningValue || !endingValue || !numberOfYears) return 0;
  return (Math.pow(endingValue / beginningValue, 1 / numberOfYears) - 1) * 100;
};

/**
 * Calculate tax amount based on revenue and tax rate
 * @param {number} revenue - Revenue amount
 * @param {number} taxRate - Tax rate as a percentage
 * @returns {number} - Tax amount
 */
export const calculateTaxAmount = (revenue, taxRate) => {
  return revenue * (taxRate / 100);
};

/**
 * Calculate break-even point
 * @param {number} fixedCosts - Fixed costs
 * @param {number} salesPrice - Sales price per unit
 * @param {number} variableCostPerUnit - Variable cost per unit
 * @returns {number} - Break-even point in units
 */
export const calculateBreakEven = (fixedCosts, salesPrice, variableCostPerUnit) => {
  const contributionMargin = salesPrice - variableCostPerUnit;
  if (!contributionMargin) return 0;
  return fixedCosts / contributionMargin;
};

/**
 * Calculate return on investment (ROI)
 * @param {number} netProfit - Net profit
 * @param {number} investment - Investment amount
 * @returns {number} - ROI as a percentage
 */
export const calculateROI = (netProfit, investment) => {
  if (!investment) return 0;
  return (netProfit / investment) * 100;
};

/**
 * Group financial data by time period (day, week, month, year)
 * @param {Array} data - Financial data array
 * @param {string} dateField - Field name containing the date
 * @param {string} valueField - Field name containing the value
 * @param {string} period - Time period ('day', 'week', 'month', or 'year')
 * @returns {Object} - Grouped data object
 */
export const groupFinancialDataByPeriod = (data, dateField, valueField, period) => {
  if (!data || !data.length) return {};
  
  const result = {};
  
  data.forEach(item => {
    if (!item[dateField]) return;
    
    const date = new Date(item[dateField]);
    let key;
    
    switch(period) {
      case 'day':
        key = date.toISOString().split('T')[0];
        break;
      case 'week':
        // Get the week number (1-52)
        const weekNum = Math.ceil((((date - new Date(date.getFullYear(), 0, 1)) / 86400000) + 1) / 7);
        key = `${date.getFullYear()}-W${weekNum}`;
        break;
      case 'month':
        key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        break;
      case 'year':
        key = `${date.getFullYear()}`;
        break;
      default:
        key = date.toISOString().split('T')[0];
    }
    
    if (!result[key]) {
      result[key] = 0;
    }
    
    result[key] += Number(item[valueField] || 0);
  });
  
  return result;
}; 