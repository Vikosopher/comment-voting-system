// backend/app.js

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const commentRoutes = require("./routes/comment.routes");

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// CORS config
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // frontend origin
    credentials: true, // allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

module.exports = app;
