/**
 * Recipe card component
 * @module components/RecipeCard
 */

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './RecipeCard.module.css';

/**
 * RecipeCard component for displaying individual recipe information
 * 
 * @param {Object} props - Component props
 * @param {Object} props.recipe - Recipe data
 * @param {string} props.recipe.recipe_id - Unique identifier for the recipe
 * @param {string} props.recipe.name - Recipe name
 * @param {number} props.recipe.total_cost - Total cost of the recipe
 * @param {Array} props.recipe.ingredients - Array of ingredients
 * @returns {JSX.Element} RecipeCard component
 */
const RecipeCard = ({ recipe }) => {
  return (
    <div className={styles.recipeCard}>
      <h3 className={styles.recipeName}>{recipe.name}</h3>
      
      <div className={styles.recipeInfo}>
        <span className={styles.recipeCost}>
          Κόστος: {(recipe.total_cost || 0).toFixed(2)}€
        </span>
        <span className={styles.ingredientCount}>
          {recipe.ingredients?.length || 0} υλικά
        </span>
      </div>
      
      <div className={styles.recipeActions}>
        <Link to={`/recipes/${recipe.recipe_id}`} className={styles.viewButton}>
          Προβολή
        </Link>
        <Link to={`/recipes/${recipe.recipe_id}/edit`} className={styles.editButton}>
          Επεξεργασία
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard; 