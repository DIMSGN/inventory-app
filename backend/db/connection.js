const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,      // Clever Cloud MySQL host
  user: process.env.DB_USER,      // Clever Cloud MySQL username
  password: process.env.DB_PASSWORD,  // Clever Cloud MySQL password
  database: process.env.DB_NAME,  // Clever Cloud MySQL database name
  port: process.env.DB_PORT || 3306,
  ssl: { rejectUnauthorized: false }, // Required for Clever Cloud
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to Clever Cloud MySQL database");
  }
});

module.exports = connection;
