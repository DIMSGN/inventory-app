const express = require("express");
const router = express.Router();
const queryDatabase = require("../utils/queryDatabase");

/**
 * Route to get all rules.
 * This route fetches all rules from the rules table.
 */
router.get("/", async (req, res) => {
    try {
        const rows = await queryDatabase("SELECT * FROM rules");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching rules:", error);
        res.status(500).json({ error: "Failed to fetch rules" });
    }
});

/**
 * Route to add a new rule.
 * This route inserts a new rule into the rules table.
 * The request body must contain the product_id, rules, comparison, amount, and color fields.
 */
router.post("/", async (req, res) => {
    const { product_id, rules, comparison, amount, color } = req.body;
    if (!product_id || !rules || !comparison || amount === undefined || !color) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const query = "INSERT INTO rules (product_id, rules, comparison, amount, color) VALUES (?, ?, ?, ?, ?)";
    try {
        const results = await queryDatabase(query, [product_id, rules, comparison, amount, color]);
        res.status(201).json({ message: "Rule added", id: results.insertId });
    } catch (err) {
        console.error("Error adding rule:", err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * Route to update an existing rule.
 * This route updates the specified fields of an existing rule in the rules table.
 * The request body can contain any combination of the rules, comparison, amount, and color fields.
 */
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { rules, comparison, amount, color } = req.body;

    const fetchQuery = "SELECT * FROM rules WHERE id = ?";
    try {
        const existingRule = await queryDatabase(fetchQuery, [id]);
        if (existingRule.length === 0) {
            return res.status(404).json({ error: "Rule not found" });
        }

        const updateQuery = "UPDATE rules SET rules = ?, comparison = ?, amount = ?, color = ? WHERE id = ?";
        await queryDatabase(updateQuery, [rules, comparison, amount, color, id]);

        res.status(200).json({ message: "Rule updated", rule: { id, rules, comparison, amount, color } });
    } catch (err) {
        console.error("Error updating rule:", err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * Route to delete a rule.
 * This route deletes a rule from the rules table based on the rule ID.
 */
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM rules WHERE id = ?";
    try {
        const results = await queryDatabase(query, [id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Rule not found" });
        }
        res.status(200).json({ message: "Rule deleted" });
    } catch (err) {
        console.error("Error deleting rule:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
