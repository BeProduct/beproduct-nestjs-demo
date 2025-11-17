import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  email: string;
  name: string;
  picture?: string;
  provider: string;
}

function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage (set by Callback component)
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div style={{ marginTop: '2rem' }}>
        {user.picture && (
          <img
            src={user.picture}
            alt="Profile"
            style={{ borderRadius: '50%', width: '100px', height: '100px' }}
          />
        )}
        <h2>Welcome, {user.name}!</h2>
        <p>Email: {user.email}</p>
        <p>Provider: {user.provider}</p>

        <button
          onClick={handleLogout}
          style={{ marginTop: '2rem', padding: '0.75rem 1.5rem' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
