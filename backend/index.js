// Import the express module to create an Express application
const express = require("express");
// Import the cors module to enable Cross-Origin Resource Sharing
const cors = require("cors");
// Import the product routes module to handle product-related API endpoints
const productRoutes = require("./routes/products");
// Import the rule routes module to handle rule-related API endpoints
const ruleRoutes = require("./routes/rules");

// Create an instance of the Express application
const app = express();
// Define the port number on which the server will listen for incoming requests
const PORT = process.env.PORT || 5000;

// Middleware to enable Cross-Origin Resource Sharing
app.use(cors({ origin: "https://dimsgn.github.io" })); // Allows requests from any origin
// Middleware to parse incoming JSON requests
app.use(express.json());

// Use the product routes for any requests to /api/products
app.use("/api/products", productRoutes);
// Use the rule routes for any requests to /api/rules
app.use("/api/rules", ruleRoutes);

// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
