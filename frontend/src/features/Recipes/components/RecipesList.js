import React, { useState, useEffect } from 'react';
import { recipeService } from '../../../common/services';
import { formatCurrency } from '../../utils/unitConversion';
import styles from './Recipes.module.css';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const RecipesList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const data = await recipeService.getAllRecipes();
        setRecipes(data);
        setError(null);
      } catch (err) {
        setError('Failed to load recipes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleDeleteRecipe = async (id) => {
    // We'll implement this later
    console.log('Delete recipe:', id);
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
        <h2>Recipes</h2>
        <Link to="/recipes/create" className={styles.addButton}>
          <FaPlus /> Add Recipe
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No recipes found. Create your first recipe to get started.</p>
          <Link to="/recipes/create" className={styles.addButtonLarge}>
            <FaPlus /> Create Recipe
          </Link>
        </div>
      ) : (
        <div className={styles.recipesList}>
          <div className={styles.tableHeader}>
            <div className={styles.nameCol}>Name</div>
            <div className={styles.costCol}>Cost</div>
            <div className={styles.actionsCol}>Actions</div>
          </div>
          
          {recipes.map(recipe => (
            <div key={recipe.recipe_id} className={styles.recipeItem}>
              <div className={styles.nameCol}>
                <Link to={`/recipes/${recipe.recipe_id}`}>
                  {recipe.name}
                </Link>
              </div>
              <div className={styles.costCol}>
                {formatCurrency(recipe.total_cost)}
              </div>
              <div className={styles.actionsCol}>
                <Link 
                  to={`/recipes/${recipe.recipe_id}/edit`} 
                  className={styles.actionButton}
                  title="Edit Recipe"
                >
                  <FaEdit />
                </Link>
                <button
                  className={styles.actionButton}
                  onClick={() => handleDeleteRecipe(recipe.recipe_id)}
                  title="Delete Recipe"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipesList; 