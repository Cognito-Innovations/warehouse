"use client";

import { usePathname } from "next/navigation";
import AddressLayout from "./AddressLayout";
import Header from "@/components/Navbar/Header";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  //To force move site, we need to update it here "/" to "/path-name".
  const hideHeader = pathname === "/";

  return (
    <>
      {!hideHeader && <AddressLayout> <Header /> </AddressLayout>}
      {children}
    </>
  );
}
