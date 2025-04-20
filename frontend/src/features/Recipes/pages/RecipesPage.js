import React, { useState } from 'react';
import RecipeList from '../components/Recipe/RecipeList';
import RecipeForm from '../components/Recipe/RecipeForm';

/**
 * Main Recipes page component
 * Serves as the entry point for the Recipes feature
 */
const RecipesPage = () => {
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setEditingRecipe(null);
    setShowForm(false);
  };

  return (
    <div className="recipes-container">
      {showForm ? (
        <RecipeForm 
          recipeId={editingRecipe?.id} 
          onFinish={handleFormClose} 
        />
      ) : (
        <RecipeList onEdit={handleEditRecipe} />
      )}
    </div>
  );
};

export default RecipesPage; 