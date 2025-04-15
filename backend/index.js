const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const productsRouter = require("./routes/products");
const rulesRouter = require("./routes/rules");
const categoriesRouter = require("./routes/categories");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Create Express app
const app = express();

// Basic CORS setup
app.use(cors());

// Body parsing middleware
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Wait for database connection before setting up routes
const pool = require('./db/connection');

// API routes
app.use("/api/products", productsRouter);
app.use("/api/rules", rulesRouter);
app.use("/api/categories", categoriesRouter);

// API health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "API is running",
    timestamp: new Date().toISOString()
  });
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Catch-all route handler
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message 
  });
});

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing HTTP server.');
  server.close(() => {
    console.log('HTTP server closed.');
    pool.end(() => {
      console.log('Database connection closed.');
      process.exit(0);
    });
  });
});

module.exports = app;
