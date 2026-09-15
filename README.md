# CourtFlow

CourtFlow is a full-stack web application for browsing and booking sports courts. It allows users to search and filter available courts, book a court for a specific date and time, view their bookings, and cancel them. This project was built as a portfolio project to demonstrate a complete frontend–backend–database setup.

## 1. Features

- Browse courts stored in PostgreSQL
- Search courts by name or location
- Filter courts by sport
- Show court availability
- Book an available court
- Select booking date and time
- Prevent duplicate bookings for the same court / date / time
- View all bookings
- Cancel bookings without a full page refresh
- Friendly loading and error states
- Responsive frontend styling

> Note: This version does **not** include authentication, user accounts, payments, or an admin dashboard.

## 2. Tech Stack

**Frontend**

- React
- TypeScript
- Vite
- React Router
- Axios
- CSS

**Backend**

- NestJS
- TypeScript
- REST API

**Database**

- PostgreSQL
- Prisma ORM

**Development**

- Git
- npm

## 3. Architecture

```
React Frontend
      |
      | Axios / REST
      v
NestJS Backend
      |
      | Prisma ORM
      v
PostgreSQL
```

The React frontend makes REST API calls through Axios. The NestJS backend handles those requests, applies the booking business rules, and uses Prisma ORM to read and write data in a PostgreSQL database. The booking API also uses a database-level unique constraint to prevent conflicts.

## 4. Project Structure

```
courtflow2/
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── pages/
│       └── types/
├── backend/
│   ├── prisma/
│   └── src/
│       ├── bookings/
│       ├── courts/
│       └── prisma/
└── README.md
```

## 5. REST API

**Courts**

| Method | Endpoint       | Description        |
| ------ | -------------- | ------------------ |
| GET    | `/courts`      | List all courts    |
| GET    | `/courts/:id`  | Get a single court |

**Bookings**

| Method | Endpoint        | Description               |
| ------ | --------------- | ------------------------- |
| GET    | `/bookings`     | List all bookings         |
| POST   | `/bookings`     | Create a booking          |
| DELETE | `/bookings/:id` | Cancel a booking          |

Example `POST /bookings` request body:

```json
{
  "courtId": 1,
  "customerName": "Example User",
  "customerEmail": "user@example.com",
  "bookingDate": "2026-09-20",
  "startTime": "15:00"
}
```

Behavior:

- Booking an unavailable court returns an error.
- Booking a court that is already booked for the same date and time returns `HTTP 409 Conflict`.

## 6. Database Model

**Court**

- `id`
- `name`
- `sport`
- `location`
- `pricePerHour`
- `available`

**Booking**

- `id`
- `customerName`
- `customerEmail`
- `bookingDate`
- `startTime`
- `createdAt`
- `courtId`

One Court can have many Bookings, while each Booking belongs to one Court.

The combination of `courtId` + `bookingDate` + `startTime` has a compound unique constraint to prevent duplicate time slots.

## 7. Local Setup

**Prerequisites**

- Node.js
- npm
- PostgreSQL

**Clone the repository**

```bash
git clone <repository-url>
cd <repository-folder>
```

**Backend**

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and configure the `DATABASE_URL` value to point to your local PostgreSQL database.

```bash
npx prisma@7.10.0 migrate deploy --config prisma7.config.ts
npx prisma@7.10.0 db seed --config prisma7.config.ts
npm run start:dev
```

**Frontend**

```bash
cd frontend
npm install
```

The default API URL is `http://localhost:3000`. Optionally, copy `.env.example` to `.env` to customize `VITE_API_URL`.

```bash
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend at `http://localhost:3000`.

## 8. Environment Variables

**Backend** (`.env`)

| Variable      | Description                          |
| ------------- | ------------------------------------ |
| `DATABASE_URL` | PostgreSQL connection string        |
| `FRONTEND_URL` | Allowed CORS origin (frontend URL)  |
| `PORT`         | Backend port (default `3000`)       |

**Frontend** (`.env`)

| Variable       | Description                        |
| -------------- | ---------------------------------- |
| `VITE_API_URL` | Backend API base URL               |

Real `.env` files are ignored by Git. The `.env.example` files in the repository are safe templates without real credentials.

## 9. Scripts

**Frontend**

```bash
npm run dev        # Start the dev server
npm run build      # Build for production
npm run lint       # Lint the code
```

**Backend**

```bash
npm run start:dev  # Start the dev server with hot reload
npm run build      # Build for production
npm run test       # Run tests
npm run lint       # Lint the code
```

## 10. Current Project Scope

The current version intentionally focuses on the core booking flow: browsing courts, creating bookings, and cancelling them.

Possible future improvements:

- Authentication and user accounts
- User-specific bookings
- Admin court management
- Stronger request validation
- Automated API tests

The items above are ideas for the future and are not part of the current implementation.

## Screenshots

Screenshots will be added after deployment.

## Live Demo

https://courtflow-kappa.vercel.app
