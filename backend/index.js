const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const productsRouter = require("./routes/products");
const rulesRouter = require("./routes/rules");
const categoriesRouter = require("./routes/categories"); // Import categories router

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Pre-flight CORS middleware - respond to OPTIONS requests
app.options('*', cors());

// Enhanced CORS configuration
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Add headers middleware to ensure CORS works
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Request body parsing
app.use(express.json({
  limit: '2mb' // Limit body size
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '2mb' // Limit body size
}));

// Log request information (only in non-production)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    const start = Date.now();
    console.log(`${req.method} ${req.url}`);
    
    // Log request completion time
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
    });
    
    next();
  });
}

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Debug route to verify API is working
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "API is running", 
    env: process.env.NODE_ENV,
    version: require('./package.json').version || '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use("/api/products", productsRouter);
app.use("/api/rules", rulesRouter);
app.use("/api/categories", categoriesRouter); // Use categories router

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`404 - API route not found: ${req.originalUrl}`);
  }
  res.status(404).json({ 
    error: 'Not Found', 
    message: `The requested API endpoint ${req.originalUrl} does not exist.`
  });
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`Server error: ${err.message}`);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
});

// Use the port provided by the environment variable or default to 8080
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Database: ${process.env.MYSQL_ADDON_DB || 'Not configured'}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  }
});

// Handle graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown() {
  console.log('Received shutdown signal, closing server...');
  server.close(() => {
    console.log('Server closed gracefully');
    
    // Close database connections
    const pool = require('./db/connection');
    if (pool && typeof pool.end === 'function') {
      console.log('Closing database connections...');
      pool.end(err => {
        if (err) {
          console.error('Error closing database connections:', err);
        } else {
          console.log('Database connections closed');
        }
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
  
  // Force close after timeout
  setTimeout(() => {
    console.error('Forcing server shutdown after timeout');
    process.exit(1);
  }, 30000); // 30 seconds
}
