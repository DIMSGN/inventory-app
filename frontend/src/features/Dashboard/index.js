/**
 * Barrel file for Dashboard feature exports
 * @module features/Dashboard
 */

// Default import
import Dashboard from './components/Dashboard/Dashboard';

// Main components
export { default as Dashboard } from './components/Dashboard/Dashboard';
export { default as BaseDashboard } from './components/BaseDashboard';
export { default as DashboardPage } from './pages/DashboardPage';

// UI Components
export { default as ActionCard } from './components/ActionCard';
export { default as StatsCard } from './components/StatsCard';
export { default as StatCard } from './components/StatCard';
export { default as DashboardHeader } from './components/DashboardHeader';

// Constants
export * from './constants/dashboardTypes';

// Hooks
export * from './hooks';

// Contexts
export * from './contexts/DashboardContext';

// Utils
export * from './utils/dashboardUtils';

// Services
export * from './services/dashboardService';

// Styles
export * from './styles';

// Default export
export default Dashboard; 