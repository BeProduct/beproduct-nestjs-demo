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
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          textAlign: 'left',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#213547', marginTop: 0 }}>Welcome, {user.name}!</h2>

          <div style={{ marginTop: '1.5rem', lineHeight: '1.8', color: '#213547' }}>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>BeProduct ID:</strong> {user.externalId}</p>
            <p><strong>Company:</strong> {user.company || '(not set)'}</p>
            <p><strong>Locale:</strong> {user.locale || '(not set)'}</p>
            <p><strong>Access Token:</strong> {user.accessToken ? `${user.accessToken.substring(0, 20)}...` : '(not set)'}</p>
            <p><strong>Refresh Token:</strong> {user.refreshToken ? `${user.refreshToken.substring(0, 20)}...` : '(not set)'}</p>
          </div>

          <details style={{ marginTop: '1.5rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#0066cc' }}>
              Show Raw User Data
            </summary>
            <pre style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '0.85rem',
              color: '#213547'
            }}>
              {JSON.stringify(user, null, 2)}
            </pre>
          </details>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={logout}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem'
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
          <p>✅ Authenticated via BeProduct OAuth (OIDC)</p>
          <p>🔒 Session managed with httpOnly cookies</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
