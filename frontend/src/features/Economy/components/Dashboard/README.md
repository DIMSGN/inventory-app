# Dashboard Components

This directory contains components related to the Economy Dashboard feature, organized into logical folders.

## Folder Structure

- **overview/** - Economy overview components
  - `EconomyOverview.js` - Main economy overview component

- **financial/** - Financial dashboard components
  - `FinancialDashboard.js` - Financial dashboard component

- **styles/** - CSS files
  - `EconomyOverview.css` - Styles for economy overview
  - `FinancialDashboard.css` - Styles for financial dashboard

## Usage

Import components directly from the main index:

```javascript
import { 
  EconomyOverview, 
  FinancialDashboard 
} from '../features/Economy/components/Dashboard';
```

This organizational structure allows for easy management of dashboard components and ensures a consistent, maintainable codebase. 