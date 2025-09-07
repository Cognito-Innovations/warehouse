"use client";

import { usePathname } from "next/navigation";
import Header from "./Navbar/Header";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const hideHeader = pathname === "/";

  return (
    <>
      {!hideHeader && <Header />}
      {children}
    </>
  );
}
