# BeProduct OAuth Application

Full-stack OAuth authentication application with separate frontend and backend.

## Project Structure

```
beproduct-oauth-nestjs/
├── backend/          # NestJS API server
│   ├── src/
│   │   ├── auth/    # OAuth authentication module
│   │   └── ...
│   ├── .env.example
│   └── package.json
│
└── frontend/         # Frontend application (to be initialized)
    └── README.md
```

## Features

- OAuth authentication (Google, GitHub)
- JWT token-based authentication
- CORS enabled for frontend communication
- Validation and error handling
- Environment-based configuration

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
# Initialize your preferred frontend framework
# (Instructions to be added based on chosen framework)
```

## Environment Variables

### Backend (.env)

See `backend/.env.example` for all available options.

Required OAuth credentials:
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`
- `JWT_SECRET`

## Getting OAuth Credentials

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/auth/google/callback`

### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set callback URL: `http://localhost:3000/auth/github/callback`

## API Endpoints

- `GET /` - Health check
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/github` - Initiate GitHub OAuth
- `GET /auth/github/callback` - GitHub OAuth callback

## Tech Stack

### Backend
- NestJS
- TypeScript
- Passport.js (OAuth)
- JWT
- Class Validator

### Frontend
- To be determined based on preference

## Development

### Backend
```bash
cd backend
npm run start:dev    # Development with watch mode
npm run test         # Run tests
npm run build        # Build for production
```

## License

MIT
