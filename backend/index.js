const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/products");
const ruleRoutes = require("./routes/rules");

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from any origin
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/rules", ruleRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
