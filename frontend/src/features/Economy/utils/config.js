/**
 * Configuration settings for the Economy module
 */

// Base API URL
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Economy-specific endpoints
export const ECONOMY_ENDPOINTS = {
  FINANCIAL_DATA: `${API_URL}/financial-data`,
  MONTHLY_SUMMARY: `${API_URL}/monthly-summary`,
  DAILY_LOGS: `${API_URL}/daily-logs`,
  EXPENSE_CATEGORIES: `${API_URL}/expense-categories`,
  PAYROLL: `${API_URL}/payroll`,
  REPORTS: `${API_URL}/reports`
};

// Default date format for the application
export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

// Month names in Greek
export const MONTH_NAMES = [
  'Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 
  'Μάιος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος', 
  'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'
];

// Month short names in Greek
export const MONTH_SHORT_NAMES = [
  'Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 
  'Μάι', 'Ιούν', 'Ιούλ', 'Αύγ', 
  'Σεπ', 'Οκτ', 'Νοέ', 'Δεκ'
];

// Financial data category types
export const CATEGORY_TYPES = {
  SALES: 'sales',
  COSTS: 'costs',
  LABOR: 'labor',
  OPERATING: 'operating'
};

// Colors for different categories in charts
export const CHART_COLORS = {
  sales: '#4CAF50',
  costs: '#F44336',
  labor: '#2196F3',
  operating: '#FF9800',
  profit: '#9C27B0'
};

// Default timeout for API requests in milliseconds
export const API_TIMEOUT = 15000;

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_MOCK_DATA: process.env.REACT_APP_USE_MOCK_DATA === 'true',
  ENABLE_DAILY_LOGS: true,
  ENABLE_REPORTS: true,
  ENABLE_EXPENSE_MANAGEMENT: true,
  ENABLE_COMPARISON: true
};

export default {
  API_URL,
  ECONOMY_ENDPOINTS,
  DEFAULT_DATE_FORMAT,
  MONTH_NAMES,
  MONTH_SHORT_NAMES,
  CATEGORY_TYPES,
  CHART_COLORS,
  API_TIMEOUT,
  FEATURE_FLAGS
}; 