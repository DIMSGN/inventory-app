// Import the mysql module to interact with the MySQL database
const mysql = require("mysql");

/**
 * Create a connection to the MySQL database.
 * The connection configuration includes:
 * - host: The hostname of the database server
 * - user: The username to connect to the database
 * - password: The password to connect to the database
 * - database: The name of the database to connect to
 */
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost", // The hostname of the database server
    user: process.env.DB_USER || "root", // The username to connect to the database
    password: process.env.DB_PASSWORD || "olympiacos7", // The password to connect to the database
    database: process.env.DB_NAME || "inventory_db", // The name of the database to connect to
});

/**
 * Connect to the MySQL database.
 * This function attempts to establish a connection to the database using the provided configuration.
 * If the connection is successful, a success message is logged to the console.
 * If the connection fails, an error message is logged to the console.
 */
db.connect((err) => {
    if (err) {
        // Log an error message if the connection fails
        console.error("Error connecting to database:", err);
        return;
    }
    // Log a success message if the connection is successful
    console.log("Connected to MySQL database");
});

// Export the database connection object for use in other parts of the application
module.exports = db;

/**
 * Explanation of Imports:
 * - mysql: This module provides a way to interact with MySQL databases in Node.js.
 *   It allows you to create connections, execute queries, and manage transactions.
 * 
 * Why it’s implemented this way:
 * - The mysql.createConnection method is used to create a connection to the MySQL database with the specified configuration.
 * - The db.connect method is called to establish the connection. If the connection is successful, a success message is logged.
 *   If the connection fails, an error message is logged.
 * - The database connection object (db) is exported so that it can be used in other parts of the application to interact with the database.
 */
