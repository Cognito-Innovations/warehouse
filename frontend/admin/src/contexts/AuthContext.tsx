import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { getStoredUser, isAuthenticated, logout as authLogout, login as authLogin } from '../services/auth.service';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      try {
        if (isAuthenticated()) {
          const storedUser = getStoredUser();
          if (storedUser && storedUser.access_token) {
            // Convert stored user data to User type
            const userData: User = {
              id: storedUser.id,
              email: storedUser.email,
              name: storedUser.name,
            };
            setUser(userData);
          } else {
            // User data exists but no token, clear it
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);


  const login = useCallback(async (email: string, password: string) => {
    try {
      const loginResponse = await authLogin(email, password);

      // Convert LoginResponse to User type
      const userData: User = {
        id: loginResponse.id,
        email: loginResponse.email,
        name: loginResponse.name || '',
        image: undefined, // Not provided in login response
      };
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  }, []);

  const value: AuthContextType = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  }), [user, isLoading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
