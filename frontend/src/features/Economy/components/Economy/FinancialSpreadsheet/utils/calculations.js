/**
 * Utility functions for financial calculations
 */

/**
 * Calculate totals and summaries for financial data
 * @param {Object} data - Financial data object
 * @returns {Object} - The same data object with calculated totals
 */
export const calculateTotals = (data) => {
  if (!data) return data;

  // Calculate totals for sales
  if (data.sales) {
    data.sales.forEach(item => {
      item.total = item.months.reduce((sum, val) => sum + (val || 0), 0);
    });
  }

  // Calculate totals for expense categories
  const expenseCategories = ['costOfGoods', 'operational', 'payroll', 'utilities', 'otherExpenses'];
  expenseCategories.forEach(category => {
    if (data.expenses && data.expenses[category]) {
      data.expenses[category].forEach(item => {
        item.total = item.months.reduce((sum, val) => sum + (val || 0), 0);
      });
    }
  });

  // Update summary data
  updateSummary(data);

  return data;
};

/**
 * Update summary calculations for the financial data
 * @param {Object} data - The financial data
 * @returns {Object} - Updated financial data
 */
export const updateSummary = (data) => {
  if (!data || !data.sales || !data.expenses) return data;

  // Initialize summary if not exists
  if (!data.summary) {
    data.summary = {};
  }

  // Calculate total sales for each month and overall
  const totalSales = {
    months: Array(12).fill(0),
    total: 0
  };

  data.sales.forEach(item => {
    item.months.forEach((val, idx) => {
      totalSales.months[idx] += (val || 0);
    });
  });
  totalSales.total = totalSales.months.reduce((sum, val) => sum + (val || 0), 0);
  data.summary.totalSales = totalSales;

  // Calculate expense totals by category
  const expenseCategories = [
    { key: 'costOfGoods', summary: 'totalCostOfGoods' },
    { key: 'operational', summary: 'totalOperational' },
    { key: 'payroll', summary: 'totalPayroll' },
    { key: 'utilities', summary: 'totalUtilities' },
    { key: 'otherExpenses', summary: 'totalOtherExpenses' }
  ];

  expenseCategories.forEach(({ key, summary }) => {
    const categoryTotal = {
      months: Array(12).fill(0),
      total: 0
    };

    if (data.expenses[key]) {
      data.expenses[key].forEach(item => {
        item.months.forEach((val, idx) => {
          categoryTotal.months[idx] += (val || 0);
        });
      });
    }
    
    categoryTotal.total = categoryTotal.months.reduce((sum, val) => sum + (val || 0), 0);
    data.summary[summary] = categoryTotal;
  });

  // Calculate total expenses
  const totalExpenses = {
    months: Array(12).fill(0),
    total: 0
  };

  expenseCategories.forEach(({ summary }) => {
    data.summary[summary].months.forEach((val, idx) => {
      totalExpenses.months[idx] += (val || 0);
    });
  });
  
  totalExpenses.total = totalExpenses.months.reduce((sum, val) => sum + (val || 0), 0);
  data.summary.totalExpenses = totalExpenses;

  // Calculate gross profit (sales - costOfGoods)
  const grossProfit = {
    months: totalSales.months.map((sales, idx) => sales - data.summary.totalCostOfGoods.months[idx]),
    total: 0
  };
  grossProfit.total = grossProfit.months.reduce((sum, val) => sum + (val || 0), 0);
  data.summary.grossProfit = grossProfit;

  // Calculate gross profit margin
  const grossProfitMargin = {
    months: totalSales.months.map((sales, idx) => 
      sales > 0 ? (grossProfit.months[idx] / sales) * 100 : 0
    ),
    total: totalSales.total > 0 ? (grossProfit.total / totalSales.total) * 100 : 0
  };
  data.summary.grossProfitMargin = grossProfitMargin;

  // Calculate net profit (gross profit - all other expenses)
  const netProfit = {
    months: grossProfit.months.map((gp, idx) => 
      gp - data.summary.totalOperational.months[idx] - 
      data.summary.totalPayroll.months[idx] - 
      data.summary.totalUtilities.months[idx] - 
      data.summary.totalOtherExpenses.months[idx]
    ),
    total: 0
  };
  netProfit.total = netProfit.months.reduce((sum, val) => sum + (val || 0), 0);
  data.summary.netProfit = netProfit;

  // Calculate net profit margin
  const netProfitMargin = {
    months: totalSales.months.map((sales, idx) => 
      sales > 0 ? (netProfit.months[idx] / sales) * 100 : 0
    ),
    total: totalSales.total > 0 ? (netProfit.total / totalSales.total) * 100 : 0
  };
  data.summary.netProfitMargin = netProfitMargin;

  return data;
};

