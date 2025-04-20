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
    
    console.log("Received category creation request:", req.body);
    
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
        // Log the details for debugging
        console.log(`Attempting to delete category with ID: ${categoryId}`);
        
        // First check if the category exists
        const categoryCheck = await queryDatabase("SELECT * FROM categories WHERE id = ?", [categoryId]);
        
        if (categoryCheck.length === 0) {
            console.log(`Category ID ${categoryId} not found`);
            return res.status(404).json({ error: "Category not found" });
        }
        
        console.log(`Found category to delete:`, categoryCheck[0]);
        
        // Step 1: ALWAYS remove all product associations first (like the SQL script approach)
        console.log(`Removing all product associations for category ID ${categoryId}`);
        await queryDatabase("UPDATE products SET category_id = NULL WHERE category_id = ?", [categoryId]);
        console.log(`Product associations removed successfully`);
        
        // Step 2: Delete the category
        console.log(`Executing DELETE FROM categories WHERE id = ${categoryId}`);
        const results = await queryDatabase("DELETE FROM categories WHERE id = ?", [categoryId]);
        
        console.log(`Delete result:`, results);
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Category not found or could not be deleted" });
        }
        
        res.status(200).json({ 
            message: "Category deleted successfully",
            categoryId: categoryId
        });
    } catch (err) {
        console.error("Error deleting category:", err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE category by name
router.delete("/name/:categoryName", async (req, res) => {
    const { categoryName } = req.params;

    try {
        // Log the details for debugging
        console.log(`Attempting to delete category with name: ${categoryName}`);
        
        // First check if the category exists
        const categoryCheck = await queryDatabase("SELECT * FROM categories WHERE name = ?", [categoryName]);
        
        if (categoryCheck.length === 0) {
            console.log(`Category name "${categoryName}" not found`);
            return res.status(404).json({ error: "Category not found" });
        }
        
        console.log(`Found category to delete:`, categoryCheck[0]);
        const categoryId = categoryCheck[0].id;
        
        // Step 1: ALWAYS remove all product associations first (like the SQL script approach)
        console.log(`Removing all product associations for category ID ${categoryId} and name "${categoryName}"`);
        await queryDatabase("UPDATE products SET category_id = NULL WHERE category_id = ?", [categoryId]);
        // Also update any products that might use the category name directly
        await queryDatabase("UPDATE products SET category = NULL WHERE category = ?", [categoryName]);
        console.log(`Product associations removed successfully`);
        
        // Step 2: Delete the category
        console.log(`Executing DELETE FROM categories WHERE name = "${categoryName}"`);
        const results = await queryDatabase("DELETE FROM categories WHERE name = ?", [categoryName]);
        
        console.log(`Delete result:`, results);
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Category not found or could not be deleted" });
        }
        
        res.status(200).json({ 
            message: "Category deleted successfully",
            categoryName: categoryName
        });
    } catch (err) {
        console.error("Error deleting category:", err);
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/categories/:categoryId - Update a category by ID
router.put("/:categoryId", async (req, res) => {
    const { categoryId } = req.params;
    const { name } = req.body;

    console.log(`Update category request received for ID: ${categoryId}`, req.body);

    if (!name || !name.trim()) {
        return res.status(400).json({ error: "Category name is required" });
    }

    try {
        // Check if category exists
        const existingCategory = await queryDatabase("SELECT * FROM categories WHERE id = ?", [categoryId]);
        if (existingCategory.length === 0) {
            console.error(`Category not found for update: ${categoryId}`);
            return res.status(404).json({ error: "Category not found" });
        }

        console.log(`Existing category found:`, existingCategory[0]);

        // Check if the new name already exists (except for the current category)
        const nameExists = await queryDatabase(
            "SELECT * FROM categories WHERE name = ? AND id != ?", 
            [name, categoryId]
        );
        
        if (nameExists.length > 0) {
            return res.status(400).json({ error: "Category name already exists" });
        }

        // Update the category name
        const updateResult = await queryDatabase(
            "UPDATE categories SET name = ? WHERE id = ?",
            [name, categoryId]
        );

        console.log("Update result:", updateResult);

        if (updateResult.affectedRows === 0) {
            return res.status(500).json({ error: "Failed to update category" });
        }

        // Update any products using this category
        await queryDatabase(
            "UPDATE products SET category = ? WHERE category = ?",
            [name, existingCategory[0].name]
        );

        const updatedCategory = await queryDatabase("SELECT * FROM categories WHERE id = ?", [categoryId]);
        
        res.status(200).json({
            message: "Category updated successfully",
            category: updatedCategory[0]
        });
    } catch (err) {
        console.error("Error updating category:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;