const express = require("express");
const cors = require("cors");
const categoryRouter = require("./routes/categories");
const productRouter = require("./routes/products");
const wishlistRouter = require("./routes/wishlist");
const userRouter = require("./routes/user");
const { initializeDatabase } = require("./db/db.connect");

const app = express();

// CORS configuration
const corsOptions = {
  origin: "*", // Consider setting this to a specific domain in production
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize database
initializeDatabase();

// Routes
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/users", userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
