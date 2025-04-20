# Economy Feature Components

This directory contains the main component folders for the Economy feature, organized into logical groups.

## Folder Structure

### /Expenses
Components related to expense management, including:
- Operating expenses
- Payroll expenses
- Expense forms and tables
- Deletion modals

See [Expenses README](./Expenses/README.md) for detailed documentation.

### /Economy
Core economy components, including:
- Forms (PayrollExpenseForm, OperatingExpenseForm, InvoiceForm, DailyLogForm)
- Lists (InvoicesList, SuppliersList, DailyLogList)
- Reports (FinancialReports, FinancialSpreadsheet)
- Sales (SalesRecording)
- Detail views (InvoiceDetails)
- Core components (Economy)

See [Economy README](./Economy/README.md) for detailed documentation.

### /Dashboard
Dashboard display components, including:
- Economy overview
- Financial dashboard
- Dashboard styles

See [Dashboard README](./Dashboard/README.md) for detailed documentation.

## Organization Pattern

Each component folder follows a consistent organization pattern:

1. Each group is organized into subdirectories by functionality
2. Each subdirectory has an index.js file that exports its components
3. Each folder has a main index.js that imports and re-exports from subdirectories
4. The main index.js file imports style files
5. README.md files document the structure and usage of each component group

## Usage

All components can be imported directly from their respective folders:

```javascript
// Import expense components
import { 
  ExpenseManagement,
  OperatingExpenseSection 
} from '../features/Economy/components/Expenses';

// Import core economy components
import { 
  PayrollExpenseForm,
  InvoicesList,
  FinancialReports 
} from '../features/Economy/components/Economy';

// Import dashboard components
import { 
  EconomyOverview,
  FinancialDashboard 
} from '../features/Economy/components/Dashboard';
```

This organization ensures a clean, maintainable, and scalable codebase. 