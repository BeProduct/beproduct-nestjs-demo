import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Get token and user data from query params
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (token && userParam) {
      // Store token and user in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', userParam);

      // Redirect to dashboard
      navigate('/dashboard');
    } else {
      // If no token, redirect to login
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="container">
      <h2>Processing authentication...</h2>
      <p>Please wait while we log you in.</p>
    </div>
  );
}

export default Callback;
