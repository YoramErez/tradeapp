# TradeSub Backend

Complete backend API for TradeSub - a peer-to-peer item trading platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and secrets
```

3. Set up database:
```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Start development server:
```bash
npm run dev
```

The API will be available at `http://localhost:4000`

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.ts               # Seed data
├── src/
│   ├── config/               # Configuration files
│   ├── middleware/           # Express middleware
│   ├── routes/              # API routes
│   ├── controllers/         # Request handlers
│   ├── services/            # Business logic
│   ├── utils/              # Helper functions
│   └── types/              # TypeScript types
├── .env                     # Environment variables
├── .env.example            # Environment template
└── tsconfig.json           # TypeScript config
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile
- `GET /api/users/:id` - Get user by ID

### Listings
- `GET /api/listings` - Get all listings (with filters)
- `POST /api/listings` - Create listing
- `GET /api/listings/:id` - Get listing details
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

### Likes & Matches
- `POST /api/likes` - Like a listing
- `GET /api/likes/mine` - Get my likes
- `GET /api/matches` - Get my matches

### Swaps
- `POST /api/swaps` - Create swap
- `POST /api/swaps/:id/quote` - Get shipping quote
- `POST /api/swaps/:id/pay` - Pay for swap
- `POST /api/swaps/:id/ship` - Submit tracking
- `POST /api/swaps/:id/complete` - Complete swap

### Messaging
- `GET /api/conversations` - Get my conversations
- `GET /api/conversations/:id/messages` - Get messages
- `POST /api/conversations/:id/messages` - Send message

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read

## 🧪 Testing

```bash
npm test
```

## 📚 Documentation

Full API documentation will be available at `/api/docs` once implemented.

## 🔐 Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation with Zod

## 🌍 Environment Variables

See `.env.example` for all required environment variables.

