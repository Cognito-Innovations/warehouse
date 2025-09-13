import axios from 'axios';
import { removeCookie } from '../utils/cookieUtils';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);

    if (error.response?.status === 401) {
      // Token/cookie invalid, redirect to login
      removeCookie('user_data');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;