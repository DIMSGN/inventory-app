/**
 * Application configuration
 * Contains API URLs and other environment-specific variables
 */

// API URLs
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Default pagination settings
export const DEFAULT_PAGE_SIZE = 10;

// Format options
export const CURRENCY_FORMAT = {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
};

// Date formats
export const DATE_FORMAT = 'DD/MM/YYYY';
export const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm';

// Export all as default for convenience
export default {
  API_URL,
  DEFAULT_PAGE_SIZE,
  CURRENCY_FORMAT,
  DATE_FORMAT,
  DATE_TIME_FORMAT
}; 