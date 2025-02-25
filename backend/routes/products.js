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
        console.log("API Response:", results); // Add this line to log the response
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

module.exports = router;