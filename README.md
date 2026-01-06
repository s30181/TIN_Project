# Tickets Project

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
Backend: `http://localhost:3000`
API docs: `http://localhost:3000/docs`

### 3.  Frontend Setup
```bash
cd tickets-frontend
npm install
cp .env.example .env

npm run api:generate
npm run dev
```
Frontend: `http://localhost:3001`

## Default Users
| Email               | Password      | Role  |
|---------------------|---------------|-------|
| admin@example.com   | admin123      | admin |
| john@example.com    | password123   | user  |
| jane@example.com    | password123   | user  |
| bob@example.com     | password123   | user  |

## License
MIT
