"use client";

import React from "react";
import { Box, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { EcommerceProduct, TodaysDealCarouselProps } from "@/types/ecommerce";
import { ecommerceData } from "@/data/ecommerceData";
import EcommerceProductCard from "./EcommerceProductCard";

export default function TodaysDealCarousel({
  products,
  cart,
  onProductClick,
  onAddToCart,
  onDecreaseQuantity,
  getCartItemQuantity,
  defaultRating,
  defaultReviewCount,
  outOfStockLabel,
  addButtonLabel,
}: TodaysDealCarouselProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  React.useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollability);
      return () => container.removeEventListener("scroll", checkScrollability);
    }
  }, [products]);

  const handlePrevious = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.clientWidth / 5; // Assuming 5 cards visible on desktop
      scrollContainerRef.current.scrollBy({
        left: -cardWidth * 2,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.clientWidth / 5;
      scrollContainerRef.current.scrollBy({
        left: cardWidth * 2,
        behavior: "smooth",
      });
    }
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <Box sx={{ position: "relative" }}>
      {/* Navigation Buttons */}
      {canScrollLeft && (
        <IconButton
          onClick={handlePrevious}
          sx={{
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            bgcolor: "white",
            boxShadow: 2,
            "&:hover": { bgcolor: "grey.100" },
          }}
        >
          <ChevronLeft />
        </IconButton>
      )}

      {canScrollRight && (
        <IconButton
          onClick={handleNext}
          sx={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            bgcolor: "white",
            boxShadow: 2,
            "&:hover": { bgcolor: "grey.100" },
          }}
        >
          <ChevronRight />
        </IconButton>
      )}

      {/* Products Container - Horizontal Scroll */}
      <Box
        ref={scrollContainerRef}
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          overflowY: "hidden",
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          px: 1,
        }}
      >
        {products.map((product: EcommerceProduct) => {
          const cartQuantity = getCartItemQuantity(product.id);
          return (
            <Box
              key={product.id}
              sx={{
                minWidth: {
                  xs: "calc(50% - 8px)",
                  sm: "calc(25% - 12px)",
                  md: "calc(25% - 12px)",
                  lg: "calc(20% - 12px)",
                },
                flexShrink: 0,
              }}
            >
              <EcommerceProductCard
                product={product}
                cartQuantity={cartQuantity}
                onProductClick={onProductClick}
                onAddToCart={onAddToCart}
                onDecreaseQuantity={onDecreaseQuantity}
                defaultRating={defaultRating}
                defaultReviewCount={defaultReviewCount}
                outOfStockLabel={outOfStockLabel}
                addButtonLabel={addButtonLabel}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

