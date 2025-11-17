"use client";

import React, { useRef, useCallback, useEffect } from "react";
import { useProducts, useProductActions, useCartActions } from "../store/ecommerceStore";

export const useEcommerceInitialization = (countryCode?: string) => {
  const { products, categories } = useProducts();
  const { fetchCategories, fetchProducts, setLoading } = useProductActions();
  const { fetchCart } = useCartActions();

  const hasFetched = useRef(false);

  const initializeEcommerceData = useCallback(async () => {
    if (hasFetched.current || !countryCode) return;
    hasFetched.current = true;
    setLoading(true);
    try {
      await fetchCategories().catch((err) => console.error("Categories fetch failed:", err));
      await Promise.all([
        fetchProducts(countryCode).catch((err) => console.error("Products fetch failed:", err)),
        fetchCart().catch((err) => console.error("Cart fetch failed:", err)),
      ]);
    } finally {
      setLoading(false);
    }
  }, [fetchCategories, fetchProducts, fetchCart, setLoading, countryCode]);

  useEffect(() => {
    if (countryCode && products.length === 0 && categories.length === 0) {
      initializeEcommerceData();
    }
  }, [countryCode, products.length, categories.length, initializeEcommerceData]);

  const reset = useCallback(() => {
    hasFetched.current = false;
  }, []);

  return { reset };
};