// Import the mysql module to interact with the MySQL database
const mysql = require("mysql");

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "olympiacos7",
    database: process.env.DB_NAME || "inventory_db",
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
