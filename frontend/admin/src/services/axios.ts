import axios from 'axios';
import { removeCookie, getCookie } from '../utils/cookieUtils';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const userData = getCookie('user_data');
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.access_token) {
          config.headers.Authorization = `Bearer ${user.access_token}`;
          console.log('Authorization header added');
        } else {
          console.log('No access token found in user data');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      console.log('No user data cookie found');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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