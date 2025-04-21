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
  const { recipes = [] } = useAppContext();
  const [barRecipes, setBarRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLoading, setIsLoading] = useState(true);

  // Load recipes
  useEffect(() => {
    setBarRecipes(Array.isArray(recipes) ? recipes : []);
    setIsLoading(false);
  }, [recipes]);

  // Filter recipes based on search query - ensure barRecipes is an array before filtering
  const filteredRecipes = Array.isArray(barRecipes) 
    ? barRecipes.filter(recipe => 
        recipe && recipe.name && recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

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