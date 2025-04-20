/**
 * Recipe card component for food recipes
 * @module components/RecipeCard
 */

import React from 'react';
import { Button } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import styles from './RecipeCard.module.css';

/**
 * RecipeCard component for displaying individual food recipe information
 * 
 * @param {Object} props - Component props
 * @param {Object} props.recipe - Recipe data
 * @param {string} props.recipe.recipe_id - Unique identifier for the recipe
 * @param {string} props.recipe.name - Recipe name
 * @param {number} props.recipe.total_cost - Total cost of the recipe
 * @param {Array} props.recipe.ingredients - Array of ingredients
 * @param {Function} props.onEdit - Edit handler function
 * @returns {JSX.Element} RecipeCard component
 */
const RecipeCard = ({ recipe, onEdit }) => {
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
        <Button 
          type="default" 
          icon={<EyeOutlined />}
          className={styles.viewButton}
        >
          Προβολή
        </Button>
        <Button 
          type="primary" 
          icon={<EditOutlined />} 
          onClick={onEdit}
          className={styles.editButton}
        >
          Επεξεργασία
        </Button>
      </div>
    </div>
  );
};

export default RecipeCard; 