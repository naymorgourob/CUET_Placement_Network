# CUET Placement Network

A web-based placement and career platform connecting CUET students, recruiters, companies, and administrators.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Main Features](#main-features)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [User Roles](#user-roles)
6. [Project Structure](#project-structure)
7. [Setup Requirements](#setup-requirements)
8. [Installation](#installation)
9. [Environment Variables](#environment-variables)
10. [Demo Accounts](#demo-accounts)
11. [Database / Data Model](#database--data-model)
12. [Authentication & Authorization](#authentication--authorization)
13. [Application Workflow](#application-workflow)
14. [Notifications](#notifications)
15. [File Uploads](#file-uploads)
16. [API Overview](#api-overview)
17. [Testing](#testing)
18. [Responsive Support](#responsive-support)
19. [Build / Quality Checks](#build--quality-checks)
20. [Known Limitations](#known-limitations)
21. [Future Improvements](#future-improvements)
22. [Progressive Web App (PWA)](#progressive-web-app-pwa)

---

## Project Overview

**CUET Placement Network** is a full-stack web application built as a University Final Year Software Engineering Project. It digitizes the campus placement process for Chittagong University of Engineering & Technology (CUET) by bringing students, recruiters, and the placement-cell administration onto a single platform.

**Why it was developed:** to replace ad-hoc, manual placement coordination (spreadsheets, email threads, physical notice boards) with a structured system where job postings, applications, candidate review, and platform moderation all happen in one place, with clear role boundaries and an auditable history.

**Who uses it:**

- **Students** — build a profile, upload a resume, discover and apply for jobs, and track application status.
- **Recruiters** — manage a company profile, post and manage job listings, and review/shortlist applicants.
- **Admins (Placement Cell)** — verify recruiter accounts, manage/suspend users, moderate job listings, and view placement reports.

The system also includes an **AI module** (Google Gemini API) that analyzes a student's resume, scores it against a specific job posting, and suggests concrete improvements — entirely optional, on-demand tooling layered on top of the core placement workflow.

---

## Main Features

Only features that are actually implemented in the codebase are listed below.

### Student

- Registration & Login
- Student Dashboard (profile completeness, recent applications, recommended jobs)
- Job Search (filters: keyword, department relevance, job type, location, etc.)
- Job Details view
- Job Application (with resume selection)
- My Applications (status tracking: `applied` → `under_review` → `shortlisted`/`rejected` → `selected`)
- Saved Jobs (bookmark jobs for later)
- Companies directory & Company Details
- Career Resources (articles curated/authored by Admin)
- AI Career Tools:
  - Resume Analysis (AI feedback on an uploaded resume)
  - Resume Improvement Suggestions
  - Job Match Score (resume-to-job compatibility score, on demand)
- Resume Upload (PDF), multiple resumes with one marked "current"
- Profile management
- In-app Notifications

### Recruiter

- Recruiter Login (shared login/registration with role selection)
- Recruiter Dashboard (job/application stats)
- Company Profile management (create/update company details, logo)
- Post Job / Edit Job
- My Jobs (manage listings: open/closed/removed)
- Applications list per job
- Candidate (applicant) details view
- Application Status Management (move applicants through the review pipeline)
- In-app Notifications
- Settings (account details, change password)

> Recruiter accounts must be **verified by an Admin** before they can post jobs.

### Admin

- Admin Dashboard (platform-wide stats)
- Recruiter Verification (approve/reject pending recruiter accounts)
- User Management (students & recruiters)
- User Suspension / Reactivation
- Job Moderation (remove inappropriate/expired listings)
- Career Resource management (create/edit resources shown to students)
- Reports (aggregated placement statistics)
- Report Export (JSON download)
- In-app Notifications

---

## Technology Stack

Versions below are read directly from `client/package.json` and `server/package.json`.

### Frontend (`client/`)

| Technology | Version | Purpose |
|---|---|---|
| React | ^19.2.8 | UI library |
| Vite | ^8.2.0 | Build tool / dev server |
| React Router (`react-router-dom`) | ^7.18.2 | Client-side routing |
| Tailwind CSS | ^4.3.3 | Utility-first styling |
| Axios | ^1.19.0 | HTTP client |
| TanStack Query (`@tanstack/react-query`) | ^5.101.4 | Server-state caching & mutations |
| React Hook Form + Zod (`@hookform/resolvers`) | ^7.84.0 / ^4.4.3 | Form state & schema validation |
| Radix UI primitives | ^1.x–2.x | Accessible unstyled UI primitives (dialog, dropdown, select, etc.) |
| Framer Motion | ^13.0.0 | Animations |
| Lucide React | ^1.29.0 | Icon set |
| oxlint | ^1.75.0 | Linting |

### Backend (`server/`)

| Technology | Version | Purpose |
|---|---|---|
| Node.js + Express | ^5.2.1 | HTTP server / REST API |
| Sequelize | ^6.37.8 | ORM |
| mysql2 | ^3.23.2 | MySQL driver |
| jsonwebtoken | ^9.0.3 | JWT authentication |
| bcrypt | ^6.0.0 | Password hashing |
| express-validator | ^7.3.2 | Request validation |
| multer | ^2.2.0 | File upload handling |
| pdf-parse | ^2.4.5 | Resume text extraction for AI features |
| @google/genai | ^2.17.0 | Gemini API client (AI resume tools) |
| dotenv | ^17.4.2 | Environment configuration |
| nodemon (dev) | ^3.1.14 | Auto-restart in development |

### Database

- **MySQL** (accessed via Sequelize ORM; schema created via `sequelize.sync()`, no separate migration files)

### File Storage

- Local disk storage under `server/uploads/` (resumes, company logos), served statically by Express at `/uploads`. No cloud storage integration.

---

## System Architecture

The application follows a classic three-tier, monolithic layered architecture:

```
React (Vite) SPA  →  REST API (Express)  →  MySQL (via Sequelize)
   client/                server/               database
```

- **Frontend**: a single-page React application. Pages call feature-specific service modules (Axios), which are wrapped by TanStack Query hooks for caching, invalidation, and optimistic updates. Routing is role-aware — `ProtectedRoute`/`GuestRoute` guard access based on authentication state and role.
- **Backend**: Express routes → controllers (thin, HTTP-only) → services (business logic) → Sequelize models. A consistent `successResponse` / `AppError` envelope is used across all controllers, with a centralized error-handling middleware.
- **Database**: MySQL, with the schema defined by Sequelize models and synced at server startup.

**Authentication**: JWT-based. On login/register, the backend issues a signed JWT (`JWT_SECRET`, `JWT_EXPIRES_IN`) which the frontend stores and attaches to subsequent requests. An `authenticate` middleware verifies the token and re-checks the user's `isActive` status on **every** request (so a suspended user is locked out immediately, not just at their next login).

**Authorization**: role-based. Every authenticated user has a role — `student`, `recruiter`, or `admin` — enforced by an `authorize(...allowedRoles)` middleware on protected backend routes, and mirrored on the frontend by `ProtectedRoute allowedRoles`. Ownership checks (e.g., a recruiter can only manage their own company's jobs) are additionally enforced in the service layer.

**File uploads**: handled by Multer, validated by MIME type and extension, stored on local disk under `server/uploads/{resumes,companies,profiles}/`, and served back via Express static middleware at `/uploads/...`.

**Notifications**: an in-app `Notification` model records events (new application, status change, recruiter verification, etc.) tied to a specific user. The frontend polls the notifications endpoint periodically to refresh the bell/list — there is no WebSocket/real-time push.

---

## User Roles

| Role | Main Responsibilities |
|---|---|
| **Student** | Build a profile, upload/manage resumes, search and apply for jobs, save jobs for later, track application status, use AI resume tools, browse companies and career resources |
| **Recruiter** | Manage a company profile, post and manage job listings, review applicants, update application status, manage account settings |
| **Admin** | Verify/reject recruiter accounts, manage and suspend/reactivate users, moderate job listings, author career resources, view and export placement reports |

---

## Project Structure

```
CUET_Placement_Network/
│
├── client/                       # React (Vite) frontend
│   └── src/
│       ├── app/                  # App shell / root composition
│       ├── assets/                # Static assets
│       ├── components/
│       │   ├── ui/                # Base design-system components (Button, Input, Modal, Table, ...)
│       │   ├── shared/             # Composite components shared across features
│       │   └── landing/            # Landing-page-only sections
│       ├── contexts/               # AuthContext, ThemeContext, ToastContext, etc.
│       ├── features/               # Feature-sliced modules (admin, auth, notifications, public, recruiter, student)
│       │   └── {feature}/
│       │       ├── components/     # Feature-specific components
│       │       ├── *Service.js     # Axios calls for this feature
│       │       ├── *Queries.js     # TanStack Query hooks
│       │       └── *Schema.js      # Zod validation schemas
│       ├── hooks/                  # Shared React hooks
│       ├── layouts/                # Role-based layout shells (sidebar/header per role)
│       ├── pages/                  # Route-level page components (student/, recruiter/, admin/, public)
│       ├── providers/              # Context/provider composition
│       ├── routes/                 # ProtectedRoute / GuestRoute route guards
│       ├── services/                # Cross-cutting services (e.g., authService, axios instance)
│       ├── types/                   # Shared type/constant definitions
│       └── utils/                   # Utility functions
│
├── server/                        # Node.js + Express backend
│   ├── src/
│   │   ├── config/                  # Sequelize/database configuration
│   │   ├── constants/                # Shared constants (roles, statuses, etc.)
│   │   ├── controllers/              # Thin HTTP controllers
│   │   ├── middlewares/              # auth, authorize, upload (Multer), validation, error handling
│   │   ├── models/                   # Sequelize models + associations (models/index.js)
│   │   ├── routes/                   # Express routers, one per resource
│   │   ├── seeders/                  # Demo/dev data seed scripts
│   │   │   ├── data/                  # Static seed datasets (companies, jobs, recruiters, students, resources)
│   │   │   └── lib/                   # Seeder helpers (e.g., resume PDF generation)
│   │   ├── services/                 # Business logic
│   │   ├── utils/                    # Token generation, response helpers, etc.
│   │   └── validators/                # express-validator rule sets
│   ├── uploads/                     # Uploaded files (resumes/, companies/, profiles/) — gitignored
│   └── server.js                    # Entry point (loads env, connects DB, starts Express)
│
├── .gitignore
└── README.md
```

---

## Setup Requirements

- **Node.js** v18 or later (project uses ES Modules throughout)
- **npm**
- **MySQL** server (local or remote)
- A **Google Gemini API key** (only required for the AI resume features; the rest of the app works without it)

---

## Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd CUET_Placement_Network

# 2. Install backend dependencies
cd server
npm install

# 3. Install frontend dependencies
cd ../client
npm install
```

### Configure environment variables

```bash
# Backend
cd server
cp .env.example .env
# then edit server/.env with real values (DB credentials, JWT secret, Gemini key)

# Frontend
cd ../client
cp .env.example .env
# then edit client/.env if your backend runs on a different host/port
```

### Create the database

Create an empty MySQL database matching `DB_NAME` in `server/.env`:

```sql
CREATE DATABASE cuet_placement_network;
```

The schema is created automatically — the backend calls `sequelize.sync()` on startup (no separate migration step or CLI tool is used in this project).

### Seed demo data (optional but recommended)

From `server/`, seed scripts populate companies, recruiters, students, jobs, resumes, applications, and resources:

```bash
cd server
npm run seed
```

This runs, in order: `seed:companies`, `seed:recruiters`, `seed:jobs`, `seed:reassign-jobs`, `seed:job-status-mix`, `seed:students`, `seed:resumes`, `seed:applications`, `seed:resources`. Individual seed scripts can also be run on their own (see `server/package.json`).

> The demo admin account (see [Demo Accounts](#demo-accounts)) is **not** created by a seed script — it must exist in the database already (e.g. created once manually) before running `npm run seed`, since `seed:recruiters` and `seed:resources` both reference an existing admin user.

### Start the backend

```bash
cd server
npm run dev     # nodemon, auto-restart on changes
# or
npm start       # plain node
```

The API starts on the port defined by `PORT` in `server/.env` and exposes a health check at `GET /api/health`.

### Start the frontend

```bash
cd client
npm run dev       # Vite dev server
```

Open the printed local URL (Vite's default is `http://localhost:5173`) in a browser.

---

## Environment Variables

### Backend — `server/.env`

| Variable | Purpose |
|---|---|
| `PORT` | Port the Express server listens on |
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port |
| `DB_NAME` | MySQL database name |
| `DB_USER` | MySQL username — `your_db_username` |
| `DB_PASSWORD` | MySQL password — `your_db_password` |
| `JWT_SECRET` | Secret used to sign JWTs — `your_jwt_secret` |
| `JWT_EXPIRES_IN` | JWT expiry (e.g. `24h`) |
| `UPLOAD_PATH` | Local directory for uploaded files (default `uploads`) |
| `MAX_FILE_SIZE_MB` | Max upload size in MB |
| `GEMINI_API_KEY` | Google Gemini API key for AI features — `your_gemini_api_key` |
| `CLIENT_URL` | Frontend origin, used for CORS |

### Frontend — `client/.env`

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API (e.g. `http://localhost:5002/api`) |
| `VITE_APP_NAME` | Display name used in the UI |
| `VITE_UPLOAD_BASE_URL` | Base URL for serving uploaded files (e.g. `http://localhost:5002/uploads`) |

Never commit real secrets — `.env` is gitignored in this repository; only `.env.example` (with placeholder values) is tracked.

---

## Demo Accounts

These are **development/demo seed credentials only** — not production accounts. They exist only in a database that has been seeded with `npm run seed` (student/recruiter) or created manually (admin).

| Role | Email | Password | Notes |
|---|---|---|---|
| Student | `tanvir.ahmed24@example.com` (or any seeded student email in `server/src/seeders/data/students.data.js`) | `password123` | All seeded students share this password |
| Recruiter | `recruiter.bkash@example.com` (or any seeded recruiter email in `server/src/seeders/data/recruiters.data.js`) | `password123` | Most seeded recruiters are pre-verified; a few are seeded as `pending`/`rejected` to demo the verification flow |
| Admin | `admin.f1@example.com` | `password123` | Not created by a seed script — must already exist in the database |

---

## Database / Data Model

Core entities (Sequelize models in `server/src/models/`):

- **User** — base account (email, password hash, `role`: student/recruiter/admin, `isActive`)
- **StudentProfile** — 1:1 with User; department, batch year, CGPA, skills, phone, current resume pointer
- **RecruiterProfile** — 1:1 with User; designation, verification status, linked Company
- **Company** — recruiter's employer; name, industry, website, logo, description
- **Job** — posted by a recruiter, belongs to a Company; title, description, requirements, status (open/closed/removed)
- **Resume** — belongs to a StudentProfile; a student can have multiple, one marked current
- **ResumeAnalysis** — 1:1 with Resume; AI-generated resume feedback
- **Application** — links a StudentProfile, a Job, and the Resume submitted; status lifecycle (`applied` → `under_review` → `shortlisted`/`rejected` → `selected`)
- **MatchScore** — links a Resume and a Job; AI-generated compatibility score (resolves the conceptual Resume↔Job many-to-many relationship)
- **SavedJob** — links a StudentProfile and a Job (bookmarking)
- **Notification** — belongs to a User; in-app event notifications
- **Resource** — career-advice content authored by an Admin

Key relationships:

```
Company    → has many → Job
Job        → has many → Application
StudentProfile → has many → Application, Resume, SavedJob
Resume     → has many → Application, MatchScore
Job        → has many → MatchScore, SavedJob
User (admin) → has many → Resource, and verifies RecruiterProfiles
```

The relationships above reflect the live Sequelize model associations (`server/src/models/index.js`).

---

## Authentication & Authorization

- **Login/Registration**: `POST /api/auth/login`, `POST /api/auth/register`. Passwords are hashed with bcrypt; on success the backend returns a signed **JWT**.
- **Session handling**: the frontend stores the JWT and attaches it as a Bearer token on every API request via a shared Axios instance.
- **Protected routes (backend)**: an `authenticate` middleware verifies the JWT on every request and re-checks the user's active status (a suspended user is blocked immediately, not only at next login). An `authorize(...roles)` middleware then restricts specific routes to `student`, `recruiter`, and/or `admin`.
- **Protected routes (frontend)**: `ProtectedRoute`/`GuestRoute` components (in `client/src/routes/`) redirect unauthenticated users to `/login` and redirect users attempting to access another role's pages to `/unauthorized`.
- **Recruiter-specific gating**: recruiters must additionally be **verified by an Admin** before they can post or manage jobs.

---

## Application Workflow

**Student**
```
Login → Find Jobs → View Job Details → Apply (select resume) → My Applications (track status)
```

**Recruiter**
```
Login → Set up Company Profile → (wait for Admin verification) → Post Job → Receive Applications
      → Review Candidate → Update Application Status
```

**Admin**
```
Login → Verify/Reject Recruiters → Manage Users (suspend/reactivate) → Moderate Jobs → View/Export Reports
```

---

## Notifications

An in-app `Notification` model (per-user, read/unread) covers the following implemented events:

| Event | Recipient |
|---|---|
| Student submits an application | Student ("Application Submitted") and Recruiter ("New application received for [Job Title]") |
| Recruiter changes an application's status | Student (status-specific message) |
| Admin verifies a recruiter account | Recruiter |
| Admin rejects a recruiter account | Recruiter |

The frontend refreshes notifications via periodic polling (60-second interval) — there is no WebSocket or push-based real-time delivery.

---

## File Uploads

- **Resumes**: students upload resumes in **PDF format only** (validated by both MIME type and file extension). A student may have multiple resumes; one is marked as the "current" resume used for new applications. Uploaded files are stored under `server/uploads/resumes/` and served via `/uploads/resumes/...`.
- **Company logos**: recruiters can upload a logo image for their company, stored under `server/uploads/companies/`.
- Resumes already attached to a submitted application keep their original file reference even if the student later uploads a new "current" resume — historical applications are not retroactively affected.
- Deleting a resume removes its database record; the underlying file on disk is not currently deleted (a known limitation, see below).

---

## API Overview

The backend exposes a REST API under `/api`, grouped by resource:

- `/api/auth` — registration, login
- `/api/students`, `/api/students/me`, `/api/students/me/saved-jobs` — student profile, dashboard, saved jobs
- `/api/recruiters`, `/api/recruiters/me` — recruiter profile and their jobs
- `/api/company`, `/api/companies` — the recruiter's own company / public company directory
- `/api/jobs`, `/api/jobs/:jobId` (nested applications) — job listings and per-job applications
- `/api/resumes` — resume upload/management, AI analysis & improvement, job match scoring
- `/api/applications` — application status management
- `/api/admin` — recruiter verification, user management, job moderation, reports
- `/api/notifications` — in-app notifications
- `/api/resources` — career resources

A health check is available at `GET /api/health`.

---

## Testing

No automated test suite (unit/integration test framework) is currently part of this project. Verification was instead performed as a **manual, live integration QA pass** against the real running application and database. Summary of what was verified:

- **Authentication** — role-correct login/logout, cross-role route protection (frontend and backend independently), invalid-token handling
- **Student workflow** — apply flow, duplicate-application blocking, resume-at-apply-time integrity, notification on apply
- **Recruiter workflow** — company data consistency, job visibility, applicant/candidate detail accuracy
- **Application status lifecycle** — every supported transition, notification-per-transition, terminal-state blocking
- **Admin workflow** — recruiter verification, user suspension, logical job removal, report accuracy, JSON export
- **Notifications** — all implemented event types, read/unread persistence, per-user isolation, IDOR check on mark-as-read
- **File/resume handling** — correct upload URL paths, historical resume association
- **API/security/data hygiene** — no bypassed service layer, no hardcoded secrets/IDs, sanitized error responses, `.env` gitignored
- **Responsive layout** — swept at `1440px`, `1280px`, `1024px`, `768px`, `390px`, `375px`

Result at last pass: **zero critical issues**, one real backend bug found and fixed (a dead/hardcoded `totalApplications: 0` stub in the student dashboard summary).

An earlier, broader full-project audit also covered architecture, backend, frontend, UX, and landing page quality across the codebase.

---

## Responsive Support

The application has been checked across desktop, tablet, and mobile viewport widths, specifically: **1440px, 1280px, 1024px, 768px, 390px, and 375px**.

---

## Build / Quality Checks

From `client/`:

```bash
npm run lint      # oxlint
npm run build     # production Vite build
npm run preview   # preview the production build locally
```

From `server/`, there is no dedicated lint/build script beyond running the app directly (`npm start` / `npm run dev`); the backend is plain Node.js with no separate build step.

As of the last integration QA pass, `npm run lint` (client) was clean aside from pre-existing, unrelated Fast Refresh context warnings, and `npm run build` completed successfully.

---

## Known Limitations

These are genuine, currently-true gaps in the project, not hypothetical concerns:

- **No automated test suite** — verification has been manual/live rather than via unit/integration test frameworks.
- **No server-side password/registration validation** — the frontend enforces password strength via Zod, but the backend's `auth` routes do not re-validate this, so it can be bypassed via a direct API call.
- **No resume file viewing/download for recruiters** — recruiters currently see only a resume's filename, not an in-app viewer or download link (transparently communicated in the UI, not silently broken).
- **Deleted resumes are not physically removed from disk** — only the database record is deleted; the uploaded file remains in `server/uploads/`.
- **No rate limiting or security headers (e.g. Helmet)** on the backend.
- **No database migration system** — schema changes are applied via `sequelize.sync()` at startup rather than versioned migrations.
- **Dark mode has no in-app toggle** — the theming system (`ThemeContext`) is fully built and works correctly when the OS is set to dark mode, but there is no UI control to switch it manually, and most page-level styles have no explicit dark-mode variant.
- **No real-time notifications** — the notification bell/list refreshes via 60-second polling, not WebSockets or push.
- **Populated with development/demo data** — the current dataset (companies, jobs, recruiters, students) is seeded demo data for showcasing the platform, not production data.
- **Not deployed to a production environment** — this project runs locally / in a development setup only.

---

## Future Improvements

The following are **not implemented** — they are possible directions for future work only:

- Production deployment (hosting, managed database, cloud file storage)
- Real-time notifications (WebSockets)
- Server-side validation hardening and rate limiting
- Automated test suite (unit/integration/e2e)
- In-app dark mode toggle and fuller dark-mode styling coverage
- Resume viewing/downloading for recruiters
- Richer AI-driven job recommendations
- Native mobile application

---

## Progressive Web App (PWA)

PWA conversion has **not** been completed. The application is a standard React SPA and is not currently installable as a PWA.

**Future improvement:** Progressive Web App support (manifest, service worker, offline support) can be added later.
