/**
 * Custom hook for managing food recipes data
 * @module hooks/useFoodRecipes
 */

import { useState, useEffect } from 'react';
import { useAppContext } from '../../../common/contexts/AppContext';

/**
 * Hook for loading and filtering food recipes
 * 
 * @param {Object} options - Hook options
 * @param {string} [options.initialCategory] - Initial category filter
 * @returns {Object} Recipe data and state management functions
 */
const useFoodRecipes = ({ initialCategory } = {}) => {
  // Use empty array as default value to avoid filter errors
  const { recipes = [] } = useAppContext() || {};
  const [foodRecipes, setFoodRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [isLoading, setIsLoading] = useState(true);

  // Load recipes
  useEffect(() => {
    // In a real app, we would filter by type="food"
    setFoodRecipes(Array.isArray(recipes) ? recipes : []);
    setIsLoading(false);
  }, [recipes]);

  // Initialize a safe default first
  let filteredRecipes = [];
  
  // Then try to filter if foodRecipes is an array
  try {
    if (Array.isArray(foodRecipes)) {
      filteredRecipes = foodRecipes.filter(recipe => 
        recipe && recipe.name && typeof recipe.name.toLowerCase === 'function' && 
        recipe.name.toLowerCase().includes((searchQuery || '').toLowerCase())
      );
    }
  } catch (error) {
    console.error("Error filtering recipes:", error);
    // Keep the default empty array if there's an error
  }

  return {
    foodRecipes,
    filteredRecipes,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    isLoading
  };
};

export default useFoodRecipes; 