import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

// Create axios instance with default config
const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
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
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const token = localStorage.getItem('access_token');
    if (token) {
      await authApi.post('/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (error: any) {
    console.error('Logout error:', error);
    // Even if logout fails on server, clear local storage
  } finally {
    // Always clear local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
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
  const token = getStoredToken();
  return !!token;
};
