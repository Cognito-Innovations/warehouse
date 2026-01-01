"use client";
import React, { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import { useSession } from "next-auth/react";

import { AssistedShoppingHero } from "./AssistedShoppingHero";
import { AssistedShoppingSteps } from "./AssistedShoppingSteps";
import { AssistedShoppingSearchForm } from "./AssistedShoppingSearchForm";
import ShoppingRequestForm from "@/components/ShoppingRequest/ShoppingRequestForm";
import { ASSISTED_SHOPPING_PRODUCT_LINK_KEY } from "@/utils/constants";

export default function AssistedShoppingLandingContent() {
  const { status } = useSession();
  const [hasSubmittedLink, setHasSubmittedLink] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && status !== "loading") {
      const productLink = sessionStorage.getItem(ASSISTED_SHOPPING_PRODUCT_LINK_KEY);
      if (productLink) {
        setHasSubmittedLink(true);
      } else {
        setHasSubmittedLink(false);
      }
    }
  }, [status]);

  const handleLinkSubmit = () => {
    setHasSubmittedLink(true);
  };

  const currentStep = hasSubmittedLink ? 2 : 1;

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "80vh", pb: { xs: 4, md: 8 }, width: "100%" }}>
      <AssistedShoppingHero />

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <AssistedShoppingSteps currentStep={currentStep} />

        <Box sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 2, md: 4 } }}>
          {hasSubmittedLink ? (
            <Box sx={{ maxWidth: { xs: "100%", md: "900px" }, mx: "auto" }}>
              <ShoppingRequestForm />
            </Box>
          ) : (
            <AssistedShoppingSearchForm onLinkSubmit={handleLinkSubmit} />
          )}
        </Box>
      </Container>
    </Box>
  );
}