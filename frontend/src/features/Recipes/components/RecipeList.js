import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { recipeService } from '../../../common/services';
import Button from '../common/Button/Button';
import styles from './Recipes.module.css';
import { FaPlus, FaEdit, FaTrash, FaCalculator } from 'react-icons/fa';
import { standardToastConfig } from '../../utils/toastConfig';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all recipes
  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const data = await recipeService.getRecipes();
      setRecipes(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
      setError('Failed to load recipes. Please try again later.');
      toast.error('Failed to load recipes', standardToastConfig);
    } finally {
      setLoading(false);
    }
  };

  // Load recipes on component mount
  useEffect(() => {
    fetchRecipes();
  }, []);

  // Handle recipe deletion
  const handleDeleteRecipe = async (recipeId, recipeName) => {
    if (window.confirm(`Are you sure you want to delete recipe "${recipeName}"?`)) {
      try {
        await recipeService.deleteRecipe(recipeId);
        toast.success(`Recipe "${recipeName}" deleted successfully`, standardToastConfig);
        fetchRecipes(); // Refresh the list
      } catch (err) {
        console.error('Failed to delete recipe:', err);
        toast.error(`Failed to delete recipe: ${err.message}`, standardToastConfig);
      }
    }
  };

  // Calculate recipe cost
  const handleCalculateCost = async (recipeId, recipeName) => {
    try {
      const costData = await recipeService.calculateRecipeCost(recipeId);
      
      toast.info(
        <div>
          <h4>Recipe Cost Calculation</h4>
          <p><strong>{recipeName}</strong>: {costData.total_cost.toFixed(2)} €</p>
          <p>This recipe contains {costData.ingredients.length} ingredients.</p>
        </div>,
        {
          ...standardToastConfig,
          autoClose: 5000,
        }
      );
    } catch (err) {
      console.error('Failed to calculate recipe cost:', err);
      toast.error(`Failed to calculate cost: ${err.message}`, standardToastConfig);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading recipes...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.recipesContainer}>
      <div className={styles.header}>
        <h1>Recipes</h1>
        <Link to="/recipes/new">
          <Button variant="primary">
            <FaPlus /> New Recipe
          </Button>
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No recipes found. Click the "New Recipe" button to create one.</p>
        </div>
      ) : (
        <div className={styles.recipeGrid}>
          {recipes.map((recipe) => (
            <div key={recipe.recipe_id} className={styles.recipeCard}>
              <h3>{recipe.name}</h3>
              
              <div className={styles.recipeCardActions}>
                <Button 
                  variant="secondary" 
                  onClick={() => handleCalculateCost(recipe.recipe_id, recipe.name)}
                >
                  <FaCalculator /> Calculate Cost
                </Button>
                
                <Link to={`/recipes/${recipe.recipe_id}`}>
                  <Button variant="info">
                    View Details
                  </Button>
                </Link>
                
                <Link to={`/recipes/${recipe.recipe_id}/edit`}>
                  <Button variant="primary">
                    <FaEdit /> Edit
                  </Button>
                </Link>
                
                <Button 
                  variant="danger"
                  onClick={() => handleDeleteRecipe(recipe.recipe_id, recipe.name)}
                >
                  <FaTrash /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeList; 