/**
 * Process financial data for display in table format
 * @param {Object} financialData - Raw financial data
 * @returns {Object} - Processed data for display
 */
export const processDataForDisplay = (financialData) => {
  if (!financialData || !financialData.sales) {
    return {
      salesData: [],
      cogData: [],
      opexData: [],
      payrollData: [],
      utilitiesData: [],
      otherData: [],
      summaryData: []
    };
  }

  // Ensure all totals are calculated
  calculateTotals(financialData);

  // Map the data to the display format
  return {
    salesData: processSectionData(financialData.sales, 'sales'),
    cogData: processSectionData(financialData.expenses.costOfGoods, 'costOfGoods'),
    opexData: processSectionData(financialData.expenses.operational, 'operational'),
    payrollData: processSectionData(financialData.expenses.payroll, 'payroll'),
    utilitiesData: processSectionData(financialData.expenses.utilities, 'utilities'),
    otherData: processSectionData(financialData.expenses.otherExpenses, 'otherExpenses'),
    summaryData: processSummaryData(financialData.summary)
  };
};

/**
 * Process a section of financial data for display
 * @param {Array} items - Items in the section
 * @param {string} sectionKey - Key identifier for the section
 * @returns {Array} Processed items
 */
const processSectionData = (items, sectionKey) => {
  if (!items || !items.length) return [];

  return items.map(item => ({
    ...item,
    key: item.id,
    dataType: sectionKey
  }));
};

/**
 * Process summary data for display
 * @param {Object} summary - Summary data
 * @returns {Array} Formatted summary rows
 */
const processSummaryData = (summary) => {
  if (!summary) return [];

  const summaryItems = [
    { id: 'totalSales', name: 'ΣΥΝΟΛΟ ΠΩΛΗΣΕΩΝ', dataType: 'summary' },
    { id: 'totalCostOfGoods', name: 'ΣΥΝΟΛΟ ΚΟΣΤΟΥΣ ΠΩΛΗΘΕΝΤΩΝ', dataType: 'summary' },
    { id: 'grossProfit', name: 'ΜΙΚΤΟ ΚΕΡΔΟΣ', dataType: 'summary' },
    { id: 'grossProfitMargin', name: 'ΠΟΣΟΣΤΟ ΜΙΚΤΟΥ ΚΕΡΔΟΥΣ (%)', dataType: 'summary', isPercentage: true },
    { id: 'totalOperational', name: 'ΣΥΝΟΛΟ ΛΕΙΤΟΥΡΓΙΚΩΝ ΕΞΟΔΩΝ', dataType: 'summary' },
    { id: 'totalPayroll', name: 'ΣΥΝΟΛΟ ΜΙΣΘΟΔΟΣΙΑΣ', dataType: 'summary' },
    { id: 'totalUtilities', name: 'ΣΥΝΟΛΟ ΠΑΓΙΩΝ ΕΞΟΔΩΝ', dataType: 'summary' },
    { id: 'totalOtherExpenses', name: 'ΣΥΝΟΛΟ ΛΟΙΠΩΝ ΕΞΟΔΩΝ', dataType: 'summary' },
    { id: 'totalExpenses', name: 'ΣΥΝΟΛΟ ΕΞΟΔΩΝ', dataType: 'summary' },
    { id: 'netProfit', name: 'ΚΑΘΑΡΟ ΚΕΡΔΟΣ', dataType: 'summary' },
    { id: 'netProfitMargin', name: 'ΠΟΣΟΣΤΟ ΚΑΘΑΡΟΥ ΚΕΡΔΟΥΣ (%)', dataType: 'summary', isPercentage: true }
  ];

  return summaryItems.map(item => ({
    ...item,
    key: item.id,
    months: summary[item.id]?.months || Array(12).fill(0),
    total: summary[item.id]?.total || 0
  }));
}; 