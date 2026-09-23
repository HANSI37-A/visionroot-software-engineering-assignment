const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes =
  require("./routes/auth.routes");

const {
  notFound,
  errorHandler,
} = require("./middleware/error.middleware");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());


// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Service Request API is running",
  });
});

// Authentication routes
app.use(
  "/api/auth",
  authRoutes
);


// 404
app.use(notFound);


// Global error handler
app.use(errorHandler);

module.exports = app;