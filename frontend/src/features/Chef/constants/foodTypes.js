/**
 * Constants for food recipe types
 * @module constants/foodTypes
 */

import { FaUtensils, FaPizzaSlice, FaCarrot, FaCookieBite } from 'react-icons/fa';

/**
 * Food category identifiers
 */
export const FOOD_CATEGORIES = {
  MAIN: 'main',
  APPETIZER: 'appetizer',
  DESSERT: 'dessert',
  VEGETARIAN: 'vegetarian'
};

/**
 * Returns the icon component for a specific food category
 * @param {string} category - The food category
 * @returns {JSX.Element} Icon component
 */
export const getCategoryIcon = (category) => {
  switch(category) {
    case FOOD_CATEGORIES.MAIN:
      return <FaUtensils />;
    case FOOD_CATEGORIES.APPETIZER:
      return <FaPizzaSlice />;
    case FOOD_CATEGORIES.DESSERT:
      return <FaCookieBite />;
    case FOOD_CATEGORIES.VEGETARIAN:
      return <FaCarrot />;
    default:
      return <FaUtensils />;
  }
};

/**
 * Returns the title for a specific food category
 * @param {string} category - The food category
 * @returns {string} Category title
 */
export const getCategoryTitle = (category) => {
  switch(category) {
    case FOOD_CATEGORIES.MAIN:
      return 'Κυρίως Πιάτα';
    case FOOD_CATEGORIES.APPETIZER:
      return 'Ορεκτικά';
    case FOOD_CATEGORIES.DESSERT:
      return 'Επιδόρπια';
    case FOOD_CATEGORIES.VEGETARIAN:
      return 'Χορτοφαγικά';
    default:
      return 'Κυρίως Πιάτα';
  }
}; 