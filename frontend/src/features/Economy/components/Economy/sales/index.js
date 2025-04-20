/**
 * Sales components index file
 * Exports all sales-related components for use in other parts of the application
 */

// Main component
export { default } from './SalesRecording';

// Tab Components
export * from './components/tabs';

// Hooks
export { default as useSalesData } from './hooks/useSalesData';
export { default as useSalesForm } from './hooks/useSalesForm'; 