"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, Stack, Typography, Alert, Box, CircularProgress } from "@mui/material";
import { Home } from "@mui/icons-material";
import { fetchUserAddresses } from "@/lib/api.service";
import { useAuth } from "@/contexts/AuthContext";

interface UserAddress {
  address: string;
  city: string;
  country: string;
  zip_code: string;
  state?: string;
  name?: string;
  phone_number?: string;
  email?: string;
}

interface DeliveryAddressCardProps {
  userId: string | undefined;
  onAddressSelect: (address: string) => void;
  onLoadingChange: (isLoading: boolean) => void;
  onAddressFetchComplete?: () => void;
}

export default function DeliveryAddressCard({
  userId,
  onAddressSelect,
  onLoadingChange,
  onAddressFetchComplete,
}: DeliveryAddressCardProps) {
    const { loading: authLoading } = useAuth();

    const [fetchedAddress, setFetchedAddress] = useState<UserAddress | null>(null);
    const [internalLoading, setInternalLoading] = useState(false);
    const [internalError, setInternalError] = useState<string | null>(null);

    const fetchAddress = async () => {
      if (!userId) {
        setFetchedAddress(null);
        if (onAddressFetchComplete) onAddressFetchComplete();
        return;
      }

      try {
        setInternalLoading(true);
        onLoadingChange(true);
        setInternalError(null);

        const addressData = await fetchUserAddresses(userId);
        
        let addresses: UserAddress[] = [];
        if (Array.isArray(addressData)) {
          addresses = addressData;
        } else if (addressData) {
          addresses = [addressData];
        }

        if (addresses.length > 0) {
          const defaultAddress = addresses[0];
          const fullAddress = `${defaultAddress.address}, ${defaultAddress.city}, ${defaultAddress.state || ''}, ${defaultAddress.zip_code}, ${defaultAddress.country}`;
          
          setFetchedAddress(defaultAddress);
          onAddressSelect(fullAddress);
        } else {
          setFetchedAddress(null);
          onAddressSelect(""); 
          setInternalError("No saved address found. Please add an address in your profile.");
        }
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
        setFetchedAddress(null);
        onAddressSelect("");
        setInternalError("Failed to fetch your saved address. Please try again.");
      } finally {
        setInternalLoading(false);
        onLoadingChange(false);
        if (onAddressFetchComplete) {
            onAddressFetchComplete();
        }
      }
    };

    useEffect(() => {
      if (userId) {
        fetchAddress();
      } else if (!authLoading) {
        if (onAddressFetchComplete) onAddressFetchComplete();
      }
    }, [userId, authLoading]); 

    return (
        <Card 
            variant="outlined" 
            sx={{ 
                borderRadius: 3, 
                border: "1px solid #e9ecef",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                transition: "box-shadow 0.2s ease",
                "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
                height: "100%"
            }}
        >
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                    <Home sx={{ color: "primary.main", fontSize: 28 }} />
                    <Typography variant="h6" fontWeight={600} color="text.primary">
                        Delivery Address
                    </Typography>
                </Stack>    

                {internalError && (
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                        {internalError}
                    </Alert>
                )}  
                    {internalLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 3, bgcolor: 'grey.50', borderRadius: 2, minHeight: '140px', justifyContent: 'center' }}>
                            <CircularProgress size={24} sx={{ mr: 2 }} />
                            <Typography color="text.secondary">Fetching your address...</Typography>
                        </Box>
                    ) : fetchedAddress ? (
                        <Box
                            sx={{
                                p: { xs: 2, md: 2.5 },
                                bgcolor: "grey.50",
                                borderRadius: 2,
                                border: "1px solid #e9ecef",
                            }}
                        >
                            <Typography variant="body1" fontWeight={500} color="text.primary" gutterBottom>
                                {fetchedAddress.address}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {fetchedAddress.city}, {fetchedAddress.country}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {fetchedAddress.zip_code}
                            </Typography>
                        </Box>
                    ) : (
                        !internalError && !authLoading && (
                            <Alert severity="warning" sx={{ borderRadius: 2 }}>
                                No saved address found. Please add an address to your profile to proceed.
                            </Alert>
                        )
                    )}
            </CardContent>
        </Card>
    );    
}