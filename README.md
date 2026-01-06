# Tickets Project

A full-stack ticket reservation system built with NestJS (backend) and React (frontend).

## Tech Stack

**Backend:**
- NestJS 11
- Prisma ORM with SQLite
- JWT Authentication
- Swagger/OpenAPI documentation

**Frontend:**
- React 19
- TanStack Router & Query
- TailwindCSS
- i18next (internationalization)
- Vite

## Project Structure

```
tin-project/
├── tickets-backend/     # NestJS REST API
├── tickets-frontend/    # React SPA
└── README.md
```

## Prerequisites

- Node.js (v18 or higher recommended)
- npm


### 1. Setup

### 2. Backend Setup

```bash
cd tickets-backend

npm install

cp .env.example .env

npm run db:generate
npm run db:migrate
npm run db:seed
npm run build
npm run start
```

The backend `http://localhost:3000`
API docs: `http://localhost:3000/docs`

### 3.  Frontend Setup

```bash
cd tickets-frontend

npm install

cp .env.example .env

npm run api:generate

npm run dev
```

The frontend will be available at `http://localhost:3001`

## Default Users
| Email               | Password      | Role  |
|---------------------|---------------|-------|
| admin@example.com   | admin123      | admin |
| john@example.com    | password123   | user  |
| jane@example.com    | password123   | user  |
| bob@example.com     | password123   | user  |

## License

MIT
