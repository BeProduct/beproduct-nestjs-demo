import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { User } from '../types/user';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (err: any) {
      console.error('Failed to fetch user:', err);
      if (err.response?.status === 401) {
        // Unauthorized - redirect to login
        setUser(null);
        navigate('/login');
      } else {
        setError('Failed to load user data');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
      // Clear user anyway and redirect
      setUser(null);
      navigate('/');
    }
  };

  return {
    user,
    loading,
    error,
    logout,
  };
}
