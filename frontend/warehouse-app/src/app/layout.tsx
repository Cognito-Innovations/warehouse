import { Suspense } from "react";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeProvider from "../providers/ThemeProvider";
import ClientLayout from "../providers/ClientLayout";
import Providers from "./providers";
import EcommerceSkeletonLoader from "@/components/ecommerce/skeleton-loader/EcommerceSkeletonLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="emotion-insertion-point" content="" />
        <meta name="google-site-verification" content="5HRhy9e2CK058UpxqRyeI6J05-j2dSG4SrOlC8GFsV8" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <ThemeProvider>
            <ClientLayout>
              <Suspense fallback={<EcommerceSkeletonLoader/>}>
                {children}
              </Suspense>
            </ClientLayout>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
