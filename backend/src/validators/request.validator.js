const { body, param, query, } = require("express-validator");


const createRequestValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 150 })
    .withMessage(
      "Title must be between 3 and 150 characters"
    ),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 2000 })
    .withMessage(
      "Description must be between 10 and 2000 characters"
    ),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn([
      "TECHNICAL",
      "BILLING",
      "ACCOUNT",
      "OTHER",
    ])
    .withMessage("Invalid category"),

  body("priority")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH"])
    .withMessage("Invalid priority"),
];


const updateRequestValidator = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage(
      "Title must be between 3 and 150 characters"
    ),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage(
      "Description must be between 10 and 2000 characters"
    ),

  body("category")
    .optional()
    .isIn([
      "TECHNICAL",
      "BILLING",
      "ACCOUNT",
      "OTHER",
    ])
    .withMessage("Invalid category"),

  body("priority")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH"])
    .withMessage("Invalid priority"),
];


const requestIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid request ID"),
];


const statusValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid request ID"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn([
      "PENDING",
      "IN_PROGRESS",
      "RESOLVED",
      "CANCELLED",
    ])
    .withMessage("Invalid status"),
];


const listRequestValidator = [
  query("status")
    .optional()
    .isIn([
      "PENDING",
      "IN_PROGRESS",
      "RESOLVED",
      "CANCELLED",
    ])
    .withMessage("Invalid status"),

  query("category")
    .optional()
    .isIn([
      "TECHNICAL",
      "BILLING",
      "ACCOUNT",
      "OTHER",
    ])
    .withMessage("Invalid category"),

  query("priority")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH"])
    .withMessage("Invalid priority"),

  query("sortBy")
    .optional()
    .isIn([
      "createdAt",
      "updatedAt",
      "title",
      "priority",
      "status",
    ])
    .withMessage("Invalid sort field"),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage(
      "sortOrder must be asc or desc"
    ),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage(
      "Page must be a positive integer"
    )
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage(
      "Limit must be between 1 and 100"
    )
    .toInt(),

  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage(
      "Search cannot exceed 100 characters"
    ),
];


module.exports = {
  createRequestValidator,
  updateRequestValidator,
  requestIdValidator,
  statusValidator,
  listRequestValidator,
};