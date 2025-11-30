# VenueHub - Hotel Venue Booking System

A full-stack venue booking application that allows users to search venues and submit booking inquiries.

![Tech Stack](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup Instructions](#-setup-instructions)
- [API Endpoints](#-api-endpoints)
- [Approach & Design Decisions](#-approach--design-decisions)
- [Tradeoffs](#-tradeoffs)
- [Future Improvements](#-future-improvements)

## ✨ Features

### Core Features
- **Venue Search & Listing** - Browse venues with multiple filters
  - Filter by location (city)
  - Filter by capacity (min/max guests)
  - Filter by price (max budget)
  - Search by venue name

- **Booking Inquiry System** - Submit booking requests
  - Required fields validation (venueId, companyName, email, startDate, endDate, attendeeCount)
  - Capacity validation against venue limits
  - Double-booking prevention

### Bonus Features
- ✅ Pagination for venue listing
- ✅ Check availability before booking
- ✅ Real-time price calculation
- ✅ Loading states and error handling
- ✅ Responsive design

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **Backend** | NestJS, TypeScript |
| **Database** | PostgreSQL with Prisma ORM |

## 📁 Project Structure
```
venuehub/
├── backend/                    
│   ├── src/
│   │   ├── bookings/          
│   │   ├── venues/            
│   │   ├── locations/         
│   │   ├── prisma/            
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── prisma/
│       ├── schema.prisma      
│       └── seed.ts            
│
├── frontend/                   
│   ├── app/
│   │   ├── page.tsx           
│   │   ├── layout.tsx
│   │   └── venues/
│   ├── lib/
│   │   └── api.ts             
│   └── next.config.js
│
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/muhrezatrih/venuehub
cd venuehub
```

### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/venuedb?schema=public"
PORT=4000
```
```bash
# Run database migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed the database with sample data
npx prisma db seed

# Start the development server
npm run start:dev
```

The API will be available at `http://localhost:4000`

### 3. Frontend Setup
```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```
```bash
# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 4. Verify Setup

1. Open `http://localhost:3000` - You should see the landing page
2. Click "Browse Venues" - You should see the venue listing with filters
3. Click on a venue → "Book This Venue" → Select dates → Should navigate to booking form

## 📡 API Endpoints

### Venues

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/venues` | List venues with filters |
| `GET` | `/api/venues/:id` | Get single venue |
| `GET` | `/api/venues/:id/availability` | Check venue availability |

**Query Parameters for `/api/venues`:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `locationId` | string | Filter by location ID |
| `name` | string | Search by venue name |
| `capacityMin` | number | Minimum guest capacity |
| `capacityMax` | number | Maximum guest capacity |
| `price` | number | Maximum price per day |
| `checkIn` | date | Start date for availability |
| `checkOut` | date | End date for availability |
| `page` | number | Page number (default: 1) |
| `perPage` | number | Items per page (default: 10) |

### Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/bookings` | Create booking inquiry |
| `GET` | `/api/bookings/:id` | Get booking details |

**Request Body for `POST /api/bookings`:**
```json
{
  "venueId": "string",
  "companyName": "string",
  "email": "string",
  "startDate": "2024-12-15T00:00:00.000Z",
  "endDate": "2024-12-18T00:00:00.000Z",
  "attendeeCount": 50,
  "notes": "optional string"
}
```

### Locations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/locations` | List all locations |

## 🎯 Approach & Design Decisions

### 1. Database Design: Normalized Schema

**Decision:** Created separate `Location` model instead of storing city as a string on venues.

**Reasoning:**
- **Data integrity** - Consistent location names, no typos
- **Query efficiency** - Filter by location ID instead of string matching
- **Extensibility** - Can add location metadata (coordinates, timezone) later
```prisma
model Location {
  id     String  @id @default(cuid())
  name   String  @unique
  venues Venue[]
}

model Venue {
  id         String   @id @default(cuid())
  locationId String
  location   Location @relation(...)
}
```

### 2. Availability Check

**Decision:** Check availability at booking creation.

**Reasoning:**
- **Phase 1 (Modal):** Confirm availability before showing booking form
- **Phase 2 (API):** Final validation prevents race conditions

### 3. Capacity Filter Logic

**Decision:** User's guest count must fit within venue's min-max range.

**Reasoning:**
- If venue requires minimum 40 guests and user has 20, venue shouldn't show
- Prevents users from seeing venues they can't actually book

### 4. Frontend State Management

**Decision:** Used URL search params for filter state instead of React state.

**Reasoning:**
- **Shareable URLs** - Users can share filtered results
- **Browser history** - Back/forward navigation works correctly
- **Server rendering** - Filters work with SSR

## ⚖️ Tradeoffs

### 1. Prisma vs Raw SQL

| Chose Prisma | Could have used Raw SQL |
|--------------|------------------------|
| ✅ Type-safe queries | ✅ More control over queries |
| ✅ Easy migrations | ✅ Better for complex queries |
| ✅ Auto-generated types | ❌ More boilerplate |
| ❌ Less control over query optimization | ❌ No automatic migrations |

**Why I chose Prisma:** Faster development, type safety, and the queries needed aren't complex enough to require raw SQL.

### 2. Server Components vs Client Components

| Decision | Reasoning |
|----------|-----------|
| Venue listing page → Server Component | SEO-friendly, faster initial load |
| Venue detail page → Client Component | Needed for modal interaction |
| Filter bar → Client Component | Requires interactivity |
| Booking form → Client Component | Form state management |

## 🔮 Future Improvements

### With More Time, I Would Add:

#### 1. **Authentication & Authorization**
```typescript
// User authentication
- JWT-based auth with refresh tokens
- Role-based access (admin, venue owner, customer)
- Protected booking routes
```

#### 2. **Testing**
```typescript
// Backend unit tests
describe('BookingsService', () => {
  it('should prevent double booking', async () => {
    // Create first booking
    await service.create(bookingData);
    // Attempt overlapping booking
    await expect(service.create(overlappingData))
      .rejects.toThrow(ConflictException);
  });
});

// Frontend integration tests
describe('BookingForm', () => {
  it('should show error for invalid capacity', () => {
    // ...
  });
});
```

#### 3. **Performance Optimizations**
- Redis caching for venue listings
- Database query optimization with proper indexes
- Infinite scroll instead of pagination

#### 4. **Enhanced Features**
- Email notifications for booking confirmation
- Admin dashboard for venue management
- Booking status management (confirm, cancel)
- Calendar view for availability
- Multiple images per venue
- Reviews and ratings

#### 5. **DevOps & Deployment**
```yaml
# Docker setup
- Dockerfile for backend and frontend
- docker-compose for local development
- CI/CD pipeline with GitHub Actions
- Environment-specific configurations
```

#### 6. **Error Tracking & Monitoring**
- Sentry for error tracking
- Logging with structured logs
- Performance monitoring

---

## 📝 License

This project was created as a take-home assignment.

## 👤 Author

Muhammad Reza Tri Hariyanto
- Email: muhammadrezatrih@gmail.com
- GitHub: [@muhrezatrih](https://github.com/muhrezatrih)