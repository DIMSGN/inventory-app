/**
 * Custom hook for managing bar recipes data
 * @module hooks/useBarRecipes
 */

import { useState, useEffect } from 'react';
import { useAppContext } from '../../../common/contexts/AppContext';

/**
 * Hook for loading and filtering bar recipes
 * 
 * @param {Object} options - Hook options
 * @param {string} options.initialTab - Initial active tab
 * @returns {Object} Recipe data and state management functions
 */
const useBarRecipes = ({ initialTab }) => {
  // Use empty array as default value to avoid filter errors
  const { recipes = [] } = useAppContext() || {};
  const [barRecipes, setBarRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLoading, setIsLoading] = useState(true);

  // Load recipes
  useEffect(() => {
    setBarRecipes(Array.isArray(recipes) ? recipes : []);
    setIsLoading(false);
  }, [recipes]);

  // Initialize a safe default first
  let filteredRecipes = [];
  
  // Then try to filter if barRecipes is an array
  try {
    if (Array.isArray(barRecipes)) {
      filteredRecipes = barRecipes.filter(recipe => 
        recipe && 
        recipe.name && 
        typeof recipe.name.toLowerCase === 'function' && 
        recipe.name.toLowerCase().includes((searchQuery || '').toLowerCase())
      );
    }
  } catch (error) {
    console.error("Error filtering recipes:", error);
    // Keep the default empty array if there's an error
  }

  return {
    barRecipes,
    filteredRecipes,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    isLoading
  };
};

export default useBarRecipes; 