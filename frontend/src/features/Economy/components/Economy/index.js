/**
 * Economy components index file
 * Exports all Economy-related components for use in other parts of the application
 */

// Main components
export { default as Economy } from './economy';
export { default as FinancialReports } from './reports';
export { default as SalesRecording } from './sales/SalesRecording';

// Financial spreadsheets (with more specific names)
export { default as MonthlyFinancialDashboard } from './FinancialSpreadsheet/FinancialSpreadsheet';
export { default as FinancialReportSpreadsheet } from './reports/spreadsheet/FinancialSpreadsheet';

// Invoice management
export { default as InvoiceDetails } from './Invoices/InvoiceDetails';

// Utility components
export { default as SuppliersList } from './SuppliersList';
export { default as InvoicesList } from './InvoicesList'; 