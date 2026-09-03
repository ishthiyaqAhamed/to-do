# Ledger — Task Board

A full-stack Trello-like task management application with role-based access control, built with Next.js, Express, and MongoDB.

## Live Demo

- Frontend: https://to-do-rho-topaz-85.vercel.app
- Backend API: https://to-do-backend-oulh.onrender.com/api

## Tech Stack

- Frontend: Next.js 14 (App Router), Tailwind CSS, @dnd-kit for drag-and-drop, Axios
- Backend: Express.js, Mongoose
- Database: MongoDB (Atlas)
- Auth: JWT, bcryptjs for password hashing
- Deployment: Vercel (frontend), Render (backend), MongoDB Atlas (database)

## Features

- Two user roles: standard users and administrators (admins are seeded via script, never through registration)
- Drag-and-drop task board with To Do / Doing / Done columns, persisted to the database
- Standard users can create tasks and self-assign unassigned tasks
- Administrators can view and reassign any task across any user
- JWT-based authentication with bcrypt password hashing
- Role-based access control enforced on the backend

## Project Structure

todo app/
├── backend/ Express REST API
└── frontend/ Next.js frontend


## Setup Instructions

### Backend

```bash
cd backend
npm install
```


Seed the admin account:

```bash
npm run seed
```

Run the server:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

NEXT_PUBLIC_API_URL=http://localhost:5000/api


Run the dev server:

```bash
npm run dev
```

## Environment Variables

| Variable | Location | Description |
|---|---|---|
| `MONGO_URI` | backend | MongoDB Atlas connection string |
| `JWT_SECRET` | backend | Secret used to sign JWTs |
| `CLIENT_URL` | backend | Frontend origin, for CORS |
| `ADMIN_EMAIL` | backend | Email used by the seed script |
| `ADMIN_PASSWORD` | backend | Password used by the seed script |
| `NEXT_PUBLIC_API_URL` | frontend | Backend API base URL |

## Deployment

- Backend deployed on Render (root directory: `backend`, build: `npm install`, start: `npm start`)
- Frontend deployed on Vercel (root directory: `frontend`)
- Database hosted on MongoDB Atlas

