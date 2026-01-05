"use client";

import React, { useRef, useCallback, useEffect } from "react";

import useCategoryStore from "@/store/categoryStore";
import { useAuth } from "@/contexts/AuthContext";
import { useEffectiveUserLocation } from "@/hooks/useEffectiveUserLocation";
import EcommercePageLayout from "@/components/ecommerce/EcommercePageLayout";
import EcommerceSkeletonLoader from "@/components/ecommerce/skeleton-loader/EcommerceSkeletonLoader";
import { ecommerceData } from "@/data/ecommerceData";

import CategorySection from "@/components/ecommerce/category_temp/CategorySection";
import AssistedShoppingLandingContent from "@/components/AssistedShopping/getting-started/AssistedShoppingLandingContent";

export default function AssistedShoppingPage() {
  const locationData = useEffectiveUserLocation({
    countryCode: undefined,
    countryName: undefined,
    city: "",
    pincode: "",
  });
  const currency = locationData?.currencyInfo?.code || "";
  const countryCode = locationData?.location?.countryCode || "";

  const { user } = useAuth();
  const userId = user?.id;

  const { categories, getCategories, setCategory } = useCategoryStore();
  const hasFetched = useRef(false);

  useEffect(() => {
    setCategory("assisted");
  }, [setCategory]);

  const initializeEcommerceData = useCallback(async (curr?: string, cntCode?: string) => {
    if (!curr || hasFetched.current) return;
    try {
      hasFetched.current = true;
      await getCategories(cntCode);
    } catch (err) {
      console.error("Init failed", err);
    }
  }, [getCategories]);

  useEffect(() => {
    if (currency && countryCode) {
      initializeEcommerceData(currency, countryCode);
    }
  }, [currency, countryCode, initializeEcommerceData]);

  const handleRefresh = () => {
    hasFetched.current = false;
    initializeEcommerceData(currency, countryCode);
  };

  const layoutProps = {
    locationData: locationData,
    categories: categories,
  };

  if (categories.length === 0) {
    return (
      <EcommerceSkeletonLoader
        networkError={ecommerceData.messages.networkError}
        refreshButtonLabel={ecommerceData.messages.refreshButton}
        onRefresh={handleRefresh}
      />
    );
  }

  return (
    <EcommercePageLayout {...layoutProps}>
      <CategorySection />
      <AssistedShoppingLandingContent />
    </EcommercePageLayout>
  );
}