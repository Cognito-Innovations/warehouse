"use client";

import React, { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { ArrowDropDown, Add } from "@mui/icons-material";
import { AddressSelectionProps } from "@/types/ecommerce";

export default function AddressSelectionDropdown({
  addresses,
  selectedAddress,
  onAddressSelect,
  onAddNewAddress,
  noAddressLabel,
  addAddressLabel,
  selectAddressLabel,
  borderColor,
}: AddressSelectionProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddressSelect = (address: typeof addresses[0]) => {
    onAddressSelect(address);
    handleClose();
  };

  const formatAddress = (address: typeof addresses[0]) => {
    return `${address.address}, ${address.city}, ${address.state} ${address.zip_code}`;
  };

  if (addresses.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 2,
          borderRadius: 2,
          border: `1px solid ${borderColor}`,
          bgcolor: "white",
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {noAddressLabel}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAddNewAddress}
          sx={{
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          {addAddressLabel}
        </Button>
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
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: "0.95rem" }}>
          {selectAddressLabel}
        </Typography>
      </Box>
      <Box sx={{ width: "100%" }}>
        <Button
          fullWidth
          variant="outlined"
          endIcon={<ArrowDropDown />}
          onClick={handleClick}
          sx={{
            justifyContent: "space-between",
            textTransform: "none",
            py: 1.75,
            px: 2,
            borderRadius: 2,
            borderColor: selectedAddress ? "primary.main" : "divider",
            borderWidth: selectedAddress ? 2 : 1,
            color: "text.primary",
            bgcolor: selectedAddress ? "primary.50" : "transparent",
            width: "100%",
            minWidth: 0,
            "&:hover": {
              borderColor: "primary.main",
              bgcolor: "primary.50",
              borderWidth: 2,
            },
          }}
        >
        <Box sx={{ flex: 1, textAlign: "left", minWidth: 0 }}>
          {selectedAddress ? (
            <>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  mb: 0.25,
                  color: "text.primary",
                }}
              >
                {selectedAddress.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: "text.secondary",
                }}
              >
                {formatAddress(selectedAddress)}
              </Typography>
            </>
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontStyle: "italic",
              }}
            >
              Select an address
            </Typography>
          )}
        </Box>
      </Button>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            maxHeight: 400,
            width: anchorEl ? anchorEl.offsetWidth : "auto",
            minWidth: anchorEl ? anchorEl.offsetWidth : "auto",
            mt: 1,
          },
        }}
      >
        {addresses.map((address) => (
          <MenuItem
            key={address.id}
            onClick={() => handleAddressSelect(address)}
            selected={selectedAddress?.id === address.id}
          >
            <ListItemText
              primary={address.name}
              secondary={formatAddress(address)}
              primaryTypographyProps={{
                fontWeight: selectedAddress?.id === address.id ? 600 : 400,
              }}
            />
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={onAddNewAddress}>
          <Add sx={{ mr: 1, fontSize: 20 }} />
          <ListItemText primary={addAddressLabel} />
        </MenuItem>
      </Menu>
    </Paper>
  );
}

