import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RecipeList from './RecipeList';
import RecipeDetail from './RecipeDetail';
import RecipeForm from './RecipeForm';
import RecipesHub from './RecipesHub';

const Recipes = () => {
  return (
    <Routes>
      <Route path="/" element={<RecipesHub />} />
      <Route path="/list" element={<RecipeList />} />
      <Route path="/new" element={<RecipeForm />} />
      <Route path="/:recipeId" element={<RecipeDetail />} />
      <Route path="/:recipeId/edit" element={<RecipeForm />} />
      <Route path="*" element={<Navigate to="/recipes" replace />} />
    </Routes>
  );
};

export default Recipes; 