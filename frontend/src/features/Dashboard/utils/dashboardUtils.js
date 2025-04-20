/**
 * Utility functions for dashboard
 * @module utils/dashboardUtils
 */

import { FaPlus, FaList, FaChartBar, FaTable } from 'react-icons/fa';

/**
 * Get common dashboard actions based on role
 * @param {string} role - User role (e.g., 'admin', 'manager')
 * @returns {Array} Array of action objects
 */
export const getDashboardActions = (role = 'user') => {
  const commonActions = [
    {
      to: '/inventory',
      icon: <FaList />,
      text: 'Αποθήκη',
      color: '#3498db'
    },
    {
      to: '/recipes',
      icon: <FaPlus />,
      text: 'Συνταγές',
      color: '#2ecc71'
    }
  ];

  // Add role-specific actions
  if (role === 'admin' || role === 'manager') {
    return [
      ...commonActions,
      {
        to: '/reports',
        icon: <FaChartBar />,
        text: 'Αναφορές',
        color: '#9b59b6'
      },
      {
        to: '/sales',
        icon: <FaTable />,
        text: 'Πωλήσεις',
        color: '#f39c12'
      }
    ];
  }

  return commonActions;
};

/**
 * Format a numeric value for display
 * @param {number} value - Numeric value
 * @param {string} [format='number'] - Format type ('number', 'currency', 'percent')
 * @param {string} [locale='el-GR'] - Locale for formatting
 * @returns {string} Formatted value
 */
export const formatValue = (value, format = 'number', locale = 'el-GR') => {
  if (typeof value !== 'number') return value;

  switch (format) {
    case 'currency':
      return new Intl.NumberFormat(locale, { 
        style: 'currency', 
        currency: 'EUR' 
      }).format(value);
    case 'percent':
      return new Intl.NumberFormat(locale, { 
        style: 'percent',
        minimumFractionDigits: 1
      }).format(value / 100);
    default:
      return new Intl.NumberFormat(locale).format(value);
  }
}; 