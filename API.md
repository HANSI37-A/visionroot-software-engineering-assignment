# API Reference

Base URL: `http://localhost:5000/api` (configurable via `PORT` in `backend/.env`)

Interactive Swagger UI: `http://localhost:5000/api-docs`

> For project overview, setup, and architecture, see the [main README](./README.md).

## Table of Contents
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Auth](#auth)
  - [Service Requests](#service-requests)
  - [Users (Admin)](#users-admin)
- [Query Parameters: Search, Filter, Sort, Pagination](#query-parameters-search-filter-sort-pagination)
- [Response Format](#response-format)
- [Error Format & Status Codes](#error-format--status-codes)
- [Database Schema](#database-schema)
- [Validation Rules](#validation-rules)

---

## Authentication
Auth uses a JWT stored in an **HttpOnly cookie** (`token`), set on register/login and cleared on logout. It is not readable by frontend JavaScript and is not stored in localStorage.

Every request from the browser must include credentials:
```js
axios.create({ baseURL: ..., withCredentials: true });
```

Protected routes require the cookie to be present and valid. Admin-only routes additionally require the authenticated user's `role` to be `ADMIN` — role is always read from the verified server-side user record, never from the request body.

---

## Endpoints

### Auth

#### Register
```
POST /api/auth/register
```
Body:
```json
{ "name": "Hansi Tharaki", "email": "hansi@example.com", "password": "password123" }
```
- Creates a `USER` account (public registration can never create an `ADMIN`).
- Sets the auth cookie on success.
- `201` on success · `409` if email already registered · `400` on validation failure.

#### Login
```
POST /api/auth/login
```
Body:
```json
{ "email": "hansi@example.com", "password": "password123" }
```
- `200` and sets the auth cookie on success.
- `401` on wrong email/password · `403` if the account is deactivated.

#### Logout
```
POST /api/auth/logout
```
- Clears the auth cookie. `200` always.

#### Current user
```
GET /api/auth/me
```
- Requires authentication.
- Returns the logged-in user; used by the frontend on load to restore the session after a refresh.
- `401` if not authenticated.

---

### Service Requests
All routes below require authentication.

#### Create a request
```
POST /api/requests
```
Body:
```json
{
  "title": "Internet connection issue",
  "description": "Office internet drops every few minutes.",
  "category": "TECHNICAL",
  "priority": "HIGH"
}
```
- `category`: `TECHNICAL | BILLING | ACCOUNT | OTHER` (required)
- `priority`: `LOW | MEDIUM | HIGH` (optional, defaults to `MEDIUM`)
- The backend always sets `status = PENDING` and `user = req.user._id` — any `status` or `user` field sent by the client is ignored.
- `201` on success · `400` on validation failure.

#### List requests
```
GET /api/requests
```
- `USER` → returns only their own requests.
- `ADMIN` → returns all requests.
- Supports the [query parameters](#query-parameters-search-filter-sort-pagination) below.
- `200` with `data` (array) and `pagination` metadata.

#### Get request details
```
GET /api/requests/:id
```
- `USER` can fetch only their own request; any other request returns `403`.
- `ADMIN` can fetch any request.
- `404` if the id doesn't exist.

#### Update a request
```
PATCH /api/requests/:id
```
Body (any subset):
```json
{ "title": "...", "description": "...", "category": "BILLING", "priority": "LOW" }
```
- Owner only, and only while `status === PENDING`.
- `status` cannot be changed through this endpoint.
- `400` if the request is not `PENDING` · `403` if not the owner.

#### Cancel a request
```
PATCH /api/requests/:id/cancel
DELETE /api/requests/:id        (alias — same behavior, does not hard-delete)
```
- Owner only, and only while `status` is `PENDING` or `IN_PROGRESS`.
- Sets `status = CANCELLED`.
- `400` if not in an eligible state · `403` if not the owner.

#### Update request status (Admin only)
```
PATCH /api/requests/:id/status
```
Body:
```json
{ "status": "IN_PROGRESS" }
```
- Requires `ADMIN` role (`403` otherwise).
- Only the transitions listed in [Business Rules](./README.md#business-rules) are accepted; anything else returns `400`.

---

### Users (Admin)
All routes below require `ADMIN` role (`403` for a `USER`).

#### List users
```
GET /api/users
```
- Returns all registered users (password never included).

#### Get a user
```
GET /api/users/:id
```
- `404` if not found.

#### Update a user
```
PATCH /api/users/:id
```
Body (any subset):
```json
{ "isActive": false, "role": "ADMIN" }
```
- Used mainly to activate/deactivate an account.
- Users are never hard-deleted, since existing requests reference them.

---

## Query Parameters: Search, Filter, Sort, Pagination
Supported on `GET /api/requests`:

| Param | Type | Notes |
|---|---|---|
| `search` | string | Full-text match against `title` + `description` |
| `status` | `PENDING｜IN_PROGRESS｜RESOLVED｜CANCELLED` | Exact match |
| `category` | `TECHNICAL｜BILLING｜ACCOUNT｜OTHER` | Exact match |
| `priority` | `LOW｜MEDIUM｜HIGH` | Exact match |
| `sortBy` | string | Any request field, e.g. `createdAt` (default) |
| `sortOrder` | `asc｜desc` | Default `desc` |
| `page` | number | Default `1` |
| `limit` | number | Default `10`, max `100` |

Example:
```
GET /api/requests?page=1&limit=10&search=payment&status=PENDING&category=BILLING&priority=HIGH&sortBy=createdAt&sortOrder=desc
```

---

## Response Format

**Success**
```json
{
  "success": true,
  "message": "Request created",
  "data": { }
}
```

**List with pagination**
```json
{
  "success": true,
  "data": [ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 53,
    "totalPages": 6,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## Error Format & Status Codes
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "title", "message": "Title is required" }
  ]
}
```

| Status | Meaning |
|---:|---|
| 200 | Success |
| 201 | Resource created |
| 400 | Invalid input or invalid status transition |
| 401 | Not authenticated |
| 403 | Authenticated but not permitted |
| 404 | Resource not found |
| 409 | Conflict (e.g. duplicate email) |
| 500 | Unexpected server error |

Stack traces are never returned to the client, in any environment.

---

## Database Schema

**User**
```
name        String   required
email       String   required, unique, lowercase
password    String   required, hashed (bcrypt), never returned in responses
role        String   enum [USER, ADMIN], default USER
isActive    Boolean  default true
createdAt   Date
updatedAt   Date
```

**ServiceRequest**
```
title        String   required, max 150 chars
description  String   required
category     String   enum [TECHNICAL, BILLING, ACCOUNT, OTHER], required
priority     String   enum [LOW, MEDIUM, HIGH], default MEDIUM
status       String   enum [PENDING, IN_PROGRESS, RESOLVED, CANCELLED], default PENDING
user         ObjectId ref User, required
createdAt    Date
updatedAt    Date
```

**Indexes:** `user`, `status`, `category`, `priority`, `createdAt` (desc) on `ServiceRequest`; text index on `title` + `description`; unique index on `User.email`.

## Validation Rules
Enforced server-side with `express-validator` — client-side checks are for UX only and are never trusted.

| Field | Rule |
|---|---|
| `name` | required, non-empty |
| `email` | required, valid email format |
| `password` | required, minimum 6 characters |
| `title` | required, non-empty, max 150 characters |
| `description` | required, non-empty |
| `category` | required, must be one of the enum values |
| `priority` | optional, must be one of the enum values if provided |
| `status` (on transition) | required, must be one of the enum values, and must be a valid transition from the current status |
| `:id` params | must be a valid MongoDB ObjectId |