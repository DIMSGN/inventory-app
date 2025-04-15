const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mysql = require('mysql2');

// Log environment variables for debugging
if (process.env.NODE_ENV !== 'production') {
  console.log('Database Configuration:');
  console.log(`Host: ${process.env.MYSQL_ADDON_HOST}`);
  console.log(`Database: ${process.env.MYSQL_ADDON_DB}`);
  console.log(`Port: ${process.env.MYSQL_ADDON_PORT}`);
}

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
        process.exit(1);
      }
      return;
    }
    
    console.log('✓ Successfully connected to MySQL database!');
    connection.release();
  });
}

// Test the connection on startup
testConnection();

// Add error listener for unexpected errors
pool.on('error', function (err) {
  console.error('Unexpected error on idle client', err);
  testConnection();
});

module.exports = pool;
