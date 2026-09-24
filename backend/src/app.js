const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");

const { notFound, errorHandler, } = require("./middleware/error.middleware");
const requestRoutes = require("./routes/request.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(
  cors({ origin: process.env.CLIENT_URL, credentials: true, })
);

app.use(express.json());

app.use( express.urlencoded({ extended: true, }));


app.use(cookieParser());


// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Service Request API is running",
  });
});

// Authentication routes
app.use( "/api/auth", authRoutes );
app.use( "/api/requests", requestRoutes );
app.use( "/api/users", userRoutes );



app.use(notFound);
app.use(errorHandler);

module.exports = app;