// src/components/Navbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ThemeToggle from './ThemeToggle';
const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = token ? jwtDecode(token).user.role : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    // Updated classes for a modern look
      <nav className="bg-white shadow-sm border-b border-slate-200 dark:bg-slate-800 dark:border-slate-700"> {/* Dark mode classes */}
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Evently</h1> {/* Dark mode classes */}
        <div className="flex items-center space-x-4">
          {userRole && (
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 capitalize"> {/* Dark mode classes */}
              {userRole} Dashboard
            </span>
          )}
          <ThemeToggle /> {/* <-- Add the toggle button */}
          <button
            onClick={handleLogout}
            // Updated button styles with transition
            className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;