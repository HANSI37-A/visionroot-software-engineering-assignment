# Service Request Management System

A full-stack **Service Request Management System** built using the **MERN stack**.

The system allows users to create, manage, and track service requests while administrators can monitor all requests, manage request statuses, and manage user accounts.

The application includes secure authentication using **JWT stored in HttpOnly cookies**, role-based authorization, request ownership protection, server-side validation, filtering, searching, sorting, pagination, responsive UI design, automated backend testing, and Swagger API documentation.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Why These Technologies Were Chosen](#why-these-technologies-were-chosen)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Database Design](#database-design)
- [Authentication](#authentication)
- [Authorization](#authorization)
- [Service Request Business Rules](#service-request-business-rules)
- [Validation](#validation)
- [Error Handling](#error-handling)
- [API Endpoints](#api-endpoints)
- [Filtering-Sorting-and-Pagination](#filtering-sorting-and-pagination)
- [Swagger API Documentation](#swagger-api-documentation)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Production Build](#production-build)
- [Security Considerations](#security-considerations)
- [Assumptions](#assumptions)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)

---

# Overview

The Service Request Management System is a web application that provides a centralized platform for submitting and managing service requests.

The system contains two main user roles:

- **USER**
- **ADMIN**

A normal user can register, log in, create service requests, view their own requests, edit eligible requests, cancel eligible requests, and monitor request statuses.

An administrator can view all service requests, search and filter requests, update request statuses according to predefined transition rules, and activate or deactivate user accounts.

The application follows a RESTful client-server architecture using React for the frontend, Express and Node.js for the backend, and MongoDB for data persistence.

---

# Features

## User Features

Users can:

- Register a new account
- Log in securely
- Log out
- Restore their login session after refreshing the browser
- View a personal dashboard
- View service request statistics
- View their own service requests
- Create a new service request
- View service request details
- Edit eligible service requests
- Cancel eligible service requests
- Track request status
- Search and navigate request information
- Receive success and error feedback through notifications

Users cannot:

- View another user's requests
- Select another user as the owner of a request
- Select the initial request status
- Directly change request status through normal edit operations
- Access administrator functionality

---

## Administrator Features

Administrators can:

- Access an administrator dashboard
- View all service requests
- View request statistics
- Search service requests
- Filter requests by status
- Filter requests by category
- Filter requests by priority
- Sort service requests
- Navigate paginated results
- View detailed request information
- Update request statuses
- Perform only valid status transitions
- View registered users
- Search/filter users where supported
- Activate user accounts
- Deactivate user accounts

Administrator privileges are enforced by the backend and are not based only on frontend route protection.

---

# Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Frontend development and build tool |
| React Router DOM | Client-side routing |
| Redux Toolkit | Global application state management |
| React Redux | React integration for Redux |
| Axios | HTTP API communication |
| Tailwind CSS | Responsive UI styling |
| React Hot Toast | Success and error notifications |
| Lucide React | Icons |

## Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB ODM |
| express-validator | Server-side request validation |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| cookie-parser | Reading authentication cookies |
| cors | Cross-origin configuration |
| dotenv | Environment variable management |

## Testing and Documentation

| Technology | Purpose |
|---|---|
| Jest | Backend testing |
| Supertest | HTTP/API integration testing |
| Swagger UI | Interactive API documentation |
| swagger-jsdoc | OpenAPI documentation generation |
| swagger-ui-express | Swagger integration with Express |

---

# Why These Technologies Were Chosen

## React

React provides a reusable component-based architecture that makes it suitable for dashboards, forms, tables, request-management interfaces, and responsive single-page applications.

## Redux Toolkit

Redux Toolkit provides predictable centralized state management.

It is used to manage application-level information such as:

- Authentication state
- Logged-in user information
- Service requests
- Loading states
- Error states

Async thunks provide a structured way to communicate with the backend API.

## Node.js

Node.js allows JavaScript to be used on both the frontend and backend, creating a consistent development environment.

## Express.js

Express provides a lightweight framework for building RESTful APIs and supports middleware-based architecture for:

- Authentication
- Authorization
- Validation
- Routing
- Error handling

## MongoDB

MongoDB provides flexible document-based storage and integrates naturally with JavaScript applications.

## Mongoose

Mongoose provides:

- Schema definitions
- Data validation
- References
- Indexes
- Query APIs
- MongoDB model management

## express-validator

`express-validator` is used for server-side validation of incoming requests.

Frontend validation improves user experience, but it cannot be trusted for security. Therefore, important data is always validated again by the backend.

## JWT

JSON Web Tokens are used to represent authenticated sessions.

The JWT is stored in an **HttpOnly cookie** instead of browser local storage.

## Tailwind CSS

Tailwind CSS allows responsive and reusable interfaces to be developed efficiently using utility classes.

---

# System Architecture

The application follows a client-server architecture.

```text
┌──────────────────────────────────┐
│           React Frontend         │
│                                  │
│  React Router                    │
│  Redux Toolkit                   │
│  Axios                           │
│  Tailwind CSS                    │
└────────────────┬─────────────────┘
                 │
                 │ REST API
                 │ HttpOnly Cookie
                 │
                 ▼
┌──────────────────────────────────┐
│       Node.js / Express API      │
│                                  │
│  Routes                          │
│      ↓                           │
│  Validation Middleware           │
│      ↓                           │
│  Authentication Middleware       │
│      ↓                           │
│  Authorization Middleware        │
│      ↓                           │
│  Controllers                     │
│      ↓                           │
│  Services                        │
│      ↓                           │
│  Mongoose Models                 │
│                                  │
│  Global Error Middleware         │
└────────────────┬─────────────────┘
                 │
                 │ Mongoose
                 ▼
┌──────────────────────────────────┐
│             MongoDB              │
│                                  │
│  users                           │
│  servicerequests                 │
└──────────────────────────────────┘
```

The backend uses a layered architecture:

```text
HTTP Request
     ↓
Express Route
     ↓
express-validator
     ↓
Authentication Middleware
     ↓
Role / Authorization Middleware
     ↓
Controller
     ↓
Service
     ↓
Mongoose Model
     ↓
MongoDB
     ↓
HTTP Response
```

This separates HTTP concerns, validation, authorization, business logic, and database operations.

---

# Project Structure

```text
service-request-system/
│
├── backend/
│   │
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── request.controller.js
│   │   │   └── user.controller.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   ├── validation.middleware.js
│   │   │   └── error.middleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── ServiceRequest.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── request.routes.js
│   │   │   └── user.routes.js
│   │   │
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── request.service.js
│   │   │   └── user.service.js
│   │   │
│   │   ├── validators/
│   │   │
│   │   ├── utils/
│   │   │   └── ApiError.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── tests/
│   │   ├── auth.test.js
│   │   ├── request.test.js
│   │   └── user.test.js
│   │
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   │
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   │
│   │   ├── app/
│   │   │   └── store.js
│   │   │
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── AdminRoute.jsx
│   │   │   └── ...
│   │   │
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   └── authSlice.js
│   │   │   └── requests/
│   │   │       └── requestSlice.js
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Requests.jsx
│   │   │   ├── CreateRequest.jsx
│   │   │   ├── RequestDetails.jsx
│   │   │   ├── EditRequest.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminRequests.jsx
│   │   │       ├── AdminRequestDetails.jsx
│   │   │       └── Users.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

> The exact file structure may vary slightly depending on the final implementation.

---

# Database Design

The application primarily contains two MongoDB collections:

1. Users
2. Service Requests

---

## User Schema

A user contains information required for authentication and authorization.

```text
User
│
├── _id
├── name
├── email
├── password
├── role
├── isActive
├── createdAt
└── updatedAt
```

Conceptual representation:

```javascript
{
  _id: ObjectId,

  name: String,

  email: String,

  password: String,

  role: "USER" | "ADMIN",

  isActive: Boolean,

  createdAt: Date,

  updatedAt: Date
}
```

### User Rules

- Email addresses must be unique.
- Passwords are never stored as plain text.
- Passwords are hashed using bcrypt.
- Public registration creates normal users.
- Administrative privileges cannot be selected through public registration.
- Users can be deactivated without deleting their database records.

---

## Service Request Schema

```text
ServiceRequest
│
├── _id
├── title
├── description
├── category
├── priority
├── status
├── user ──────────► User._id
├── createdAt
└── updatedAt
```

Conceptual representation:

```javascript
{
  _id: ObjectId,

  title: String,

  description: String,

  category: String,

  priority: String,

  status: String,

  user: ObjectId,

  createdAt: Date,

  updatedAt: Date
}
```

The `user` field contains a MongoDB ObjectId referencing the user who created the service request.

---

## Relationship

```text
┌───────────────┐
│     User      │
│               │
│ _id           │
│ name          │
│ email         │
│ role          │
└───────┬───────┘
        │
        │ 1
        │
        │ creates
        │
        │ many
        ▼
┌────────────────────┐
│   ServiceRequest   │
│                    │
│ _id                │
│ title              │
│ category           │
│ priority           │
│ status             │
│ user ──────────────┼──► User._id
└────────────────────┘
```

One user can create many service requests.

Each service request belongs to one user.

---

# Database Indexes

Indexes are used on commonly queried fields to improve database performance.

The ServiceRequest model includes indexes for fields such as:

```text
user
status
category
priority
createdAt
```

These indexes help optimize:

- User request queries
- Status filtering
- Category filtering
- Priority filtering
- Date sorting
- Administrative request listings

---

# Authentication

The application uses **JWT authentication with HttpOnly cookies**.

## Login Flow

```text
User enters email/password
          ↓
POST /api/auth/login
          ↓
Backend validates input
          ↓
User searched by email
          ↓
bcrypt compares password
          ↓
JWT generated
          ↓
JWT placed in HttpOnly cookie
          ↓
Browser stores cookie
          ↓
User authenticated
```

For later requests:

```text
Browser
   ↓
Automatically sends HttpOnly cookie
   ↓
Express authenticate middleware
   ↓
JWT verification
   ↓
User loaded
   ↓
req.user populated
   ↓
Protected operation continues
```

---

## Why HttpOnly Cookies?

The JWT is **not stored in localStorage or sessionStorage**.

Instead, it is stored in an HttpOnly cookie.

This means normal frontend JavaScript cannot directly access the token.

The frontend Axios instance uses:

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
```

`withCredentials: true` allows the browser to include authentication cookies when communicating with the backend.

---

## Restoring Authentication

Redux state exists in memory and disappears after a full browser refresh.

However, the HttpOnly authentication cookie remains available.

Therefore, when the application initializes, it requests:

```http
GET /api/auth/me
```

The backend checks the authentication cookie and returns the current authenticated user.

This allows authentication state to be restored after a browser refresh without storing the JWT in localStorage.

---

# Authorization

The application supports two roles:

```text
USER
ADMIN
```

Authorization is enforced on the backend.

Frontend route protection is provided for better user experience, but it is **not considered a security boundary**.

---

## USER Permissions

A USER can:

```text
✓ Create service requests
✓ View their own requests
✓ View their own request details
✓ Edit eligible own requests
✓ Cancel eligible own requests
```

A USER cannot:

```text
✗ View another user's requests
✗ Access admin user management
✗ Perform admin-only status changes
✗ Assign request ownership
✗ Assign themselves ADMIN role
```

---

## ADMIN Permissions

An ADMIN can:

```text
✓ View all requests
✓ Search/filter/sort requests
✓ View request details
✓ Perform valid request status transitions
✓ View users
✓ Activate users
✓ Deactivate users
```

Role checking is based on the authenticated backend user:

```javascript
req.user.role
```

The backend never trusts a role supplied by frontend request data.

---

# Service Request Business Rules

Several important business rules are enforced by the backend.

---

## Request Creation

When a USER creates a request, the frontend sends only user-editable information such as:

```json
{
  "title": "Internet connection issue",
  "description": "The office internet connection is unstable.",
  "category": "TECHNICAL",
  "priority": "HIGH"
}
```

The frontend does **not** control:

```text
user
status
```

The backend assigns ownership using:

```javascript
req.user._id
```

and forces the initial status to:

```text
PENDING
```

Therefore, a malicious frontend request cannot create a service request for another user or choose an unauthorized initial status.

---

## Request Ownership

Normal users can access only their own requests.

Conceptually:

```javascript
request.user.equals(req.user._id)
```

is checked before ownership-sensitive operations.

Administrators are allowed to access requests according to administrator permissions.

---

## Request Editing

Normal users can edit only requests that meet the backend's eligibility rules.

For example, if editing is allowed only while the request is `PENDING`, the backend checks:

```text
request.status === PENDING
```

The frontend may hide the Edit button when editing is unavailable, but the backend performs the real enforcement.

---

## Request Cancellation

Request cancellation also requires:

- Correct ownership
- Eligible request state

The backend validates both conditions.

The frontend cannot bypass these rules by manually calling the API.

---

## Status Changes

Status changes are controlled by the backend.

A predefined transition map determines which status changes are valid.

Conceptually:

```javascript
const allowedTransitions = {
  PENDING: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["RESOLVED"],
  RESOLVED: [],
  CANCELLED: [],
};
```

> Replace the example above with the exact transition map used by the final implementation if it differs.

The administrator interface displays only valid next states for better usability.

However, the backend remains authoritative and rejects invalid transitions even if a client manually sends one.

---

# Validation

The backend uses **express-validator** to validate incoming requests.

Validation is applied to areas including:

- Registration
- Login
- Service request creation
- Service request updates
- Request IDs
- Request status updates
- User-management operations
- Query parameters where applicable

Example validation concept:

```javascript
body("email")
  .isEmail()
  .withMessage("Please provide a valid email address");

body("password")
  .notEmpty()
  .withMessage("Password is required");

body("title")
  .trim()
  .notEmpty()
  .withMessage("Title is required");
```

Validation results are handled by centralized validation middleware.

Frontend validation is used for user experience, but backend validation is always required.

---

# Error Handling

The backend uses centralized error handling.

Errors follow a consistent response structure similar to:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

The frontend handles both general API errors and validation errors.

Common HTTP response codes include:

| Status | Meaning |
|---:|---|
| 200 | Request successful |
| 201 | Resource created |
| 400 | Invalid request / validation failure |
| 401 | Authentication required |
| 403 | Access forbidden |
| 404 | Resource not found |
| 409 | Conflict |
| 500 | Internal server error |

---

# API Endpoints

The REST API is organized into three main groups:

```text
/api/auth
/api/requests
/api/users
```

---

## Authentication API

### Register

```http
POST /api/auth/register
```

Creates a new normal user account.

---

### Login

```http
POST /api/auth/login
```

Authenticates the user and stores a JWT in an HttpOnly cookie.

---

### Logout

```http
POST /api/auth/logout
```

Clears the authentication cookie.

---

### Current User

```http
GET /api/auth/me
```

Returns the currently authenticated user.

Used by the frontend to restore authentication after a browser refresh.

---

# Service Request API

## Create Request

```http
POST /api/requests
```

Access:

```text
Authenticated USER/ADMIN according to implementation
```

The backend controls request ownership and initial status.

---

## Get Requests

```http
GET /api/requests
```

Role-aware behavior:

```text
USER
→ receives their own requests

ADMIN
→ receives all requests
```

---

## Get Request Details

```http
GET /api/requests/:id
```

Normal users can access only their own request details.

---

## Update Request

```http
PATCH /api/requests/:id
```

Normal users can update only eligible requests they own.

Status cannot be changed through the normal update endpoint.

---

## Cancel Request

```http
PATCH /api/requests/:id/cancel
```

Cancels an eligible request.

Ownership and cancellation rules are enforced by the backend.

---

## Update Request Status

```http
PATCH /api/requests/:id/status
```

Access:

```text
ADMIN only
```

The requested transition must be allowed by the backend transition map.

---

# User Management API

## Get Users

```http
GET /api/users
```

Access:

```text
ADMIN only
```

Returns registered users according to supported search/filter/pagination behavior.

---

## Update User

```http
PATCH /api/users/:id
```

Access:

```text
ADMIN only
```

Used to activate or deactivate user accounts.

Users are not hard deleted because existing service requests may reference them.

---

# Filtering, Sorting and Pagination

The service-request API supports query parameters where implemented.

Available parameters include:

```text
search
status
category
priority
sortBy
sortOrder
page
limit
```

Example:

```http
GET /api/requests?status=PENDING&priority=HIGH&page=1&limit=10
```

Another example:

```http
GET /api/requests?search=internet&category=TECHNICAL&sortBy=createdAt&sortOrder=desc&page=1&limit=10
```

The backend performs filtering and pagination instead of requiring the frontend to download the entire request collection.

A paginated response includes the request data and pagination metadata according to the API implementation.

---

# Swagger API Documentation

Interactive REST API documentation is provided using Swagger.

Start the backend and open:

```text
http://localhost:5000/api-docs
```

Swagger provides documentation for:

- Authentication endpoints
- Service request endpoints
- User-management endpoints
- Request parameters
- Query parameters
- Validation rules
- Response structures
- Authentication requirements

> If your backend runs on a different port, replace `5000` with the configured `PORT`.

---

# Environment Variables

Environment variables are used for configuration and sensitive information.

Real `.env` files must **never be committed to Git**.

---

## Backend Environment Variables

Create:

```text
backend/.env
```

Use:

```text
backend/.env.example
```

as the template.

Example:

```env
PORT=5000

MONGODB_URI=mongodb://127.0.0.1:27017/service-request-system

JWT_SECRET=replace_with_a_secure_secret

JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

NODE_ENV=development
```

### Description

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `MONGODB_URI` | MongoDB connection URI |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | JWT expiration duration |
| `CLIENT_URL` | Allowed frontend origin |
| `NODE_ENV` | Application environment |

Never use the example `JWT_SECRET` in production.

---

## Frontend Environment Variables

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

### Important

Vite exposes variables beginning with:

```text
VITE_
```

to frontend JavaScript.

Therefore, never place secrets such as these in frontend environment variables:

```text
JWT_SECRET
MongoDB passwords
SMTP passwords
private API keys
```

---

# Installation

## Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git
- MongoDB locally or MongoDB Atlas

Verify installation:

```bash
node --version
npm --version
git --version
```

---

## 1. Clone Repository

```bash
git clone <repository-url>
```

Then:

```bash
cd service-request-system
```

Replace `<repository-url>` with the actual Git repository URL.

---

## 2. Backend Installation

Navigate to:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env` from `.env.example`.

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### macOS/Linux

```bash
cp .env.example .env
```

Configure the required environment variables.

---

## 3. Frontend Installation

From the project root:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `.env` from `.env.example`.

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### macOS/Linux

```bash
cp .env.example .env
```

Example frontend configuration:

```env
VITE_API_URL=http://localhost:5000/api
```

---

# Running the Application

The frontend and backend run as separate applications during development.

---

## Start Backend

Open a terminal:

```bash
cd backend
npm run dev
```

The backend should normally run at:

```text
http://localhost:5000
```

Health endpoint, if configured:

```text
http://localhost:5000/api/health
```

Swagger:

```text
http://localhost:5000/api-docs
```

---

## Start Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The frontend should normally run at:

```text
http://localhost:5173
```

Open this URL in a browser.

---

# Testing

The backend uses:

- Jest
- Supertest

Tests focus on important application behavior rather than attempting to achieve an arbitrary 100% coverage target.

---

## Run Backend Tests

```bash
cd backend
npm test
```

If coverage is configured:

```bash
npm test -- --coverage
```

or:

```bash
npm run test:coverage
```

depending on the available package scripts.

---

## Authentication Tests

Important authentication cases include:

```text
✓ Register
✓ Successful login
✓ Failed login
✓ Duplicate email
✓ Protected route without authentication
✓ Current user endpoint
✓ Logout
```

---

## Service Request Tests

Important request cases include:

```text
✓ Create request
✓ Initial status controlled by backend
✓ Owner controlled by backend
✓ USER sees only own requests
✓ ADMIN sees all requests
✓ Ownership isolation
✓ Eligible request editing
✓ Ineligible request editing rejected
✓ Cancellation rules
✓ Valid status transition
✓ Invalid status transition rejected
✓ USER cannot use admin status endpoint
```

---

## User Management Tests

Important administrator cases include:

```text
✓ USER cannot access admin user API
✓ ADMIN can access users
✓ ADMIN can activate users
✓ ADMIN can deactivate users
```

Additional business rules such as self-deactivation protection are tested if implemented.

---

# Production Build

Before submission or deployment, verify that the frontend can build successfully.

```bash
cd frontend
npm run build
```

Vite generates the production build in:

```text
frontend/dist/
```

The `dist` directory should normally not be committed to source control.

If ESLint is configured, also run:

```bash
npm run lint
```

---

# Responsive Design

The frontend is designed to work across different screen sizes.

The interface includes responsive behavior for:

- Navigation
- Dashboards
- Statistics cards
- Forms
- Filters
- Request lists
- User lists
- Tables
- Mobile request cards
- Action buttons

Desktop tables are adapted into more suitable layouts/cards where necessary on smaller screens.

---

# Loading, Error and Empty States

Pages that communicate with the API provide appropriate application states.

## Loading

Displayed while API requests are in progress.

## Error

Displayed when API operations fail.

## Empty

Displayed when no relevant data exists.

Examples include:

```text
No service requests found.
No users found.
No matching requests found.
```

## Success

Successful mutations provide feedback using React Hot Toast.

Examples include:

```text
Request created successfully.
Request updated successfully.
Request cancelled successfully.
Status updated successfully.
User updated successfully.
```

---

# Security Considerations

Security is enforced primarily on the backend.

The application implements the following measures:

### Password Security

Passwords are hashed using:

```text
bcryptjs
```

Plain-text passwords are not stored in MongoDB.

### HttpOnly JWT Cookie

JWT authentication uses an HttpOnly cookie.

The JWT is not stored in:

```text
localStorage
sessionStorage
```

### Backend Role Authorization

Administrator endpoints are protected by backend role middleware.

The frontend cannot grant administrative permissions.

### Request Ownership

Normal users can access only their own service requests.

Ownership is checked by the backend.

### Server-Controlled Ownership

The frontend cannot choose the request owner.

The backend obtains ownership from:

```javascript
req.user._id
```

### Server-Controlled Initial Status

The frontend does not select the initial request status.

The backend controls the initial state.

### Status Transition Validation

Administrator status changes are checked against backend business rules.

Invalid transitions are rejected even if the frontend is bypassed.

### Server-Side Validation

`express-validator` validates incoming API data.

### CORS

CORS is configured so the expected frontend can communicate with the backend while authentication cookies are supported.

### Environment Variables

Secrets and environment-specific configuration are stored in `.env`.

Real `.env` files are excluded from Git.

---

# Git Security

The repository ignores sensitive and generated files.

Example `.gitignore` rules:

```gitignore
# Dependencies
node_modules/
backend/node_modules/
frontend/node_modules/

# Environment files
.env
.env.*
!.env.example

backend/.env
backend/.env.*
!backend/.env.example

frontend/.env
frontend/.env.*
!frontend/.env.example

# Build output
dist/
frontend/dist/
build/

# Coverage
coverage/
backend/coverage/
frontend/coverage/

# Logs
*.log

# Operating system
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

Before committing, verify that `.env` is not tracked:

```bash
git status
```

Windows PowerShell:

```powershell
git ls-files | Select-String -Pattern '(^|/)\.env$'
```

macOS/Linux:

```bash
git ls-files | grep -E '(^|/)\.env$'
```

---

# Assumptions

The following assumptions were made during development:

1. The application contains two roles: `USER` and `ADMIN`.

2. Public registration creates normal `USER` accounts.

3. Users cannot select the `ADMIN` role during registration.

4. A normal user can access only service requests belonging to their account.

5. Administrators can access all service requests.

6. Request ownership is determined from the authenticated backend user.

7. The frontend cannot manually select request ownership.

8. Newly created requests start with the backend-defined initial status.

9. Request status transitions are controlled by backend business rules.

10. Users can edit or cancel requests only when permitted by the backend.

11. User accounts are deactivated rather than hard deleted because service requests reference users.

12. MongoDB is available either locally or through MongoDB Atlas.

13. The frontend and backend run as separate applications during local development.

14. Frontend authorization checks are used for user experience only. Backend authorization remains authoritative.

---

# Known Limitations

The current implementation may have the following limitations:

- No password reset functionality
- No email verification
- No file attachments for service requests
- No comments or conversation system
- No real-time notifications
- No dedicated support-agent role
- No advanced analytics dashboard
- No request SLA tracking
- No request assignment to individual support employees
- No email notifications unless the optional feature is implemented
- No request activity timeline unless the optional feature is implemented
- No WebSocket-based real-time updates
- Limited audit logging
- No multi-factor authentication
- Automated frontend testing may not yet be included

These limitations do not affect the core service-request workflow.

---

# Future Improvements

The system can be extended with several features.

## Request Activity Timeline

Record events such as:

```text
Request Created
       ↓
Request Updated
       ↓
PENDING → IN_PROGRESS
       ↓
IN_PROGRESS → RESOLVED
```

This would provide a complete history of each request.

## Email Notifications

Users could receive email notifications when:

- A request is created
- A request status changes
- A request is resolved
- Important administrative actions occur

## Comments

Users and administrators could communicate through comments attached to service requests.

## File Attachments

Users could upload:

- Screenshots
- Documents
- Error logs
- Supporting files

## Real-Time Notifications

Socket.IO could provide real-time updates when administrators change request statuses.

## Password Reset

A secure email-based password reset workflow could be added.

## Email Verification

New accounts could require email verification before becoming active.

## Advanced Analytics

Administrator dashboards could include:

- Requests by category
- Requests by priority
- Requests by status
- Average resolution time
- Request trends over time

## Support Staff Assignment

A future `STAFF` role could allow administrators to assign requests to individual employees.

## Audit Logging

Sensitive administrator actions could be recorded for accountability and security monitoring.

## Docker

Docker and Docker Compose could provide consistent development and deployment environments.

## CI/CD

A CI/CD pipeline could automatically:

```text
Install dependencies
       ↓
Run tests
       ↓
Run linting
       ↓
Build frontend
       ↓
Deploy
```

---

# Final Verification

Before submission, the following should be verified.

## Backend

- [ ] MongoDB connection works
- [ ] User model works
- [ ] ServiceRequest model works
- [ ] Password hashing works
- [ ] Authentication works
- [ ] HttpOnly cookie works
- [ ] `/auth/me` works
- [ ] Logout works
- [ ] Role authorization works
- [ ] Request ownership works
- [ ] Request creation works
- [ ] Request editing rules work
- [ ] Request cancellation works
- [ ] Status transitions work
- [ ] Invalid transitions are rejected
- [ ] Admin user management works
- [ ] express-validator works
- [ ] Centralized error handling works
- [ ] Swagger documentation works
- [ ] Backend tests pass

## Frontend

- [ ] Axios uses `withCredentials: true`
- [ ] No JWT stored in localStorage
- [ ] Redux store works
- [ ] Authentication restores after refresh
- [ ] ProtectedRoute works
- [ ] AdminRoute works
- [ ] Login works
- [ ] Register works
- [ ] Logout works
- [ ] USER dashboard works
- [ ] My Requests works
- [ ] Create Request works
- [ ] Request Details works
- [ ] Edit Request works
- [ ] Cancel Request works
- [ ] Admin Dashboard works
- [ ] Admin request management works
- [ ] Search works
- [ ] Filters work
- [ ] Sorting works
- [ ] Pagination works
- [ ] Status-transition interface works
- [ ] User management works
- [ ] Loading states exist
- [ ] Error states exist
- [ ] Empty states exist
- [ ] Success notifications work
- [ ] Responsive layouts work
- [ ] Production build succeeds

## Repository

- [ ] `.env` is not committed
- [ ] `.env.example` is committed
- [ ] No database credentials committed
- [ ] No JWT secrets committed
- [ ] `node_modules` is not committed
- [ ] `dist` is not committed
- [ ] Coverage output is not committed
- [ ] Commit messages are meaningful
- [ ] Branch names are sensible if branches are used
- [ ] README matches the actual implementation
- [ ] Working tree is clean before submission

---

# Useful Commands

## Backend

```bash
cd backend

npm install

npm run dev

npm test
```

Coverage, if configured:

```bash
npm run test:coverage
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev

npm run build
```

Linting, if configured:

```bash
npm run lint
```

---

## Git Verification

```bash
git status

git log --oneline --graph --decorate --all

git ls-files
```

---

# API Documentation

When the backend is running locally, Swagger documentation is available at:

```text
http://localhost:5000/api-docs
```

---

# Author

**Hansi Tharaki**

Software Engineering Undergraduate  
Faculty of Science  
University of Kelaniya

---

# License

This project was developed for educational and technical assessment purposes.