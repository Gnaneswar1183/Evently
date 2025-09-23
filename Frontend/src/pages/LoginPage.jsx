import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      const token = res.data.token;
      localStorage.setItem('token', token);

      const decoded = jwtDecode(token);
      if (decoded.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
      console.error(err.response);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md w-full max-w-md">
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Evently</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back! Please log in.</p>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-slate-300 text-sm font-bold mb-2" htmlFor="email">Email Address</label>
            <input 
              type="email" id="email" name="email" value={email} onChange={onChange} 
              className="shadow appearance-none border dark:border-slate-600 rounded w-full py-2 px-3 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 leading-tight focus:outline-none focus:shadow-outline" 
              required 
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-slate-300 text-sm font-bold mb-2" htmlFor="password">Password</label>
            <input 
              type="password" id="password" name="password" value={password} onChange={onChange} 
              className="shadow appearance-none border dark:border-slate-600 rounded w-full py-2 px-3 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
              required 
            />
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">Sign In</button>
          </div>
        </form>
        <p className="mt-6 text-center text-gray-600 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 font-bold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;