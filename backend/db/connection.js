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
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
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
    
    // Check if we can actually query the database
    connection.query('SELECT 1', (error, results) => {
      connection.release();
      
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
  testConnection();
});

// Don't terminate the app on connection failures
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't crash the server, just log the error
});

module.exports = pool;
