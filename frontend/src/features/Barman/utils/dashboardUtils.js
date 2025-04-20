/**
 * Utility functions for barman dashboard
 * @module utils/dashboardUtils
 */

import { FaPlus, FaList, FaGlassMartini, FaWineBottle, FaExclamationTriangle } from 'react-icons/fa';

/**
 * Returns action items for the ActionCard
 * @returns {Array} Action items with links and icons
 */
export const getActionItems = () => [
  {
    to: '/recipes/new?type=drink',
    icon: <FaPlus />,
    text: 'Νέα Συνταγή',
    color: '#3498db'
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
 * @param {number} recipeCount - Number of recipes
 * @returns {Array} Stats data with labels, values and icons
 */
export const getStatsData = (recipeCount) => [
  {
    label: 'Συνταγές Κοκτέιλ',
    value: recipeCount,
    color: '#3498db',
    icon: <FaGlassMartini />
  },
  {
    label: 'Ποτά',
    value: 12, // This would normally come from a real data source
    color: '#9b59b6',
    icon: <FaWineBottle />
  },
  {
    label: 'Υλικά που λείπουν',
    value: 2, // This would normally come from a real data source
    color: '#e74c3c',
    icon: <FaExclamationTriangle />
  }
]; 