import { lazy } from 'react';

// Regular imports for non-lazy loaded components
import FinancialSpreadsheetPage from '../features/Economy/pages/FinancialSpreadsheetPage';
import DailyEconomyPage from '../features/Economy/pages/DailyEconomyPage';
import ExpensesPage from '../features/Economy/pages/ExpensesPage';

// Lazy loaded components
const DashboardPage = lazy(() => import("../features/Dashboard/pages/DashboardPage"));
const InventoryPage = lazy(() => import("../features/Inventory/pages/InventoryPage"));
const EconomyPage = lazy(() => import("../features/Economy/pages/EconomyPage"));
const RecipesPage = lazy(() => import("../features/Recipes/pages/RecipesPage"));
const BarmanPage = lazy(() => import("../features/Barman/pages/BarmanPage"));
const ChefPage = lazy(() => import("../features/Chef/pages/ChefPage"));
const ManagerPage = lazy(() => import("../features/Manager/pages/ManagerPage"));

// Main routes
export const routes = [
  {
    path: '/',
    element: DashboardPage,
    exact: true
  },
  {
    path: '/dashboard',
    redirect: '/',
    exact: true
  },
  {
    path: '/inventory',
    element: InventoryPage,
    exact: true
  },
  {
    path: '/inventory/rules',
    element: InventoryPage,
    exact: true
  },
  {
    path: '/economy/*',
    element: EconomyPage,
    exact: true
  },
  {
    path: '/recipes/*',
    element: RecipesPage,
    exact: true
  },
  {
    path: '/barman-dashboard',
    element: BarmanPage,
    exact: true
  },
  {
    path: '/chef-dashboard',
    element: ChefPage,
    exact: true
  },
  {
    path: '/manager-dashboard',
    element: ManagerPage,
    exact: true
  }
];

// Economy-specific routes
export const economyRoutes = [
  {
    path: '/economy/financials/:year',
    element: FinancialSpreadsheetPage
  },
  {
    path: '/economy/financials',
    element: FinancialSpreadsheetPage
  },
  {
    path: '/economy/daily',
    element: DailyEconomyPage
  },
  {
    path: '/economy/expenses',
    element: ExpensesPage
  }
];

// Map from route paths to section titles
export const routeTitles = {
  'dashboard': 'Dashboard Management System',
  'inventory': 'Inventory Management System',
  'economy': 'Economic Analytics System',
  'economy/financials': 'Financial Spreadsheet',
  'recipes': 'Recipe Management System',
  'barman': 'Barman Dashboard',
  'chef': 'Chef Dashboard',
  'manager': 'Manager Dashboard'
}; 