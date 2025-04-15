const express = require('express');
const router = express.Router();
const queryDatabase = require('../utils/queryDatabase');

// GET /api/categories
router.get("/", async (req, res) => {
    try {
        const results = await queryDatabase("SELECT * FROM categories");
        res.status(200).json(results);
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

    try {
        const existing = await queryDatabase("SELECT * FROM categories WHERE name = ?", [category]);
        if (existing.length > 0) {
            return res.status(400).json({ error: "Category already exists" });
        }

        const results = await queryDatabase("INSERT INTO categories (name) VALUES (?)", [category]);
        res.status(201).json({ 
            message: "Category added", 
            id: results.insertId, 
            name: category 
        });
    } catch (err) {
        console.error("Error adding category:", err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE category by ID
router.delete("/id/:categoryId", async (req, res) => {
    const { categoryId } = req.params;

    try {
        const products = await queryDatabase("SELECT COUNT(*) as count FROM products WHERE category = ?", [categoryId]);
        
        if (products[0].count > 0) {
            return res.status(400).json({ 
                error: "Cannot delete category that has associated products",
                productsCount: products[0].count 
            });
        }

        const results = await queryDatabase("DELETE FROM categories WHERE id = ?", [categoryId]);
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Category not found" });
        }
        
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
        console.error("Error deleting category:", err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE category by name
router.delete("/name/:categoryName", async (req, res) => {
    const { categoryName } = req.params;

    try {
        const products = await queryDatabase("SELECT COUNT(*) as count FROM products WHERE category = ?", [categoryName]);
        
        if (products[0].count > 0) {
            return res.status(400).json({ 
                error: "Cannot delete category that has associated products",
                productsCount: products[0].count 
            });
        }
        
        const results = await queryDatabase("DELETE FROM categories WHERE name = ?", [categoryName]);
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Category not found" });
        }
        
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
        console.error("Error deleting category:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;