const express = require("express");
const router = express.Router();
const queryDatabase = require("../utils/queryDatabase");

// GET /api/products
router.get("/", async (req, res) => {
    console.log("GET /api/products called - fetching all products from database");
    
    try {
        // Log query parameters if any
        if (Object.keys(req.query).length > 0) {
            console.log("Query parameters:", req.query);
        }
        
        const rows = await queryDatabase("SELECT * FROM products");
        console.log(`Retrieved ${rows.length} products from database:`);
        
        // Log product IDs for debugging
        if (rows.length > 0) {
            const productIds = rows.map(p => p.product_id).join(', ');
            console.log(`Product IDs in database: ${productIds}`);
        }
        
        res.json(rows);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// POST /api/products
router.post("/", async (req, res) => {
    const { product_id, product_name, unit, category, amount } = req.body;
    console.log("Request body:", req.body); // Log the request body
    if (!product_id || !product_name || !unit || !category || amount === undefined) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const query = "INSERT INTO products (product_id, product_name, unit, category, amount) VALUES (?, ?, ?, ?, ?)";
    console.log("SQL query:", query); // Log the SQL query
    console.log("Parameters:", [product_id, product_name, unit, category, amount]); // Log the parameters
    try {
        const results = await queryDatabase(query, [product_id, product_name, unit, category, amount]);
        res.status(201).json({ message: "Product added", id: results.insertId });
    } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/products/:id
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { product_name, unit, category, amount } = req.body;

    const fetchQuery = "SELECT * FROM products WHERE product_id = ?";
    try {
        const existingProduct = await queryDatabase(fetchQuery, [id]);
        if (existingProduct.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        const updateQuery = "UPDATE products SET product_name = ?, unit = ?, category = ?, amount = ? WHERE product_id = ?";
        await queryDatabase(updateQuery, [product_name, unit, category, amount, id]);

        res.status(200).json({ message: "Product updated", product: { product_id: id, product_name, unit, category, amount } });
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    console.log(`Attempting to delete product with ID: ${id}`);
    
    try {
        // First, get the database structure to understand the table
        const tableSchema = await queryDatabase("DESCRIBE products");
        console.log("Database table schema:", tableSchema);
        
        // Get the product details first to verify it exists and log it
        const checkQuery = "SELECT * FROM products WHERE product_id = ?";
        const product = await queryDatabase(checkQuery, [id]);
        
        console.log(`Found product for deletion:`, product);
        
        if (product.length === 0) {
            console.log(`No product found with product_id: ${id}`);
            return res.status(404).json({ error: "Product not found" });
        }
        
        // Log the exact product we're trying to delete
        const productToDelete = product[0];
        console.log("Product to delete:", productToDelete);
        
        // Check if product has a numeric database ID separate from product_id
        const hasNumericId = productToDelete.id !== undefined;
        if (hasNumericId) {
            console.log(`Product has numeric ID: ${productToDelete.id}`);
        }
        
        // Try a more forceful deletion without transaction
        console.log(`Executing deletion for product_id: ${id}`);
        
        // Use a direct delete query with product_id
        const deleteQuery = "DELETE FROM products WHERE product_id = ?";
        const results = await queryDatabase(deleteQuery, [id]);
        
        console.log(`Deletion results:`, results);
        
        if (results.affectedRows === 0) {
            console.log("No rows affected. Deletion failed with product_id.");
            
            if (hasNumericId) {
                // Try deletion by numeric ID as fallback
                console.log(`Trying deletion by numeric ID: ${productToDelete.id}`);
                const altDeleteQuery = "DELETE FROM products WHERE id = ?";
                const altResults = await queryDatabase(altDeleteQuery, [productToDelete.id]);
                
                console.log(`Alternative deletion results:`, altResults);
                
                if (altResults.affectedRows === 0) {
                    return res.status(404).json({ 
                        error: "Product could not be deleted",
                        details: "No rows affected by either product_id or id field" 
                    });
                }
            } else {
                return res.status(404).json({ 
                    error: "Product could not be deleted",
                    details: "No rows affected and no numeric ID to try" 
                });
            }
        }
        
        console.log(`Successfully deleted product with ID: ${id}`);
        
        // Force a server-side check to verify deletion
        const verifyQuery = "SELECT * FROM products WHERE product_id = ?";
        const verifyResult = await queryDatabase(verifyQuery, [id]);
        
        if (verifyResult.length > 0) {
            console.log(`WARNING: Product still exists after deletion!`, verifyResult);
            return res.status(500).json({ 
                error: "Product deletion verification failed", 
                details: "Product still exists in database after deletion"
            });
        }
        
        res.status(200).json({ 
            message: "Product deleted successfully",
            verification: "Product no longer exists in database"
        });
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({ 
            error: "Failed to delete product", 
            details: err.message,
            stack: err.stack
        });
    }
});

// GET /api/products/:id - Check if product exists
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const isVerification = req.query.verify === 'true';
    
    console.log(`GET /api/products/${id} called${isVerification ? ' (verification check)' : ''}`);
    
    try {
        const query = "SELECT * FROM products WHERE product_id = ?";
        const product = await queryDatabase(query, [id]);
        
        if (product.length === 0) {
            console.log(`Product with ID ${id} not found in database`);
            
            if (isVerification) {
                return res.json({ exists: false, message: "Product does not exist" });
            } else {
                return res.status(404).json({ error: "Product not found" });
            }
        }
        
        console.log(`Product with ID ${id} found:`, product[0]);
        
        if (isVerification) {
            return res.json({ exists: true, product: product[0] });
        } else {
            return res.json(product[0]);
        }
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        res.status(500).json({ error: "Failed to fetch product" });
    }
});

module.exports = router;