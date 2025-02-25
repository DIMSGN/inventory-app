const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql");
const productRoutes = require("./routes/products");
const ruleRoutes = require("./routes/rules");

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// API routes
app.use("/api/products", productRoutes);
app.use("/api/rules", ruleRoutes);

// Serve the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Database connection
const connection = mysql.createConnection({
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  port: process.env.MYSQL_ADDON_PORT,
  ssl: { rejectUnauthorized: false }, // Required for Clever Cloud
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
