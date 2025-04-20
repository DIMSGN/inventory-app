const express = require("express");
const router = express.Router();
const queryDatabase = require('../utils/queryDatabase');

/**
 * GET /api/sales
 * Get all sales from all categories combined
 */
router.get("/", async (req, res) => {
  try {
    const allSales = await queryDatabase(`
      SELECT * FROM all_recipe_sales
      ORDER BY sale_date DESC, sale_id DESC
    `);
    res.status(200).json(allSales);
  } catch (err) {
    console.error("Error fetching all sales:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/sales/daily
 * Get daily sales summary
 */
router.get("/daily", async (req, res) => {
  try {
    const dailySummary = await queryDatabase(`
      SELECT * FROM daily_financial_summary
      ORDER BY date DESC
    `);
    res.status(200).json(dailySummary);
  } catch (err) {
    console.error("Error fetching daily financial summary:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/sales/monthly
 * Get monthly sales summary
 */
router.get("/monthly", async (req, res) => {
  try {
    const monthlySummary = await queryDatabase(`
      SELECT * FROM monthly_financial_summary
      ORDER BY year DESC, month DESC
    `);
    res.status(200).json(monthlySummary);
  } catch (err) {
    console.error("Error fetching monthly financial summary:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/sales/food
 * Record food recipe sales
 */
router.post("/food", async (req, res) => {
  const { recipe_id, quantity, sale_price, sale_date } = req.body;
  
  if (!recipe_id || !quantity || !sale_price) {
    return res.status(400).json({ 
      error: "Required fields missing", 
      required: ["recipe_id", "quantity", "sale_price"] 
    });
  }
  
  try {
    // Start transaction
    await queryDatabase("START TRANSACTION");
    
    // Format date
    const formattedDate = sale_date ? new Date(sale_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    
    // Insert the sale
    const result = await queryDatabase(
      `INSERT INTO food_recipes_sales 
       (recipe_id, quantity, sale_price, sale_date) 
       VALUES (?, ?, ?, ?)`,
      [recipe_id, quantity, sale_price, formattedDate]
    );
    
    // Commit transaction - triggers will handle inventory updates
    await queryDatabase("COMMIT");
    
    res.status(201).json({
      message: "Food sale recorded successfully",
      sale_id: result.insertId
    });
  } catch (err) {
    // Rollback on error
    await queryDatabase("ROLLBACK");
    console.error("Error recording food sale:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/sales/coffee
 * Record coffee/beverage sales
 */
router.post("/coffee", async (req, res) => {
  const { recipe_id, quantity, sale_price, sale_date } = req.body;
  
  if (!recipe_id || !quantity || !sale_price) {
    return res.status(400).json({ 
      error: "Required fields missing", 
      required: ["recipe_id", "quantity", "sale_price"] 
    });
  }
  
  try {
    // Start transaction
    await queryDatabase("START TRANSACTION");
    
    // Format date
    const formattedDate = sale_date ? new Date(sale_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    
    // Insert the sale
    const result = await queryDatabase(
      `INSERT INTO coffees_beverages_recipes_sales 
       (recipe_id, quantity, sale_price, sale_date) 
       VALUES (?, ?, ?, ?)`,
      [recipe_id, quantity, sale_price, formattedDate]
    );
    
    // Commit transaction - triggers will handle inventory updates
    await queryDatabase("COMMIT");
    
    res.status(201).json({
      message: "Coffee/beverage sale recorded successfully",
      sale_id: result.insertId
    });
  } catch (err) {
    // Rollback on error
    await queryDatabase("ROLLBACK");
    console.error("Error recording coffee/beverage sale:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/sales/cocktail
 * Record cocktail sales
 */
router.post("/cocktail", async (req, res) => {
  const { recipe_id, quantity, sale_price, sale_date } = req.body;
  
  if (!recipe_id || !quantity || !sale_price) {
    return res.status(400).json({ 
      error: "Required fields missing", 
      required: ["recipe_id", "quantity", "sale_price"] 
    });
  }
  
  try {
    // Start transaction
    await queryDatabase("START TRANSACTION");
    
    // Format date
    const formattedDate = sale_date ? new Date(sale_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    
    // Insert the sale
    const result = await queryDatabase(
      `INSERT INTO cocktails_recipes_sales 
       (recipe_id, quantity, sale_price, sale_date) 
       VALUES (?, ?, ?, ?)`,
      [recipe_id, quantity, sale_price, formattedDate]
    );
    
    // Commit transaction - triggers will handle inventory updates
    await queryDatabase("COMMIT");
    
    res.status(201).json({
      message: "Cocktail sale recorded successfully",
      sale_id: result.insertId
    });
  } catch (err) {
    // Rollback on error
    await queryDatabase("ROLLBACK");
    console.error("Error recording cocktail sale:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/sales/drink
 * Record individual drink sales
 */
router.post("/drink", async (req, res) => {
  const { product_id, quantity, sale_price, sale_date } = req.body;
  
  if (!product_id || !quantity || !sale_price) {
    return res.status(400).json({ 
      error: "Required fields missing", 
      required: ["product_id", "quantity", "sale_price"] 
    });
  }
  
  try {
    // Start transaction
    await queryDatabase("START TRANSACTION");
    
    // Format date
    const formattedDate = sale_date ? new Date(sale_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    
    // Insert the sale
    const result = await queryDatabase(
      `INSERT INTO drinks_sales 
       (product_id, quantity, sale_price, sale_date) 
       VALUES (?, ?, ?, ?)`,
      [product_id, quantity, sale_price, formattedDate]
    );
    
    // Commit transaction - triggers will handle inventory updates
    await queryDatabase("COMMIT");
    
    res.status(201).json({
      message: "Drink sale recorded successfully",
      sale_id: result.insertId
    });
  } catch (err) {
    // Rollback on error
    await queryDatabase("ROLLBACK");
    console.error("Error recording drink sale:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 