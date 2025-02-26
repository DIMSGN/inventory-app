const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const productsRouter = require("./routes/products");
const rulesRouter = require("./routes/rules");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../frontend/build")));

// API routes
app.use("/api", productsRouter);
app.use("/api", rulesRouter);

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// Use the port provided by the environment variable or default to 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
