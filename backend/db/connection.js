const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mysql = require('mysql2');

// Always log critical database configuration in production for debugging
console.log('Database Configuration:');
console.log(`Host: ${process.env.MYSQL_ADDON_HOST || 'NOT_SET'}`);
console.log(`Database: ${process.env.MYSQL_ADDON_DB || 'NOT_SET'}`);
console.log(`Port: ${process.env.MYSQL_ADDON_PORT || 'NOT_SET'}`);
console.log(`User: ${process.env.MYSQL_ADDON_USER ? 'SET' : 'NOT_SET'}`);
console.log(`Password: ${process.env.MYSQL_ADDON_PASSWORD ? 'SET' : 'NOT_SET'}`);

// Connection configuration
const dbConfig = {
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  port: process.env.MYSQL_ADDON_PORT || 3306,
  // Reduce connection limit to avoid exceeding the maximum user connections (5)
  connectionLimit: 5, 
  waitForConnections: true,
  queueLimit: 10,
  // Add connection timeout
  connectTimeout: 10000,
  // Add keepalive to prevent connections from being closed by the server
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  // Enable connection timeouts
  acquireTimeout: 15000,
  // Ensure connections are released back to the pool after use
  releaseTimeout: 5000,
  ssl: {
    rejectUnauthorized: false
  }
};

// Check that all required environment variables are set
const requiredEnvVars = [
  'MYSQL_ADDON_HOST',
  'MYSQL_ADDON_USER',
  'MYSQL_ADDON_PASSWORD',
  'MYSQL_ADDON_DB',
  'MYSQL_ADDON_PORT'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars.join(', '));
  console.error('API will start but database operations will fail');
}

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Maximum retry attempts for connection
const MAX_RETRY_ATTEMPTS = 5;

// Connection monitor
let connectionAttempts = 0;
let activeConnections = 0;

// Function to test database connection with retries
function testConnection(retryAttempt = 0) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error(`Database connection attempt ${retryAttempt + 1} failed:`, err.message);
      
      if (retryAttempt < MAX_RETRY_ATTEMPTS) {
        const delay = Math.min(1000 * Math.pow(2, retryAttempt), 30000);
        console.log(`Retrying connection in ${delay/1000} seconds...`);
        setTimeout(() => testConnection(retryAttempt + 1), delay);
      } else {
        console.error(`Failed to connect to database after ${MAX_RETRY_ATTEMPTS} attempts.`);
        console.error('API will start but database operations will fail');
      }
      return;
    }
    
    activeConnections++;
    connectionAttempts++;
    console.log(`Connection established. Active connections: ${activeConnections}`);
    
    // Check if we can actually query the database
    connection.query('SELECT 1', (error, results) => {
      connection.release();
      activeConnections--;
      console.log(`Connection released. Remaining active connections: ${activeConnections}`);
      
      if (error) {
        console.error('Database query test failed:', error.message);
        return;
      }
      
      console.log('✓ Successfully connected to MySQL database and verified query execution!');
    });
  });
}

// Test the connection on startup
testConnection();

// Add error listener for unexpected errors
pool.on('error', function (err) {
  console.error('Unexpected error on idle client', err);
  // Don't immediately retry on error to avoid connection spikes
  setTimeout(() => testConnection(), 5000);
});

// Add connection acquire listeners
pool.on('acquire', function (connection) {
  activeConnections++;
  console.log(`Connection %d acquired. Active connections: ${activeConnections}`, connection.threadId);
});

// Add connection release listeners
pool.on('release', function (connection) {
  activeConnections--;
  console.log(`Connection %d released. Remaining active connections: ${activeConnections}`, connection.threadId);
});

// Don't terminate the app on connection failures
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't crash the server, just log the error
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Closing database connections...');
  pool.end(function (err) {
    if (err) {
      console.error('Error closing connection pool:', err);
    } else {
      console.log('All database connections closed.');
    }
    process.exit(0);
  });
});

module.exports = pool;
