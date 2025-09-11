'use client';
import React, { createContext, useContext, ReactNode } from 'react';
import { useSession, signOut } from 'next-auth/react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  suite_no?: string;
  country: string;
  image?: string;
  is_logged_in: boolean;
  last_login?: string;
  verified: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  logout: () => void;
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
  const { data: session, status } = useSession();

  // Get user data from NextAuth session
  const user = session?.user ? {
    id: (session.user as any).user_id || session.user.email || '',
    email: session.user.email || '',
    name: session.user.name || '',
    role: 'user',
    country: 'India',
    image: session.user.image || '',
    is_logged_in: true,
    verified: (session.user as any).verified ?? false, // Use actual verified status from backend, default to false
  } : null;

  // Debug logging
  console.log('AuthProvider - Session status:', status);
  console.log('AuthProvider - Session data:', session);
  console.log('AuthProvider - User data:', user);

  const token = (session as any)?.access_token || null;
  const loading = status === 'loading';

  const logout = () => {
    signOut({ callbackUrl: '/' });
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};