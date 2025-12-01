"use client";

import React from "react";
import { Paper, Typography, IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";
import AddressSectionSkeletonLoader from "../skeleton-loader/AddressSectionSkeletonLoader";
import { CartAddressData } from "@/types/ecommerce";

interface AddressSectionProps {
  selectedAddress: CartAddressData | null;
  highlightAddressError: boolean;
  isLoading?: boolean;
  onAddAddress: () => void;
  onEditAddress: () => void;
  noAddressLabel: string;
  addAddressLabel: string;
  borderColor: string;
}

export default function AddressSection({
  selectedAddress,
  highlightAddressError,
  isLoading = false,
  onAddAddress,
  onEditAddress,
  noAddressLabel,
  addAddressLabel,
  borderColor,
}: AddressSectionProps) {
  const formatAddress = (address: CartAddressData) => {
    return `${address.address}, ${address.city}, ${address.state} ${address.zip_code}`;
  };

  if (isLoading) {
    return <AddressSectionSkeletonLoader borderColor={borderColor} />;
  }

  if (!selectedAddress) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          border: `1px solid ${highlightAddressError ? "#f44336" : borderColor}`,
          bgcolor: "white",
          transition: 'border 0.3s ease'
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          {noAddressLabel}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Add your delivery address to continue.
        </Typography>
        <Typography
          variant="body2"
          sx={{ 
            mt: 2, 
            color: "primary.main", 
            cursor: "pointer", 
            fontWeight: 600,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
          onClick={onAddAddress}
        >
          {addAddressLabel}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        mb: 2,
        borderRadius: 2,
        border: `1px solid ${borderColor}`,
        bgcolor: "white",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
        },
        position: 'relative',
      }}
    >
      <IconButton
        onClick={onEditAddress}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: 'text.secondary',
          '&:hover': {
            color: 'primary.main',
          },
        }}
        size="small"
      >
        <Edit />
      </IconButton>
      <Typography variant="body2" fontWeight={600} sx={{ fontSize: "0.95rem", mb: 1.5 }}>
        Delivery Address
      </Typography>
      <Typography
        variant="body1"
        fontWeight={600}
        sx={{ mb: 0.5, color: "text.primary" }}
      >
        {selectedAddress.name}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          mb: 0.5,
          color: "text.secondary",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {formatAddress(selectedAddress)}
      </Typography>
      {selectedAddress.phone_number && (
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.25 }}>
          Phone: {selectedAddress.phone_number}
        </Typography>
      )}
      {selectedAddress.email && (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Email: {selectedAddress.email}
        </Typography>
      )}
    </Paper>
  );
}