const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const authRoutes = require("./routes/auth.routes");
const requestRoutes = require("./routes/request.routes");
const userRoutes = require("./routes/user.routes");

const { notFound, errorHandler, } = require("./middleware/error.middleware");
const app = express();


app.use(express.json());
app.use(cookieParser());

app.use(
  cors({ origin: process.env.CLIENT_URL, credentials: true, })
);

app.use( "/api-docs",swaggerUi.serve, swaggerUi.setup(swaggerSpec)
);


app.use( express.urlencoded({ extended: true, }));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Service Request API is running",
  });
});

app.get(
  "/api-docs.json",
  (req, res) => {
    res.setHeader(
      "Content-Type",
      "application/json"
    );

    res.send(swaggerSpec);
  }
);

// Authentication routes
app.use( "/api/auth", authRoutes );
app.use( "/api/requests", requestRoutes );
app.use( "/api/users", userRoutes );


app.use(notFound);
app.use(errorHandler);

module.exports = app;