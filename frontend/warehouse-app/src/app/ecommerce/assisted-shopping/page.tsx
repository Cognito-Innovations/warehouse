"use client";

import React, { useRef, useCallback, useEffect } from "react";

import useCategoryStore from "@/store/categoryStore";
import { useDetectUserLocation } from "@/store/useDetectUserLocation";
import EcommercePageLayout from "@/components/ecommerce/EcommercePageLayout";
// import EcommerceSkeletonLoader from "@/components/ecommerce/skeleton-loader/EcommerceSkeletonLoader";
// import { ecommerceData } from "@/data/ecommerceData";

import CategorySection from "@/components/ecommerce/category_temp/CategorySection";
import AssistedShoppingLandingContent from "@/components/AssistedShopping/getting-started/AssistedShoppingLandingContent";

export default function AssistedShoppingPage() {
  const {currencyCode, countryCode} = useDetectUserLocation();
  const { categories, getCategories, setCategory } = useCategoryStore();
  const hasFetched = useRef(false);

  useEffect(() => {
    setCategory("assisted");
  }, [setCategory]);

  const initializeEcommerceData = useCallback(async () => {
    if (!currencyCode || hasFetched.current) return;
    try {
      hasFetched.current = true;
      await getCategories(countryCode);
    } catch (err) {
      console.error("Init failed", err);
    }
  }, [getCategories]);

  useEffect(() => {
    if (currencyCode && countryCode) {
      initializeEcommerceData();
    }
  }, [currencyCode, countryCode, initializeEcommerceData]);

  // const handleRefresh = () => {
  //   hasFetched.current = false;
  //   initializeEcommerceData(currencyCode, countryCode);
  // };

  const layoutProps = {
    locationData: { countryCode: countryCode },
    categories: categories,
  };


  return (
    <EcommercePageLayout {...layoutProps}>
      <CategorySection />
      <AssistedShoppingLandingContent />
    </EcommercePageLayout>
  );
}