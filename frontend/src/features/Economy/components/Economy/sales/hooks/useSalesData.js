import { useState, useEffect } from 'react';
import { productService, recipeService } from '../../../../../../common/services';

/**
 * Custom hook for fetching and organizing sales data
 * @returns {Object} Sales data and loading state
 */
const useSalesData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Data state
  const [foodRecipes, setFoodRecipes] = useState([]);
  const [coffeeRecipes, setCoffeeRecipes] = useState([]);
  const [cocktailRecipes, setCocktailRecipes] = useState([]);
  const [drinks, setDrinks] = useState([]);
  
  // Fetch data on hook initialization
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch recipes for each category
        const recipes = await recipeService.getRecipes();
        
        // Simple categorization - in a real app, this would be more sophisticated
        setFoodRecipes(recipes.filter(r => r.name.toLowerCase().includes('food')));
        setCoffeeRecipes(recipes.filter(r => 
          r.name.toLowerCase().includes('coffee') || 
          r.name.toLowerCase().includes('tea')
        ));
        setCocktailRecipes(recipes.filter(r => 
          r.name.toLowerCase().includes('cocktail') || 
          r.name.toLowerCase().includes('drink')
        ));
        
        // Fetch drink products (direct sales)
        const productsRes = await productService.getProducts();
        const products = productsRes.data || [];
        
        // Filter for drink products (those in drink categories)
        setDrinks(products.filter(p => 
          p.category_name && (
            p.category_name.toLowerCase().includes('beer') ||
            p.category_name.toLowerCase().includes('wine') ||
            p.category_name.toLowerCase().includes('spirit') ||
            p.category_name.toLowerCase().includes('beverage')
          )
        ));
      } catch (err) {
        console.error("Error fetching data for sales recording:", err);
        setError("Failed to load necessary data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return {
    isLoading,
    error,
    foodRecipes,
    coffeeRecipes,
    cocktailRecipes,
    drinks
  };
};

export default useSalesData; 