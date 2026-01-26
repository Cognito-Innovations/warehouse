"use client";
import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { signOut } from "next-auth/react";

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
  phone?: string;
}

interface AuthContextType {
  user: User | {};
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
  session: any;
}

const defaultUser: User = {
  id: "",
  email: "",
  name: "",
  role: "",
  suite_no: "",
  country: "",
  image: "",
  is_logged_in: false,
  last_login: "",
  verified: false,
  phone: "",
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, session }) => {
  const user: User | {} = useMemo(() => {
    if (session?.user) {
      return {
        id: (session.user as any).user_id || session.user.email || "",
        email: session.user.email || "",
        name: session.user.name || "",
        role: (session.user as any).role || "",
        suite_no: (session.user as any).suite_no || "",
        country: (session.user as any).country || "",
        image: (session.user as any).image || "",
        is_logged_in: (session.user as any).is_logged_in || false,
        last_login: (session.user as any).last_login || "",
        verified: (session.user as any).verified || false,
        phone: (session.user as any).phone || "",
      };
    }
    return defaultUser;
  }, [session]);

  const token = session ? (session as any).access_token || null : null;
  const isAuthenticated = !!(session?.user && ((session.user as any).user_id || session.user.email));
  const loading = false;

  const logout = () => {
    signOut({ callbackUrl: "/" });
  };

  const value: AuthContextType = { user, token, loading, isAuthenticated, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};