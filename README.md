# Service Request Management System

A full-stack Service Request Management System built with the MERN stack, for the VisionRoot (Pvt) Ltd Software Engineering Intern technical assignment. Registered **USER**s create and track their own service requests; **ADMIN**s view all requests, manage status transitions, and manage user accounts.

> Looking for the REST API reference? See [`API.md`](./API.md).

## Table of Contents
- [About the Project](#about-the-project)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Business Rules](#business-rules)
- [Installation & Setup](#installation--setup)
- [Running the Project Locally](#running-the-project-locally)
- [Running Tests](#running-tests)
- [Assumptions](#assumptions)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)

---

## About the Project
Two roles, enforced entirely on the backend — frontend route guards exist only for usability, every rule is re-checked server-side:

- **USER** — register/login, create requests, view/edit own `PENDING` requests, cancel eligible requests, view status.
- **ADMIN** — view all requests, search/filter/sort/paginate, update status per the transition rules, view and activate/deactivate users.

## Technology Stack

**Frontend**
| Technology | Purpose |
|---|---|
| React + Vite | UI and dev/build tooling |
| Tailwind CSS | Responsive styling |
| Redux Toolkit + React Redux | Global auth/session state |
| React Router DOM | Client-side routing |
| Axios (`withCredentials: true`) | API calls, sends the auth cookie |
| React Hot Toast | Success/error notifications |
| Lucide React | Icons |

**Backend**
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API |
| MongoDB + Mongoose | Data storage, schema, indexes |
| jsonwebtoken | Signing/verifying the auth token |
| bcryptjs | Password hashing |
| express-validator | Server-side request validation |
| cookie-parser | Reading the HttpOnly auth cookie |
| cors | Restricting API access to the frontend origin |
| dotenv | Environment configuration |

**Testing & Docs**
| Technology | Purpose |
|---|---|
| Jest + Supertest | Backend integration tests |
| mongodb-memory-server | Isolated in-memory DB for tests |
| Swagger (swagger-jsdoc + swagger-ui-express) | Interactive API docs at `/api-docs` |

**Why these choices:** JWT in an HttpOnly cookie (not localStorage) keeps the token out of reach of frontend JS, closing off the main XSS token-theft vector. `express-validator` re-validates everything server-side since client-side checks can always be bypassed. Mongoose indexes and query-driven filtering keep the admin request list fast without loading the whole collection into the browser.

## Architecture

```
                         ┌───────────────────────────┐
                         │      React Frontend        │
                         │  Vite · Redux Toolkit       │
                         │  React Router · Tailwind    │
                         └──────────────┬──────────────┘
                                        │
                         Axios (withCredentials: true)
                            HttpOnly JWT cookie
                                        │
                                        ▼
                         ┌───────────────────────────┐
                         │   Express REST API          │
                         │                             │
                         │  route                      │
                         │    → validator              │
                         │    → authenticate            │
                         │    → authorize (role check)  │
                         │    → controller              │
                         │    → service (business rules)│
                         │  → global error middleware   │
                         └──────────────┬──────────────┘
                                        │
                                    Mongoose
                                        │
                                        ▼
                         ┌───────────────────────────┐
                         │          MongoDB            │
                         │   users   serviceRequests    │
                         └───────────────────────────┘
```

**Data relationship:** one `User` has many `ServiceRequest`s — each `ServiceRequest.user` is an ObjectId reference to `User._id`.

## Business Rules
Enforced only in `backend/src/services/request.service.js`, never trusted from the client:
```
PENDING      -> IN_PROGRESS
PENDING      -> CANCELLED
IN_PROGRESS  -> RESOLVED
IN_PROGRESS  -> CANCELLED
```
- `RESOLVED` and `CANCELLED` are terminal — no transitions out of them.
- A USER may edit a request only while it is `PENDING`.
- A USER may cancel a request only while it is `PENDING` or `IN_PROGRESS`.
- The request owner and the initial `PENDING` status are always set from `req.user._id` server-side — a client can never choose either.
- A USER can access only their own requests; an ADMIN can access all requests. Changing the `:id` in a URL never exposes another user's request (returns `403`).
- Only an ADMIN can change a request's status.

## Installation & Setup

**Prerequisites:** Node.js, npm, Git, and a reachable MongoDB (local `mongod` or Atlas).

```bash
git clone <repository-url>
cd service-request-system

# Backend
cd backend
cp .env.example .env      # fill in real values, see below
npm install

# Frontend
cd ../frontend
cp .env.example .env
npm install
```

**`backend/.env`**
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/service-request-system
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**`frontend/.env`**
```
VITE_API_URL=http://localhost:5000/api
```
Vite only exposes `VITE_`-prefixed variables to the browser — never put secrets (JWT_SECRET, DB credentials) in this file.

## Running the Project Locally

```bash
# Terminal 1 — backend
cd backend
npm run dev        # http://localhost:5000, Swagger at /api-docs

# Terminal 2 — frontend
cd frontend
npm run dev         # http://localhost:5173
```

Open `http://localhost:5173` in a browser. Register a normal account through the UI.

**To get an admin account**, register normally, then promote the user directly in MongoDB:
```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "ADMIN" } })
```
Log out and back in so the new role takes effect.

**Production build check:**
```bash
cd frontend
npm run build   # outputs to frontend/dist
```

## Running Tests

```bash
cd backend
npm test
```

Covers:
- Register, duplicate email rejected, login success/failure, unauthenticated access rejected.
- Request creation forcing `status=PENDING` and the correct owner regardless of what the client sends.
- Cross-user ownership isolation (`403` on another user's request).
- PENDING-only edit enforcement.
- Valid and invalid status transitions.

## Assumptions
- A standalone MongoDB instance is sufficient; no replica set required for this assignment.
- "Cancel" sets `status = CANCELLED` rather than hard-deleting the document, since requests reference users and keeping history is preferable. `DELETE /api/requests/:id` is wired to the same behavior as `PATCH /:id/cancel`.
- There is no public "become admin" endpoint — admin accounts are created by manually promoting a user in the database.

## Known Limitations
- Single long-lived JWT; no refresh-token rotation.
- No email notifications or request activity/history timeline (both listed as optional in the assignment).
- No file attachments on requests.

## Future Improvements
- Request activity/history timeline (a `RequestActivity` collection).
- Email notifications on status change.
- Refresh tokens with shorter-lived access tokens.
- Rate limiting on auth endpoints.

## Author
**Hansi Tharaki Randima**
Software Engineering Undergraduate, University of Kelaniya