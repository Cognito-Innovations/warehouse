"use client";
import React, { createContext, useContext, ReactNode, useMemo, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useDetectUserLocation } from "@/store/useDetectUserLocation";
import { useCartStore } from "@/store/cartStore";

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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, session: initialSession }) => {
  const { fetchLocationBasedOnUser } = useDetectUserLocation();
  const setUserId = useCartStore((state) => state.setUserId);
  const { data: sessionData } = useSession();
  const session = sessionData || initialSession;
  
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

  // Sync userId to cart store whenever user changes
  // This ensures userId persists in memory while user is authenticated
  // and gets cleared when user logs out
  useEffect(() => {
    const userId = (user as User).id;
    if (userId && isAuthenticated) {
      setUserId(userId);
    } else {
      setUserId(null);
    }
  }, [(user as User).id, isAuthenticated, setUserId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchLocationBasedOnUser((user as User).id);
    }
  }, [(user as User).id]);

  const logout = () => {
    setUserId(null);
    signOut({ callbackUrl: "/" });
  };

  const value: AuthContextType = { user, token, isAuthenticated, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};