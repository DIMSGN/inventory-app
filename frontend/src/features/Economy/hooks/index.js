/**
 * Economy Hooks
 * Exports all custom hooks for the Economy module
 */

// Spreadsheet hooks
export { default as useFinancialData } from './useFinancialData';
export { default as useSpreadsheetCellEditing } from './useSpreadsheetCellEditing';
export { default as useFinancialReporting } from './useFinancialReporting';

// Expense management hooks
export { default as useExpenseHandlers } from './useExpenseHandlers';
export { default as useExpenseManagement } from './useExpenseManagement';
export { default as useExpenses } from './useExpenses';

// Financial hooks
export { default as useFinancialDashboard } from './useFinancialDashboard';
export { default as useFinancialSpreadsheet } from './useFinancialSpreadsheet';

// Sales hooks
export { default as useSales } from './useSales';
export { default as useDailyEconomy } from './useDailyEconomy'; 