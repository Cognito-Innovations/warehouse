"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, Typography, Box } from "@mui/material";
import { KeyboardArrowDown, Public } from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { useDetectUserLocation } from "@/store/useDetectUserLocation";
import { ROUTES } from "@/utils/constants";

export default function HeaderCountrySelector() {
  const router = useRouter();
  const { user } = useAuth();
  const { countryName, countryCode } = useDetectUserLocation();
  const isLoggedIn = Boolean(user?.id || user?.email);

  const handleClick = () => {
    if (isLoggedIn) {
      // Redirect to Profile Country settings if logged in
      // Assuming the profile page handles a 'view' query param or just goes to profile
      router.push(`${ROUTES.PROFILE}?view=country`); 
    } else {
      // Redirect to Login if not logged in
      // Passing callbackUrl ensures they return to the current page after login
      const returnTo = typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/";
      const callback = encodeURIComponent(returnTo);
      router.push(`/sign-in?callbackUrl=${callback}`);
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="text"
      sx={{
        textTransform: "none",
        color: "text.primary",
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        padding: "6px 12px",
        borderRadius: "4px",
        border: "1px solid transparent",
        transition: "all 0.2s ease-in-out",
        minWidth: { xs: "auto", md: "120px" },
        "&:hover": {
          backgroundColor: "primary.main",
          color: "white",
          border: "1px solid",
          borderColor: "primary.main",
          "& .MuiSvgIcon-root": {
            color: "white",
            transform: "rotate(180deg)", // "Movement" effect on hover
          },
        },
      }}
    >
      {/* Icon for visual context */}
      <Public fontSize="small" sx={{ fontSize: "1.1rem", transition: "color 0.2s" }} />

      {/* Text: Hidden on very small screens if space is tight, visible on others */}
      <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "left" }}>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 500, 
            fontSize: "0.9rem",
            lineHeight: 1 
          }}
        >
          {countryName || "Country"}
        </Typography>
      </Box>

      {/* Mobile only: Show Code instead of full name */}
      <Typography 
        variant="body2" 
        sx={{ 
          display: { xs: "block", sm: "none" }, 
          fontWeight: 600,
          fontSize: "0.85rem"
        }}
      >
        {countryCode || "IN"}
      </Typography>

      {/* Arrow that animates on hover */}
      <KeyboardArrowDown 
        fontSize="small" 
        sx={{ 
          transition: "transform 0.2s, color 0.2s",
          display: { xs: "none", sm: "block" }
        }} 
      />
    </Button>
  );
}