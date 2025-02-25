require('dotenv').config(); // Load environment variables from .env file
const mysql = require("mysql");

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
    connectionLimit: 10, // Set the maximum number of connections in the pool
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB,
    port: process.env.MYSQL_ADDON_PORT,
    ssl: { rejectUnauthorized: false }, // Required for Clever Cloud
});

// Export the pool object for use in other parts of the application
module.exports = pool;
