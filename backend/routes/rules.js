const express = require("express");
const router = express.Router();
const queryDatabase = require("../utils/queryDatabase");

// GET /api/rules - Get all rules with product details
router.get("/", async (req, res) => {
    try {
        const rules = await queryDatabase(`
            SELECT r.*, p.product_name, p.amount as current_amount, p.product_id as product_id
            FROM rules r
            LEFT JOIN products p ON r.product_id = p.product_id
            ORDER BY r.id
        `);
        res.json(rules);
    } catch (err) {
        console.error("Error fetching rules:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/rules/product/:productId - Get rules for a specific product
router.get("/product/:productId", async (req, res) => {
    const { productId } = req.params;
    
    try {
        const rules = await queryDatabase(`
            SELECT r.*, p.product_name, p.amount as current_amount 
            FROM rules r
            JOIN products p ON r.product_id = p.product_id
            WHERE r.product_id = ?
            ORDER BY r.id
        `, [productId]);
        
        res.json(rules);
    } catch (err) {
        console.error(`Error fetching rules for product ${productId}:`, err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/rules - Add a new rule
router.post("/", async (req, res) => {
    const { product_id, rules, comparison, amount, color } = req.body;
    
    if (!product_id || !rules || !comparison || !amount || !color) {
        return res.status(400).json({ 
            error: "All fields are required", 
            required: ["product_id", "rules", "comparison", "amount", "color"] 
        });
    }

    try {
        // Check if product exists
        const product = await queryDatabase(
            "SELECT product_id, product_name FROM products WHERE product_id = ?", 
            [product_id]
        );
        
        if (product.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        
        const results = await queryDatabase(
            "INSERT INTO rules (product_id, rules, comparison, amount, color) VALUES (?, ?, ?, ?, ?)",
            [product_id, rules, comparison, amount, color]
        );
        
        // Get the rule with product details
        const newRule = await queryDatabase(`
            SELECT r.*, p.product_name, p.amount as current_amount 
            FROM rules r
            JOIN products p ON r.product_id = p.product_id
            WHERE r.id = ?
        `, [results.insertId]);
        
        res.status(201).json({
            message: "Rule added successfully",
            rule: newRule[0]
        });
    } catch (err) {
        console.error("Error adding rule:", err);
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/rules/:ruleId - Update a rule
router.put("/:ruleId", async (req, res) => {
    const { ruleId } = req.params;
    const { product_id, rules, comparison, amount, color } = req.body;
    
    try {
        // Check if rule exists
        const existingRule = await queryDatabase("SELECT * FROM rules WHERE id = ?", [ruleId]);
        
        if (existingRule.length === 0) {
            return res.status(404).json({ error: "Rule not found" });
        }
        
        // Build the SQL query dynamically based on provided fields
        let updates = [];
        let params = [];
        
        if (product_id !== undefined) {
            // Validate product_id if provided
            const product = await queryDatabase(
                "SELECT product_id FROM products WHERE product_id = ?", 
                [product_id]
            );
            
            if (product.length === 0) {
                return res.status(404).json({ error: "Product not found" });
            }
            
            updates.push("product_id = ?");
            params.push(product_id);
        }
        
        if (rules !== undefined) {
            updates.push("rules = ?");
            params.push(rules);
        }
        
        if (comparison !== undefined) {
            updates.push("comparison = ?");
            params.push(comparison);
        }
        
        if (amount !== undefined) {
            updates.push("amount = ?");
            params.push(amount);
        }
        
        if (color !== undefined) {
            updates.push("color = ?");
            params.push(color);
        }
        
        // Add the ruleId as the last parameter
        params.push(ruleId);
        
        // If no fields to update, return early
        if (updates.length === 0) {
            return res.status(400).json({ error: "No fields provided for update" });
        }
        
        // Execute the update query
        const updateQuery = `UPDATE rules SET ${updates.join(", ")} WHERE id = ?`;
        const results = await queryDatabase(updateQuery, params);
        
        if (results.affectedRows === 0) {
            return res.status(500).json({ error: "Failed to update rule" });
        }
        
        // Get the updated rule with product details
        const updatedRule = await queryDatabase(`
            SELECT r.*, p.product_name, p.amount as current_amount 
            FROM rules r
            JOIN products p ON r.product_id = p.product_id
            WHERE r.id = ?
        `, [ruleId]);
        
        res.status(200).json({
            message: "Rule updated successfully",
            rule: updatedRule[0]
        });
    } catch (err) {
        console.error(`Error updating rule ${ruleId}:`, err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/rules/:ruleId - Delete a rule
router.delete("/:ruleId", async (req, res) => {
    const { ruleId } = req.params;
    
    try {
        const result = await queryDatabase("DELETE FROM rules WHERE id = ?", [ruleId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Rule not found" });
        }
        
        res.status(200).json({ message: "Rule deleted successfully" });
    } catch (err) {
        console.error(`Error deleting rule ${ruleId}:`, err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
