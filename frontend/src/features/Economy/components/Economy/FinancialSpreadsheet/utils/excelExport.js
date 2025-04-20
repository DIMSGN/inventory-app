import * as XLSX from 'xlsx';

/**
 * Export financial data to Excel
 * @param {Object} financialData - The financial data to export
 * @param {string} year - The year of the report
 */
export const exportToExcel = (financialData, year) => {
  try {
    const workbook = XLSX.utils.book_new();
    
    // Prepare data for Excel export
    const data = [
      ['Financial Report', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['Year:', year, '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Total'],
    ];
    
    // Add Sales data
    data.push(['SALES', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    financialData.sales.forEach(row => {
      const rowData = [row.name];
      row.months.forEach(val => rowData.push(val || 0));
      rowData.push(row.total || 0);
      data.push(rowData);
    });
    
    // Add Total Sales
    const totalSalesRow = ['Total Sales'];
    financialData.summary.totalSales?.months.forEach(val => totalSalesRow.push(val || 0));
    totalSalesRow.push(financialData.summary.totalSales?.total || 0);
    data.push(totalSalesRow);
    
    data.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    
    // Add Cost of Goods
    data.push(['COST OF GOODS', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    financialData.expenses.costOfGoods.forEach(row => {
      const rowData = [row.name];
      row.months.forEach(val => rowData.push(val || 0));
      rowData.push(row.total || 0);
      data.push(rowData);
    });
    
    // Add Total Cost of Goods
    const totalCostRow = ['Total Cost of Goods'];
    financialData.summary.totalCostOfGoods?.months.forEach(val => totalCostRow.push(val || 0));
    totalCostRow.push(financialData.summary.totalCostOfGoods?.total || 0);
    data.push(totalCostRow);
    
    // Add Gross Profit
    const grossProfitRow = ['Gross Profit'];
    financialData.summary.grossProfit?.months.forEach(val => grossProfitRow.push(val || 0));
    grossProfitRow.push(financialData.summary.grossProfit?.total || 0);
    data.push(grossProfitRow);
    
    // Add Gross Profit Margin
    const grossMarginRow = ['Gross Profit Margin (%)'];
    financialData.summary.grossProfitMargin?.months.forEach(val => grossMarginRow.push(val || 0));
    grossMarginRow.push(financialData.summary.grossProfitMargin?.total || 0);
    data.push(grossMarginRow);
    
    data.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    
    // Add Operational Expenses
    data.push(['OPERATIONAL EXPENSES', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    financialData.expenses.operational.forEach(row => {
      const rowData = [row.name];
      row.months.forEach(val => rowData.push(val || 0));
      rowData.push(row.total || 0);
      data.push(rowData);
    });
    
    // Add Total Operational
    const totalOperationalRow = ['Total Operational'];
    financialData.summary.totalOperational?.months.forEach(val => totalOperationalRow.push(val || 0));
    totalOperationalRow.push(financialData.summary.totalOperational?.total || 0);
    data.push(totalOperationalRow);
    
    data.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    
    // Add Utilities Expenses
    data.push(['UTILITIES EXPENSES', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    financialData.expenses.utilities.forEach(row => {
      const rowData = [row.name];
      row.months.forEach(val => rowData.push(val || 0));
      rowData.push(row.total || 0);
      data.push(rowData);
    });
    
    // Add Total Utilities
    const totalUtilitiesRow = ['Total Utilities'];
    financialData.summary.totalUtilities?.months.forEach(val => totalUtilitiesRow.push(val || 0));
    totalUtilitiesRow.push(financialData.summary.totalUtilities?.total || 0);
    data.push(totalUtilitiesRow);
    
    data.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
    
    // Add Total Expenses
    const totalExpensesRow = ['Total Expenses'];
    financialData.summary.totalExpenses?.months.forEach(val => totalExpensesRow.push(val || 0));
    totalExpensesRow.push(financialData.summary.totalExpenses?.total || 0);
    data.push(totalExpensesRow);
    
    // Add Net Profit
    const netProfitRow = ['Net Profit'];
    financialData.summary.netProfit?.months.forEach(val => netProfitRow.push(val || 0));
    netProfitRow.push(financialData.summary.netProfit?.total || 0);
    data.push(netProfitRow);
    
    // Add Net Profit Margin
    const netMarginRow = ['Net Profit Margin (%)'];
    financialData.summary.netProfitMargin?.months.forEach(val => netMarginRow.push(val || 0));
    netMarginRow.push(financialData.summary.netProfitMargin?.total || 0);
    data.push(netMarginRow);
    
    // Create worksheet and add to workbook
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Annual Report');
    
    // Apply some styling
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; C++) {
      const address = XLSX.utils.encode_col(C) + '4'; // Header row
      if (!worksheet[address]) continue;
      worksheet[address].s = { font: { bold: true } };
    }
    
    // Auto-size columns
    const colWidths = data.reduce((acc, row) => {
      row.forEach((cell, i) => {
        const cellValue = cell?.toString() || '';
        const width = cellValue.length;
        if (!acc[i] || acc[i] < width) acc[i] = width;
      });
      return acc;
    }, []);
    
    worksheet['!cols'] = colWidths.map(width => ({ width }));
    
    // Save file
    XLSX.writeFile(workbook, `Financial_Report_${year}.xlsx`);
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
}; 