"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Paper, Typography, IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";

import { useLocationStore } from "@/store/locationStore";
import { fetchUserAddresses, createUserAddress, updateUserAddress } from "@/lib/api.service";
import AddAddressModal from "./AddAddressModal";
import AddressSectionSkeletonLoader from "../skeleton-loader/AddressSectionSkeletonLoader";
import { CartAddressData } from "@/types/ecommerce";

interface AddressSectionProps {
  userId?: string;
  onAddressChange: (address: CartAddressData | null) => void;
  highlightAddressError: boolean;
  onAddressFetchComplete?: () => void;
}

export default function AddressSection({
  userId,
  onAddressChange,
  highlightAddressError,
  onAddressFetchComplete,
}: AddressSectionProps) {
  const refreshLocation = useLocationStore((s) => s.refreshLocation);

  const [selectedAddress, setSelectedAddress] = useState<CartAddressData | null>(null);
  const [addAddressModalOpen, setAddAddressModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState<CartAddressData | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatAddress = (address: CartAddressData) => {
    return `${address.address}, ${address.city}, ${address.state} ${address.zip_code}`;
  };

  const loadAddressesInternal = useCallback(async (uid: string) => {
    try {
      const addressData = await fetchUserAddresses(uid);
      let formattedAddress: CartAddressData | null = null;
      if (addressData) {
        formattedAddress = {
          id: addressData.id,
          name: addressData.name || "",
          address: addressData.address || "",
          city: addressData.city || "",
          state: addressData.state || "",
          zip_code: addressData.zip_code || "",
          country: addressData.country || "",
          phone_code: addressData.user.phone_code,
          phone_number: addressData.user.phone_number,
          email: addressData.user.email,
          currency: addressData.user?.preference?.currency?.id || "",
        };
      }
      setSelectedAddress(formattedAddress);
      onAddressChange(formattedAddress);
    } catch (err) {
      console.error("Failed to load addresses:", err);
      setSelectedAddress(null);
      onAddressChange(null);
    } finally {
      if (onAddressFetchComplete) {
        onAddressFetchComplete();
      }
    }
  }, [onAddressChange, onAddressFetchComplete]);

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      loadAddressesInternal(userId).finally(() => setIsLoading(false));
    } else {
      setSelectedAddress(null);
      onAddressChange(null);
      if (onAddressFetchComplete) onAddressFetchComplete();
    }
  }, [userId, loadAddressesInternal, onAddressChange, onAddressFetchComplete]);

  const handleSaveAddress = useCallback(async (addressData: Omit<CartAddressData, "id">) => {
    if (!userId) return;
    try {
      const apiData = {
        user_id: userId,
        name: addressData.name,
        address: addressData.address,
        country: addressData.country,
        zip_code: addressData.zip_code,
        state: addressData.state,
        city: addressData.city,
        phone_number: `${addressData.phone_code || ""}${addressData.phone_number || ""}`,
        email: addressData.email,
        currency: addressData.currency,
      };
      const newAddress = await createUserAddress(apiData);
      await refreshLocation(userId);
      const formattedAddress: CartAddressData = {
        id: newAddress.id,
        ...addressData,
      };
      setSelectedAddress(formattedAddress);
      onAddressChange(formattedAddress);
    } catch (err) {
      console.error("Failed to save address:", err);
      throw err;
    }
  }, [userId, onAddressChange]);

  const handleUpdateAddress = useCallback(async (addressId: string, addressData: Omit<CartAddressData, "id">) => {
    if (!userId) return;
    try {
      const apiData = {
        user_id: userId,
        name: addressData.name,
        address: addressData.address,
        country: addressData.country,
        zip_code: addressData.zip_code,
        state: addressData.state,
        city: addressData.city,
        phone_number: `${addressData.phone_code || ""}${addressData.phone_number || ""}`,
        email: addressData.email,
        currency: addressData.currency,
      };
      await updateUserAddress(addressId, apiData);
      await refreshLocation(userId);
      const formattedAddress: CartAddressData = {
        id: addressId,
        ...addressData,
      };
      setSelectedAddress(formattedAddress);
      onAddressChange(formattedAddress);
      setEditAddress(null);
    } catch (err) {
      console.error("Failed to update address:", err);
      throw err;
    }
  }, [userId, onAddressChange]);

  const handleAddClick = () => {
    setAddAddressModalOpen(true);
  };

  const handleEditClick = () => {
    if (selectedAddress) {
      setEditAddress(selectedAddress);
      setEditModalOpen(true);
    }
  };

  if (isLoading) {
    return <AddressSectionSkeletonLoader borderColor="#e0e0e0" />;
  }

  let content;
  if (!selectedAddress) {
    content = (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          border: `1px solid ${highlightAddressError ? "#f44336" : "#e0e0e0"}`,
          bgcolor: "white",
          transition: "border 0.3s ease"
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          No Address Found
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
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline"
            }
          }}
          onClick={handleAddClick}
        >
          + Add Address
        </Typography>
      </Paper>
    );
  } else {
    content = (
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 2,
          borderRadius: 2,
          border: "1px solid #e0e0e0",
          bgcolor: "white",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
          },
          position: "relative",
        }}
      >
        <IconButton
          onClick={handleEditClick}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "text.secondary",
            "&:hover": {
              color: "primary.main",
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

  return (
    <>
      {content}
      <AddAddressModal
        open={addAddressModalOpen}
        initialData={null}
        onClose={() => setAddAddressModalOpen(false)}
        onSave={handleSaveAddress}
        title="Add New Address"
        saveLabel="Save Address"
        cancelLabel="Cancel"
      />

      <AddAddressModal
        open={editModalOpen}
        initialData={editAddress}
        onClose={() => {
          setEditModalOpen(false);
          setEditAddress(null);
        }}
        onSave={(data) => handleUpdateAddress(editAddress!.id, data)}
        title="Edit Address"
        saveLabel="Update Address"
        cancelLabel="Cancel"
      />
    </>
  );
}