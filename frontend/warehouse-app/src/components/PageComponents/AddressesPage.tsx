"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import {
  Add,
  LocationOn,
} from "@mui/icons-material";
import AddAddressModal from "../Modals/AddAddressModal";
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
  const [address, setAddress] = useState<Address>({} as Address);
  const [loading, setLoading] = useState(true);

  const getUserAddresses = async () => {
    try {
      setLoading(true);
      const res = await fetchUserAddresses(userId);
      setAddress(res || {});
    } catch (error) {
      console.error("Error fetching user addresses:", error);
      setAddress({} as Address);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      getUserAddresses();
    }
  }, [userId]);

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
        {Object.keys(address).length === 0 && (
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
                alignItems: "center",
                justifyContent: "center",
                minHeight: 350,
              }}
            >
              <Typography variant="body1" sx={{ color: "grey.600" }}>
                Loading addresses...
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : Object.keys(address).length === 0 ? (
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
            <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {/* Left column */}
              <Box sx={{ flex: 1, minWidth: 220 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.900', mb: 1 }}>Name</Typography>
                  <Typography variant="body1" sx={{  color: 'grey.900', mb: 1 }}>
                    {address.name}
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.900', mb: 1 }}>Address</Typography>
                  <Typography variant="body1" sx={{ color: 'grey.900', mb: 1 }}>
                    {address.address}
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.900', mb: 1 }}>City</Typography>
                  <Typography variant="body1" sx={{ color: 'grey.900', mb: 1 }}>
                    {address.city}
                  </Typography>
                </Box>
              </Box>
              {/* Right column */}
              <Box sx={{ flex: 1, minWidth: 220 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.900', mb: 1 }}>State</Typography>
                  <Typography variant="body1" sx={{ color: 'grey.900', mb: 1 }}>
                    {address.state}
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.900', mb: 1 }}>Zip Code</Typography>
                  <Typography variant="body1" sx={{ color: 'grey.900', mb: 1 }}>
                    {address.zip_code}
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'grey.900', mb: 1 }}>Country</Typography>
                  <Typography variant="body1" sx={{ color: 'grey.900', mb: 1 }}>
                    {address.country}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      <AddAddressModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </Box>
  );
}