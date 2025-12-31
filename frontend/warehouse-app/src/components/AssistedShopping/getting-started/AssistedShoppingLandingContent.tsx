"use client";
import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

import { AssistedShoppingHero } from "./AssistedShoppingHero";
import { AssistedShoppingSteps } from "./AssistedShoppingSteps";
import { AssistedShoppingSearchForm } from "./AssistedShoppingSearchForm";
import ShoppingRequestForm from "@/components/ShoppingRequest/ShoppingRequestForm";
import { ASSISTED_SHOPPING_PRODUCT_LINK_KEY } from "@/utils/constants";

export default function AssistedShoppingLandingContent() {
  const [hasSubmittedLink, setHasSubmittedLink] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const productLink = sessionStorage.getItem(ASSISTED_SHOPPING_PRODUCT_LINK_KEY);
      if (productLink) {
        setHasSubmittedLink(true);
      }
    }
  }, []);

  const handleLinkSubmit = () => {
    setHasSubmittedLink(true);
  };

  const currentStep = hasSubmittedLink ? 2 : 1;

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "80vh", pb: 8 }}>
      <AssistedShoppingHero />

      <AssistedShoppingSteps currentStep={currentStep} />

      {hasSubmittedLink ? (
        <ShoppingRequestForm />
      ) : (
        <AssistedShoppingSearchForm onLinkSubmit={handleLinkSubmit} />
      )}
    </Box>
  );
}