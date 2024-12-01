const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./db/db.connect");

const app = express();

// CORS configuration
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize database
initializeDatabase();
