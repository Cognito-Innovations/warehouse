"use client";

import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import ThemeProvider from "../components/ThemeProvider";
import Header from "../components/Navbar/Header";
import Providers from "./providers";
import { AddressProvider } from "../contexts/AddressContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
          <AddressProvider>
            <ThemeProvider>
              {!hideHeader && <Header /> }
              {children}
            </ThemeProvider>
          </AddressProvider>
        </Providers>
      </body>
    </html>
  );
}
