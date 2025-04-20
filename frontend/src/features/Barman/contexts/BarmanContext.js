/**
 * Context for barman-specific state
 * @module contexts/BarmanContext
 */

import React, { createContext, useContext, useState } from 'react';
import { TABS } from '../constants/tabs';

// Create context
const BarmanContext = createContext();

/**
 * Hook to use the barman context
 * @returns {Object} Barman context value
 */
export const useBarmanContext = () => {
  const context = useContext(BarmanContext);
  if (!context) {
    throw new Error('useBarmanContext must be used within a BarmanProvider');
  }
  return context;
};

/**
 * Provider component for barman state
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Context provider
 */
export const BarmanProvider = ({ children }) => {
  // State for barman dashboard
  const [preferredTab, setPreferredTab] = useState(TABS.COCKTAILS);
  const [recentRecipes, setRecentRecipes] = useState([]);
  
  // Memoized context value
  const value = {
    preferredTab,
    setPreferredTab,
    recentRecipes,
    setRecentRecipes,
    
    // Methods
    addRecentRecipe: (recipe) => {
      setRecentRecipes(prev => {
        // Filter out duplicates
        const filtered = prev.filter(r => r.recipe_id !== recipe.recipe_id);
        // Add to beginning, limit to 5 items
        return [recipe, ...filtered].slice(0, 5);
      });
    }
  };
  
  return (
    <BarmanContext.Provider value={value}>
      {children}
    </BarmanContext.Provider>
  );
}; 