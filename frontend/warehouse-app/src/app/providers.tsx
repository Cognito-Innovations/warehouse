"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "../contexts/AuthContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      refetchInterval={60 * 60} // Refetch session every 60 minutes
      refetchOnWindowFocus={true}
    >
      <AuthProvider>
        {children}
      </AuthProvider>
    </SessionProvider>
  );
}