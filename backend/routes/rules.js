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
 * Route to get all rules.
 * This route fetches all rules from the rules table.
 */
router.get("/", async (req, res) => {
    const query = "SELECT * FROM rules";
    try {
        const results = await queryDatabase(query);
        res.json(results);
    } catch (err) {
        console.error("Error fetching rules:", err);
        res.status(500).json({ error: err.message });
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

// Export the router to be used in other parts of the application
module.exports = router;
