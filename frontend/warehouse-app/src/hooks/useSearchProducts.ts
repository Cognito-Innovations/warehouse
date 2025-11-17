"use client";

import React, { useRef, useCallback, useEffect, useMemo } from "react";
import { useProducts, useProductActions } from "../store/ecommerceStore";
import { debounce } from "@/utils/debounce";

export const useSearchProducts = (countryCode?: string) => {
  const { searchQuery } = useProducts();
  const { setLoading, fetchProducts } = useProductActions();

  const prevSearchQueryRef = useRef(searchQuery);
  const prevCountryCodeRef = useRef(countryCode);

  const fetchProductsCallback = useCallback(async (searchTerm: string) => {
    setLoading(true);
    try {
      await fetchProducts(countryCode, searchTerm || undefined);
    } catch (error) {
      console.error("Search fetch failed:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, fetchProducts, countryCode]);

  const debouncedFetchProducts = useMemo(
    () => debounce(fetchProductsCallback, 500),
    [fetchProductsCallback]
  );

  useEffect(() => {
    if (!countryCode) return;

    const prevSearchQuery = prevSearchQueryRef.current;
    const prevCountryCode = prevCountryCodeRef.current;

    const searchChanged = searchQuery !== prevSearchQuery;
    const countryChanged = prevCountryCode !== undefined && countryCode !== prevCountryCode;

    if (searchChanged || countryChanged) {
      setLoading(true);
      if (searchQuery) {
        debouncedFetchProducts(searchQuery);
      } else {
        fetchProductsCallback("");
      }
    }

    prevSearchQueryRef.current = searchQuery;
    prevCountryCodeRef.current = countryCode;
  }, [searchQuery, countryCode, debouncedFetchProducts, setLoading, fetchProductsCallback]);
};