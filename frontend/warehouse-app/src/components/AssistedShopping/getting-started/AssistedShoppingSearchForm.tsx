"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ASSISTED_SHOPPING_PRODUCT_LINK_KEY } from "@/utils/constants";

interface AssistedShoppingSearchFormProps {
  onLinkSubmit?: () => void;
}

export const AssistedShoppingSearchForm = ({ onLinkSubmit }: AssistedShoppingSearchFormProps) => {
  const router = useRouter();
  const { status } = useSession();

  const [link, setLink] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && status === "authenticated") {
      const storedLink = sessionStorage.getItem(ASSISTED_SHOPPING_PRODUCT_LINK_KEY);
      if (storedLink) {
        setLink(storedLink);
        onLinkSubmit?.();
      }
    }
  }, [status]);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSearch = () => {
    if (status === "loading") return;

    const trimmedLink = link.trim();
    if (!trimmedLink || !isValidUrl(trimmedLink)) {
      setError(true);
      return;
    }

    sessionStorage.setItem(ASSISTED_SHOPPING_PRODUCT_LINK_KEY, trimmedLink);

    if (status === "authenticated") {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onLinkSubmit?.();
      }, 100);
    } else {
      const callbackUrl = encodeURIComponent(window.location.href);
      router.push(`/sign-in?callbackUrl=${callbackUrl}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading && link.trim() && status !== "loading") {
      handleSearch();
    }
  };

  return (
    <Box
      sx={{
        maxWidth: { xs: "100%", sm: "600px", md: "700px" },
        mx: "auto",
        px: { xs: 2, sm: 3 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <TextField
        fullWidth
        placeholder="Paste a product link from any store (e.g., https://amazon.com/...)"
        value={link}
        onChange={(e) => {
          setLink(e.target.value);
          if (error) setError(false);
        }}
        onKeyPress={handleKeyPress}
        error={error}
        helperText={
          error ? "Please enter a valid URL (e.g. https://amazon.com/...)" : ""
        }
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          sx: { 
            bgcolor: "#f9fafb", 
            borderRadius: 1,
            fontSize: { xs: "0.875rem", md: "0.9375rem" }
          },
        }}
        sx={{ 
          mb: { xs: 2, md: 3 },
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
              borderColor: "primary.main",
            },
          },
        }}
      />

      <Button
        variant="contained"
        onClick={handleSearch}
        disabled={!link.trim() || isLoading || status === "loading"}
        sx={{
          bgcolor: "#fccb00",
          color: "#000",
          fontWeight: "bold",
          px: { xs: 5, md: 6 },
          py: { xs: 1.25, md: 1.5 },
          boxShadow: "none",
          "&:hover": { 
            bgcolor: "#e3b600", 
            boxShadow: "0 2px 8px rgba(252, 203, 0, 0.3)" 
          },
          "&:disabled": { bgcolor: "#fcefa8", color: "#888" },
          minWidth: { xs: "140px", md: "150px" },
          fontSize: { xs: "0.875rem", md: "0.9375rem" },
          textTransform: "none",
        }}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Search"
        )}
      </Button>
    </Box>
  );
};