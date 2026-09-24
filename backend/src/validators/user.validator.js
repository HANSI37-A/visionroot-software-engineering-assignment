const { body, param, query } = require("express-validator");

const userIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid user ID"),
];

const updateUserValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid user ID"),

  body("isActive")
    .exists()
    .withMessage("isActive is required")
    .bail()
    .isBoolean()
    .withMessage("isActive must be a boolean")
    .toBoolean(),
];


const listUsersValidator = [
  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage(
      "Search cannot exceed 100 characters"
    ),

  query("isActive")
    .optional()
    .isBoolean()
    .withMessage(
      "isActive must be true or false"
    )
    .toBoolean(),

  query("role")
    .optional()
    .isIn(["USER", "ADMIN"])
    .withMessage("Invalid role"),

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
];


module.exports = {
  userIdValidator,
  updateUserValidator,
  listUsersValidator,
};