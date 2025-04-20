/**
 * Economy module index file
 * Exports all economy-related components and hooks for use in other parts of the application
 */

// Main Component
export { default } from './Economy';

// Hooks
export { useEconomyData } from './hooks/useEconomyData';

// Tab Components
export * from './components/tabs';

// Utils
export * from './utils/tabConfig'; 