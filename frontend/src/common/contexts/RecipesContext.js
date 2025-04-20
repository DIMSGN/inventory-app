import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

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
      const endpoint = type ? `/api/recipes/${type}` : '/api/recipes';
      const response = await axios.get(endpoint);
      setRecipes(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch recipes');
      toast.error(`Error fetching recipes: ${err.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecipeById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/recipes/${id}`);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch recipe');
      toast.error(`Error fetching recipe: ${err.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addRecipe = useCallback(async (recipeData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/recipes', recipeData);
      setRecipes(prev => [...prev, response.data]);
      toast.success('Recipe added successfully');
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to add recipe');
      toast.error(`Error adding recipe: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRecipe = useCallback(async (id, recipeData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/recipes/${id}`, recipeData);
      setRecipes(prev => 
        prev.map(recipe => recipe.id === id ? response.data : recipe)
      );
      toast.success('Recipe updated successfully');
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to update recipe');
      toast.error(`Error updating recipe: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRecipe = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/recipes/${id}`);
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
      toast.success('Recipe deleted successfully');
    } catch (err) {
      setError(err.message || 'Failed to delete recipe');
      toast.error(`Error deleting recipe: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const value = {
    recipes,
    recipeTypes,
    loading,
    error,
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