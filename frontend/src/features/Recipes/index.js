// Recipes feature exports
import Recipe from './components/Recipe/Recipe';
import RecipeForm from './components/Recipe/RecipeForm';
import RecipeList from './components/Recipe/RecipeList';

// Services (imported from common/services)
import { recipeService } from '../../common/services';

// Export all Recipe components and services
export {
  // Components
  Recipe,
  RecipeForm,
  RecipeList,
  
  // Services
  recipeService
}; 

// Default export for the Recipes feature
// Using Recipe component as default export
export default Recipe; 