import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);
    // You might want to add a check for token expiry here
    // const isExpired = decoded.exp * 1000 < Date.now();
    // if (isExpired) {
    //   localStorage.removeItem('token');
    //   return <Navigate to="/login" />;
    // }

    if (requiredRole && decoded.user.role !== requiredRole) {
      // If role is required and doesn't match, redirect to a fallback page or login
      // For simplicity, we'll just redirect to login
      return <Navigate to="/login" />;
    }

    return children;
  } catch (error) {
    // If token is invalid, clear it and redirect to login
    console.log(error)
    localStorage.removeItem('token');
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;