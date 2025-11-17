# BeProduct OAuth NestJS Application

A full-stack application demonstrating BeProduct OpenID Connect (OIDC) authentication with NestJS backend and React frontend.

## Features

- BeProduct OIDC authentication integration
- JWT-based session management with httpOnly cookies
- **Secure token storage** - Access & refresh tokens stored server-side
- Small JWT payload (~200 bytes) prevents HTTP 431 errors
- React frontend with TypeScript and Vite
- CORS-enabled API communication
- Automatic server startup script
- Auto-registration for new users

## Architecture

### Backend (NestJS)
- **Port**: 3000
- **API Prefix**: `/api`
- **Authentication Strategy**: JWT + BeProduct OIDC
- **Token Storage**: In-memory (Map-based, suitable for prototyping)
- **Key Feature**: BeProduct access/refresh tokens stored server-side, NOT in JWT

### Frontend (React + Vite)
- **Port**: 5173
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite

## npm Package

This example application demonstrates BeProduct OIDC authentication. The authentication module is also available as an npm package:

**[@beproduct/nestjs-auth](https://www.npmjs.com/package/@beproduct/nestjs-auth)**

```bash
npm install @beproduct/nestjs-auth
```

See the [package documentation](https://github.com/BeProduct/beproduct-org-nestjs-auth) for integration instructions.

## Project Structure

```
beproduct-oauth-nestjs/
├── backend/                    # Example NestJS backend
│   ├── src/
│   │   ├── auth/
│   │   │   ├── strategies/     # Local BeProduct OIDC & JWT strategies
│   │   │   │   ├── beproduct-oidc.strategy.ts
│   │   │   │   └── jwt.strategy.ts
│   │   │   ├── interfaces/
│   │   │   │   └── user.interface.ts
│   │   │   ├── dto/
│   │   │   │   ├── jwt-payload.dto.ts
│   │   │   │   └── oidc-user.dto.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env
│   └── package.json
├── frontend/                   # Example React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── types/
│   │   │   └── user.ts
│   │   └── App.tsx
│   └── package.json
├── packages/
│   └── beproduct-nestjs-auth/  # npm package source
├── start-all.sh
├── generate-secrets.sh
└── README.md
```

## Prerequisites

- Node.js (v20 or higher)
- npm
- BeProduct IDS account and client credentials

## Installation

1. **Install backend dependencies**
```bash
cd backend
npm install
```

2. **Install frontend dependencies**
```bash
cd frontend
npm install
```

3. **Generate secure secrets**

Run the secret generator script to create secure JWT_SECRET and APP_SECRET:

```bash
./generate-secrets.sh
```

This will:
- Generate cryptographically secure random secrets
- Display them in the terminal
- Optionally update `backend/.env` automatically (with backup)

4. **Configure environment variables**

The `backend/.env` file should contain:

```env
# BeProduct OIDC Configuration
OIDC_ENABLED=true
OIDC_CLIENT_ID=nextjs
OIDC_CLIENT_SECRET=Hj348793dejkSW
OIDC_ISSUER=https://id.winks.io/ids
OIDC_AUTHORIZATION_URL=https://id.winks.io/ids/connect/authorize
OIDC_TOKEN_URL=https://id.winks.io/ids/connect/token
OIDC_USERINFO_URL=https://id.winks.io/ids/connect/userinfo
OIDC_SCOPES=openid profile email roles offline_access BeProductPublicApi
OIDC_CALLBACK_URL=http://localhost:3000/api/auth/callback/beproduct

# Application Configuration
APP_SECRET=<generated-by-script>
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=<generated-by-script>
JWT_EXPIRATION=30d
```

**Important**:
- `JWT_SECRET`: Signs your authentication tokens (30-day lifetime)
- `APP_SECRET`: Signs OAuth session cookies (10-minute lifetime)
- Both should be different, secure, random strings (64+ characters)

## Running the Application

### Option 1: Start Both Servers (Recommended)

```bash
./start-all.sh
```

This will:
- Clear any existing processes on ports 3000 and 5173
- Build and start the backend on http://localhost:3000
- Start the frontend on http://localhost:5173
- Handle graceful shutdown with Ctrl+C

### Option 2: Start Servers Separately

**Backend:**
```bash
cd backend
npm run build
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Usage

1. Open your browser and navigate to http://localhost:5173
2. Click "Sign in with BeProduct"
3. You'll be redirected to BeProduct IDS for authentication
4. After successful login, you'll be redirected back to the dashboard
5. The dashboard displays your user information including access and refresh tokens

## API Endpoints

### Authentication Routes

- `GET /api/auth/beproduct` - Initiate BeProduct OAuth flow
- `GET /api/auth/callback/beproduct` - OAuth callback handler
- `GET /api/auth/me` - Get current authenticated user (requires JWT)
- `POST /api/auth/logout` - Logout and clear auth cookie

### Example: Get Current User

```bash
curl http://localhost:3000/api/auth/me \
  -H "Cookie: authToken=your_jwt_token"
```

Response:
```json
{
  "id": "uuid",
  "externalId": "beproduct_user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "company": "Example Corp",
  "locale": "en",
  "emailVerified": true,
  "provider": "beproduct-oidc",
  "accessToken": "beproduct_access_token",
  "refreshToken": "beproduct_refresh_token",
  "createdAt": "2025-11-17T...",
  "lastLoginAt": "2025-11-17T..."
}
```

## Security Features

### JWT Cookie Strategy
- **Small JWT payload** (~200 bytes) - contains only user metadata (id, email, name, company, locale)
- **httpOnly cookies** - prevents XSS attacks
- **Secure flag** - enabled in production (HTTPS only)
- **SameSite** - set to 'lax' for CSRF protection

### Token Storage
- BeProduct access and refresh tokens are **NOT stored in JWT**
- Tokens stored server-side in User object
- Retrieved via `/api/auth/me` endpoint when needed
- Prevents HTTP 431 "Request Header Fields Too Large" errors

## Tech Stack

### Backend
- NestJS - Progressive Node.js framework
- TypeScript - Type-safe development
- Passport.js - Authentication middleware
  - passport-openidconnect - OpenID Connect strategy
- @nestjs/jwt - Token-based authentication
- cookie-parser - httpOnly cookie handling
- express-session - OAuth state management

### Frontend
- React 18 - UI library
- TypeScript - Type safety
- Vite - Fast build tool and dev server
- React Router - Client-side routing
- Axios - HTTP client with cookie support

## Authentication Flow

1. **User initiates login** → Frontend redirects to `/api/auth/beproduct`
2. **OAuth redirect** → Backend redirects to BeProduct IDS authorization page
3. **User authenticates** → BeProduct IDS redirects back to `/api/auth/callback/beproduct`
4. **Token exchange** → Backend exchanges authorization code for tokens
5. **User validation** → `validateOidcUser()` processes BeProduct profile and tokens
6. **User storage** → User created/updated with tokens stored server-side
7. **JWT generation** → Small JWT created (without BeProduct tokens)
8. **Cookie set** → JWT stored in httpOnly cookie
9. **Redirect to dashboard** → Frontend displays user info
10. **Token retrieval** → Frontend calls `/api/auth/me` to get full user data with tokens

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

## Production Considerations

1. **Token Storage**: Replace in-memory Map with Redis or database
2. **Session Management**: Consider using Redis for session storage
3. **HTTPS**: Enable secure cookies in production
4. **Environment Variables**: Use proper secret management
5. **CORS**: Configure specific allowed origins
6. **Token Refresh**: Implement automatic token refresh logic
7. **Error Handling**: Add comprehensive error handling and logging
8. **Rate Limiting**: Implement rate limiting on auth endpoints

## Troubleshooting

### Port Already in Use
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### HTTP 431 Error
This application solves the HTTP 431 error by keeping JWT tokens small. BeProduct access/refresh tokens are stored server-side, not in the JWT payload.

### OAuth Errors
- Verify your BeProduct client credentials in `.env`
- Check that callback URL matches BeProduct IDS configuration
- Ensure all required scopes are included

## License

MIT

## Support

For issues related to BeProduct IDS, please contact BeProduct support.
For application issues, please open an issue in this repository.
