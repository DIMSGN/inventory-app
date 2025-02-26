const express = require("express");
const router = express.Router();
const queryDatabase = require("../utils/queryDatabase");

// GET /api/products
router.get("/", async (req, res) => {
    try {
        const rows = await queryDatabase(`
            SELECT 
                p.product_id, p.product_name, p.unit, p.category, p.amount,
                r.rules, r.comparison, r.amount AS rule_amount, r.color
            FROM products p
            LEFT JOIN rules r ON p.product_id = r.product_id
        `);

        const products = rows.reduce((acc, row) => {
            const product = acc.find(p => p.product_id === row.product_id);
            const rule = {
                rules: row.rules,
                comparison: row.comparison,
                amount: row.rule_amount,
                color: row.color
            };

            if (product) {
                product.rules.push(rule);
            } else {
                acc.push({
                    product_id: row.product_id,
                    product_name: row.product_name,
                    unit: row.unit,
                    category: row.category,
                    amount: row.amount,
                    rules: row.rules ? [rule] : []
                });
            }

            return acc;
        }, []);

        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

module.exports = router;