# Frontend - BeProduct OAuth

React + TypeScript + Vite frontend for BeProduct OpenID Connect (OIDC) authentication.

This frontend works with a NestJS backend that uses the [@beproduct/nestjs-auth](https://www.npmjs.com/package/@beproduct/nestjs-auth) package.

## Features

- BeProduct OIDC authentication with automatic login redirect
- Secure httpOnly cookie-based sessions
- User profile dashboard with access/refresh tokens
- React Router for navigation
- TypeScript for type safety
- Axios for API calls with cookie support
- Modern UI with Vite's fast HMR

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Backend API running on http://localhost:3000

### Installation

```bash
npm install
```

### Configuration

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

The default configuration connects to the backend at `http://localhost:3000`.

### Development

```bash
npm run dev
```

The app will run on `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── api/
│   └── axios.ts          # Axios instance with credentials support
├── pages/
│   ├── Login.tsx         # Login page with BeProduct OIDC button
│   └── Dashboard.tsx     # User dashboard showing profile + tokens
├── types/
│   └── user.ts           # User type definitions
├── App.tsx               # Routes and navigation
└── main.tsx              # Application entry point
```

## Authentication Flow

This application demonstrates BeProduct OIDC authentication using the [@beproduct/nestjs-auth](https://www.npmjs.com/package/@beproduct/nestjs-auth) npm package.

### Login Flow

1. User clicks **"Sign in with BeProduct"** on `/login`
2. Frontend redirects to backend: `GET /api/auth/beproduct`
3. Backend (using `@beproduct/nestjs-auth`) redirects to BeProduct IDS authorization page
4. User authenticates with BeProduct
5. BeProduct redirects back to backend callback: `GET /api/auth/callback/beproduct`
6. Backend:
   - Receives profile + access/refresh tokens from BeProduct
   - Stores user with tokens in server-side storage (in-memory Map for this demo)
   - Generates a small JWT (~200 bytes) containing only user metadata (id, email, name)
   - Sets JWT in httpOnly cookie
   - Redirects to frontend `/dashboard`
7. Frontend displays user info and access/refresh tokens (fetched from `/api/auth/me`)

### Token Architecture

**Why separate JWT and BeProduct tokens?**

- **JWT in httpOnly cookie**: Contains only user metadata (id, email, name, company, locale)
  - Small size (~200 bytes) prevents HTTP 431 errors
  - Used for session authentication
  - Cannot be accessed by JavaScript (XSS protection)

- **BeProduct access/refresh tokens**: Stored server-side
  - Retrieved via `/api/auth/me` when needed
  - Used to call BeProduct APIs on behalf of the user
  - Not sent in every request (reduces overhead)

This architecture solves the "cookie too large" problem while maintaining security.

## Available Routes

- `/` - Home page
- `/login` - Login page with "Sign in with BeProduct" button
- `/dashboard` - Protected dashboard showing user profile and BeProduct tokens

## API Endpoints

The frontend communicates with these backend endpoints:

- `GET /api/auth/beproduct` - Initiate BeProduct OIDC login
- `GET /api/auth/callback/beproduct` - OAuth callback (handled by backend)
- `GET /api/auth/me` - Get current user with access/refresh tokens (requires auth cookie)
- `POST /api/auth/logout` - Clear auth cookie and logout

## Tech Stack

- **React 18** - UI library with hooks
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client with cookie support (`withCredentials: true`)
- **@vitejs/plugin-react** - React Fast Refresh via Babel

## Security Features

### httpOnly Cookies
- JWT stored in httpOnly cookies (not accessible to JavaScript)
- Prevents XSS attacks
- Automatically sent with requests via `withCredentials: true`

### CORS Configuration
- Backend allows credentials from `http://localhost:5173` in development
- Configure `FRONTEND_URL` in backend `.env` for production

### Token Storage
- BeProduct access/refresh tokens stored server-side (not in frontend)
- Only exposed via authenticated `/api/auth/me` endpoint
- Reduces attack surface

## Learn More

- **Backend Package**: [@beproduct/nestjs-auth](https://www.npmjs.com/package/@beproduct/nestjs-auth)
- **BeProduct IDS**: [https://id.winks.io/ids](https://id.winks.io/ids)
- **Full Example**: See the main [project README](../README.md)
