// Index file for Economy styles
// This file doesn't actually export CSS modules but provides a reference to them

// Standard CSS imports
import './ExpenseForms.css';
import './FinancialSpreadsheet.css';
import './DailyLog.css';
import './FinancialDashboard.css';

// CSS Modules (these can be exported)
import economyStyles from './Economy.module.css';
import invoiceDetailsStyles from './InvoiceDetails.module.css';
import invoiceFormStyles from './InvoiceForm.module.css';
import invoicesListStyles from './InvoicesList.module.css';

// Export CSS modules
export {
  economyStyles,
  invoiceDetailsStyles,
  invoiceFormStyles,
  invoicesListStyles
}; 