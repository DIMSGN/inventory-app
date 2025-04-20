/**
 * Constants for dashboard elements and types
 * @module constants/dashboardTypes
 */

import { 
  FaChartLine, 
  FaShoppingCart, 
  FaUserFriends, 
  FaCalendarAlt,
  FaCubes
} from 'react-icons/fa';

/**
 * Dashboard widget types
 */
export const WIDGET_TYPES = {
  STATS: 'stats',
  CHART: 'chart',
  TABLE: 'table',
  ACTION: 'action'
};

/**
 * Dashboard card sizes
 */
export const CARD_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  FULL: 'full-width'
};

/**
 * Returns the icon component for a specific stat type
 * @param {string} type - The stat type
 * @returns {JSX.Element} Icon component
 */
export const getStatIcon = (type) => {
  switch(type) {
    case 'sales':
      return <FaShoppingCart />;
    case 'users':
      return <FaUserFriends />;
    case 'events':
      return <FaCalendarAlt />;
    case 'inventory':
      return <FaCubes />;
    default:
      return <FaChartLine />;
  }
}; 