"use client";

import "./globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import ThemeProvider from "../components/ThemeProvider";
import Header from "../components/Navbar/Header";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "ShopMe - Warehouse Management",
//   description: "Warehouse management application for ShopMe",
// };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  const hideHeader = pathname === "/";

  return (
    <html lang="en">
      <head>
        <meta name="emotion-insertion-point" content="" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <ThemeProvider>
            {!hideHeader && <Header /> }
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
