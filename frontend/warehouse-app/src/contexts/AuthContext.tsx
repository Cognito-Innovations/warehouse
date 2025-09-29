"use client";
import React, { createContext, useContext, ReactNode, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { data: session, status } = useSession();

  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Get user data from NextAuth session
  const user = session?.user ? {
    id: (session.user as any).user_id || session.user.email || "",
    email: session.user.email || "",
    name: session.user.name || "",
    verified: (session.user as any).verified ?? false, // Use actual verified status from backend, default to false
  } : null;

  const token = (session as any)?.access_token || null;
  const loading = status === "loading";

  const logout = () => {
    signOut({ callbackUrl: "/" });
  };

  const value: AuthContextType = {
    user: user
      ? {
          id: user.id,
          email: user.email,
          name: user.name,
          role: (session?.user as any)?.role || "",
          suite_no: (session?.user as any)?.suite_no,
          country: (session?.user as any)?.country || "",
          image: (session?.user as any)?.image,
          is_logged_in: (session?.user as any)?.is_logged_in ?? true,
          last_login: (session?.user as any)?.last_login,
          verified: user.verified,
        }
      : null,
    token,
    loading,
    logout,
  };

  // Auto-logout when JWT expires
  useEffect(() => {
    // Clear any existing timer
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }

    if (!token) {
      return;
    }

    try {
      // Decode JWT payload safely without extra deps
      const parts = token.split(".");
      if (parts.length !== 3) return;
      const payloadJson = JSON.parse(typeof window !== "undefined"
        ? atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
        : Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));

      const expSeconds = payloadJson?.exp;
      if (!expSeconds || typeof expSeconds !== "number") return;

      const expiryMs = expSeconds * 1000;
      const nowMs = Date.now();
      const deltaMs = expiryMs - nowMs;

      if (deltaMs <= 0) {
        // Already expired
        signOut({ callbackUrl: "/" });
        return;
      }

      // Schedule sign out slightly after expiry to avoid clock skews
      logoutTimerRef.current = setTimeout(() => {
        signOut({ callbackUrl: "/" });
      }, Math.max(1000, deltaMs + 500));
    } catch (_e) {
      // If token cannot be decoded, do nothing
    }

    // Cleanup on unmount or token change
    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
    };
  }, [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};