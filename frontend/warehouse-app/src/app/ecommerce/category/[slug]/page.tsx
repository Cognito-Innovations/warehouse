"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";

import useProductStore from "@/store/productStore";
import { useDetectUserLocation } from "@/store/useDetectUserLocation";
import { useAuth } from "@/contexts/AuthContext";
import EcommerceContent from "@/components/ecommerce/EcommerceContent";

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { user } = useAuth();
  const userId = (user as any)?.id;
  const { currencyCode, countryCode, isLoaded } = useDetectUserLocation();
  const { fetchProducts } = useProductStore();

  useEffect(() => {
    if (isLoaded && slug) {
      fetchProducts({
        category: slug,
        currency: currencyCode,
        countryCode,
        userId,
      });
    }
  }, [slug, isLoaded, currencyCode, countryCode, userId, fetchProducts]);

  return <EcommerceContent slug={slug}/>;
}