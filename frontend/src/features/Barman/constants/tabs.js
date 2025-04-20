/**
 * Constants for bar recipe types
 * @module constants/tabs
 */

import { FaGlassMartini, FaWineBottle, FaCoffee } from 'react-icons/fa';

/**
 * Tab identifiers for different types of recipes
 */
export const TABS = {
  COCKTAILS: 'cocktails',
  DRINKS: 'drinks',
  COFFEES: 'coffees'
};

/**
 * Returns the icon component for a specific tab
 * @param {string} tab - The tab identifier
 * @returns {JSX.Element} Icon component
 */
export const getTabIcon = (tab) => {
  switch(tab) {
    case TABS.COCKTAILS:
      return <FaGlassMartini />;
    case TABS.DRINKS:
      return <FaWineBottle />;
    case TABS.COFFEES:
      return <FaCoffee />;
    default:
      return <FaGlassMartini />;
  }
};

/**
 * Returns the title for a specific tab
 * @param {string} tab - The tab identifier
 * @returns {string} Tab title
 */
export const getTabTitle = (tab) => {
  switch(tab) {
    case TABS.COCKTAILS:
      return 'Κοκτέιλ';
    case TABS.DRINKS:
      return 'Ποτά';
    case TABS.COFFEES:
      return 'Καφέδες & Ροφήματα';
    default:
      return 'Κοκτέιλ';
  }
}; 