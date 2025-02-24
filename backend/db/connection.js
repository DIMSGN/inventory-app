// Import the mysql module to interact with the MySQL database
const mysql = require("mysql");
require('dotenv').config(); // Load environment variables from .env file

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB,
    port: process.env.MYSQL_ADDON_PORT,
    ssl: { rejectUnauthorized: false }, // Required for Clever Cloud
});

// Connect to the MySQL database
db.connect((err) => {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Connected to MySQL database");
});

// Export the database connection object for use in other parts of the application
module.exports = db;
