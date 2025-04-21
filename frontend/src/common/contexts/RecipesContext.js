import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { API_URL, STORAGE_KEYS } from '../config';
import { recipeService, toastService } from '../services';

const { showSuccess, showError } = toastService;

const RecipesContext = createContext();

export const useRecipes = () => useContext(RecipesContext);

export const RecipesProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [recipeTypes, setRecipeTypes] = useState(['food', 'coffee', 'cocktail']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecipes = useCallback(async (type = null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await recipeService.getAllRecipes(type);
      setRecipes(data);
      localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(data));
      return data;
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError(err.message || 'Failed to fetch recipes');
      showError(`Error fetching recipes: ${err.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecipeById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await recipeService.getRecipeById(id);
      return data;
    } catch (err) {
      console.error('Error fetching recipe:', err);
      setError(err.message || 'Failed to fetch recipe');
      showError(`Error fetching recipe: ${err.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addRecipe = useCallback(async (recipeData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await recipeService.createRecipe(recipeData);
      setRecipes(prev => [...prev, result]);
      showSuccess('Recipe added successfully');
      return result;
    } catch (err) {
      console.error('Error adding recipe:', err);
      setError(err.message || 'Failed to add recipe');
      showError(`Error adding recipe: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRecipe = useCallback(async (id, recipeData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await recipeService.updateRecipe(id, recipeData);
      setRecipes(prev => 
        prev.map(recipe => recipe.id === id ? result : recipe)
      );
      showSuccess('Recipe updated successfully');
      return result;
    } catch (err) {
      console.error('Error updating recipe:', err);
      setError(err.message || 'Failed to update recipe');
      showError(`Error updating recipe: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRecipe = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await recipeService.deleteRecipe(id);
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
      showSuccess('Recipe deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting recipe:', err);
      setError(err.message || 'Failed to delete recipe');
      showError(`Error deleting recipe: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Try to use cached data first for faster initial render
        const cachedRecipes = localStorage.getItem(STORAGE_KEYS.RECIPES);
        if (cachedRecipes) {
          setRecipes(JSON.parse(cachedRecipes));
          console.log("Using cached recipes");
        }
      } catch (err) {
        console.error("Error loading cached recipes:", err);
      }
      
      // Then fetch fresh data
      await fetchRecipes();
    };
    
    loadInitialData();
  }, [fetchRecipes]);

  const value = {
    // State
    recipes,
    recipeTypes,
    loading,
    error,
    
    // Operations
    fetchRecipes,
    getRecipeById,
    addRecipe,
    updateRecipe,
    deleteRecipe
  };

  return (
    <RecipesContext.Provider value={value}>
      {children}
    </RecipesContext.Provider>
  );
};

export default RecipesContext; 