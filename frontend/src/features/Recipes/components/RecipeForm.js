import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaArrowLeft, FaCalculator, FaUtensils, FaGlassMartini, FaCoffee, FaMinus, FaEuroSign } from 'react-icons/fa';
import { useAppContext } from '../../../common/contexts/AppContext';
import Button from '../common/Button/Button';
import styles from './Recipes.module.css';
import { standardToastConfig } from '../../utils/toastConfig';
import { calculateIngredientCost, formatCurrency } from '../../utils/unitConversion';

const RECIPE_TYPES = {
  FOOD: 'food',
  COFFEE: 'coffee',
  COCKTAIL: 'cocktail'
};

const RecipeForm = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const { products = [], units = [], addRecipe, updateRecipe, getRecipe } = useAppContext();
  
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [recipe, setRecipe] = useState({
    name: '',
    type: RECIPE_TYPES.FOOD,
    description: '',
    instructions: '',
    sale_price: 0,
    ingredients: []
  });
  const [totalCost, setTotalCost] = useState(0);
  const [profit, setProfit] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0);
  
  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        if (recipeId) {
          setIsEdit(true);
          const recipeData = await getRecipe(recipeId);
          if (recipeData) {
            // Ensure ingredients have cost information
            const ingredientsWithCost = recipeData.ingredients.map(ingredient => {
              const productData = products.find(p => p.product_id === ingredient.product_id) || {};
              return {
                ...ingredient,
                cost: calculateIngredientCost(ingredient, productData)
              };
            });
            
            setRecipe({
              ...recipeData.recipe,
              ingredients: ingredientsWithCost
            });
            
            // Calculate initial total cost
            const initialCost = ingredientsWithCost.reduce((sum, ing) => sum + (ing.cost || 0), 0);
            setTotalCost(initialCost);
            
            const initialProfit = recipeData.recipe.sale_price - initialCost;
            setProfit(initialProfit);
            
            if (recipeData.recipe.sale_price > 0) {
              setProfitMargin((initialProfit / recipeData.recipe.sale_price) * 100);
            }
          }
        }
      } catch (error) {
        console.error('Error loading recipe data:', error);
        toast.error('Failed to load recipe data', standardToastConfig);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [recipeId, getRecipe, products]);
  
  // Calculate total cost whenever ingredients change
  useEffect(() => {
    const newTotalCost = recipe.ingredients.reduce((sum, ing) => sum + (ing.cost || 0), 0);
    setTotalCost(newTotalCost);
    
    const newProfit = recipe.sale_price - newTotalCost;
    setProfit(newProfit);
    
    if (recipe.sale_price > 0) {
      setProfitMargin((newProfit / recipe.sale_price) * 100);
    } else {
      setProfitMargin(0);
    }
  }, [recipe.ingredients, recipe.sale_price]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });
  };
  
  // Handle changes to sale price
  const handleSalePriceChange = (value) => {
    setRecipe({ ...recipe, sale_price: value });
  };
  
  // Handle recipe type change
  const handleTypeChange = (value) => {
    setRecipe({ ...recipe, type: value });
  };
  
  // Add a new ingredient
  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [
        ...recipe.ingredients,
        { product_id: '', amount: 0, unit_id: '', cost: 0 }
      ]
    });
  };
  
  // Remove an ingredient
  const removeIngredient = (index) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients.splice(index, 1);
    setRecipe({ ...recipe, ingredients: newIngredients });
  };
  
  // Handle changes to ingredient fields
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    
    // If product_id changed, recalculate cost
    if (field === 'product_id' || field === 'amount') {
      const product = products.find(p => p.product_id === (field === 'product_id' ? value : newIngredients[index].product_id));
      if (product) {
        newIngredients[index].cost = calculateIngredientCost(newIngredients[index], product);
      }
    }
    
    setRecipe({ ...recipe, ingredients: newIngredients });
  };
  
  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!recipe.name.trim()) {
      toast.error('Recipe name is required', standardToastConfig);
      return;
    }
    
    if (recipe.ingredients.length === 0) {
      toast.error('At least one ingredient is required', standardToastConfig);
      return;
    }
    
    for (const ingredient of recipe.ingredients) {
      if (!ingredient.product_id || !ingredient.amount || ingredient.amount <= 0) {
        toast.error('All ingredients must have a product and a positive amount', standardToastConfig);
        return;
      }
    }
    
    try {
      setLoading(true);
      
      // Format data for submission
      const recipeData = {
        name: recipe.name,
        type: recipe.type,
        description: recipe.description || '',
        instructions: recipe.instructions || '',
        sale_price: recipe.sale_price || 0,
        ingredients: recipe.ingredients.map(ing => ({
          product_id: ing.product_id,
          amount: ing.amount
        }))
      };
      
      if (recipeId) {
        await updateRecipe(recipeId, recipeData);
        toast.success(`Recipe "${recipe.name}" updated successfully`, standardToastConfig);
      } else {
        await addRecipe(recipeData);
        toast.success(`Recipe "${recipe.name}" created successfully`, standardToastConfig);
      }
      
      // Return to recipes list
      navigate('/recipes');
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast.error('Failed to save recipe', standardToastConfig);
    } finally {
      setLoading(false);
    }
  };
  
  // Go back to recipes list
  const handleCancel = () => {
    navigate('/recipes');
  };
  
  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.recipesContainer}>
      <Link to="/recipes" className={styles.backButton}>
        <FaArrowLeft /> Πίσω στις συνταγές
      </Link>
      
      <form className={styles.recipeForm} onSubmit={handleSubmit}>
        <h2>
          {recipe.type === RECIPE_TYPES.FOOD ? <FaUtensils /> : recipe.type === RECIPE_TYPES.COFFEE ? <FaCoffee /> : <FaGlassMartini />}
          {isEdit ? 'Επεξεργασία Συνταγής' : 'Δημιουργία Νέας Συνταγής'}
        </h2>
        
        <div className={styles.formHeader}>
          <div className={styles.formGroup}>
            <label htmlFor="recipe-name">Όνομα Συνταγής</label>
            <input
              id="recipe-name"
              type="text"
              name="name"
              value={recipe.name}
              onChange={handleInputChange}
              placeholder="Εισάγετε όνομα συνταγής"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="recipe-type">Τύπος Συνταγής</label>
            <select
              id="recipe-type"
              name="type"
              value={recipe.type}
              onChange={handleTypeChange}
              required
            >
              <option value={RECIPE_TYPES.FOOD}>Φαγητό</option>
              <option value={RECIPE_TYPES.COFFEE}>Καφές/Ρόφημα</option>
              <option value={RECIPE_TYPES.COCKTAIL}>Κοκτέιλ</option>
            </select>
          </div>
        </div>
        
        <div className={styles.totalCostDisplay}>
          <FaCalculator />
          <span>Συνολικό Κόστος:</span>
          <strong>{formatCurrency(totalCost)}</strong>
        </div>
        
        <div className={styles.profitDisplay}>
          <span>Κέρδος:</span>
          <strong>{formatCurrency(profit)}</strong>
        </div>
        
        <div className={styles.profitMarginDisplay}>
          <span>Περιθώριο Κέρδους:</span>
          <strong>{profitMargin.toFixed(2)}%</strong>
        </div>
        
        <div className={styles.ingredientSection}>
          <h3>Υλικά</h3>
          
          <div className={styles.ingredientHeader}>
            <div className={styles.ingredientColumn}>Προϊόν</div>
            <div className={styles.ingredientColumn}>Ποσότητα</div>
            <div className={styles.ingredientColumn}>Μονάδα</div>
            <div className={styles.ingredientColumn}>Κόστος</div>
            <div className={styles.ingredientActionColumn}></div>
          </div>
          
          {recipe.ingredients.map((ingredient, index) => {
            return (
              <div key={index} className={styles.ingredientRow}>
                <div className={styles.ingredientField}>
                  <select
                    value={ingredient.product_id}
                    onChange={(e) => handleIngredientChange(index, 'product_id', e.target.value)}
                    required
                  >
                    <option value="">Επιλέξτε προϊόν</option>
                    {products.map(product => (
                      <option key={product.product_id} value={product.product_id}>
                        {product.product_name} 
                        {product.purchase_price ? ` (${formatCurrency(product.purchase_price)}` : ' (0,00 €'} / 
                        {product.amount || 0} {units.find(u => u.id === product.unit_id)?.name || ''})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.ingredientField}>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    name="amount"
                    value={ingredient.amount}
                    onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                    placeholder="Ποσότητα"
                    required
                  />
                </div>
                
                <div className={styles.ingredientField}>
                  <select
                    value={ingredient.unit_id}
                    onChange={(e) => handleIngredientChange(index, 'unit_id', e.target.value)}
                    required
                  >
                    <option value="">Επιλέξτε μονάδα</option>
                    {units.map(unit => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.ingredientCost}>
                  <FaEuroSign /> {formatCurrency(ingredient.cost).replace('€', '')}
                </div>
                
                <Button
                  type="button"
                  variant="danger"
                  className={styles.removeButton}
                  onClick={() => removeIngredient(index)}
                  disabled={recipe.ingredients.length === 1}
                >
                  <FaMinus />
                </Button>
              </div>
            );
          })}
          
          <Button
            type="button"
            variant="secondary"
            className={styles.addIngredientButton}
            onClick={addIngredient}
          >
            <FaPlus /> Προσθήκη Υλικού
          </Button>
        </div>
        
        <div className={styles.formActions}>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
          >
            Ακύρωση
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Αποθήκευση...' : 'Αποθήκευση Συνταγής'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm; 