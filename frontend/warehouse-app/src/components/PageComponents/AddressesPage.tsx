"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import {Edit,} from "@mui/icons-material";
import {
  Add,
  LocationOn,
} from "@mui/icons-material";
import AddEditAddressModal from "../Modals/AddEditAddressModal";
import { useSession } from "next-auth/react";
import { fetchUserAddresses } from "@/lib/api.service";

interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    email: string;
  };
}

export default function AddressesPage() {
  const { data: session, status } = useSession();
  const userId = (session?.user as any)?.user_id;

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [address, setAddress] = useState<Address>({} as Address);
  const [loading, setLoading] = useState(true);

  const getUserAddresses = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await fetchUserAddresses(userId);
      setAddress(res || ({} as Address));
    } catch (error) {
      console.error("Error fetching user addresses:", error);
      setAddress({} as Address);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressAdded = () => {
    setAddModalOpen(false);
    setSelectedAddress(null);
    getUserAddresses();
  };

  const handleEditClick = () => {
    setSelectedAddress(address.id ? address : null);
    setAddModalOpen(true);
  };

  useEffect(() => {
    if (userId) {
      getUserAddresses();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const hasAddress = !!address.id;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: "grey.900" }}>
            Addresses
          </Typography>
          <Typography variant="body2" sx={{ color: "grey.600", mt: 0.5 }}>
            Your delivery addresses
          </Typography>
        </Box>
        {!loading && !hasAddress && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setAddModalOpen(true)}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              textTransform: "none",
              borderRadius: "8px",
              px: 3,
              py: 1,
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            Add Address
          </Button>
        )}
      </Box>

      {loading ? (
        <Card sx={{ minHeight: 400 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 350,
                gap: 1,
              }}
            >
              <CircularProgress size={24} />
              <Typography variant="body1" sx={{ color: "grey.600" }}>
                Loading addresses...
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : !hasAddress ? (
        <Card sx={{ minHeight: 400 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 350,
                textAlign: "center",
                gap: 2
              }}
            >
              <LocationOn sx={{ fontSize: 64, color: "grey.300" }} />
              <Typography variant="h6" sx={{ color: "grey.600", fontWeight: 500 }}>
                No Addresses Available
              </Typography>
              <Typography variant="body2" sx={{ color: "grey.500", maxWidth: 300 }}>
                Add your first address to start managing your delivery locations.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ minHeight: 400 }}>
          <CardContent>
            <Box sx={{ position: "relative" }}>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={handleEditClick}
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  textTransform: "none",
                  borderRadius: "8px",
                  px: 2,
                  py: 0.5,
                  color: "primary.main",
                  borderColor: "primary.main",
                  "&:hover": {
                    borderColor: "primary.dark",
                    bgcolor: "primary.main",
                    color: "white",
                  },
                }}
              >
                Edit
              </Button>
              <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {/* Left column */}
                <Box sx={{ flex: 1, minWidth: 220 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "grey.900", mb: 1 }}>Name</Typography>
                    <Typography variant="body1" sx={{  color: "grey.900", mb: 1 }}>
                      {address.name}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "grey.900", mb: 1 }}>Address</Typography>
                    <Typography variant="body1" sx={{ color: "grey.900", mb: 1 }}>
                      {address.address}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "grey.900", mb: 1 }}>City</Typography>
                    <Typography variant="body1" sx={{ color: "grey.900", mb: 1 }}>
                      {address.city}
                    </Typography>
                  </Box>
                </Box>
                {/* Right column */}
                <Box sx={{ flex: 1, minWidth: 220 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "grey.900", mb: 1 }}>State</Typography>
                    <Typography variant="body1" sx={{ color: "grey.900", mb: 1 }}>
                      {address.state}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "grey.900", mb: 1 }}>Zip Code</Typography>
                    <Typography variant="body1" sx={{ color: "grey.900", mb: 1 }}>
                      {address.zip_code}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "grey.900", mb: 1 }}>Country</Typography>
                    <Typography variant="body1" sx={{ color: "grey.900", mb: 1 }}>
                      {address.country}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      <AddEditAddressModal
        open={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setSelectedAddress(null);
        }}
        onAddressAdded={handleAddressAdded}
        initialAddress={selectedAddress}
      />
    </Box>
  );
}