import axios from 'axios';
import { setCookie, getCookie, removeCookie, hasCookie } from '../utils/cookieUtils';
import type { UserRole } from '../data/menuItems';

const API_BASE_URL = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:3001';

// Create axios instance with default config
const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export interface AuthUserResponse {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  suite_no?: string;
  country?: string;
  preference?: {
    courier?: {
      country?: {
        id: string;
        name: string;
        code: string;
      };
    };
  };
}

export interface LoginResponse {
  access_token: string;
  user: AuthUserResponse;
}

export interface RegisterResponse {
  access_token: string;
  user: AuthUserResponse;
}

export interface StoredAuthData {
  access_token: string;
  user: AuthUserResponse;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await authApi.post('/login', {
    email,
    password,
  });

  const loginData = response.data;
  if (loginData.user && loginData.access_token) {
    // Store user data in cookie (7 days expiration)
    setCookie('user_data', JSON.stringify(loginData), {
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      secure: window.location.protocol === 'https:',
      sameSite: 'lax'
    });
  }
    
    return loginData;
};

export const register = async (name: string, email: string, password: string): Promise<RegisterResponse> => {
  const response = await authApi.post('/register', {
    name,
    email,
    password,
  });

  return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    await authApi.post('/logout');
  } catch (error: any) {
    console.error('Logout error:', error);
  } finally {
    removeCookie('user_data');
  }
};

export const getStoredUser = (): StoredAuthData | null => {
  const userStr = getCookie('user_data');
  try {
    return userStr ? (JSON.parse(userStr) as StoredAuthData) : null;
  } catch (error) {
    console.error('Error parsing user data from cookie:', error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return hasCookie('user_data');
};
