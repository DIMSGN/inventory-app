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

// DELETE /api/categories/:id
router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM categories WHERE id = ?";
    try {
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

// DELETE /api/categories/:name
router.delete("/:name", async (req, res) => { // Use name instead of id
    const { name } = req.params;
    const query = "DELETE FROM categories WHERE name = ?";
    try {
        const results = await queryDatabase(query, [name]);
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