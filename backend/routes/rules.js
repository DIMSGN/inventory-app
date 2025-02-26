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

// PUT /api/rules/:id
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

// DELETE /api/rules/:id
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
