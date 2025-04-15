const express = require("express");
const router = express.Router();
const queryDatabase = require("../utils/queryDatabase");

// GET /api/rules
router.get("/", async (req, res) => {
    try {
        const rows = await queryDatabase("SELECT * FROM rules");
        res.json(rows);
    } catch (error) {
        console.error("Error fetching rules:", error);
        res.status(500).json({ error: "Failed to fetch rules" });
    }
});

// POST /api/rules
router.post("/", async (req, res) => {
    const { product_id, rules, comparison, amount, color } = req.body;
    if (!rules || !comparison || amount === undefined || !color) {
        return res.status(400).json({ error: "All fields except product_id are required" });
    }
    
    try {
        const results = await queryDatabase(
            "INSERT INTO rules (product_id, rules, comparison, amount, color) VALUES (?, ?, ?, ?, ?)",
            [product_id || null, rules, comparison, amount, color]
        );
        res.status(201).json({ 
            message: "Rule added", 
            id: results.insertId,
            rule: { id: results.insertId, product_id, rules, comparison, amount, color }
        });
    } catch (err) {
        console.error("Error adding rule:", err);
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/rules/:ruleId
router.put("/:ruleId", async (req, res) => {
    const { ruleId } = req.params;
    const { rules, comparison, amount, color } = req.body;

    try {
        const existingRule = await queryDatabase("SELECT * FROM rules WHERE id = ?", [ruleId]);
        if (existingRule.length === 0) {
            return res.status(404).json({ error: "Rule not found" });
        }

        await queryDatabase(
            "UPDATE rules SET rules = ?, comparison = ?, amount = ?, color = ? WHERE id = ?",
            [rules, comparison, amount, color, ruleId]
        );

        res.status(200).json({ 
            message: "Rule updated",
            rule: { id: ruleId, rules, comparison, amount, color }
        });
    } catch (err) {
        console.error("Error updating rule:", err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/rules/:ruleId
router.delete("/:ruleId", async (req, res) => {
    const { ruleId } = req.params;
    try {
        const results = await queryDatabase("DELETE FROM rules WHERE id = ?", [ruleId]);
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
