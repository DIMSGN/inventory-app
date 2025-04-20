const express = require("express");
const router = express.Router();
const queryDatabase = require("../utils/queryDatabase");

// Utility to handle database errors
const handleDatabaseError = (res, error, operation) => {
    console.error(`Error ${operation}:`, error);
    // Check if it's a connection error
    if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST') {
        return res.status(503).json({ 
            error: "Database connection error", 
            message: "Unable to connect to database. Please try again later."
        });
    }
    // General error
    return res.status(500).json({ error: `Failed to ${operation}` });
};

// GET /api/products
router.get("/", async (req, res) => {
    try {
        const rows = await queryDatabase(`
            SELECT p.*, 
                  c.name AS category_name, 
                  u.name AS unit_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN units u ON p.unit_id = u.id
        `);
        res.json(rows);
    } catch (error) {
        handleDatabaseError(res, error, "fetch products");
    }
});

// GET /api/products/:productId
router.get("/:productId", async (req, res) => {
    const { productId } = req.params;
    try {
        const results = await queryDatabase(`
            SELECT p.*, 
                  c.name AS category_name, 
                  u.name AS unit_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN units u ON p.unit_id = u.id
            WHERE p.product_id = ?
        `, [productId]);
        
        if (results.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(results[0]);
    } catch (error) {
        handleDatabaseError(res, error, "fetch product");
    }
});

// POST /api/products
router.post("/", async (req, res) => {
    try {
        const {
            product_name,
            unit_id,
            category_id,
            amount,
            price,
            purchase_price,
            pieces_per_package,
            received_date,
            expiration_date
        } = req.body;

        // Required fields validation
        if (!product_name || !unit_id || !category_id || amount === undefined) {
            return res.status(400).json({ error: "Required fields missing" });
        }

        // Insert the product
        const insertQuery = `
            INSERT INTO products (
                product_name, unit_id, category_id, amount, 
                price, purchase_price, pieces_per_package, received_date, expiration_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const result = await queryDatabase(insertQuery, [
            product_name,
            unit_id,
            category_id,
            amount,
            price || null,
            purchase_price || null,
            pieces_per_package || null,
            received_date || null,
            expiration_date || null
        ]);

        // Get the new product with its name
        const newProduct = await queryDatabase(`
            SELECT 
                p.*, 
                c.name AS category_name,
                u.name AS unit_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN units u ON p.unit_id = u.id
            WHERE p.product_id = ?
        `, [result.insertId]);

        res.status(201).json({
            message: "Product added successfully",
            product: newProduct[0]
        });
    } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/products/:id
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const {
            product_name,
            unit_id,
            category_id,
            amount,
            price,
            purchase_price,
            pieces_per_package,
            received_date,
            expiration_date
        } = req.body;

        // Build update query dynamically
        const updates = [];
        const params = [];

        if (product_name !== undefined) {
            updates.push("product_name = ?");
            params.push(product_name);
        }

        if (unit_id !== undefined) {
            updates.push("unit_id = ?");
            params.push(unit_id);
        }

        if (category_id !== undefined) {
            updates.push("category_id = ?");
            params.push(category_id);
        }

        if (amount !== undefined) {
            updates.push("amount = ?");
            params.push(amount);
        }

        if (price !== undefined) {
            updates.push("price = ?");
            params.push(price);
        }

        if (purchase_price !== undefined) {
            updates.push("purchase_price = ?");
            params.push(purchase_price);
        }
        
        if (pieces_per_package !== undefined) {
            updates.push("pieces_per_package = ?");
            params.push(pieces_per_package);
        }

        if (received_date !== undefined) {
            updates.push("received_date = ?");
            params.push(received_date);
        }

        if (expiration_date !== undefined) {
            updates.push("expiration_date = ?");
            params.push(expiration_date);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: "No fields to update provided" });
        }

        // Add the product ID to params
        params.push(id);

        // Execute the update
        const updateQuery = `UPDATE products SET ${updates.join(", ")} WHERE product_id = ?`;
        await queryDatabase(updateQuery, params);

        // Fetch the updated product with category and unit names
        const updatedProduct = await queryDatabase(`
            SELECT 
                p.*, 
                c.name AS category_name,
                u.name AS unit_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN units u ON p.unit_id = u.id
            WHERE p.product_id = ?
        `, [id]);

        if (updatedProduct.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({
            message: "Product updated successfully",
            product: updatedProduct[0]
        });
    } catch (err) {
        console.error(`Error updating product ${id}:`, err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/products/:productId
router.delete("/:productId", async (req, res) => {
    const { productId } = req.params;
    try {
        const results = await queryDatabase("DELETE FROM products WHERE product_id = ?", [productId]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        handleDatabaseError(res, err, "delete product");
    }
});

module.exports = router;