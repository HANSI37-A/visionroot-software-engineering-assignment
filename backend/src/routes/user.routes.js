const express = require("express");

const {
  listUsers,
  updateUser,
} = require("../controllers/user.controller");

const {
  authenticate,
} = require("../middleware/auth.middleware");

const {
  authorize,
} = require("../middleware/role.middleware");

const validate =
  require("../middleware/validate.middleware");

const {
  updateUserValidator,
  listUsersValidator,
} = require("../validators/user.validator");


const router = express.Router();


router.use(authenticate);
router.use(authorize("ADMIN"));


router.get(
  "/",
  listUsersValidator,
  validate,listUsers
);


// PATCH /api/users/:id
router.patch(
  "/:id",
  updateUserValidator,
  validate, updateUser
);


module.exports = router;