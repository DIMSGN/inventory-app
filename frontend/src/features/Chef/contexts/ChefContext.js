/**
 * Context for chef-specific state
 * @module contexts/ChefContext
 */

import React, { createContext, useContext, useState } from 'react';
import { FOOD_CATEGORIES } from '../constants/foodTypes';

// Create context
const ChefContext = createContext();

/**
 * Hook to use the chef context
 * @returns {Object} Chef context value
 */
export const useChefContext = () => {
  const context = useContext(ChefContext);
  if (!context) {
    throw new Error('useChefContext must be used within a ChefProvider');
  }
  return context;
};

/**
 * Provider component for chef state
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Context provider
 */
export const ChefProvider = ({ children }) => {
  // State for chef dashboard
  const [preferredCategory, setPreferredCategory] = useState(FOOD_CATEGORIES.MAIN);
  const [topRecipes, setTopRecipes] = useState([]);
  
  // Context value
  const value = {
    preferredCategory,
    setPreferredCategory,
    topRecipes,
    setTopRecipes,
    
    // Helper methods
    getTopRecipeName: () => topRecipes.length > 0 ? topRecipes[0].name : 'Καμία'
  };
  
  return (
    <ChefContext.Provider value={value}>
      {children}
    </ChefContext.Provider>
  );
}; 