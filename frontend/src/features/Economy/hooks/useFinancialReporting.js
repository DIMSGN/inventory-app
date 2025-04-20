import { useCallback } from 'react';
import { exportToExcel } from '../common/spreadsheet/utils/excelExport';

/**
 * Custom hook for generating financial reports and exports
 * 
 * This hook specializes in report generation and export functionality
 * separate from data management and editing concerns.
 * 
 * @example
 * // In a component file:
 * const {
 *   generateExcelReport,
 *   generatePdfReport,
 *   prepareReportData
 * } = useFinancialReporting(financialData);
 * 
 * @param {Object} financialData - Financial data for reporting
 * @returns {Object} Report generation methods
 */
const useFinancialReporting = (financialData) => {
  /**
   * Prepare data for report generation
   * @param {Object} options - Options for data preparation
   * @param {string} options.year - Year for report
   * @param {string} options.reportType - Type of report ('monthly', 'quarterly', 'annual')
   * @param {boolean} options.includeProjections - Whether to include projections
   * @returns {Object} Prepared report data
   */
  const prepareReportData = useCallback((options = {}) => {
    const { year, reportType = 'annual', includeProjections = false } = options;
    
    if (!financialData) return null;
    
    const result = {
      title: `Financial Report ${year || new Date().getFullYear()}`,
      reportType,
      data: {
        sales: [],
        expenses: {
          costOfGoods: [],
          operational: [],
          utilities: []
        },
        summary: {}
      },
      metadata: {
        generatedAt: new Date(),
        includesProjections: includeProjections
      }
    };
    
    // Populate with real data
    if (financialData.sales) {
      result.data.sales = [...financialData.sales];
    }
    
    if (financialData.expenses) {
      if (financialData.expenses.costOfGoods) {
        result.data.expenses.costOfGoods = [...financialData.expenses.costOfGoods];
      }
      
      if (financialData.expenses.operational) {
        result.data.expenses.operational = [...financialData.expenses.operational];
      }
      
      if (financialData.expenses.utilities) {
        result.data.expenses.utilities = [...financialData.expenses.utilities];
      }
    }
    
    if (financialData.summary) {
      result.data.summary = { ...financialData.summary };
    }
    
    // Add quarterly aggregations if needed
    if (reportType === 'quarterly') {
      result.quarters = calculateQuarterlyData(financialData);
    }
    
    // Add projections if requested
    if (includeProjections) {
      result.projections = generateProjections(financialData);
    }
    
    return result;
  }, [financialData]);
  
  /**
   * Calculate quarterly aggregations of monthly data
   * @param {Object} data - Financial data with monthly values
   * @returns {Object} Quarterly aggregations
   */
  const calculateQuarterlyData = useCallback((data) => {
    if (!data || !data.sales) return null;
    
    const quarters = {
      sales: [],
      expenses: {
        costOfGoods: [],
        operational: [],
        utilities: []
      },
      summary: {}
    };
    
    // Function to aggregate monthly data into quarters
    const aggregateByQuarter = (items) => {
      return items.map(item => {
        const quarterlyData = Array(4).fill(0);
        
        // Q1: Jan-Mar (0-2)
        quarterlyData[0] = (item.months[0] || 0) + (item.months[1] || 0) + (item.months[2] || 0);
        
        // Q2: Apr-Jun (3-5)
        quarterlyData[1] = (item.months[3] || 0) + (item.months[4] || 0) + (item.months[5] || 0);
        
        // Q3: Jul-Sep (6-8)
        quarterlyData[2] = (item.months[6] || 0) + (item.months[7] || 0) + (item.months[8] || 0);
        
        // Q4: Oct-Dec (9-11)
        quarterlyData[3] = (item.months[9] || 0) + (item.months[10] || 0) + (item.months[11] || 0);
        
        return {
          id: item.id,
          name: item.name,
          quarters: quarterlyData,
          total: item.total
        };
      });
    };
    
    // Aggregate sales
    if (data.sales) {
      quarters.sales = aggregateByQuarter(data.sales);
    }
    
    // Aggregate expenses
    if (data.expenses) {
      if (data.expenses.costOfGoods) {
        quarters.expenses.costOfGoods = aggregateByQuarter(data.expenses.costOfGoods);
      }
      
      if (data.expenses.operational) {
        quarters.expenses.operational = aggregateByQuarter(data.expenses.operational);
      }
      
      if (data.expenses.utilities) {
        quarters.expenses.utilities = aggregateByQuarter(data.expenses.utilities);
      }
    }
    
    // Aggregate summary
    if (data.summary) {
      if (data.summary.totalSales) {
        quarters.summary.totalSales = {
          quarters: [
            (data.summary.totalSales.months[0] || 0) + (data.summary.totalSales.months[1] || 0) + (data.summary.totalSales.months[2] || 0),
            (data.summary.totalSales.months[3] || 0) + (data.summary.totalSales.months[4] || 0) + (data.summary.totalSales.months[5] || 0),
            (data.summary.totalSales.months[6] || 0) + (data.summary.totalSales.months[7] || 0) + (data.summary.totalSales.months[8] || 0),
            (data.summary.totalSales.months[9] || 0) + (data.summary.totalSales.months[10] || 0) + (data.summary.totalSales.months[11] || 0)
          ],
          total: data.summary.totalSales.total
        };
      }
      
      if (data.summary.totalExpenses) {
        quarters.summary.totalExpenses = {
          quarters: [
            (data.summary.totalExpenses.months[0] || 0) + (data.summary.totalExpenses.months[1] || 0) + (data.summary.totalExpenses.months[2] || 0),
            (data.summary.totalExpenses.months[3] || 0) + (data.summary.totalExpenses.months[4] || 0) + (data.summary.totalExpenses.months[5] || 0),
            (data.summary.totalExpenses.months[6] || 0) + (data.summary.totalExpenses.months[7] || 0) + (data.summary.totalExpenses.months[8] || 0),
            (data.summary.totalExpenses.months[9] || 0) + (data.summary.totalExpenses.months[10] || 0) + (data.summary.totalExpenses.months[11] || 0)
          ],
          total: data.summary.totalExpenses.total
        };
      }
      
      if (data.summary.profit) {
        quarters.summary.profit = {
          quarters: [
            (data.summary.profit.months[0] || 0) + (data.summary.profit.months[1] || 0) + (data.summary.profit.months[2] || 0),
            (data.summary.profit.months[3] || 0) + (data.summary.profit.months[4] || 0) + (data.summary.profit.months[5] || 0),
            (data.summary.profit.months[6] || 0) + (data.summary.profit.months[7] || 0) + (data.summary.profit.months[8] || 0),
            (data.summary.profit.months[9] || 0) + (data.summary.profit.months[10] || 0) + (data.summary.profit.months[11] || 0)
          ],
          total: data.summary.profit.total
        };
      }
    }
    
    return quarters;
  }, []);
  
  /**
   * Generate simple projections based on current data
   * @param {Object} data - Financial data
   * @returns {Object} Projections for next period
   */
  const generateProjections = useCallback((data) => {
    if (!data || !data.sales) return null;
    
    // Simple projection calculation - this would be more sophisticated in a real app
    const calculateGrowthRate = (values) => {
      // Calculate average month-over-month growth
      let growthSum = 0;
      let count = 0;
      
      for (let i = 1; i < values.length; i++) {
        if (values[i-1] && values[i] && values[i-1] > 0) {
          growthSum += (values[i] - values[i-1]) / values[i-1];
          count++;
        }
      }
      
      // Return average growth rate or 0.02 (2%) as default if can't calculate
      return count > 0 ? growthSum / count : 0.02;
    };
    
    // Calculate sales projections
    const salesGrowthRate = 
      data.summary?.totalSales?.months ? 
      calculateGrowthRate(data.summary.totalSales.months) : 
      0.02;
    
    // Apply growth rate to each month of sales
    const salesProjection = {
      monthly: Array(12).fill(0),
      total: 0
    };
    
    if (data.summary?.totalSales?.months) {
      for (let i = 0; i < 12; i++) {
        salesProjection.monthly[i] = data.summary.totalSales.months[i] * (1 + salesGrowthRate);
      }
      salesProjection.total = salesProjection.monthly.reduce((sum, val) => sum + val, 0);
    }
    
    // Similar projections for expenses
    const expensesGrowthRate = 
      data.summary?.totalExpenses?.months ? 
      calculateGrowthRate(data.summary.totalExpenses.months) : 
      0.015;
    
    const expensesProjection = {
      monthly: Array(12).fill(0),
      total: 0
    };
    
    if (data.summary?.totalExpenses?.months) {
      for (let i = 0; i < 12; i++) {
        expensesProjection.monthly[i] = data.summary.totalExpenses.months[i] * (1 + expensesGrowthRate);
      }
      expensesProjection.total = expensesProjection.monthly.reduce((sum, val) => sum + val, 0);
    }
    
    // Calculate profit projections
    const profitProjection = {
      monthly: salesProjection.monthly.map((sales, i) => sales - expensesProjection.monthly[i]),
      total: salesProjection.total - expensesProjection.total
    };
    
    return {
      sales: salesProjection,
      expenses: expensesProjection,
      profit: profitProjection,
      metadata: {
        salesGrowthRate,
        expensesGrowthRate
      }
    };
  }, []);
  
  /**
   * Generate and download an Excel report
   * @param {Object} options - Excel export options
   * @param {string} options.year - Year for report
   * @param {string} options.filename - Filename for Excel file
   * @param {string} options.reportType - Type of report ('monthly', 'quarterly', 'annual')
   * @returns {boolean} Success status
   */
  const generateExcelReport = useCallback((options = {}) => {
    const { 
      year = new Date().getFullYear(), 
      filename = 'Financial_Report',
      reportType = 'annual'
    } = options;
    
    try {
      // Prepare data for export
      const reportData = prepareReportData({ year, reportType });
      if (!reportData) return false;
      
      // Transform into format for Excel export
      const excelData = [];
      
      // Add headers
      excelData.push([reportData.title, '', '', '', '', '', '', '', '', '', '', '', '']);
      excelData.push(['Year:', year, '', '', '', '', '', '', '', '', '', '', '']);
      excelData.push(['Generated:', new Date().toLocaleString(), '', '', '', '', '', '', '', '', '', '', '']);
      excelData.push(['', '', '', '', '', '', '', '', '', '', '', '', '']);
      
      if (reportType === 'monthly') {
        excelData.push(['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Total']);
        
        // Sales section
        excelData.push(['SALES', '', '', '', '', '', '', '', '', '', '', '', '', '']);
        reportData.data.sales.forEach(row => {
          const rowData = [row.name];
          row.months.forEach(val => rowData.push(val || 0));
          rowData.push(row.total || 0);
          excelData.push(rowData);
        });
        
        // Expenses sections
        excelData.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
        excelData.push(['EXPENSES', '', '', '', '', '', '', '', '', '', '', '', '', '']);
        
        // Cost of goods
        excelData.push(['COST OF GOODS', '', '', '', '', '', '', '', '', '', '', '', '', '']);
        reportData.data.expenses.costOfGoods.forEach(row => {
          const rowData = [row.name];
          row.months.forEach(val => rowData.push(val || 0));
          rowData.push(row.total || 0);
          excelData.push(rowData);
        });
        
        // Operational expenses
        excelData.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
        excelData.push(['OPERATIONAL EXPENSES', '', '', '', '', '', '', '', '', '', '', '', '', '']);
        reportData.data.expenses.operational.forEach(row => {
          const rowData = [row.name];
          row.months.forEach(val => rowData.push(val || 0));
          rowData.push(row.total || 0);
          excelData.push(rowData);
        });
        
        // Utilities expenses
        excelData.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
        excelData.push(['UTILITIES & FIXED EXPENSES', '', '', '', '', '', '', '', '', '', '', '', '', '']);
        reportData.data.expenses.utilities.forEach(row => {
          const rowData = [row.name];
          row.months.forEach(val => rowData.push(val || 0));
          rowData.push(row.total || 0);
          excelData.push(rowData);
        });
        
        // Summary section
        excelData.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
        excelData.push(['SUMMARY', '', '', '', '', '', '', '', '', '', '', '', '', '']);
        
        // Total sales
        const totalSalesRow = ['Total Sales'];
        reportData.data.summary.totalSales?.months.forEach(val => totalSalesRow.push(val || 0));
        totalSalesRow.push(reportData.data.summary.totalSales?.total || 0);
        excelData.push(totalSalesRow);
        
        // Total expenses
        const totalExpensesRow = ['Total Expenses'];
        reportData.data.summary.totalExpenses?.months.forEach(val => totalExpensesRow.push(val || 0));
        totalExpensesRow.push(reportData.data.summary.totalExpenses?.total || 0);
        excelData.push(totalExpensesRow);
        
        // Profit
        const profitRow = ['Profit'];
        reportData.data.summary.profit?.months.forEach(val => profitRow.push(val || 0));
        profitRow.push(reportData.data.summary.profit?.total || 0);
        excelData.push(profitRow);
      } else if (reportType === 'quarterly') {
        // Format for quarterly reports
        excelData.push(['', 'Q1', 'Q2', 'Q3', 'Q4', 'Total']);
        
        // Add quarterly data...
        // (similar to monthly but with quarters)
      }
      
      // Execute export
      return exportToExcel({
        data: excelData,
        filename: `${filename}_${year}`,
        sheetName: 'Financial Report',
        headerRow: 4
      });
    } catch (error) {
      console.error('Error generating Excel report:', error);
      return false;
    }
  }, [prepareReportData]);
  
  /**
   * Generate a PDF report (placeholder implementation)
   * @param {Object} options - PDF export options
   * @returns {boolean} Success status
   */
  const generatePdfReport = useCallback((options = {}) => {
    // This would use a PDF generation library in a real implementation
    console.log('PDF generation would happen here with options:', options);
    return true;
  }, []);
  
  return {
    prepareReportData,
    generateExcelReport,
    generatePdfReport,
    calculateQuarterlyData
  };
};

export default useFinancialReporting; 