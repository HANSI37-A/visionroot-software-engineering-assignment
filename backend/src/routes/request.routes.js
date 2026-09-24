const express = require("express");

const {
  create,
  list,
  getOne,
  update,
  cancel,
  changeStatus,
} = require("../controllers/request.controller");

const { authenticate } = require("../middleware/auth.middleware");

const { authorize } = require("../middleware/role.middleware");

const validate = require("../middleware/validate.middleware");

const {
  createRequestValidator,
  updateRequestValidator,
  requestIdValidator,
  statusValidator,
  listRequestValidator,
} = require("../validators/request.validator");

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/requests:
 *   post:
 *     summary: Create a service request
 *     description: >
 *       Creates a service request for the authenticated user.
 *       The server always assigns the authenticated user as
 *       owner and forces the initial status to PENDING.
 *     tags:
 *       - Service Requests
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: Cannot access my account
 *               description:
 *                 type: string
 *                 example: I cannot access my account after changing my password.
 *               category:
 *                 type: string
 *                 enum:
 *                   - TECHNICAL
 *                   - BILLING
 *                   - ACCOUNT
 *                   - OTHER
 *                 example: ACCOUNT
 *               priority:
 *                 type: string
 *                 enum:
 *                   - LOW
 *                   - MEDIUM
 *                   - HIGH
 *                 example: HIGH
 *     responses:
 *       201:
 *         description: Service request created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 */
router.post("/", createRequestValidator, validate, create);

/**
 * @swagger
 * /api/requests:
 *   get:
 *     summary: Get service requests
 *     description: >
 *       Normal users receive only their own requests.
 *       Administrators can receive requests from all users.
 *     tags:
 *       - Service Requests
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search title and description
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - PENDING
 *             - IN_PROGRESS
 *             - RESOLVED
 *             - CANCELLED
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum:
 *             - TECHNICAL
 *             - BILLING
 *             - ACCOUNT
 *             - OTHER
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum:
 *             - LOW
 *             - MEDIUM
 *             - HIGH
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum:
 *             - createdAt
 *             - updatedAt
 *             - title
 *             - priority
 *             - status
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Requests returned successfully
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Authentication required
 */
router.get("/", listRequestValidator, validate, list);

/**
 * @swagger
 * /api/requests/{id}:
 *   get:
 *     summary: Get service request by ID
 *     description: >
 *       Users can access only their own requests.
 *       Administrators can access any request.
 *     tags:
 *       - Service Requests
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB service request ID
 *     responses:
 *       200:
 *         description: Request returned successfully
 *       400:
 *         description: Invalid request ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Service request not found
 */
router.get("/:id", requestIdValidator, validate, getOne);

/**
 * @swagger
 * /api/requests/{id}:
 *   patch:
 *     summary: Update a service request
 *     description: >
 *       Only the owner can update the request and only while
 *       its status is PENDING. Status and ownership cannot be
 *       changed through this endpoint.
 *     tags:
 *       - Service Requests
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum:
 *                   - TECHNICAL
 *                   - BILLING
 *                   - ACCOUNT
 *                   - OTHER
 *               priority:
 *                 type: string
 *                 enum:
 *                   - LOW
 *                   - MEDIUM
 *                   - HIGH
 *     responses:
 *       200:
 *         description: Request updated successfully
 *       400:
 *         description: Validation error or request is not PENDING
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User does not own the request
 *       404:
 *         description: Service request not found
 */
router.patch(
  "/:id",
  requestIdValidator,
  updateRequestValidator,
  validate,
  update
);

/**
 * @swagger
 * /api/requests/{id}/cancel:
 *   patch:
 *     summary: Cancel a service request
 *     description: >
 *       Allows the request owner to cancel an eligible
 *       PENDING or IN_PROGRESS request.
 *     tags:
 *       - Service Requests
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Request cancelled successfully
 *       400:
 *         description: Request cannot be cancelled
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User does not own the request
 *       404:
 *         description: Service request not found
 */
router.patch("/:id/cancel", requestIdValidator, validate, cancel);

/**
 * @swagger
 * /api/requests/{id}/status:
 *   patch:
 *     summary: Transition request status
 *     description: >
 *       Allows administrators to change the status of any service request.
 *     tags:
 *       - Service Requests
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB service request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - PENDING
 *                   - IN_PROGRESS
 *                   - RESOLVED
 *                   - CANCELLED
 *                 example: IN_PROGRESS
 *     responses:
 *       200:
 *         description: Request status updated successfully
 *       400:
 *         description: Invalid status or request ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Service request not found
 */
router.patch(
  "/:id/status",
  authorize("ADMIN"),
  requestIdValidator,
  statusValidator,
  validate,
  changeStatus
);

module.exports = router;