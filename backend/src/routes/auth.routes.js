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

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Hansi Tharaki
 *               email:
 *                 type: string
 *                 format: email
 *                 example: hansi@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or email already exists
 */


router.post( "/register", registerValidator,
  validate,
  register
);


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: >
 *       Authenticates the user and stores the JWT
 *       in an HttpOnly cookie.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: hansi@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             description: HttpOnly JWT authentication cookie
 *             schema:
 *               type: string
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Invalid email or password
 *       403:
 *         description: Account is inactive
 */

router.post( "/login", loginValidator,
  validate,
  login
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */

router.post( "/logout",
  logout
);


/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Account inactive
 */

router.get( "/me",
  authenticate,
  me
);

module.exports = router;