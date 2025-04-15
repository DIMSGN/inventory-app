require('dotenv').config();
const mysql = require('mysql2');

// Log environment variables (without exposing sensitive data)
console.log(`Database Configuration:
- Host: ${process.env.MYSQL_ADDON_HOST ? '✓ Set' : '✗ Missing'}
- User: ${process.env.MYSQL_ADDON_USER ? '✓ Set' : '✗ Missing'}
- Password: ${process.env.MYSQL_ADDON_PASSWORD ? '✓ Set' : '✗ Missing'}
- Database: ${process.env.MYSQL_ADDON_DB ? '✓ Set' : '✗ Missing'}
- Port: ${process.env.MYSQL_ADDON_PORT || '3306 (default)'}`);

// Connection configuration
const dbConfig = {
    connectionLimit: 10,
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB,
    port: process.env.MYSQL_ADDON_PORT || 3306,
    waitForConnections: true,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    // SSL configuration for Clever Cloud
    ssl: {
        rejectUnauthorized: false // Required for Clever Cloud MySQL addon
    },
    // Set connection timeout
    connectTimeout: 30000, // 30 seconds
    // Configure automatic reconnection
    reconnect: {
        max_retries: 10,
        max_delay: 5000 // 5 seconds
    }
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Maximum retry attempts for connection
const MAX_RETRY_ATTEMPTS = 5;
let retryCount = 0;

// Function to test database connection with retries
function testConnection(retryAttempt = 0) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(`Database connection attempt ${retryAttempt + 1} failed:`, err.message);
            
            // Log specific error information
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.error('Database connection was closed.');
            } else if (err.code === 'ER_CON_COUNT_ERROR') {
                console.error('Database has too many connections.');
            } else if (err.code === 'ECONNREFUSED') {
                console.error('Database connection was refused.');
            } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
                console.error('Access denied. Check your database credentials.');
            } else {
                console.error('Unknown database error:', err.code);
            }
            
            // Retry connection with exponential backoff
            if (retryAttempt < MAX_RETRY_ATTEMPTS) {
                const delay = Math.min(1000 * Math.pow(2, retryAttempt), 30000); // Exponential backoff with max 30s
                console.log(`Retrying connection in ${delay/1000} seconds...`);
                setTimeout(() => testConnection(retryAttempt + 1), delay);
            } else {
                console.error(`Failed to connect to database after ${MAX_RETRY_ATTEMPTS} attempts.`);
                console.error('Application will continue, but database operations will fail.');
            }
            return;
        }
        
        console.log('✓ Successfully connected to MySQL database!');
        console.log(`Database: ${process.env.MYSQL_ADDON_DB} on ${process.env.MYSQL_ADDON_HOST}`);
        connection.release();
    });
}

// Test the connection on startup
testConnection();

// Add event listeners to the pool
pool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
});

pool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
});

pool.on('enqueue', function () {
    console.log('Waiting for available connection slot');
});

pool.on('error', function (err) {
    console.error('Unexpected error on idle client', err);
    // Attempt to reconnect
    testConnection();
});

module.exports = pool;
