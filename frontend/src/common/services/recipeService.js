import axios from 'axios';
import { API_URL } from '../../config';

// Recipe service for managing recipes
const recipeService = {
  // Get all recipes
  getAllRecipes: async () => {
    try {
      const response = await axios.get(`${API_URL}/recipes`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  },

  /**
   * Get a recipe by ID with ingredients and cost calculation
   * @param {number} recipeId - Recipe ID
   * @returns {Promise} Promise with recipe data including ingredients and costs
   */
  getRecipeById: (recipeId) => {
    return axios.get(`${API_URL}/recipes/${recipeId}`)
      .then(response => response.data)
      .catch(error => {
        console.error(`Error fetching recipe ${recipeId}:`, error);
        throw error;
      });
  },

  /**
   * Calculate the cost of a recipe
   * @param {number} recipeId - Recipe ID
   * @returns {Promise} Promise with recipe cost data
   */
  calculateRecipeCost: (recipeId) => {
    return axios.get(`${API_URL}/recipes/${recipeId}/cost`)
      .then(response => response.data)
      .catch(error => {
        console.error(`Error calculating recipe cost for ${recipeId}:`, error);
        throw error;
      });
  },

  /**
   * Create a new recipe
   * @param {Object} recipeData - Recipe data with name and ingredients
   * @returns {Promise} Promise with created recipe data
   */
  createRecipe: (recipeData) => {
    return axios.post(`${API_URL}/recipes`, recipeData)
      .then(response => response.data)
      .catch(error => {
        console.error('Error creating recipe:', error);
        throw error;
      });
  },

  /**
   * Update an existing recipe
   * @param {number} recipeId - Recipe ID
   * @param {Object} recipeData - Updated recipe data with name and ingredients
   * @returns {Promise} Promise with updated recipe data
   */
  updateRecipe: (recipeId, recipeData) => {
    return axios.put(`${API_URL}/recipes/${recipeId}`, recipeData)
      .then(response => response.data)
      .catch(error => {
        console.error(`Error updating recipe ${recipeId}:`, error);
        throw error;
      });
  },

  /**
   * Delete a recipe by ID
   * @param {number} recipeId - Recipe ID
   * @returns {Promise} Promise with deletion confirmation
   */
  deleteRecipe: (recipeId) => {
    return axios.delete(`${API_URL}/recipes/${recipeId}`)
      .then(response => response.data)
      .catch(error => {
        console.error(`Error deleting recipe ${recipeId}:`, error);
        throw error;
      });
  }
};

export default recipeService; 