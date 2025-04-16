const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");

// Try to load optional modules
let helmet, compression;
try {
  helmet = require("helmet");
} catch (e) {
  console.log("Helmet module not available, skipping security middleware");
}

try {
  compression = require("compression");
} catch (e) {
  console.log("Compression module not available, skipping compression middleware");
}

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Create Express app
const app = express();

// Log environment variables for debugging
console.log('Environment:');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`PORT: ${process.env.PORT || 3000}`);

// Security and performance middleware for production
if (process.env.NODE_ENV === 'production') {
  if (helmet) {
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https:"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "https:", "wss:", "http:"],
          fontSrc: ["'self'", "data:", "https:"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'self'"]
        }
      },
      // Don't set X-Powered-By header
      hidePoweredBy: true,
      // Disable strict-transport-security for now (can enable it after everything works)
      strictTransportSecurity: false
    }));
    console.log("Helmet security middleware enabled with relaxed CSP");
  }
  
  if (compression) {
    app.use(compression());
    console.log("Compression middleware enabled");
  }
}

// Enhanced CORS setup - simplified and permissive
app.use(cors({
  // Allow requests from any origin in production
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
console.log("CORS configured with permissive settings");

// Body parsing middleware
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Connect to database - load first to log any connection issues early
console.log('Initializing database connection...');
const pool = require('./db/connection');

// Import routes - deferred loading them until after the DB connection is established
const productsRouter = require("./routes/products");
const rulesRouter = require("./routes/rules");
const categoriesRouter = require("./routes/categories");

// API routes
app.use("/api/products", productsRouter);
app.use("/api/rules", rulesRouter);
app.use("/api/categories", categoriesRouter);

// API health check
app.get("/api/health", (req, res) => {
  // Check database connection
  let dbStatus = 'unknown';
  
  try {
    pool.getConnection((err, connection) => {
      if (err) {
        dbStatus = 'disconnected';
        console.error('Health check - Database connection error:', err.message);
      } else {
        connection.release();
        dbStatus = 'connected';
      }
      
      res.json({ 
        status: "API is running",
        database: dbStatus,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.json({ 
      status: "API is running",
      database: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Handle API 404s
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Catch-all route for React app - must be last
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message 
  });
});

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
