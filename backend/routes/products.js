// Import the express module to create a router and handle HTTP requests
const express = require("express");
// Import the database connection module to interact with the MySQL database
const db = require("../db/connection");
// Create a new router instance
const router = express.Router();

/**
 * Helper function to handle database queries.
 * This function returns a promise that resolves with the query results or rejects with an error.
 * @param {string} query - The SQL query to execute.
 * @param {Array} params - The parameters for the SQL query.
 * @returns {Promise} - A promise that resolves with the query results or rejects with an error.
 */
const queryDatabase = async (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

/**
 * Route to get all products with their associated rules.
 * This route performs a LEFT JOIN between the products and rules tables to fetch all products and their rules.
 * The results are then formatted into a nested structure where each product contains its associated rules.
 */
router.get("/", async (req, res) => {
    const query = `
        SELECT p.product_id, p.product_name, p.unit, p.category, p.amount,
               r.id AS rule_id, r.rules, r.comparison, r.amount AS rule_amount, r.color
        FROM products p
        LEFT JOIN rules r ON p.product_id = r.product_id
    `;
    try {
        const results = await queryDatabase(query);
        // Reduce the results into a nested structure
        const products = results.reduce((acc, row) => {
            const product = acc.find(p => p.product_id === row.product_id);
            if (product) {
                // If the product already exists, add the rule to its rules array
                product.rules.push({
                    rule_id: row.rule_id,
                    rules: row.rules,
                    comparison: row.comparison,
                    amount: row.rule_amount,
                    color: row.color
                });
            } else {
                // If the product does not exist, create a new product entry
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

// Export the router to be used in other parts of the application
module.exports = router;