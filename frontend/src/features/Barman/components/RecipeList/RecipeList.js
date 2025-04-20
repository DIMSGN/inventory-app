/**
 * Recipe list component
 * @module components/RecipeList
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import RecipeCard from '../RecipeCard/RecipeCard';
import styles from './RecipeList.module.css';

/**
 * RecipeList component for displaying a grid of recipes or empty state
 * 
 * @param {Object} props - Component props
 * @param {Array} props.recipes - Array of recipe objects
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.activeTab - Currently active tab
 * @returns {JSX.Element} RecipeList component
 */
const RecipeList = ({ recipes, isLoading, activeTab }) => {
  if (isLoading) {
    return <div className={styles.loading}>Φόρτωση συνταγών...</div>;
  }
  
  if (recipes.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Δεν βρέθηκαν συνταγές. Δημιουργήστε την πρώτη σας συνταγή!</p>
        <Link 
          to={`/recipes/new?type=${activeTab}`} 
          className={styles.createRecipeButton}
        >
          <FaPlus /> Νέα Συνταγή
        </Link>
      </div>
    );
  }
  
  return (
    <div className={styles.recipeGrid}>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.recipe_id} recipe={recipe} />
      ))}
    </div>
  );
};

export default RecipeList; 