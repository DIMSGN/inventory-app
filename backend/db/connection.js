require('dotenv').config(); // Load environment variables from .env file
const mysql = require("mysql");

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB,
    port: process.env.MYSQL_ADDON_PORT,
    ssl: { rejectUnauthorized: false }, // Required for Clever Cloud
});

// Connect to the MySQL database
connection.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to the database");
});

// Export the database connection object for use in other parts of the application
module.exports = connection;
