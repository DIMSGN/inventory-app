# Financial Spreadsheet Module

This module provides reusable components, hooks, and utilities for implementing financial spreadsheets throughout the application. Using this shared module helps maintain consistency and avoids code duplication across different spreadsheet implementations.

## Directory Structure

- **components/** - Reusable UI components
  - **EditableCell.js** - Editable cell component with inline editing capabilities
  - **SpreadsheetControls.js** - Control panel with common spreadsheet actions
  - **SpreadsheetHeader.js** - Header component with title and metadata
- **hooks/** - Custom hooks for spreadsheet functionality
  - **useCellEditing.js** - Hook for managing cell editing state
- **utils/** - Utility functions
  - **formatters.js** - Functions for formatting values (currency, percentages, dates)
  - **calculations.js** - Functions for calculations (sums, averages, totals)
  - **excelExport.js** - Functions for exporting spreadsheet data to Excel
  - **__tests__/** - Test files for utility functions

## Components

### EditableCell

A reusable cell component that supports inline editing with validation.

```jsx
import { EditableCell } from '../../common/spreadsheet';

<EditableCell
  value={1000}
  record={rowData}
  dataKey="sales"
  columnIndex={2}
  isEditing={isEditing}
  editValue={editValue}
  onStartEdit={handleStartEdit}
  onCancelEdit={handleCancelEdit}
  onSaveEdit={handleSaveEdit}
  onEditValueChange={handleValueChange}
  formatValue={formatCurrency}
/>
```

### SpreadsheetControls

A control panel component with buttons for common spreadsheet actions.

```jsx
import { SpreadsheetControls } from '../../common/spreadsheet';

<SpreadsheetControls
  year={2023}
  onYearChange={handleYearChange}
  onSave={handleSave}
  onExport={handleExport}
  onPrint={handlePrint}
  onRefresh={handleRefresh}
  saving={isSaving}
  loading={isLoading}
/>
```

### SpreadsheetHeader

A header component for displaying spreadsheet title and metadata.

```jsx
import { SpreadsheetHeader } from '../../common/spreadsheet';

<SpreadsheetHeader
  title="Financial Report 2023"
  year={2023}
  lastUpdated={lastUpdated}
  isUsingMockData={isDemo}
  controls={<SpreadsheetControls {...controlProps} />}
/>
```

## Hooks

### useCellEditing

A hook for managing cell editing state in spreadsheets.

```jsx
import { useCellEditing } from '../../common/spreadsheet';

const {
  editingCell,
  editingValue,
  startEdit,
  saveEdit,
  cancelEdit,
  updateEditingValue,
  isEditing
} = useCellEditing();

// Start editing a cell
startEdit(record.id, columnIndex, currentValue);

// Check if a specific cell is being edited
const isCellBeingEdited = isEditing(record.id, columnIndex);

// Save the edit
saveEdit(() => {
  // Custom save logic
  return { value: editingValue, record, dataType, monthIndex };
});
```

## Utilities

### Formatters

Functions for formatting values for display.

```jsx
import { formatCurrency, formatPercentage, formatDate } from '../../common/spreadsheet';

// Format as currency: "1.000,00 €"
const formattedAmount = formatCurrency(1000);

// Format as percentage: "25,0%"
const formattedPercentage = formatPercentage(25);

// Format as date: "15/01/2023"
const formattedDate = formatDate(new Date(2023, 0, 15));
```

### Calculations

Functions for performing common calculations on financial data.

```jsx
import { 
  sumValues, 
  calculatePercentage,
  calculateRowTotals 
} from '../../common/spreadsheet';

// Sum an array of values
const total = sumValues([100, 200, 300]); // 600

// Calculate percentage
const percentage = calculatePercentage(25, 100); // 25

// Calculate row totals for a data set
const dataWithTotals = calculateRowTotals(financialData);
```

### Excel Export

Functions for exporting data to Excel format.

```jsx
import { 
  exportToExcel,
  prepareFinancialDataForExcel 
} from '../../common/spreadsheet';

// Prepare data for export
const excelData = prepareFinancialDataForExcel(financialData, 2023);

// Execute export
exportToExcel({
  data: excelData,
  filename: 'Financial_Report_2023',
  sheetName: 'Annual Report',
  headerRow: 3
});
```

## Best Practices

1. Always use the shared components for consistency across different spreadsheets
2. Prefer to use the utility functions over implementing your own formatting or calculation logic
3. Add tests for any new utility functions you create
4. Follow the established prop naming conventions when creating new components
5. Use the hooks to manage complex state rather than reimplementing the logic 