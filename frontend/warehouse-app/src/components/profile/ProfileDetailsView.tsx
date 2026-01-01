"use client";

import React from "react";
import { Edit, ArrowBack } from "@mui/icons-material";
import { ProfileData } from "../Modals/EditProfileModal";
import { Box, Typography, Button, Card, CardContent, Grid, CircularProgress, IconButton } from "@mui/material";

interface ProfileDetailsViewProps {
    onBack?: () => void;
    showBackButton?: boolean;
    profileData: ProfileData;
    loading: boolean;
    onEdit: () => void;
}

export default function ProfileDetailsView({
    onBack,
    showBackButton,
    profileData,
    loading,
    onEdit
}: ProfileDetailsViewProps) {

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50vh",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <CircularProgress color="primary" size={48} />
                <Typography variant="body1" sx={{ color: "grey.700" }}>
                    Loading your profile...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: "100%" }}>
            {showBackButton && (
                <Box sx={{ mb: 2 }}>
                    <IconButton onClick={onBack} size="small" edge="start" sx={{ color: "grey.700" }}>
                        <ArrowBack />
                    </IconButton>
                </Box>
            )}

            <Card sx={{ mb: 2, borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid", borderColor: "grey.200" }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: "grey.900" }}>
                            My Profile
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            onClick={onEdit}
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
                            Edit
                        </Button>
                    </Box>

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="caption" sx={{ color: "grey.500", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                    Identifier (ID / Passport)
                                </Typography>
                                <Typography variant="body1" sx={{ color: "grey.900", fontWeight: 500, mt: 0.5 }}>
                                    {profileData.id_card_passport_no || "-"}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="caption" sx={{ color: "grey.500", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                    Full Name
                                </Typography>
                                <Typography variant="body1" sx={{ color: "grey.900", fontWeight: 500, mt: 0.5 }}>
                                    {profileData.name}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="caption" sx={{ color: "grey.500", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                    Email Address
                                </Typography>
                                <Typography variant="body1" sx={{ color: "grey.900", fontWeight: 500, mt: 0.5 }}>
                                    {profileData.email}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="caption" sx={{ color: "grey.500", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                    Phone Number
                                </Typography>
                                <Typography variant="body1" sx={{ color: "grey.900", fontWeight: 500, mt: 0.5 }}>
                                    {profileData.phone_code && profileData.phone_number
                                        ? `${profileData.phone_code} ${profileData.phone_number}`
                                        : "-"
                                    }
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="caption" sx={{ color: "grey.500", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                    Alternative Contact
                                </Typography>
                                <Typography variant="body1" sx={{ color: "grey.900", fontWeight: 500, mt: 0.5 }}>
                                    {profileData.alternate_phone_number || "-"}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box>
                                <Typography variant="caption" sx={{ color: "grey.500", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                    Gender
                                </Typography>
                                <Typography variant="body1" sx={{ color: "grey.900", fontWeight: 500, mt: 0.5 }}>
                                    {profileData.gender
                                        ? profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1).toLowerCase()
                                        : "-"}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}
