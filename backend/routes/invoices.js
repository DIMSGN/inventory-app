const express = require("express");
const router = express.Router();
const queryDatabase = require("../utils/queryDatabase");

// GET /api/invoices - Get all invoices with supplier details
router.get("/", async (req, res) => {
    try {
        const invoices = await queryDatabase(`
            SELECT pi.*, s.name as supplier_name
            FROM product_invoices pi
            JOIN suppliers s ON pi.supplier_id = s.id
            ORDER BY pi.invoice_date DESC
        `);
        res.json(invoices);
    } catch (err) {
        console.error("Error fetching invoices:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/invoices/:id - Get invoice by ID with items and product details
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        // Get the invoice header
        const invoice = await queryDatabase(`
            SELECT pi.*, s.name as supplier_name, s.phone as supplier_phone, s.email as supplier_email
            FROM product_invoices pi
            JOIN suppliers s ON pi.supplier_id = s.id
            WHERE pi.id = ?
        `, [id]);
        
        if (invoice.length === 0) {
            return res.status(404).json({ error: "Invoice not found" });
        }
        
        // Get the invoice items with product details
        const items = await queryDatabase(`
            SELECT pii.*, p.product_name, u.name as unit_name
            FROM product_invoice_items pii
            JOIN products p ON pii.product_id = p.product_id
            JOIN units u ON p.unit_id = u.id
            WHERE pii.invoice_id = ?
        `, [id]);
        
        // Combine invoice and items
        const result = {
            ...invoice[0],
            items: items
        };
        
        res.json(result);
    } catch (err) {
        console.error(`Error fetching invoice ${id}:`, err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/invoices - Add a new invoice with items
router.post("/", async (req, res) => {
    const { supplier_id, invoice_date, items } = req.body;
    
    if (!supplier_id || !invoice_date || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ 
            error: "Supplier ID, invoice date, and at least one item are required" 
        });
    }
    
    try {
        // Start a transaction
        await queryDatabase("START TRANSACTION");
        
        // Calculate total amount from items
        const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
        
        // Insert invoice header
        const invoiceResult = await queryDatabase(
            "INSERT INTO product_invoices (supplier_id, invoice_date, total_amount) VALUES (?, ?, ?)",
            [supplier_id, invoice_date, totalAmount]
        );
        
        const invoiceId = invoiceResult.insertId;
        
        // Insert invoice items
        for (const item of items) {
            if (!item.product_id || !item.quantity || !item.unit_price) {
                await queryDatabase("ROLLBACK");
                return res.status(400).json({ error: "Each item must have product_id, quantity, and unit_price" });
            }
            
            await queryDatabase(
                "INSERT INTO product_invoice_items (invoice_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
                [invoiceId, item.product_id, item.quantity, item.unit_price]
            );
            
            // Update product inventory
            await queryDatabase(
                "UPDATE products SET amount = amount + ? WHERE product_id = ?",
                [item.quantity, item.product_id]
            );
            
            // Log inventory change
            await queryDatabase(
                `INSERT INTO inventory_log 
                (product_id, action_type, quantity_change, notes) 
                VALUES (?, 'purchase', ?, ?)`,
                [item.product_id, item.quantity, `Received from invoice #${invoiceId}`]
            );
        }
        
        // Commit the transaction
        await queryDatabase("COMMIT");
        
        res.status(201).json({
            message: "Invoice added successfully",
            invoice_id: invoiceId
        });
    } catch (err) {
        // Rollback in case of error
        await queryDatabase("ROLLBACK");
        console.error("Error adding invoice:", err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/invoices/:id - Delete an invoice
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        // Start a transaction
        await queryDatabase("START TRANSACTION");
        
        // Get all items to update inventory
        const items = await queryDatabase(
            "SELECT product_id, quantity FROM product_invoice_items WHERE invoice_id = ?",
            [id]
        );
        
        if (items.length === 0) {
            await queryDatabase("ROLLBACK");
            return res.status(404).json({ error: "Invoice not found or has no items" });
        }
        
        // Reverse inventory changes for each item
        for (const item of items) {
            // Decrease product inventory
            await queryDatabase(
                "UPDATE products SET amount = amount - ? WHERE product_id = ?",
                [item.quantity, item.product_id]
            );
            
            // Log inventory change
            await queryDatabase(
                `INSERT INTO inventory_log 
                (product_id, action_type, quantity_change, notes) 
                VALUES (?, 'adjustment', ?, ?)`,
                [item.product_id, -item.quantity, `Invoice #${id} deleted`]
            );
        }
        
        // Delete invoice items first (due to foreign key constraints)
        await queryDatabase("DELETE FROM product_invoice_items WHERE invoice_id = ?", [id]);
        
        // Then delete the invoice header
        const result = await queryDatabase("DELETE FROM product_invoices WHERE id = ?", [id]);
        
        if (result.affectedRows === 0) {
            await queryDatabase("ROLLBACK");
            return res.status(404).json({ error: "Invoice not found" });
        }
        
        // Commit the transaction
        await queryDatabase("COMMIT");
        
        res.status(200).json({ message: "Invoice deleted successfully" });
    } catch (err) {
        // Rollback in case of error
        await queryDatabase("ROLLBACK");
        console.error(`Error deleting invoice ${id}:`, err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 