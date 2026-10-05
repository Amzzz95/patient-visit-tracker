# Patient Visit Tracker

A full-stack application for tracking patient visits by clinician, with a responsive healthcare dashboard and a structured backend API.

## Tech stack

### Frontend
- React 19
- Vite
- Chakra UI
- React Hook Form
- CSS modules / class-based styling for maintainability

### Backend
- Node.js
- Express
- SQLite with better-sqlite3
- Helmet
- CORS
- express-rate-limit
- morgan

---

## Project structure

```bash
patient-visit-tracker/
├── package.json
├── README.md
├── client/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── theme.js
│       ├── styles.css
│       ├── components/
│       │   ├── Roster.jsx
│       │   └── VisitLog.jsx
│       ├── forms/
│       │   └── NewVisitForm.jsx
│       └── utils/
│           └── api.js
├── server/
│   ├── package.json
│   ├── app.js
│   ├── db.js
│   ├── index.js
│   ├── test.js
│   ├── routes/
│   │   ├── people.js
│   │   └── visits.js
│   └── utils/
│       └── validation.js
└── visits.db
```

---

## Requirements

- Node.js 18+
- npm

---

## Local setup

Install all dependencies:

```bash
npm run install:all
```

Run the app in development mode:

```bash
npm run dev
```

This starts:
- Backend API on http://localhost:3001
- Frontend on http://localhost:5173

Run backend only:

```bash
npm run dev --prefix server
```

Run frontend only:

```bash
npm run dev --prefix client
```

Run backend tests:

```bash
npm test --prefix server
```

The SQLite database will be created automatically in the server folder as `visits.db`.

---

## Frontend overview

The frontend is built to be clear, responsive, and easy to review for interview purposes.

### UI responsibilities
- Patient visit form for creating new visits
- Filter controls for clinician and patient selection
- Roster panels for clinicians and patients
- Visit log with newest records first
- Loading and validation states
- Toast feedback for success and error states

### Frontend quality choices
- Chakra UI for speed and consistency in component styling
- React Hook Form for form validation and cleaner state handling
- CSS classes for reusable styling rather than excessive inline prop-based styling
- Theme setup for consistent branding and dark mode support
- Error boundaries to avoid full app crashes from unexpected UI failures

### Frontend patterns used
- `useOptimistic` for instant UI feedback when adding a clinician or patient
- server-driven data flow for filtering and list updates
- structured API helper in `client/src/utils/api.js`

---

## Backend overview

The backend is designed as a small but professional Express API with a clear layered structure.

### API responsibilities
- manage clinicians and patients
- create and fetch visit records
- validate incoming input before inserts
- enforce foreign-key relationships between visits and records
- return consistent HTTP error responses

### Backend quality choices
- route separation into `people.js` and `visits.js`
- input sanitization and validation utilities
- centralized error handling
- security middleware for production patterns
- rate limiting to reduce abuse
- request logging using Morgan
- health-check endpoint at `/health`

### Security and hardening applied
- Helmet for secure HTTP headers
- CORS configuration
- request rate limiting
- JSON body size limit
- strict validation for IDs, dates, and input length
- no direct database writes without validation

### Backend API endpoints

#### Clinicians
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/clinicians` | Get all clinicians |
| POST | `/api/clinicians` | Create a clinician `{ name, specialty? }` |

#### Patients
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/patients` | Get all patients |
| POST | `/api/patients` | Create a patient `{ name, date_of_birth? }` |

#### Visits
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/visits` | Get visits, newest first; optional filters `?clinicianId=1&patientId=2` |
| POST | `/api/visits` | Create a visit `{ clinicianId, patientId, visitedAt, notes? }` |

### Example response pattern

```json
{
  "error": "Name is required."
}
```

All validation or server issues return structured error responses with proper HTTP status codes.

---

## Testing

Backend tests are written with Node's built-in test runner and supertest.

Covered scenarios include:
- valid creation of clinicians and patients
- input validation failures
- invalid dates
- missing clinician/patient IDs
- visit ordering
- filtering by clinician

Run tests:

```bash
npm test --prefix server
```

---

## Notes for demo / interview readiness

This project is structured to show professional engineering thinking:
- code is split by responsibility
- the frontend and backend are not tightly coupled
- validation and security are handled with care
- the app is easy to reason about and extend
- it demonstrates both UI polish and API discipline

Future improvements could include:
- pagination and search
- edit / delete flows
- user authentication
- audit logging
- database migration strategy for larger production use
