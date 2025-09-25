import axios from 'axios';

// This logic automatically determines the correct backend URL
const isProduction = process.env.NODE_ENV === 'production';
const baseURL = isProduction 
  ? 'https://evently-backend.onrender.com/api' // <-- Your live backend URL
  : 'http://localhost:5000/api';                 // <-- Your local backend URL

const api = axios.create({
  baseURL: baseURL, // Use the URL determined above
  headers: {
    'Content-Type': 'application/json',
  },
});

// This part adds the auth token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
