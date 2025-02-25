const express = require('express');
const router = express.Router();
const queryDatabase = require('../utils/queryDatabase');

// Route to get all products
router.get('/', async (req, res) => {
    const query = `
        SELECT p.product_id, p.product_name, p.unit, p.category, p.amount,
               r.id AS rule_id, r.rules, r.comparison, r.amount AS rule_amount, r.color
        FROM products p
        LEFT JOIN rules r ON p.product_id = r.product_id
    `;
    try {
        const results = await queryDatabase(query);
        const products = results.reduce((acc, row) => {
            const product = acc.find(p => p.product_id === row.product_id);
            if (product) {
                product.rules.push({
                    rule_id: row.rule_id,
                    rules: row.rules,
                    comparison: row.comparison,
                    amount: row.rule_amount,
                    color: row.color
                });
            } else {
                acc.push({
                    product_id: row.product_id,
                    product_name: row.product_name,
                    unit: row.unit,
                    category: row.category,
                    amount: row.amount,
                    rules: row.rule_id ? [{
                        rule_id: row.rule_id,
                        rules: row.rules,
                        comparison: row.comparison,
                        amount: row.rule_amount,
                        color: row.color
                    }] : []
                });
            }
            return acc;
        }, []);
        res.json(products);
    } catch (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * Route to add a new product.
 * This route inserts a new product into the products table.
 * The request body must contain the product_name, unit, category, and amount fields.
 */
router.post("/", async (req, res) => {
    const { product_name, unit, category, amount } = req.body;
    if (!product_name || !unit || !category || amount === undefined) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const query = "INSERT INTO products (product_name, unit, category, amount) VALUES (?, ?, ?, ?)";
    try {
        const results = await queryDatabase(query, [product_name, unit, category, amount]);
        res.status(201).json({ message: "Product added", id: results.insertId });
    } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * Route to update an existing product.
 * This route updates the specified fields of an existing product in the products table.
 * The request body can contain any combination of the product_name, unit, category, and amount fields.
 */
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

/**
 * Route to delete a product.
 * This route deletes a product from the products table based on the product ID.
 */
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