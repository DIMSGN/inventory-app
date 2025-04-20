/**
 * Utility functions for chef dashboard
 * @module utils/dashboardUtils
 */

import { FaPlus, FaList, FaUtensils, FaExclamationTriangle } from 'react-icons/fa';

/**
 * Returns action items for the ActionCard
 * @returns {Array} Action items with links and icons
 */
export const getActionItems = () => [
  {
    to: '/recipes/new?type=food',
    icon: <FaPlus />,
    text: 'Νέα Συνταγή',
    color: '#e74c3c'
  },
  {
    to: '/recipes',
    icon: <FaList />,
    text: 'Όλες οι Συνταγές',
    color: '#2ecc71'
  }
];

/**
 * Returns stats data for the StatsCard
 * @param {number} recipeCount - Number of food recipes
 * @param {string} topRecipeName - Name of the top recipe
 * @returns {Array} Stats data with labels, values and icons
 */
export const getStatsData = (recipeCount, topRecipeName = 'Καμία') => [
  {
    label: 'Συνταγές Φαγητών',
    value: recipeCount,
    color: '#e74c3c',
    icon: <FaUtensils />
  },
  {
    label: 'Κορυφαία Συνταγή',
    value: topRecipeName,
    color: '#2ecc71'
  },
  {
    label: 'Υλικά που λείπουν',
    value: 3, // This would normally come from a real data source
    color: '#f39c12',
    icon: <FaExclamationTriangle />
  }
]; 