const express = require("express");
const app = express();
const cors = require("cors");

const categoryRouter = require("./routes/categories");
const productRouter = require("./routes/products");
const wishlistRouter = require("./routes/wishlist");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

const { initializeDatabase } = require("./db/db.connect");

// Initialize database
initializeDatabase();

// Routes
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/wishlist", wishlistRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
