const express = require('express');
const router = express.Router();
const queryDatabase = require('../utils/queryDatabase');

// GET /api/categories
router.get("/", async (req, res) => {
    const query = "SELECT * FROM categories";
    try {
        const results = await queryDatabase(query);
        res.status(200).json(results); // Send the list of categories as JSON
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/categories
router.post("/", async (req, res) => {
    const { category } = req.body;
    if (!category) {
        return res.status(400).json({ error: "Category is required" });
    }

    // Check if the category already exists
    const checkQuery = "SELECT * FROM categories WHERE name = ?";
    try {
        const existingCategory = await queryDatabase(checkQuery, [category]);
        if (existingCategory.length > 0) {
            return res.status(400).json({ error: "Category already exists" });
        }

        const insertQuery = "INSERT INTO categories (name) VALUES (?)";
        const results = await queryDatabase(insertQuery, [category]);
        res.status(201).json({ message: "Category added", id: results.insertId, name: category });
    } catch (err) {
        console.error("Error adding category:", err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/categories/id/:id
router.delete("/id/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // Check if any products are using this category
        const checkProductsQuery = "SELECT COUNT(*) as count FROM products WHERE category = ?";
        const productsCount = await queryDatabase(checkProductsQuery, [id]);
        
        if (productsCount[0].count > 0) {
            return res.status(400).json({ 
                error: "Cannot delete category that has associated products", 
                productsCount: productsCount[0].count 
            });
        }

        const query = "DELETE FROM categories WHERE id = ?";
        const results = await queryDatabase(query, [id]);
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Category not found" });
        }
        
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
        console.error("Error deleting category:", err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/categories/name/:name
router.delete("/name/:name", async (req, res) => {
    const { name } = req.params;
    
    try {
        // First get the category ID
        const getCategoryQuery = "SELECT id FROM categories WHERE name = ?";
        const category = await queryDatabase(getCategoryQuery, [name]);
        
        if (category.length === 0) {
            return res.status(404).json({ error: "Category not found" });
        }
        
        const categoryId = category[0].id;
        
        // Check if any products are using this category
        const checkProductsQuery = "SELECT COUNT(*) as count FROM products WHERE category = ?";
        const productsCount = await queryDatabase(checkProductsQuery, [categoryId]);
        
        if (productsCount[0].count > 0) {
            return res.status(400).json({ 
                error: "Cannot delete category that has associated products", 
                productsCount: productsCount[0].count 
            });
        }
        
        const query = "DELETE FROM categories WHERE name = ?";
        const results = await queryDatabase(query, [name]);
        
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
        console.error("Error deleting category:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;