"use client";

import React, { useRef, useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";


import CategoryItems from "./CategoryItems";
import CategoryStaticAllCard from "./CategoryStaticAllCard";
import CategoryStaticAssistedCard from "./CategoryStaticAssistedCard";

export default function CategorySection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      setShowScrollButton(element.scrollWidth > element.clientWidth);
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 112;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        ref={scrollContainerRef}
        sx={{
          display: "flex",
          gap: { xs: 4, sm: 6, md: 8 },
          flexWrap: "nowrap",
          overflowX: "auto",
          borderBottom: "1px solid #d3d2d2",
          pt: { xs: 1.5, sm: 2 },
          pb: { xs: 1, sm: 1.5 },
          "::-webkit-scrollbar": {
            display: "none",
          },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
        }}
      >
        <CategoryStaticAllCard />
        <CategoryStaticAssistedCard />
        <CategoryItems />
      </Box>

      {showScrollButton && (
        <IconButton
          onClick={handleScroll}
          sx={{
            position: "absolute",
            right: { xs: -10, md: -20 },
            top: { xs: "14px", md: "20px" },
            zIndex: 2,
            width: { xs: 32, md: 40 },
            height: { xs: 32, md: 40 },
            borderRadius: "50%",
            bgcolor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(4px)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 1)",
            },
          }}
        >
          <ArrowForwardIosIcon
            sx={{
              fontSize: { xs: "1rem", md: "1.25rem" },
              color: "#4B5563",
              ml: { xs: "2px", md: "3px" },
            }}
          />
        </IconButton>
      )}
    </Box>
  );
}