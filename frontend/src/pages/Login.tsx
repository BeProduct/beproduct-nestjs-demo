import { useSearchParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function Login() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');

  const handleBeProductLogin = () => {
    window.location.href = `${API_URL}/auth/beproduct`;
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <p>Sign in with your BeProduct account</p>

      {error && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          backgroundColor: '#fee',
          color: '#c33',
          borderRadius: '4px',
          maxWidth: '400px',
          margin: '1rem auto'
        }}>
          {error === 'oauth_failed' ? 'Authentication failed. Please try again.' : 'An error occurred during login.'}
        </div>
      )}

      <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
        <button
          onClick={handleBeProductLogin}
          style={{
            width: '100%',
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            backgroundColor: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0052a3'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0066cc'}
        >
          Sign in with BeProduct IDS
        </button>
      </div>

      <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
        You will be redirected to BeProduct IDS to authenticate
      </p>
    </div>
  );
}

export default Login;
