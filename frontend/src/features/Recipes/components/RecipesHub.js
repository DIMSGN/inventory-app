import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUtensils, FaGlassMartini, FaPlus } from 'react-icons/fa';
import styles from './RecipesHub.module.css';
import { useAppContext } from '../../../common/contexts/AppContext';

const RecipesHub = () => {
  const { recipes = [] } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Sort recipes by type
  const [foodRecipes, setFoodRecipes] = useState([]);
  const [drinkRecipes, setDrinkRecipes] = useState([]);
  
  useEffect(() => {
    // In a real app, you would have a type property in each recipe
    // Here we're simulating it by splitting the recipes
    const foodItems = recipes.slice(0, Math.ceil(recipes.length / 2));
    const drinkItems = recipes.slice(Math.ceil(recipes.length / 2));
    
    setFoodRecipes(foodItems);
    setDrinkRecipes(drinkItems);
    setIsLoading(false);
  }, [recipes]);
  
  // Filter recipes based on search query
  const filteredFoodRecipes = foodRecipes.filter(recipe => 
    recipe.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredDrinkRecipes = drinkRecipes.filter(recipe => 
    recipe.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className={styles.hubContainer}>
      <header className={styles.hubHeader}>
        <h1>Recipe Hub</h1>
        <div className={styles.searchBar}>
          <FaSearch />
          <input
            type="text"
            placeholder="Search all recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>
      
      <div className={styles.hubContent}>
        {/* Food Recipes Column */}
        <div className={styles.recipeColumn}>
          <div className={styles.columnHeader}>
            <div className={styles.titleWrapper}>
              <FaUtensils className={styles.columnIcon} />
              <h2>Food Recipes</h2>
            </div>
            <Link to="/chef-dashboard" className={styles.viewAllLink}>
              View Chef Dashboard
            </Link>
          </div>
          
          {isLoading ? (
            <div className={styles.loading}>Loading recipes...</div>
          ) : filteredFoodRecipes.length > 0 ? (
            <div className={styles.recipeList}>
              {filteredFoodRecipes.map((recipe) => (
                <div key={recipe.recipe_id} className={styles.recipeCard}>
                  <h3>{recipe.name}</h3>
                  <div className={styles.recipeInfo}>
                    <span className={styles.recipeCost}>
                      Cost: ${(recipe.total_cost || 0).toFixed(2)}
                    </span>
                    <span className={styles.ingredientCount}>
                      {recipe.ingredients?.length || 0} ingredients
                    </span>
                  </div>
                  <div className={styles.recipeActions}>
                    <Link to={`/recipes/${recipe.recipe_id}`}>
                      View
                    </Link>
                  </div>
                </div>
              ))}
              
              <Link to="/recipes/new?type=food" className={styles.addRecipeButton}>
                <FaPlus /> Add Food Recipe
              </Link>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No food recipes found</p>
              <Link to="/recipes/new?type=food" className={styles.addRecipeButton}>
                <FaPlus /> Add First Food Recipe
              </Link>
            </div>
          )}
        </div>
        
        {/* Drink Recipes Column */}
        <div className={styles.recipeColumn}>
          <div className={styles.columnHeader}>
            <div className={styles.titleWrapper}>
              <FaGlassMartini className={styles.columnIcon} />
              <h2>Drink Recipes</h2>
            </div>
            <Link to="/barman-dashboard" className={styles.viewAllLink}>
              View Barman Dashboard
            </Link>
          </div>
          
          {isLoading ? (
            <div className={styles.loading}>Loading recipes...</div>
          ) : filteredDrinkRecipes.length > 0 ? (
            <div className={styles.recipeList}>
              {filteredDrinkRecipes.map((recipe) => (
                <div key={recipe.recipe_id} className={styles.recipeCard}>
                  <h3>{recipe.name}</h3>
                  <div className={styles.recipeInfo}>
                    <span className={styles.recipeCost}>
                      Cost: ${(recipe.total_cost || 0).toFixed(2)}
                    </span>
                    <span className={styles.ingredientCount}>
                      {recipe.ingredients?.length || 0} ingredients
                    </span>
                  </div>
                  <div className={styles.recipeActions}>
                    <Link to={`/recipes/${recipe.recipe_id}`}>
                      View
                    </Link>
                  </div>
                </div>
              ))}
              
              <Link to="/recipes/new?type=drink" className={styles.addRecipeButton}>
                <FaPlus /> Add Drink Recipe
              </Link>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No drink recipes found</p>
              <Link to="/recipes/new?type=drink" className={styles.addRecipeButton}>
                <FaPlus /> Add First Drink Recipe
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipesHub; 