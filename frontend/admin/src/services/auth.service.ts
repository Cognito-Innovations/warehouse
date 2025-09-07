import axios from 'axios';

const API_BASE_URL = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:3001';

// Create axios instance with default config
const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
    suite_no?: string;
    country?: string;
  };
}

export interface RegisterResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
    suite_no?: string;
    country?: string;
  };
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await authApi.post('/login', {
      email,
      password,
    });

    // Persist token in cookie so backend can read it
    const token = response.data?.access_token;
    if (token) {
      // Session cookie, accessible by server only conceptually; here we set a client cookie
      document.cookie = `jwt-token=${token}; path=/; SameSite=Lax`;
    }
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const register = async (name: string, email: string, password: string): Promise<RegisterResponse> => {
  try {
    const response = await authApi.post('/register', {
      name,
      email,
      password,
    });

    const token = response.data?.access_token;
    if (token) {
      document.cookie = `jwt-token=${token}; path=/; SameSite=Lax`;
    }
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await authApi.post('/logout');
  } catch (error: any) {
    console.error('Logout error:', error);
  } finally {
    // Clear local storage and cookie
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    document.cookie = 'jwt-token=; Max-Age=0; path=/; SameSite=Lax';
  }
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem('access_token');
};

export const getStoredUser = (): any | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = (): boolean => {
  // Consider cookie presence as auth indicator
  const hasCookie = document.cookie.split('; ').some((c) => c.startsWith('jwt-token='));
  return hasCookie || !!getStoredToken();
};
