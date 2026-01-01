"use client";

import React from "react";
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Avatar, Divider, Skeleton } from "@mui/material";
import { AccountCircle, Public, CreditCard, ChevronRight } from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileViewType } from "./ProfileMobileMenu";

interface ProfileSidebarProps {
    activeView: ProfileViewType;
    onSelectView: (view: ProfileViewType) => void;
}

export default function ProfileSidebar({ activeView, onSelectView }: ProfileSidebarProps) {
    const { user, loading } = useAuth();

    return (
        <Box sx={{ width: "100%" }}>
            {/* User Info Card */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: "16px",
                    bgcolor: "primary.50",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    border: "1px solid",
                    borderColor: "primary.100",
                    minHeight: 180, // Prevent height collapse
                    overflow: "hidden"
                }}
            >
                {loading ? (
                    <Skeleton variant="circular" width={80} height={80} sx={{ mb: 2 }} />
                ) : (
                    <Avatar
                        src={user?.image}
                        imgProps={{ referrerPolicy: "no-referrer" }}
                        alt={user?.name || "User"}
                        sx={{
                            bgcolor: "primary.main",
                            width: 80,
                            height: 80,
                            fontSize: "2.5rem",
                            mb: 2,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                        }}
                    >
                        {user?.name ? user.name.charAt(0).toUpperCase() : <AccountCircle sx={{ fontSize: "2.5rem" }} />}
                    </Avatar>
                )}

                {loading ? (
                    <Skeleton variant="text" width="60%" height={28} sx={{ mb: 1 }} />
                ) : (
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                        sx={{
                            width: "100%",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}
                    >
                        {user?.name || "User"}
                    </Typography>
                )}

                {loading ? (
                    <Skeleton variant="text" width="80%" height={20} />
                ) : (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            width: "100%",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}
                    >
                        {user?.email}
                    </Typography>
                )}
            </Paper>

            {/* Navigation Menu */}
            <Paper variant="outlined" sx={{ borderRadius: "16px", overflow: "hidden" }}>
                <List disablePadding>
                    <ListItem disablePadding>
                        <ListItemButton
                            selected={activeView === "details"}
                            onClick={() => onSelectView("details")}
                            sx={{
                                py: 2,
                                borderLeft: "4px solid",
                                borderColor: activeView === "details" ? "primary.main" : "transparent",
                                "&.Mui-selected": {
                                    bgcolor: "primary.50",
                                    typography: "fontWeightBold"
                                }
                            }}
                        >
                            <ListItemIcon>
                                <AccountCircle color={activeView === "details" ? "primary" : "action"} />
                            </ListItemIcon>
                            <ListItemText primary="Profile Details" primaryTypographyProps={{ fontWeight: activeView === "details" ? 700 : 500 }} />
                            {activeView === "details" && <ChevronRight color="primary" />}
                        </ListItemButton>
                    </ListItem>

                    <Divider component="li" />

                    <ListItem disablePadding>
                        <ListItemButton
                            selected={activeView === "country"}
                            onClick={() => onSelectView("country")}
                            sx={{
                                py: 2,
                                borderLeft: "4px solid",
                                borderColor: activeView === "country" ? "primary.main" : "transparent",
                                "&.Mui-selected": {
                                    bgcolor: "primary.50"
                                }
                            }}
                        >
                            <ListItemIcon>
                                <Public color={activeView === "country" ? "primary" : "action"} />
                            </ListItemIcon>
                            <ListItemText primary="Change Country" primaryTypographyProps={{ fontWeight: activeView === "country" ? 700 : 500 }} />
                            {activeView === "country" && <ChevronRight color="primary" />}
                        </ListItemButton>
                    </ListItem>

                    <Divider component="li" />

                    <ListItem disablePadding>
                        <ListItemButton
                            selected={activeView === "currency"}
                            onClick={() => onSelectView("currency")}
                            sx={{
                                py: 2,
                                borderLeft: "4px solid",
                                borderColor: activeView === "currency" ? "primary.main" : "transparent",
                                "&.Mui-selected": {
                                    bgcolor: "primary.50"
                                }
                            }}
                        >
                            <ListItemIcon>
                                <CreditCard color={activeView === "currency" ? "primary" : "action"} />
                            </ListItemIcon>
                            <ListItemText primary="Change Currency" primaryTypographyProps={{ fontWeight: activeView === "currency" ? 700 : 500 }} />
                            {activeView === "currency" && <ChevronRight color="primary" />}
                        </ListItemButton>
                    </ListItem>
                </List>
            </Paper>
        </Box>
    );
}
