"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Paper,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useCartStore } from "@/store/cartStore";
import { ecommerceService } from "@/services/ecommerce.service";
import { DeliveryOption } from "@/types/ecommerce";
import { formatPrice } from "@/utils/priceUtils";
import { useDetectUserLocation } from "@/hooks/useEffectiveUserLocation";

interface DeliveryModelSelectionProps {
  countryCode?: string;
  selectedOption: DeliveryOption | null;
  onSelectOption: (option: DeliveryOption) => void;
  onBack: () => void;
  onContinue: () => void;
}

export default function DeliveryModelSelection({
  countryCode,
  selectedOption,
  onSelectOption,
  onBack,
  onContinue,
}: DeliveryModelSelectionProps) {
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currencyCode, currencySymbol } = useDetectUserLocation();
  const { getCart } = useCartStore();

  useEffect(() => {
    const fetchDeliveryOptions = async () => {
      if (!countryCode) {
        setError("Country code is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const options = await ecommerceService.getDeliveryRates(countryCode);
        setDeliveryOptions(options);
        
        // Auto-select first option if none selected
        if (options.length > 0 && !selectedOption) {
          onSelectOption(options[0]);
        }
      } catch (err: any) {
        console.error("Failed to fetch delivery options:", err);
        setError(err.message || "Failed to load delivery options");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryCode]); // Only depend on countryCode to avoid infinite loops

  const handleDeliveryOptionClick = useCallback(
    async (option: DeliveryOption) => {
      onSelectOption(option);
      try {
        await ecommerceService.selectDeliveryOption(option);
        await getCart(currencyCode, countryCode);
      } catch (err) {
        console.error("Failed to save delivery option:", err);
      }
    },
    [onSelectOption, getCart, currencyCode, countryCode]
  );

  const formatDeliveryDays = (days?: string) => {
    if (!days) return "";
    // Handle formats like "2-6 WORKING DAYS" or "6-8 WORKING DAYS"
    return days.replace("WORKING DAYS", "days").trim();
  };

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 3,
          borderRadius: 2,
          border: "1px solid #e0e0e0",
          bgcolor: "white",
          textAlign: "center",
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading delivery options...
        </Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          border: "1px solid #e0e0e0",
          bgcolor: "white",
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  if (deliveryOptions.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          border: "1px solid #e0e0e0",
          bgcolor: "white",
        }}
      >
        <Alert severity="warning">
          No delivery options available for this location.
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 3,
        borderRadius: 2,
        border: "1px solid #e0e0e0",
        bgcolor: "white",
      }}
    >
      <Typography 
        variant="h6" 
        fontWeight="bold" 
        gutterBottom 
        sx={{ 
          mb: 2,
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
        }}
      >
        Select Delivery Platform
      </Typography>

      <Box
        sx={{
          bgcolor: "grey.50",
          p: { xs: 1.5, sm: 2 },
          borderRadius: 1,
          mb: 3,
        }}
      >
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 0.5, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
        >
          Delivery Location
        </Typography>
        <Typography 
          variant="body2" 
          fontWeight={500}
          sx={{ fontSize: { xs: "0.85rem", sm: "0.875rem" } }}
        >
          {countryCode || "Not specified"}
        </Typography>
      </Box>

      <Typography 
        variant="body2" 
        fontWeight={600} 
        sx={{ 
          mb: 2,
          fontSize: { xs: "0.85rem", sm: "0.875rem" },
        }}
      >
        Delivery Platform <span style={{ color: "#f44336" }}>*</span>
      </Typography>

      <Box sx={{ mb: 3 }}>
        {deliveryOptions.map((option, index) => {
          const isSelected =
            selectedOption?.delivery_platform === option.delivery_platform;
          return (
            <Paper
              key={index}
              elevation={0}
              onClick={() => handleDeliveryOptionClick(option)}
              sx={{
                p: { xs: 2, sm: 2.5 },
                mb: 2,
                borderRadius: 2,
                border: `2px solid ${isSelected ? "#1976d2" : "#e0e0e0"}`,
                bgcolor: isSelected ? "primary.50" : "white",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: isSelected ? "#1976d2" : "#bdbdbd",
                  boxShadow: 1,
                },
                "&:active": {
                  transform: "scale(0.98)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "flex-start" },
                  gap: { xs: 1, sm: 0 },
                }}
              >
                <Box sx={{ flex: 1, width: "100%" }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ 
                      mb: 0.5,
                      fontSize: { xs: "0.95rem", sm: "1rem" },
                    }}
                  >
                    {option.delivery_platform}
                  </Typography>
                  {option.estimated_time && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ 
                        mb: 0.5,
                        fontSize: { xs: "0.8rem", sm: "0.875rem" },
                      }}
                    >
                      {formatDeliveryDays(option.estimated_time)}
                    </Typography>
                  )}
                </Box>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color="primary.main"
                  sx={{ 
                    ml: { xs: 0, sm: 2 },
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatPrice(option.total_amount, currencySymbol)} / Kg
                </Typography>
              </Box>
            </Paper>
          );
        })}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          gap: { xs: 1.5, sm: 2 },
          pt: 2,
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Button
          fullWidth={false}
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={onBack}
          sx={{
            textTransform: "none",
            color: "primary.main",
            borderColor: "primary.main",
            flex: { xs: 1, sm: "none" },
            "&:hover": {
              borderColor: "primary.dark",
              bgcolor: "primary.50",
            },
          }}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            Return to Address
          </Box>
          <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
            Back
          </Box>
        </Button>
        <Button
          fullWidth={false}
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={onContinue}
          disabled={!selectedOption}
          sx={{
            textTransform: "none",
            bgcolor: "primary.main",
            flex: { xs: 1, sm: "none" },
            "&:hover": {
              bgcolor: "primary.dark",
            },
            "&.Mui-disabled": {
              bgcolor: "#e0e0e0",
              color: "#9e9e9e",
            },
          }}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            Continue to Review
          </Box>
          <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
            Continue
          </Box>
        </Button>
      </Box>
    </Paper>
  );
}
