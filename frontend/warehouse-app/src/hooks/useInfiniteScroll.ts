"use client";

import React, { useRef, useEffect } from "react";
import { useProducts, useProductActions } from "../store/ecommerceStore";

export const useInfiniteScroll = (
  observerRef: React.RefObject<HTMLDivElement | null>,
  countryCode: string | undefined,
) => {
  const { hasMoreProducts, loadingNextPage, loading, searchQuery } = useProducts();
  const { fetchMoreProducts } = useProductActions();

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!observerRef.current || !hasMoreProducts || loadingNextPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new window.IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMoreProducts && !loadingNextPage && !loading) {
        fetchMoreProducts(countryCode, searchQuery || undefined);
      }
    }, {
      rootMargin: "300px",
    });
    observer.current.observe(observerRef.current);
    return () => {
      observer.current?.disconnect();
    };
  }, [fetchMoreProducts, hasMoreProducts, loadingNextPage, loading, countryCode, searchQuery, observerRef]);
};