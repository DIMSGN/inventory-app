const express = require("express");
const router = express.Router();
const queryDatabase = require("../utils/queryDatabase");

// Utility to handle database errors
const handleDatabaseError = (res, error, operation) => {
    console.error(`Error ${operation}:`, error);
    // Check if it's a connection error
    if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST') {
        return res.status(503).json({ 
            error: "Database connection error", 
            message: "Unable to connect to database. Please try again later."
        });
    }
    // General error
    return res.status(500).json({ error: `Failed to ${operation}` });
};

// GET /api/products
router.get("/", async (req, res) => {
    try {
        const rows = await queryDatabase("SELECT * FROM products");
        res.json(rows);
    } catch (error) {
        handleDatabaseError(res, error, "fetch products");
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
        handleDatabaseError(res, error, "fetch product");
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
        handleDatabaseError(res, err, "add product");
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
        handleDatabaseError(res, err, "update product");
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
        handleDatabaseError(res, err, "delete product");
    }
});

module.exports = router;