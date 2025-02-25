const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const productRoutes = require("./routes/products");
const ruleRoutes = require("./routes/rules");

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
