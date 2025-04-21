// Pure Node.js HTTP server implementation without Express
// This bypasses all the Express dependency issues
require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const mysql = require('mysql2');

// Log startup info
console.log(`Starting server in ${process.env.NODE_ENV || 'development'} mode`);
console.log(`PORT: ${process.env.PORT || 8080}`);

// Basic MIME type map
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm',
  '.ico': 'image/x-icon'
};

// Database connection
const dbConfig = {
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  port: process.env.MYSQL_ADDON_PORT || 3306,
  connectionLimit: 5
};

// Create connection pool
let pool;
try {
  pool = mysql.createPool(dbConfig);
  console.log('Database connection pool created');
} catch (err) {
  console.error('Error creating database pool:', err.message);
}

// Test database connection
function testConnection() {
  if (!pool) return false;
  
  try {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Database connection error:', err.message);
        return;
      }
      
      connection.query('SELECT 1', (error, results) => {
        connection.release();
        
        if (error) {
          console.error('Database query test failed:', error.message);
          return;
        }
        
        console.log('✓ Successfully connected to MySQL database and verified query execution!');
      });
    });
  } catch (error) {
    console.error('Error testing connection:', error);
  }
}

// Test the database connection
testConnection();

// Middleware to parse JSON request bodies
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    if (req.method === 'GET' || req.method === 'HEAD') {
      return resolve({});
    }
    
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('application/json')) {
      return resolve({});
    }
    
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const parsedBody = body ? JSON.parse(body) : {};
        resolve(parsedBody);
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    
    req.on('error', reject);
  });
}

// Simple query function
function queryDatabase(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (!pool) {
      return reject(new Error('Database connection not available'));
    }
    
    pool.query(sql, params, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
}

// API Handlers
const apiHandlers = {
  // Health check endpoint
  '/api/health': async (req, res) => {
    // Check database connection
    let dbStatus = 'unknown';
    
    try {
      await queryDatabase('SELECT 1');
      dbStatus = 'connected';
    } catch (err) {
      dbStatus = 'disconnected';
      console.error('Health check - Database error:', err.message);
    }
    
    return {
      status: "API is running",
      database: dbStatus,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    };
  },
  
  // Products API
  '/api/products': async (req, res) => {
    const method = req.method;
    const urlParts = url.parse(req.url, true);
    const pathParts = urlParts.pathname.split('/').filter(Boolean);
    
    // GET /api/products (list all products)
    if (method === 'GET' && pathParts.length === 2) {
      try {
        const rows = await queryDatabase(`
          SELECT p.*, 
                c.name AS category_name, 
                u.name AS unit_name
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          LEFT JOIN units u ON p.unit_id = u.id
        `);
        return rows;
      } catch (error) {
        throw new Error(`Failed to fetch products: ${error.message}`);
      }
    }
    
    // GET /api/products/:id (get a single product)
    if (method === 'GET' && pathParts.length === 3) {
      const productId = pathParts[2];
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
          res.statusCode = 404;
          return { error: "Product not found" };
        }
        
        return results[0];
      } catch (error) {
        throw new Error(`Failed to fetch product: ${error.message}`);
      }
    }
    
    // Not found
    res.statusCode = 404;
    return { error: "API endpoint not found" };
  }
};

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const urlParts = url.parse(req.url, true);
  const pathname = urlParts.pathname;
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }
  
  try {
    // Check if this is an API request
    if (pathname.startsWith('/api/')) {
      // Find the correct handler based on the URL path
      const handler = Object.keys(apiHandlers).find(path => {
        // Exact match
        if (path === pathname) return true;
        
        // Pattern match for paths with IDs
        const pathParts = path.split('/').filter(Boolean);
        const urlPathParts = pathname.split('/').filter(Boolean);
        
        if (pathParts.length === 2 && urlPathParts.length === 3 && 
            pathParts[0] === urlPathParts[0] && pathParts[1] === urlPathParts[1]) {
          return true;
        }
        
        return false;
      });
      
      if (handler) {
        // Parse request body for POST, PUT, PATCH methods
        let body = {};
        if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
          body = await parseJsonBody(req);
          req.body = body;
        }
        
        // Call the handler
        try {
          const result = await apiHandlers[handler](req, res);
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = res.statusCode || 200;
          res.end(JSON.stringify(result));
        } catch (error) {
          console.error(`API error for ${pathname}:`, error);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: error.message || 'Internal Server Error' }));
        }
        return;
      }
      
      // API endpoint not found
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'API endpoint not found' }));
      return;
    }
    
    // Serve static files from React build
    let filePath;
    
    if (pathname === '/' || pathname === '/index.html') {
      filePath = path.join(__dirname, 'frontend', 'build', 'index.html');
    } else {
      filePath = path.join(__dirname, 'frontend', 'build', pathname);
    }
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // If the file doesn't exist, serve the index.html for client-side routing
        filePath = path.join(__dirname, 'frontend', 'build', 'index.html');
      }
      
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end('Not Found');
          return;
        }
        
        // Get the file extension and MIME type
        const extname = path.extname(filePath);
        const contentType = MIME_TYPES[extname] || 'application/octet-stream';
        
        res.statusCode = 200;
        res.setHeader('Content-Type', contentType);
        res.end(data);
      });
    });
    
  } catch (error) {
    console.error('Server error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
});

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  server.close(() => {
    console.log('HTTP server closed.');
    if (pool) {
      pool.end(() => {
        console.log('Database connection closed.');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
});

module.exports = server;