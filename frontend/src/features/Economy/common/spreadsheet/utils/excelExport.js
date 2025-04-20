import * as XLSX from 'xlsx';

/**
 * Export data to an Excel file
 * @param {Object} options - Export options
 * @param {Array<Array<any>>} options.data - Data to export (array of arrays)
 * @param {string} options.filename - File name (without extension)
 * @param {string} options.sheetName - Excel sheet name
 * @param {Object} options.styles - Styles configuration
 * @param {number} options.headerRow - Index of the header row for styling
 * @returns {boolean} Success flag
 */
export const exportToExcel = ({ 
  data, 
  filename = 'Export',
  sheetName = 'Sheet1',
  styles = {},
  headerRow = 0 
}) => {
  try {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error('Invalid export data');
      return false;
    }
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    
    // Add styling to header row if specified
    if (headerRow >= 0) {
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      for (let C = range.s.c; C <= range.e.c; C++) {
        const address = XLSX.utils.encode_col(C) + (headerRow + 1); // Convert to 1-indexed
        if (!worksheet[address]) continue;
        
        worksheet[address].s = { 
          font: { bold: true },
          ...(styles.header || {})
        };
      }
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
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Save file
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};

/**
 * Prepare financial data for Excel export
 * @param {Object} financialData - Financial data to export
 * @param {string} year - Year of the report
 * @returns {Array<Array<any>>} Formatted data ready for Excel export
 */
export const prepareFinancialDataForExcel = (financialData, year) => {
  if (!financialData || !financialData.sales) return [];
  
  // Base data structure with headers
  const data = [
    ['Financial Report', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['Year:', year, '', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Total'],
  ];
  
  // Add Sales section
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
  
  // Add Cost of Goods section
  data.push(['COST OF GOODS', '', '', '', '', '', '', '', '', '', '', '', '', '']);
  financialData.expenses.costOfGoods.forEach(row => {
    const rowData = [row.name];
    row.months.forEach(val => rowData.push(val || 0));
    rowData.push(row.total || 0);
    data.push(rowData);
  });
  
  // Add more sections following the same pattern...
  
  return data;
}; 