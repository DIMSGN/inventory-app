# Economy Components

This directory contains components related to the Economy feature, organized into logical folders.

## Folder Structure

- **core/** - Core Economy components
  - `Economy.js` - Main Economy component

- **forms/** - Form components
  - `PayrollExpenseForm.js` - Form for payroll expenses
  - `OperatingExpenseForm.js` - Form for operating expenses
  - `InvoiceForm.js` - Form for invoices
  - `DailyLogForm.js` - Form for daily logs

- **lists/** - List components
  - `InvoicesList.js` - List of invoices
  - `SuppliersList.js` - List of suppliers
  - `DailyLogList.js` - List of daily logs

- **details/** - Detail view components
  - `InvoiceDetails.js` - Invoice details component

- **reports/** - Report components
  - `FinancialReports.js` - Financial reports component
  - `FinancialSpreadsheet.js` - Financial spreadsheet component

- **sales/** - Sales-related components
  - `SalesRecording.js` - Sales recording component

- **styles/** - CSS files
  - `ExpenseForms.css` - Styles for expense forms

## Usage

Import components directly from the main index:

```javascript
import { 
  PayrollExpenseForm, 
  InvoicesList, 
  FinancialReports 
} from '../features/Economy/components/Economy';
```

This organizational structure helps maintain a clean separation of concerns and makes it easier to locate and manage components. 