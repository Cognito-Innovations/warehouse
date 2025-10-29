"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import AddressLayout from "./AddressLayout";
import Header from "@/components/Navbar/Header";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  //To force move site, we need to update it here "/" to "/path-name".
  const hideHeader = pathname === "/";
  
  // Don't show header for ecommerce routes
  const isEcommerceRoute = pathname.startsWith("/ecommerce");

  const hideForAuth = pathname === "/sign-in";

  return (
    <>
      {!hideHeader && !isEcommerceRoute && !hideForAuth && (
        <AddressLayout>
          <Header />
        </AddressLayout>
      )}
      {children}
      <Toaster position="top-right" richColors />
    </>
  );
}
