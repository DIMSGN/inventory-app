/**
 * Recipe list component for food recipes
 * @module components/RecipeList
 */

import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import RecipeCard from '../RecipeCard/RecipeCard';
import styles from './RecipeList.module.css';

/**
 * RecipeList component for displaying a grid of food recipes or empty state
 * 
 * @param {Object} props - Component props
 * @param {Array} props.recipes - Array of recipe objects
 * @param {boolean} props.isLoading - Loading state
 * @param {Function} props.onEditRecipe - Function to handle recipe editing
 * @returns {JSX.Element} RecipeList component
 */
const RecipeList = ({ recipes, isLoading, onEditRecipe }) => {
  if (isLoading) {
    return <div className={styles.loading}>Φόρτωση συνταγών...</div>;
  }
  
  if (recipes.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Δεν βρέθηκαν συνταγές. Δημιουργήστε την πρώτη σας συνταγή!</p>
        <Button 
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => onEditRecipe && onEditRecipe(null)}
        >
          Νέα Συνταγή
        </Button>
      </div>
    );
  }
  
  return (
    <div className={styles.recipeGrid}>
      {recipes.map((recipe) => (
        <RecipeCard 
          key={recipe.recipe_id} 
          recipe={recipe} 
          onEdit={() => onEditRecipe && onEditRecipe(recipe)}
        />
      ))}
    </div>
  );
};

export default RecipeList; 