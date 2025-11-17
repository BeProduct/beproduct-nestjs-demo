import { useAuth } from '../hooks/useAuth';

function Dashboard() {
  const { user, loading, error, logout } = useAuth();

  if (loading) {
    return (
      <div className="container">
        <h2>Loading...</h2>
        <p>Fetching your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h2>Error</h2>
        <p style={{ color: '#c33' }}>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <h2>Not authenticated</h2>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div style={{ marginTop: '2rem', maxWidth: '600px', margin: '2rem auto' }}>
        <div style={{
          padding: '2rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          textAlign: 'left'
        }}>
          <h2>Welcome, {user.name}!</h2>

          <div style={{ marginTop: '1.5rem', lineHeight: '1.8' }}>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>BeProduct ID:</strong> {user.externalId}</p>
            {user.company && <p><strong>Company:</strong> {user.company}</p>}
            {user.locale && <p><strong>Locale:</strong> {user.locale}</p>}
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={logout}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#c33',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
          <p>Authenticated via BeProduct OAuth (OIDC)</p>
          <p>Session managed with httpOnly cookies</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
