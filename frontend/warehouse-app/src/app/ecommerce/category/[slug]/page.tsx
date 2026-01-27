"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";

import useProductStore from "@/store/productStore";
import { useAuth } from "@/contexts/AuthContext";
import { useDetectUserLocation } from "@/hooks/useDetectUserLocation";
import EcommerceContent from "@/components/ecommerce/EcommerceContent";

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { user } = useAuth();
  const { currencyCode, countryCode, isLoaded } = useDetectUserLocation();
  const { fetchProducts } = useProductStore();

  useEffect(() => {
    if (isLoaded && slug) {
      fetchProducts({
        category: slug,
        currency: currencyCode,
        countryCode,
        userId: (user as any)?.id,
      });
    }
  }, [slug, isLoaded, currencyCode, countryCode, user, fetchProducts]);

  return <EcommerceContent slug={slug}/>;
}