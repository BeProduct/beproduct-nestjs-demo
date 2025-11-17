# BeProduct OAuth Application

Full-stack OAuth authentication application using BeProduct IDS (Identity Server) with OpenID Connect.

## Project Structure

```
beproduct-oauth-nestjs/
├── backend/                    # NestJS API server
│   ├── src/
│   │   ├── auth/              # OAuth authentication module
│   │   │   ├── strategies/    # BeProduct OIDC & JWT strategies
│   │   │   ├── dto/           # Data transfer objects
│   │   │   └── interfaces/    # User interfaces
│   │   └── ...
│   ├── .env.example
│   └── package.json
│
├── frontend/                   # React + TypeScript + Vite
│   ├── src/
│   │   ├── pages/            # Home, Login, Dashboard
│   │   ├── hooks/            # useAuth hook
│   │   └── types/            # User types
│   └── package.json
│
└── start-all.sh              # Start both servers
```

## Features

- **BeProduct OAuth (OIDC)** - Single Sign-On with BeProduct IDS
- **httpOnly Cookie Authentication** - Secure JWT token storage
- **Auto-Registration** - New users automatically created on first login
- **In-Memory User Storage** - No database required (for prototyping)
- **React Frontend** - Modern UI with hooks and TypeScript
- **CORS Enabled** - Frontend-backend communication configured

## Quick Start

### Backend Setup

```bash
cd backend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your OAuth credentials

# Run in development mode
npm run start:dev
```

The API will run on `http://localhost:3000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### Quick Start (Both Servers)

```bash
# From root directory
./start-all.sh
```

This will start both backend (port 3000) and frontend (port 5173) servers.

## Environment Variables

### Backend (.env)

Required BeProduct OIDC configuration (already set in `.env`):

```bash
# BeProduct OAuth
OIDC_ENABLED=true
OIDC_PROVIDER_NAME=BeProduct
OIDC_CLIENT_ID=nextjs
OIDC_CLIENT_SECRET=Hj348793dejkSW
OIDC_ISSUER=https://id.winks.io/ids
OIDC_AUTHORIZATION_URL=https://id.winks.io/ids/connect/authorize
OIDC_TOKEN_URL=https://id.winks.io/ids/connect/token
OIDC_USERINFO_URL=https://id.winks.io/ids/connect/userinfo
OIDC_SCOPES=openid profile email roles offline_access BeProductPublicApi
OIDC_CALLBACK_URL=http://localhost:3000/auth/callback/beproduct

# JWT (change this!)
JWT_SECRET=your-jwt-secret-key-change-this-min-32-chars
JWT_EXPIRATION=30d
```

### Frontend (.env)

```bash
VITE_API_URL=http://localhost:3000
```

## BeProduct OAuth Setup

This application uses **BeProduct IDS** (Identity Server) for authentication.

- **Base URL**: https://id.winks.io
- **Client ID**: nextjs (shared with Docmost)
- **Client Secret**: Hj348793dejkSW
- **Scopes**: openid, profile, email, roles, offline_access, BeProductPublicApi

The OAuth credentials are already configured. No additional setup required.

## API Endpoints

### Authentication
- `GET /auth/beproduct` - Initiate BeProduct OAuth flow
- `GET /auth/callback/beproduct` - OAuth callback (handled by backend)
- `GET /auth/me` - Get current user (requires JWT cookie)
- `POST /auth/logout` - Logout and clear cookie

### Other
- `GET /` - Health check

## Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **Passport.js** - Authentication middleware
  - `passport-openidconnect` - OpenID Connect strategy
- **JWT** - Token-based authentication (@nestjs/jwt)
- **Cookie Parser** - httpOnly cookie handling
- **Class Validator** - Request validation

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client with cookie support

## OAuth Flow

1. User clicks "Sign in with BeProduct IDS" on `/login`
2. Frontend redirects to backend `/auth/beproduct`
3. Backend initiates OAuth flow, redirects to BeProduct IDS
4. User authenticates at https://id.winks.io
5. BeProduct IDS redirects back to `/auth/callback/beproduct` with code
6. Backend exchanges code for tokens
7. Backend fetches user profile from BeProduct
8. Backend creates/updates user (auto-registration)
9. Backend generates JWT and sets httpOnly cookie
10. Backend redirects to frontend `/dashboard`
11. Frontend calls `/auth/me` to get user from JWT cookie
12. User sees dashboard with profile info

## Development

### Backend
```bash
cd backend
npm run start:dev    # Development with watch mode
npm run test         # Run tests
npm run build        # Build for production
npm run start:prod   # Run production build
```

### Frontend
```bash
cd frontend
npm run dev          # Development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Security Features

- **httpOnly Cookies** - Prevents XSS attacks (JavaScript cannot access tokens)
- **CORS Protection** - Only allows requests from configured frontend URL
- **Secure Cookies** - HTTPS-only in production
- **SameSite Policy** - CSRF protection
- **JWT Expiration** - 30-day token validity
- **Auto-Registration Control** - Can be disabled via env var

## Notes

- Users are stored in-memory (Map) - data is lost on server restart
- For production, integrate a database (PostgreSQL, MongoDB, etc.)
- Change `JWT_SECRET` before deploying
- BeProduct IDS credentials are shared with Docmost application

## License

MIT
