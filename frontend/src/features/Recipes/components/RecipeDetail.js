import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';
import { recipeService } from '../../../common/services';
import Button from '../common/Button/Button';
import styles from './Recipes.module.css';
import { standardToastConfig } from '../../utils/toastConfig';

const RecipeDetail = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      setLoading(true);
      try {
        const data = await recipeService.getRecipeById(recipeId);
        setRecipe(data.recipe);
        setIngredients(data.ingredients);
        setTotalCost(data.total_cost);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch recipe details:', err);
        setError('Failed to load recipe details. The recipe may not exist.');
        toast.error('Failed to load recipe details', standardToastConfig);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [recipeId]);

  const handleDelete = async () => {
    if (!recipe) return;
    
    if (window.confirm(`Are you sure you want to delete recipe "${recipe.name}"?`)) {
      try {
        await recipeService.deleteRecipe(recipeId);
        toast.success(`Recipe "${recipe.name}" deleted successfully`, standardToastConfig);
        navigate('/recipes');
      } catch (err) {
        console.error('Failed to delete recipe:', err);
        toast.error(`Failed to delete recipe: ${err.message}`, standardToastConfig);
      }
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading recipe details...</div>;
  }

  if (error || !recipe) {
    return (
      <div>
        <Link to="/recipes" className={styles.backButton}>
          <FaArrowLeft /> Back to recipes
        </Link>
        <div className={styles.error}>{error || 'Recipe not found'}</div>
      </div>
    );
  }

  return (
    <div className={styles.recipesContainer}>
      <Link to="/recipes" className={styles.backButton}>
        <FaArrowLeft /> Back to recipes
      </Link>
      
      <div className={styles.recipeDetail}>
        <div className={styles.recipeHeader}>
          <h2>{recipe.name}</h2>
          
          <div className={styles.actionButtons}>
            <Link to={`/recipes/${recipeId}/edit`}>
              <Button variant="primary">
                <FaEdit /> Edit
              </Button>
            </Link>
            
            <Button 
              variant="danger" 
              onClick={handleDelete}
            >
              <FaTrash /> Delete
            </Button>
          </div>
        </div>
        
        <div className={styles.recipeCost}>
          <h3>Recipe Cost</h3>
          <p>Total cost: <strong>{totalCost.toFixed(2)} €</strong></p>
        </div>
        
        <h3>Ingredients</h3>
        {ingredients.length === 0 ? (
          <p>No ingredients found for this recipe.</p>
        ) : (
          <table className={styles.ingredientsTable}>
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Amount</th>
                <th>Unit</th>
                <th>Cost</th>
                <th>Cost Calculation</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ingredient) => (
                <tr key={ingredient.ingredient_id}>
                  <td>{ingredient.product_name}</td>
                  <td>{ingredient.ingredient_amount}</td>
                  <td>{ingredient.unit_name}</td>
                  <td>{ingredient.ingredient_cost.toFixed(2)} €</td>
                  <td>
                    {ingredient.ingredient_amount} {ingredient.unit_name} × 
                    {ingredient.cost_per_unit.toFixed(4)} €/{ingredient.unit_name}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="3"><strong>Total Cost</strong></td>
                <td><strong>{totalCost.toFixed(2)} €</strong></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail; 