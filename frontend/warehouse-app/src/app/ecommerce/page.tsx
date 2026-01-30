"use client";
import React, { useEffect } from "react";

import useProductStore from "@/store/productStore";
import { useAuth } from "@/contexts/AuthContext";
import EcommerceContent from "@/components/ecommerce/EcommerceContent";
import { useDetectUserLocation } from "@/store/useDetectUserLocation";

export default function Ecommerce() {
  const { user } = useAuth();
  const { currencyCode, countryCode, isLoaded } = useDetectUserLocation();
  const { fetchProducts } = useProductStore();

  useEffect(() => {
    if (isLoaded) {
      fetchProducts({
        currency: currencyCode,
        countryCode,
        userId: (user as any)?.id,
      });
    }
  }, [isLoaded, currencyCode, countryCode, user, fetchProducts]);

  return <EcommerceContent />;
}