const express = require("express");

const {
  create, list, getOne, update, cancel, changeStatus,
} = require("../controllers/request.controller");

const {
  authenticate,
} = require("../middleware/auth.middleware");

const {
  authorize,
} = require("../middleware/role.middleware");

const validate =
  require("../middleware/validate.middleware");

const {
  createRequestValidator,
  updateRequestValidator,
  requestIdValidator,
  statusValidator,
  listRequestValidator,
} = require("../validators/request.validator");


const router = express.Router();

router.use(authenticate);


router.post( "/",createRequestValidator,
   validate, create
);


router.get( "/",listRequestValidator,
  validate, list
);


router.get("/:id",requestIdValidator,
  validate, getOne
);


router.patch("/:id",requestIdValidator,updateRequestValidator,
  validate, update
);


router.patch("/:id/cancel",requestIdValidator,
  validate, cancel
);


router.patch("/:id/status",
  authorize("ADMIN"),
  statusValidator,
  validate,
  changeStatus
);


module.exports = router;