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
  const { recipes = [] } = useAppContext();
  const [foodRecipes, setFoodRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [isLoading, setIsLoading] = useState(true);

  // Load recipes
  useEffect(() => {
    // In a real app, we would filter by type="food"
    setFoodRecipes(recipes);
    setIsLoading(false);
  }, [recipes]);

  // Filter recipes based on search query and category
  const filteredRecipes = foodRecipes.filter(recipe => 
    recipe.name?.toLowerCase().includes(searchQuery.toLowerCase())
    // We would also filter by category if activeCategory is set
    // && (!activeCategory || recipe.category === activeCategory)
  );

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