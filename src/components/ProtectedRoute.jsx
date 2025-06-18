import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);

        // Check if token is expired or if it's past midnight
        if (decoded.exp * 1000 < Date.now() || now >= midnight) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token validation error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    // Check every minute
    const interval = setInterval(checkAuth, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isAuthenticated === null) {
    // Still checking authentication
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 