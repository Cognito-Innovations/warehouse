import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeProvider from "../providers/ThemeProvider";
import ClientLayout from "../providers/ClientLayout";
import Providers from "./providers";
import { AddressProvider } from "@/contexts/AddressContext";

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
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <ThemeProvider>
            <AddressProvider>
              <ClientLayout>
                {children}
              </ClientLayout>
            </AddressProvider>  
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
