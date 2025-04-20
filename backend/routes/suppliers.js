const express = require("express");
const router = express.Router();
const queryDatabase = require("../utils/queryDatabase");

// GET /api/suppliers - Get all suppliers
router.get("/", async (req, res) => {
    try {
        const suppliers = await queryDatabase("SELECT * FROM suppliers ORDER BY name");
        res.json(suppliers);
    } catch (err) {
        console.error("Error fetching suppliers:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/suppliers/:id - Get supplier by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        const supplier = await queryDatabase("SELECT * FROM suppliers WHERE id = ?", [id]);
        
        if (supplier.length === 0) {
            return res.status(404).json({ error: "Supplier not found" });
        }
        
        res.json(supplier[0]);
    } catch (err) {
        console.error(`Error fetching supplier ${id}:`, err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/suppliers - Add a new supplier
router.post("/", async (req, res) => {
    const { name, phone, email } = req.body;
    
    if (!name) {
        return res.status(400).json({ error: "Supplier name is required" });
    }
    
    try {
        // Check if supplier with same name already exists
        const existing = await queryDatabase("SELECT * FROM suppliers WHERE name = ?", [name]);
        
        if (existing.length > 0) {
            return res.status(400).json({ error: "Supplier with this name already exists" });
        }
        
        const results = await queryDatabase(
            "INSERT INTO suppliers (name, phone, email) VALUES (?, ?, ?)",
            [name, phone || null, email || null]
        );
        
        const newSupplier = await queryDatabase("SELECT * FROM suppliers WHERE id = ?", [results.insertId]);
        
        res.status(201).json({
            message: "Supplier added successfully",
            supplier: newSupplier[0]
        });
    } catch (err) {
        console.error("Error adding supplier:", err);
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/suppliers/:id - Update a supplier
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, phone, email } = req.body;
    
    if (!name && phone === undefined && email === undefined) {
        return res.status(400).json({ error: "No update fields provided" });
    }
    
    try {
        // Check if supplier exists
        const supplier = await queryDatabase("SELECT * FROM suppliers WHERE id = ?", [id]);
        
        if (supplier.length === 0) {
            return res.status(404).json({ error: "Supplier not found" });
        }
        
        // Check if name is taken by another supplier
        if (name) {
            const existing = await queryDatabase(
                "SELECT * FROM suppliers WHERE name = ? AND id != ?", 
                [name, id]
            );
            
            if (existing.length > 0) {
                return res.status(400).json({ error: "Another supplier with this name already exists" });
            }
        }
        
        // Build the SQL query dynamically based on provided fields
        let updates = [];
        let params = [];
        
        if (name !== undefined) {
            updates.push("name = ?");
            params.push(name);
        }
        
        if (phone !== undefined) {
            updates.push("phone = ?");
            params.push(phone);
        }
        
        if (email !== undefined) {
            updates.push("email = ?");
            params.push(email);
        }
        
        // Add the supplierId as the last parameter
        params.push(id);
        
        // Execute the update query
        const updateQuery = `UPDATE suppliers SET ${updates.join(", ")} WHERE id = ?`;
        const results = await queryDatabase(updateQuery, params);
        
        if (results.affectedRows === 0) {
            return res.status(500).json({ error: "Failed to update supplier" });
        }
        
        const updatedSupplier = await queryDatabase("SELECT * FROM suppliers WHERE id = ?", [id]);
        
        res.status(200).json({
            message: "Supplier updated successfully",
            supplier: updatedSupplier[0]
        });
    } catch (err) {
        console.error(`Error updating supplier ${id}:`, err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/suppliers/:id - Delete a supplier
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        // Check if supplier has invoices
        const invoices = await queryDatabase(
            "SELECT COUNT(*) as count FROM product_invoices WHERE supplier_id = ?", 
            [id]
        );
        
        if (invoices[0].count > 0) {
            return res.status(400).json({ 
                error: "Cannot delete supplier with associated invoices",
                invoicesCount: invoices[0].count
            });
        }
        
        const result = await queryDatabase("DELETE FROM suppliers WHERE id = ?", [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Supplier not found" });
        }
        
        res.status(200).json({ message: "Supplier deleted successfully" });
    } catch (err) {
        console.error(`Error deleting supplier ${id}:`, err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 