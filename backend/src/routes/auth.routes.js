const express = require("express");

const {
  register,
  login,
  logout,
  me,
} = require("../controllers/auth.controller");

const {
  registerValidator,
  loginValidator,
} = require("../validators/auth.validator");

const validate =
  require("../middleware/validate.middleware");

const {
  authenticate,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.post( "/register", registerValidator,
  validate,
  register
);

router.post( "/login", loginValidator,
  validate,
  login
);

router.post( "/logout",
  logout
);

router.get( "/me",
  authenticate,
  me
);

module.exports = router;