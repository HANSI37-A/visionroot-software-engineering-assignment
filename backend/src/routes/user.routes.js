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


/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get users
 *     description: ADMIN only. Returns users with filtering and pagination.
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum:
 *             - USER
 *             - ADMIN
 *
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *
 *     responses:
 *       200:
 *         description: Users returned successfully
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Authentication required
 *       403:
 *         description: ADMIN role required
 */

router.get(
  "/",
  listUsersValidator,
  validate,listUsers
);


/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Activate or deactivate a user
 *     description: >
 *       ADMIN only. Changes the user's isActive state without
 *       deleting the user or their historical service requests.
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       400:
 *         description: Invalid input or admin attempted self-deactivation
 *       401:
 *         description: Authentication required
 *       403:
 *         description: ADMIN role required
 *       404:
 *         description: User not found
 */

router.patch(
  "/:id",
  updateUserValidator,
  validate, updateUser
);


module.exports = router;