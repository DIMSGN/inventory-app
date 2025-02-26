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

module.exports = router;
