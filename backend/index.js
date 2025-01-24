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
app.use(cors());
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

/**
 * Explanation of Imports:
 * - express: This module is used to create an Express application, which provides a robust set of features for web and mobile applications.
 * - cors: This module is used to enable Cross-Origin Resource Sharing (CORS), allowing the server to accept requests from different origins.
 * - productRoutes: This module contains the routes for handling product-related API endpoints.
 * - ruleRoutes: This module contains the routes for handling rule-related API endpoints.
 * 
 * Why it’s implemented this way:
 * - The express() function is used to create an instance of the Express application.
 * - The cors() middleware is used to enable CORS, allowing the server to accept requests from different origins.
 * - The express.json() middleware is used to parse incoming JSON requests, making it easier to work with JSON data in the request body.
 * - The app.use() method is used to mount the product and rule routes on the /api/products and /api/rules paths, respectively.
 * - The app.listen() method is used to start the server and listen on the defined port, logging a message to the console when the server is running.
 */
