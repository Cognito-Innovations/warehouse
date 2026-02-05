"use client";
import React, { createContext, useContext, ReactNode, useMemo, useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useDetectUserLocation } from "@/store/useDetectUserLocation";
import { useCartStore } from "@/store/cartStore";
import { clearBrowserStorage, clearAllCookies } from "../lib/cookieUtils";

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
  const {
    setUserId,
    getCart,
    syncLocalStorageProductsToCartDB,
  } = useCartStore();
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
  const userId = session?.user?.user_id ?? null;

  const token = session ? (session as any).access_token || null : null;
  const isAuthenticated = !!session?.user?.user_id;

  const getCartData = async (userId: string) => {
    const localCart =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("cart-storage") || "{}")
        : null;
    const hasLocalCartItems = localCart?.state?.cart?.length > 0;
    if (hasLocalCartItems) {
      await syncLocalStorageProductsToCartDB(userId);
    } else {
      await getCart();
    }
  }

  useEffect(() => {
    if (userId) {
      getCartData(userId);
    }
    setUserId(userId);
    if (typeof window !== 'undefined') {
      fetchLocationBasedOnUser(userId);
    }
  }, [userId]);


  const logout = () => {
    clearBrowserStorage();
    clearAllCookies();
    setUserId(null);
    signOut({ callbackUrl: "/" });
  };

  const value: AuthContextType = { user, token, isAuthenticated, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};