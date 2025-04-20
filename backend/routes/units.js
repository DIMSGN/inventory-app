const express = require("express");
const router = express.Router();
const queryDatabase = require("../utils/queryDatabase");

// GET /api/units - Get all units
router.get("/", async (req, res) => {
    try {
        const units = await queryDatabase("SELECT * FROM units ORDER BY name");
        res.json(units);
    } catch (err) {
        console.error("Error fetching units:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/units/:unitId - Get unit by ID
router.get("/:unitId", async (req, res) => {
    const { unitId } = req.params;
    
    try {
        const unit = await queryDatabase("SELECT * FROM units WHERE id = ?", [unitId]);
        
        if (unit.length === 0) {
            return res.status(404).json({ error: "Unit not found" });
        }
        
        res.json(unit[0]);
    } catch (err) {
        console.error(`Error fetching unit ${unitId}:`, err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/units - Add a new unit
router.post("/", async (req, res) => {
    const { name, conversion_factor } = req.body;
    
    if (!name) {
        return res.status(400).json({ error: "Unit name is required" });
    }
    
    try {
        // Check if unit already exists
        const existing = await queryDatabase("SELECT * FROM units WHERE name = ?", [name]);
        
        if (existing.length > 0) {
            return res.status(400).json({ error: "Unit with this name already exists" });
        }
        
        const results = await queryDatabase(
            "INSERT INTO units (name, conversion_factor) VALUES (?, ?)",
            [name, conversion_factor || null]
        );
        
        const newUnit = await queryDatabase("SELECT * FROM units WHERE id = ?", [results.insertId]);
        
        res.status(201).json({
            message: "Unit added successfully",
            unit: newUnit[0]
        });
    } catch (err) {
        console.error("Error adding unit:", err);
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/units/:unitId - Update a unit
router.put("/:unitId", async (req, res) => {
    const { unitId } = req.params;
    const { name, conversion_factor } = req.body;
    
    if (!name && conversion_factor === undefined) {
        return res.status(400).json({ error: "No update fields provided" });
    }
    
    try {
        // Check if unit exists
        const unit = await queryDatabase("SELECT * FROM units WHERE id = ?", [unitId]);
        
        if (unit.length === 0) {
            return res.status(404).json({ error: "Unit not found" });
        }
        
        // Check if name is taken by another unit
        if (name) {
            const existing = await queryDatabase(
                "SELECT * FROM units WHERE name = ? AND id != ?", 
                [name, unitId]
            );
            
            if (existing.length > 0) {
                return res.status(400).json({ error: "Another unit with this name already exists" });
            }
        }
        
        // Build the SQL query dynamically based on provided fields
        let updates = [];
        let params = [];
        
        if (name !== undefined) {
            updates.push("name = ?");
            params.push(name);
        }
        
        if (conversion_factor !== undefined) {
            updates.push("conversion_factor = ?");
            params.push(conversion_factor);
        }
        
        // Add the unitId as the last parameter
        params.push(unitId);
        
        // Execute the update query
        const updateQuery = `UPDATE units SET ${updates.join(", ")} WHERE id = ?`;
        const results = await queryDatabase(updateQuery, params);
        
        if (results.affectedRows === 0) {
            return res.status(500).json({ error: "Failed to update unit" });
        }
        
        const updatedUnit = await queryDatabase("SELECT * FROM units WHERE id = ?", [unitId]);
        
        res.status(200).json({
            message: "Unit updated successfully",
            unit: updatedUnit[0]
        });
    } catch (err) {
        console.error(`Error updating unit ${unitId}:`, err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/units/:unitId - Delete a unit
router.delete("/:unitId", async (req, res) => {
    const { unitId } = req.params;
    
    try {
        // Check if unit is in use
        const products = await queryDatabase(
            "SELECT COUNT(*) as count FROM products WHERE unit_id = ?", 
            [unitId]
        );
        
        if (products[0].count > 0) {
            return res.status(400).json({ 
                error: "Cannot delete unit that is in use by products",
                productsCount: products[0].count
            });
        }
        
        const result = await queryDatabase("DELETE FROM units WHERE id = ?", [unitId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Unit not found" });
        }
        
        res.status(200).json({ message: "Unit deleted successfully" });
    } catch (err) {
        console.error(`Error deleting unit ${unitId}:`, err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 