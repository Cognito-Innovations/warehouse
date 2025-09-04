import "./globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import Header from "../components/Navbar/Header";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeProvider from "../components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopMe - Warehouse Management",
  description: "Warehouse management application for ShopMe",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="emotion-insertion-point" content="" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <Header />
          <Toaster>
            {children}
          </Toaster>
        </ThemeProvider>
      </body>
    </html>
  );
}
