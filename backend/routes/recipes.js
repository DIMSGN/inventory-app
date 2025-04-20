const express = require("express");
const router = express.Router();
const queryDatabase = require('../utils/queryDatabase');

/**
 * GET /api/recipes
 * Get all recipes with their cost information
 */
router.get("/", async (req, res) => {
  try {
    const recipes = await queryDatabase("SELECT * FROM recipes");
    res.status(200).json(recipes);
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/recipes/:recipeId
 * Get a single recipe by ID with detailed ingredients list and calculated costs
 */
router.get("/:recipeId", async (req, res) => {
  const { recipeId } = req.params;
  
  try {
    // Get recipe details
    const recipe = await queryDatabase("SELECT * FROM recipes WHERE recipe_id = ?", [recipeId]);
    
    if (recipe.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    
    // Get all ingredients for this recipe with product details
    const ingredients = await queryDatabase(`
      SELECT 
        ri.id AS ingredient_id,
        ri.recipe_id,
        ri.product_id,
        ri.amount AS ingredient_amount,
        p.product_name,
        p.unit_id,
        u.name AS unit_name,
        p.purchase_price,
        p.amount AS product_amount
      FROM recipe_ingredients ri
      JOIN products p ON ri.product_id = p.product_id
      JOIN units u ON p.unit_id = u.id
      WHERE ri.recipe_id = ?
    `, [recipeId]);
    
    // Calculate cost for each ingredient
    const ingredientsWithCost = ingredients.map(ingredient => {
      // Calculate cost per unit
      const costPerUnit = ingredient.purchase_price / ingredient.product_amount;
      
      // Calculate cost for this ingredient
      const ingredientCost = costPerUnit * ingredient.ingredient_amount;
      
      return {
        ...ingredient,
        cost_per_unit: costPerUnit,
        ingredient_cost: parseFloat(ingredientCost.toFixed(2))
      };
    });
    
    // Calculate total cost
    const totalCost = ingredientsWithCost.reduce((sum, ing) => sum + ing.ingredient_cost, 0);
    
    res.status(200).json({
      recipe: recipe[0],
      ingredients: ingredientsWithCost,
      total_cost: parseFloat(totalCost.toFixed(2))
    });
  } catch (err) {
    console.error("Error fetching recipe details:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/recipes
 * Create a new recipe
 */
router.post("/", async (req, res) => {
  const { name, ingredients } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: "Recipe name is required" });
  }
  
  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ error: "At least one ingredient is required" });
  }
  
  try {
    // Check if recipe name already exists
    const existingRecipe = await queryDatabase("SELECT * FROM recipes WHERE name = ?", [name]);
    if (existingRecipe.length > 0) {
      return res.status(400).json({ error: "Recipe with this name already exists" });
    }
    
    // Start a transaction
    await queryDatabase("START TRANSACTION");
    
    // Insert recipe
    const recipeResult = await queryDatabase("INSERT INTO recipes (name) VALUES (?)", [name]);
    const recipeId = recipeResult.insertId;
    
    // Insert all ingredients
    for (const ingredient of ingredients) {
      const { product_id, amount } = ingredient;
      
      if (!product_id || !amount || amount <= 0) {
        // Rollback if any ingredient is invalid
        await queryDatabase("ROLLBACK");
        return res.status(400).json({ 
          error: "Each ingredient must have a product_id and a positive amount" 
        });
      }
      
      await queryDatabase(
        "INSERT INTO recipe_ingredients (recipe_id, product_id, amount) VALUES (?, ?, ?)",
        [recipeId, product_id, amount]
      );
    }
    
    // Commit the transaction
    await queryDatabase("COMMIT");
    
    // Calculate the total cost of the recipe using the recipe_costs view
    const costResult = await queryDatabase(
      "SELECT total_cost FROM recipe_costs WHERE recipe_id = ?",
      [recipeId]
    );
    
    const totalCost = costResult.length > 0 ? costResult[0].total_cost : null;
    
    res.status(201).json({
      message: "Recipe created successfully",
      recipe_id: recipeId,
      name: name,
      total_cost: totalCost
    });
  } catch (err) {
    // Rollback on error
    await queryDatabase("ROLLBACK");
    console.error("Error creating recipe:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * PUT /api/recipes/:recipeId
 * Update a recipe and its ingredients
 */
router.put("/:recipeId", async (req, res) => {
  const { recipeId } = req.params;
  const { name, ingredients } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: "Recipe name is required" });
  }
  
  if (!ingredients || !Array.isArray(ingredients)) {
    return res.status(400).json({ error: "Ingredients must be an array" });
  }
  
  try {
    // Check if recipe exists
    const recipeCheck = await queryDatabase("SELECT * FROM recipes WHERE recipe_id = ?", [recipeId]);
    if (recipeCheck.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    
    // Check if name already exists for a different recipe
    const existingRecipe = await queryDatabase(
      "SELECT * FROM recipes WHERE name = ? AND recipe_id != ?", 
      [name, recipeId]
    );
    
    if (existingRecipe.length > 0) {
      return res.status(400).json({ error: "Recipe with this name already exists" });
    }
    
    // Start transaction
    await queryDatabase("START TRANSACTION");
    
    // Update recipe name
    await queryDatabase("UPDATE recipes SET name = ? WHERE recipe_id = ?", [name, recipeId]);
    
    // Delete all existing ingredients
    await queryDatabase("DELETE FROM recipe_ingredients WHERE recipe_id = ?", [recipeId]);
    
    // Insert new ingredients
    for (const ingredient of ingredients) {
      const { product_id, amount } = ingredient;
      
      if (!product_id || !amount || amount <= 0) {
        // Rollback if any ingredient is invalid
        await queryDatabase("ROLLBACK");
        return res.status(400).json({ 
          error: "Each ingredient must have a product_id and a positive amount" 
        });
      }
      
      await queryDatabase(
        "INSERT INTO recipe_ingredients (recipe_id, product_id, amount) VALUES (?, ?, ?)",
        [recipeId, product_id, amount]
      );
    }
    
    // Commit transaction
    await queryDatabase("COMMIT");
    
    // Calculate the total cost of the recipe using the recipe_costs view
    const costResult = await queryDatabase(
      "SELECT total_cost FROM recipe_costs WHERE recipe_id = ?",
      [recipeId]
    );
    
    const totalCost = costResult.length > 0 ? costResult[0].total_cost : null;
    
    res.status(200).json({
      message: "Recipe updated successfully",
      recipe_id: recipeId,
      name: name,
      total_cost: totalCost
    });
    
  } catch (err) {
    // Rollback on error
    await queryDatabase("ROLLBACK");
    console.error("Error updating recipe:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/recipes/:recipeId
 * Delete a recipe and its ingredients
 */
router.delete("/:recipeId", async (req, res) => {
  const { recipeId } = req.params;
  
  try {
    // Check if recipe exists
    const recipeCheck = await queryDatabase("SELECT * FROM recipes WHERE recipe_id = ?", [recipeId]);
    if (recipeCheck.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    
    // Start transaction
    await queryDatabase("START TRANSACTION");
    
    // Delete all ingredients
    await queryDatabase("DELETE FROM recipe_ingredients WHERE recipe_id = ?", [recipeId]);
    
    // Delete recipe
    await queryDatabase("DELETE FROM recipes WHERE recipe_id = ?", [recipeId]);
    
    // Commit transaction
    await queryDatabase("COMMIT");
    
    res.status(200).json({
      message: "Recipe deleted successfully",
      recipe_id: recipeId
    });
    
  } catch (err) {
    // Rollback on error
    await queryDatabase("ROLLBACK");
    console.error("Error deleting recipe:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/recipes/:recipeId/cost
 * Calculate the cost of a recipe
 */
router.get("/:recipeId/cost", async (req, res) => {
  const { recipeId } = req.params;
  
  try {
    // Get cost from view
    const costResult = await queryDatabase(
      "SELECT * FROM recipe_costs WHERE recipe_id = ?",
      [recipeId]
    );
    
    if (costResult.length === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    
    // Get detailed ingredient costs
    const ingredients = await queryDatabase(`
      SELECT 
        ri.id AS ingredient_id,
        ri.product_id,
        p.product_name,
        ri.amount AS ingredient_amount,
        ri.unit AS ingredient_unit_id,
        iu.name AS ingredient_unit_name,
        p.unit_id AS product_unit_id,
        pu.name AS product_unit_name,
        p.pieces_per_package,
        p.purchase_price,
        p.amount AS product_amount
      FROM recipe_ingredients ri
      JOIN products p ON ri.product_id = p.product_id
      LEFT JOIN units iu ON ri.unit = iu.id
      LEFT JOIN units pu ON p.unit_id = pu.id
      WHERE ri.recipe_id = ?
    `, [recipeId]);
    
    // Get all relevant units for conversion
    const unitIds = [...new Set([
      ...ingredients.map(ing => ing.ingredient_unit_id),
      ...ingredients.map(ing => ing.product_unit_id)
    ])].filter(id => id); // Filter out any nulls
    
    let units = [];
    if (unitIds.length > 0) {
      units = await queryDatabase(`
        SELECT id, name, conversion_factor 
        FROM units 
        WHERE id IN (${unitIds.map(() => '?').join(',')})
      `, unitIds);
    }
    
    // Calculate cost for each ingredient
    const ingredientsWithCost = ingredients.map(ing => {
      let cost = 0;
      
      // If product has a purchase price
      if (ing.purchase_price) {
        const purchasePrice = parseFloat(ing.purchase_price);
        const ingredientAmount = parseFloat(ing.ingredient_amount);
        
        // If it's a packaged product (has pieces_per_package)
        if (ing.pieces_per_package) {
          const pricePerPiece = purchasePrice / parseFloat(ing.pieces_per_package);
          cost = ingredientAmount * pricePerPiece;
        }
        // If units match directly
        else if (ing.ingredient_unit_id === ing.product_unit_id) {
          // Simple proportion: price per product amount * ingredient amount
          const productAmount = parseFloat(ing.product_amount) || 1;
          cost = (ingredientAmount / productAmount) * purchasePrice;
        }
        // Handle weight unit conversions
        else {
          const ingredientUnit = units.find(u => u.id === ing.ingredient_unit_id);
          const productUnit = units.find(u => u.id === ing.product_unit_id);
          
          if (ingredientUnit && productUnit && 
              ingredientUnit.conversion_factor && productUnit.conversion_factor) {
            // Calculate conversion factor
            let conversionFactor = 1;
            
            // Convert to base unit by multiplying by ingredient's conversion factor
            // Then convert to product's unit by dividing by product's conversion factor
            conversionFactor = ingredientUnit.conversion_factor / productUnit.conversion_factor;
            
            // Convert ingredient amount to product unit
            const convertedAmount = ingredientAmount * conversionFactor;
            
            // Calculate cost
            const productAmount = parseFloat(ing.product_amount) || 1;
            cost = (convertedAmount / productAmount) * purchasePrice;
          } else {
            // Fallback if conversion factors not available - just use direct proportion
            const productAmount = parseFloat(ing.product_amount) || 1;
            cost = (ingredientAmount / productAmount) * purchasePrice;
          }
        }
      }
      
      return {
        ...ing,
        cost: parseFloat(cost.toFixed(2))
      };
    });
    
    // Calculate total cost
    const totalCost = ingredientsWithCost.reduce((sum, ing) => sum + ing.cost, 0);
    
    res.status(200).json({
      recipe_id: recipeId,
      recipe_name: costResult[0].recipe_name,
      total_cost: parseFloat(totalCost.toFixed(2)),
      ingredients: ingredientsWithCost
    });
    
  } catch (err) {
    console.error("Error calculating recipe cost:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 