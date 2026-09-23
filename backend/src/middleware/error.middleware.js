const ApiError = require("../utils/ApiError");

const notFound = (req, res, next) => {
  next(
    new ApiError(  404, `Route not found: ${req.originalUrl}`
    )
  );
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message =
    err.message || "Internal server error";

  let errors = err.errors || [];

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource ID";
  }

  if (err.code === 11000) {
    statusCode = 409;

    const field = Object.keys(
      err.keyValue || {}
    )[0];

    message = field
      ? `${field} already exists`
      : "Duplicate value";

    errors = field
      ? [
          {
            field,
            message: `${field} already exists`,
          },
        ]
      : [];
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";

    errors = Object.values(
      err.errors
    ).map((error) => ({
      field: error.path,
      message: error.message,
    }));
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

module.exports = {
  notFound,
  errorHandler,
};