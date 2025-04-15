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

// GET /api/products/:productId
router.get("/:productId", async (req, res) => {
    const { productId } = req.params;
    try {
        const results = await queryDatabase("SELECT * FROM products WHERE product_id = ?", [productId]);
        if (results.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(results[0]);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Failed to fetch product" });
    }
});

// POST /api/products
router.post("/", async (req, res) => {
    const { product_id, product_name, unit, category, amount } = req.body;
    if (!product_id || !product_name || !unit || !category || amount === undefined) {
        return res.status(400).json({ error: "All fields are required" });
    }
    
    try {
        const results = await queryDatabase(
            "INSERT INTO products (product_id, product_name, unit, category, amount) VALUES (?, ?, ?, ?, ?)",
            [product_id, product_name, unit, category, amount]
        );
        res.status(201).json({ 
            message: "Product added", 
            id: results.insertId,
            product: { product_id, product_name, unit, category, amount }
        });
    } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/products/:productId
router.put("/:productId", async (req, res) => {
    const { productId } = req.params;
    const { product_name, unit, category, amount } = req.body;

    try {
        const existingProduct = await queryDatabase("SELECT * FROM products WHERE product_id = ?", [productId]);
        if (existingProduct.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        await queryDatabase(
            "UPDATE products SET product_name = ?, unit = ?, category = ?, amount = ? WHERE product_id = ?",
            [product_name, unit, category, amount, productId]
        );

        res.status(200).json({ 
            message: "Product updated",
            product: { product_id: productId, product_name, unit, category, amount }
        });
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/products/:productId
router.delete("/:productId", async (req, res) => {
    const { productId } = req.params;
    try {
        const results = await queryDatabase("DELETE FROM products WHERE product_id = ?", [productId]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;