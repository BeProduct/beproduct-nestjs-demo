# Frontend - BeProduct OAuth

React + TypeScript + Vite frontend for OAuth authentication.

## Features

- OAuth login with Google and GitHub
- React Router for navigation
- TypeScript for type safety
- Axios for API calls
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
│   └── axios.ts          # Axios configuration
├── pages/
│   ├── Home.tsx          # Landing page
│   ├── Login.tsx         # Login with OAuth providers
│   ├── Dashboard.tsx     # Protected user dashboard
│   └── Callback.tsx      # OAuth callback handler
├── App.tsx               # Routes configuration
└── main.tsx              # App entry point
```

## OAuth Flow

1. User clicks "Login with Google/GitHub" on `/login`
2. Redirected to backend OAuth endpoint
3. User authenticates with provider
4. Provider redirects to backend callback
5. Backend processes auth and redirects to frontend `/auth/callback` with token
6. Frontend stores token and redirects to `/dashboard`

## Available Routes

- `/` - Home page
- `/login` - Login page with OAuth buttons
- `/dashboard` - Protected dashboard (requires authentication)
- `/auth/callback` - OAuth callback handler

## Tech Stack

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
