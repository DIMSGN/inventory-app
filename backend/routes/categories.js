const express = require('express');
const router = express.Router();
const queryDatabase = require('../utils/queryDatabase');

// POST /api/categories
router.post("/", async (req, res) => {
    const { category } = req.body;
    if (!category) {
        return res.status(400).json({ error: "Category is required" });
    }

    const query = "INSERT INTO categories (name) VALUES (?)";
    try {
        const results = await queryDatabase(query, [category]);
        res.status(201).json({ message: "Category added", id: results.insertId, name: category });
    } catch (err) {
        console.error("Error adding category:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;