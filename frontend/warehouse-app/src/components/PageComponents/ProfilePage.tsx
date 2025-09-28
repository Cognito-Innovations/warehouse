"use client";

import React, { useCallback, useEffect, useState } from "react";
import {Edit,} from "@mui/icons-material";
import EditProfileModal, { ProfileData } from "../Modals/EditProfileModal";
import {Box,Typography,Button,Card,CardContent,Grid,Switch, CircularProgress } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { getUser } from "@/lib/api.service";

export default function ProfilePage() {
  const { user } = useAuth();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData>({
    id_card_passport_no: "",
    name: "",
    email: "",
    phone_number: "",
    alternate_phone_number: "",
    gender: "",
    dob: "",
    email_verified: false,
  });

    const fetchUserProfile = useCallback(async () => {
        if (user?.id) {
          try {
            const userInfo = await getUser(user.id);
            setProfileData({
              id_card_passport_no: userInfo.id_card_passport_no || "",
              name: userInfo.name || "",
              email: userInfo.email || "",
              phone_number: userInfo.phone_number || "",
              alternate_phone_number: userInfo.alternate_phone_number || "",
              gender: userInfo.gender || "",
              dob: userInfo.dob?.split("T")[0] || "",
              email_verified: userInfo.email_verified || false,
            });
          } catch (error) {
            console.error("Failed to fetch user profile", error);
          } finally {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      }, [user?.id]);
    
      useEffect(() => {
        fetchUserProfile();
      }, [user?.id, fetchUserProfile]);

  const handleProfileUpdate = (updatedData: Partial<ProfileData>) => {
    setProfileData((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };
  
  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "grey.900" }}>
          Profile
        </Typography>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => setEditModalOpen(true)}
          size="small"
          sx={{
            bgcolor: "primary.main",
            color: "white",
            textTransform: "none",
            borderRadius: "6px",
            px: 2,
            py: 0.5,
            fontSize: "0.875rem",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          Edit Profile
        </Button>
      </Box>

      <Card sx={{ mb: 2, borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <CardContent sx={{ p: 2.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: "black.500", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Identifier
                </Typography>
                <Typography variant="body2" sx={{ color: "black.900", fontWeight: 500, mt: 0.5 }}>
                  {profileData.id_card_passport_no || "-"}
                </Typography>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: "black.500", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Name
                </Typography>
                <Typography variant="body2" sx={{ color: "black.900", fontWeight: 500, mt: 0.5 }}>
                  {profileData.name}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: "black.500", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Email
                </Typography>
                <Typography variant="body2" sx={{ color: "black.900", fontWeight: 500, mt: 0.5 }}>
                  {profileData.email}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: "black.500", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Contact
                </Typography>
                <Typography variant="body2" sx={{ color: "black.900", fontWeight: 500, mt: 0.5 }}>
                  {profileData.phone_number || "-"}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: "black.500", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Alternative Contact
                </Typography>
                <Typography variant="body2" sx={{ color: "black.900", fontWeight: 500, mt: 0.5 }}>
                  {profileData.alternate_phone_number || "-"}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: "black.500", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Gender
                </Typography>
                <Typography variant="body2" sx={{ color: "black.900", fontWeight: 500, mt: 0.5 }}>
                  {profileData.gender
                    ? profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1).toLowerCase()
                    : "-"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <EditProfileModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        profileData={profileData}
        onProfileUpdate={handleProfileUpdate}
        loading={loading}
      />
    </Box>
  );
}