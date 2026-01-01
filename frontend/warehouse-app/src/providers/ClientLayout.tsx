"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import EcommerceHeader from "@/components/ecommerce/EcommerceHeader";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();


  const hideForAuth = pathname === "/sign-in";

  return (
    <>
      {!hideForAuth && (
        <EcommerceHeader />
      )}
      {children}
      <Toaster position="top-right" richColors />
    </>
  );
}
