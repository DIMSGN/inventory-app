# Expense Management Components

This directory contains components for managing business expenses, including payroll and operating expenses.

## Component Structure

- **ExpenseManagement.js**: Main container component that manages the tabs and overall structure
- **OperatingExpenseSection.js**: Section for managing operating expenses
- **PayrollExpenseSection.js**: Section for managing payroll expenses
- **DeleteExpenseModal.js**: Reusable modal for confirming expense deletion

### Sub-components (in `/components` folder)

- **ExpenseCard.js**: Reusable card component with consistent styling
- **ExpenseTable.js**: Reusable table component for displaying expenses
- **OperatingExpenseForm.js**: Form for operating expenses
- **PayrollExpenseForm.js**: Form for payroll expenses

## Related Hooks and Utilities

The expense components use these supporting files:

- **useExpenseManagement.js**: Hook that manages state and basic operations
- **useExpenseHandlers.js**: Hook that provides operation handlers
- **expenseUtils.js**: Utility functions for formatting and calculations

## Component Hierarchy

```
ExpenseManagement
├── Tabs
│   ├── OperatingExpenseSection
│   │   ├── ExpenseCard (form)
│   │   │   └── OperatingExpenseForm
│   │   └── ExpenseCard (table)
│   │       └── ExpenseTable
│   └── PayrollExpenseSection
│       ├── ExpenseCard (form)
│       │   └── PayrollExpenseForm
│       └── ExpenseCard (table)
│           └── ExpenseTable
└── DeleteExpenseModal
```

## Testing

Each component is designed to be testable in isolation. Use the following testing strategies:

1. **Unit Tests**: For utility functions and hooks
2. **Component Tests**: For individual components using React Testing Library
3. **Integration Tests**: For interaction between component groups

## Usage

Import components from the main index:

```javascript
import { 
  ExpenseManagement, 
  OperatingExpenseSection, 
  PayrollExpenseSection 
} from '../features/Economy/components/Expenses';
``` 