/**
 * Application configuration
 * Contains API URLs and other environment-specific variables
 */

// Common configuration file for the frontend application

// Base API URL from environment variable with fallback
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Toast notification settings
export const TOAST_CONFIG = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
};

// Storage keys for local caching
export const STORAGE_KEYS = {
  PRODUCTS: 'cachedProducts',
  CATEGORIES: 'cachedCategories',
  UNITS: 'cachedUnits',
  RULES: 'cachedRules',
  RECIPES: 'cachedRecipes',
  SUPPLIERS: 'cachedSuppliers',
  USER_SETTINGS: 'userSettings'
};

// Config for data refresh intervals (in milliseconds)
export const REFRESH_INTERVALS = {
  ECONOMY: 5 * 60 * 1000, // 5 minutes
  INVENTORY: 15 * 60 * 1000 // 15 minutes
};

// Logging configuration
export const isDevelopment = process.env.NODE_ENV === 'development';

// Export config object for easier imports
export const config = {
  API_URL,
  isDevelopment,
  TOAST_CONFIG,
  STORAGE_KEYS,
  REFRESH_INTERVALS
};

export default config; 