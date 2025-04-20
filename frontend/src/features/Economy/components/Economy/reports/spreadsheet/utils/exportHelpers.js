/**
 * Utility functions for exporting and printing financial data
 */

import * as XLSX from 'xlsx';
import { getMonthName } from './formatters';

/**
 * Prepare data for Excel export
 * @param {Object} data - Financial data
 * @param {number} year - The year of the data
 * @returns {Array} Formatted data array for Excel
 */
export const prepareExcelData = (data, year) => {
  if (!data) return [];
  
  const excelData = [];
  
  // Add header row with months
  const headerRow = ['Category'];
  for (let i = 0; i < 12; i++) {
    headerRow.push(getMonthName(i));
  }
  headerRow.push('ΣΥΝΟΛΟ');
  excelData.push(headerRow);
  
  // Add a row for the year
  excelData.push([`Financial Data ${year}`, '', '', '', '', '', '', '', '', '', '', '', '']);
  
  // Add sales section
  excelData.push(['SALES', '', '', '', '', '', '', '', '', '', '', '', '']);
  if (data.sales) {
    data.sales.forEach(item => {
      const row = [item.name];
      item.months.forEach(val => row.push(val || 0));
      row.push(item.total || 0);
      excelData.push(row);
    });
  }
  
  // Add expenses sections
  excelData.push(['EXPENSES', '', '', '', '', '', '', '', '', '', '', '', '']);
  
  // Cost of goods
  excelData.push(['Cost of Goods', '', '', '', '', '', '', '', '', '', '', '', '']);
  if (data.expenses?.costOfGoods) {
    data.expenses.costOfGoods.forEach(item => {
      const row = [item.name];
      item.months.forEach(val => row.push(val || 0));
      row.push(item.total || 0);
      excelData.push(row);
    });
  }
  
  // Operational expenses
  excelData.push(['Operational Expenses', '', '', '', '', '', '', '', '', '', '', '', '']);
  if (data.expenses?.operational) {
    data.expenses.operational.forEach(item => {
      const row = [item.name];
      item.months.forEach(val => row.push(val || 0));
      row.push(item.total || 0);
      excelData.push(row);
    });
  }
  
  return excelData;
};

/**
 * Export financial data to Excel
 * @param {Object} data - Financial data
 * @param {number} year - The year of the data
 */
export const exportToExcel = (data, year) => {
  const excelData = prepareExcelData(data, year);
  
  const ws = XLSX.utils.aoa_to_sheet(excelData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Financial Data');
  
  // Generate filename with date
  const date = new Date();
  const filename = `Financial_Data_${year}_exported_${date.toISOString().split('T')[0]}.xlsx`;
  
  // Save file
  XLSX.writeFile(wb, filename);
}; 