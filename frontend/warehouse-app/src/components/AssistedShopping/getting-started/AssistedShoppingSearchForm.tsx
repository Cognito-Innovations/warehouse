"use client";

import React, { useState } from "react";
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

    setIsLoading(true);

    sessionStorage.setItem(ASSISTED_SHOPPING_PRODUCT_LINK_KEY, trimmedLink);

    if (status === "authenticated") {
      setIsLoading(false);
      onLinkSubmit?.();
    } else {
      const callbackUrl = encodeURIComponent(window.location.href);
      router.push(`/login?callbackUrl=${callbackUrl}`);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "600px",
        mx: "auto",
        px: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <TextField
        fullWidth
        placeholder="Paste a product link from any store"
        value={link}
        onChange={(e) => {
          setLink(e.target.value);
          if (error) setError(false);
        }}
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
          sx: { bgcolor: "#f9fafb", borderRadius: 1 },
        }}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        onClick={handleSearch}
        disabled={!link || isLoading || status === "loading"}
        sx={{
          bgcolor: "#fccb00",
          color: "#000",
          fontWeight: "bold",
          px: 6,
          py: 1.5,
          boxShadow: "none",
          "&:hover": { bgcolor: "#e3b600", boxShadow: "none" },
          "&:disabled": { bgcolor: "#fcefa8", color: "#888" },
          minWidth: "160px",
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