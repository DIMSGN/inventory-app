/**
 * Application configuration
 * Contains API URLs and other environment-specific variables
 */

// Base API URL from environment variable
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Logging configuration
export const isDevelopment = process.env.NODE_ENV === 'development';

// Export config object for easier imports
export const config = {
  API_URL,
  isDevelopment
};

export default config; 