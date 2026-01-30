"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "../contexts/AuthContext";

interface ClientProvidersProps {
  children: React.ReactNode;
  session: any;
}

export default function ClientProviders({ children, session }: ClientProvidersProps) {
  return (
    <SessionProvider session={session}>
      <AuthProvider session={session}>
        {children}
      </AuthProvider>
    </SessionProvider>
  );
}
