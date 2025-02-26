const express = require("express");
const router = express.Router();
const queryDatabase = require("../utils/queryDatabase");

// GET /api/products
router.get("/", async (req, res) => {
    try {
        const rows = await queryDatabase("SELECT * FROM products");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// POST /api/products
router.post("/", async (req, res) => {
    const { product_id, product_name, unit, category, amount } = req.body;
    if (!product_id || !product_name || !unit || !category || amount === undefined) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const query = "INSERT INTO products (product_id, product_name, unit, category, amount) VALUES (?, ?, ?, ?, ?)";
    try {
        const results = await queryDatabase(query, [product_id, product_name, unit, category, amount]);
        res.status(201).json({ message: "Product added", id: results.insertId });
    } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/products/:id
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { product_name, unit, category, amount } = req.body;

    const fetchQuery = "SELECT * FROM products WHERE product_id = ?";
    try {
        const existingProduct = await queryDatabase(fetchQuery, [id]);
        if (existingProduct.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        const updateQuery = "UPDATE products SET product_name = ?, unit = ?, category = ?, amount = ? WHERE product_id = ?";
        await queryDatabase(updateQuery, [product_name, unit, category, amount, id]);

        res.status(200).json({ message: "Product updated", product: { product_id: id, product_name, unit, category, amount } });
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM products WHERE product_id = ?";
    try {
        const results = await queryDatabase(query, [id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted" });
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;