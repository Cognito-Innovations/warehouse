"use client";
import React, { useEffect } from "react";

import useProductStore from "@/store/productStore";
import { useAuth } from "@/contexts/AuthContext";
import EcommerceContent from "@/components/ecommerce/EcommerceContent";
import { useDetectUserLocation } from "@/store/useDetectUserLocation";
import { useCartStore } from "@/store/cartStore";

export default function Ecommerce() {
  const { user } = useAuth();
  const userId = (user as any)?.id;
  const { currencyCode, countryCode, isLoaded } = useDetectUserLocation();
  const { fetchProducts } = useProductStore();
  const { syncLocalStorageProductsToCartDB } = useCartStore();

  useEffect(() => {
    if(user && (user as any).id) syncLocalStorageProductsToCartDB((user as any).id);
  }, [(user as any)?.id as string]);

  useEffect(() => {
    if (isLoaded) {
      fetchProducts({
        currency: currencyCode,
        countryCode,
        userId,
      });
    }
  }, [isLoaded, currencyCode, countryCode, userId, fetchProducts]);

  return <EcommerceContent />;
}