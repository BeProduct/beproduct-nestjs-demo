const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Login() {
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${API_URL}/auth/github`;
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <p>Choose your preferred login method:</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '2rem auto' }}>
        <button
          onClick={handleGoogleLogin}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login with Google
        </button>

        <button
          onClick={handleGithubLogin}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: '#24292e',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login with GitHub
        </button>
      </div>
    </div>
  );
}

export default Login;
