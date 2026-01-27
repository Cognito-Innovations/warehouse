"use client";

import React, { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Toaster } from "sonner";

import { useCartStore } from "@/store/cartStore";
import EcommerceWrapper from "@/providers/EcommerceWrapper";
import { useDetectUserLocation } from "@/hooks/useDetectUserLocation";
import Header from "@/components/Common/Header";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { cartProductQuantityCount } = useCartStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { countryCode } = useDetectUserLocation();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const hideHeader = pathname === "/sign-in";

  const isEcommercePath = pathname === "/" || pathname.startsWith("/ecommerce");

  let title: string | undefined = undefined;
  if (pathname.startsWith("/profile")) {
    const view = searchParams.get("view");
    if (view === "country") {
      title = "Profile / Country";
    } else if (view === "currency") {
      title = "Profile / Currency";
    } else {
      title = "Profile";
    }
  } else {
    title =
      pathname === "/dashboard" ? "Dashboard" :
      pathname.includes("/cart") ? "My Cart" :
      pathname.includes("/packages") ? "Packages" :
      pathname.includes("/shipments") ? "Shipments" :
      pathname.includes("/history") ? "Assisted Shopping History" :
      pathname.includes("/share-otp") ? "Share OTP History" :

      pathname.includes("/returns-policy") ? "Returns Policy" :
      pathname.includes("/terms-conditions") ? "Terms & Conditions" :
      pathname.includes("/security") ? "Security Policy" :
      pathname.includes("/privacy-policy") ? "Privacy Policy" :
      pathname.includes("/contact-us") ? "Contact Us" :
      undefined;
  }

  const headerProps = {
    locationData: { countryCode: countryCode },
    onMenuClick: toggleSidebar,
    hideMenuButton: !isEcommercePath || pathname.includes("/orders") || pathname.includes("/checkout") || pathname.includes("/history"),
    hideSearch: true, //TODO P0: !isEcommercePath || pathname.includes("/product") || pathname.includes("/history") Uncomment wih this code when it fully functional
    hideLocation: pathname.includes("/cart") || pathname.includes("/orders") || pathname.includes("/checkout") || pathname.includes("/history"),
    itemCount: pathname.includes("/checkout") ? cartProductQuantityCount() : undefined,
    title,
  };

  const isEcommerceRoute = pathname === "/" || pathname.startsWith("/ecommerce");
  const renderedContent = isEcommerceRoute ? (
    <EcommerceWrapper
      isSidebarOpen={isSidebarOpen}
      onSidebarClose={() => setIsSidebarOpen(false)}
      onMenuClick={toggleSidebar}
    >
      {children}
    </EcommerceWrapper>
  ) : (
    children
  );

  return (
    <>
      {!hideHeader && <Header {...headerProps} />}
      {renderedContent}
      <Toaster position="top-right" richColors />
    </>
  );
}
