"use client";

import React from "react";
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Avatar } from "@mui/material";
import { ChevronRight, AccountCircle, Public, CreditCard } from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";

export type ProfileViewType = "menu" | "details" | "country" | "currency";

interface ProfileMobileMenuProps {
    onNavigate: (view: ProfileViewType) => void;
}

export default function ProfileMobileMenu({ onNavigate }: ProfileMobileMenuProps) {
    const { user } = useAuth();

    return (
        <Box>
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: "12px",
                    bgcolor: "primary.50",
                    display: "flex",
                    alignItems: "center",
                    gap: 2
                }}
            >
                <Avatar
                    src={user?.image}
                    imgProps={{ referrerPolicy: "no-referrer" }}
                    alt={user?.name || "User"}
                    sx={{
                        bgcolor: "primary.main",
                        width: 56,
                        height: 56,
                        fontSize: "1.5rem"
                    }}
                >
                    {user?.name ? user.name.charAt(0).toUpperCase() : <AccountCircle fontSize="large" />}
                </Avatar>
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                        {user?.name || "User"}
                    </Typography>
                    <Typography variant="subtitle2" fontWeight="bold">
                        {user?.email || "user@example.com"}
                    </Typography>
                </Box>
            </Paper>

            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Profile Options
            </Typography>

            <List disablePadding>
                <ListItem disablePadding sx={{ mb: 2 }}>
                    <ListItemButton
                        onClick={() => onNavigate("details")}
                        sx={{
                            bgcolor: "white",
                            borderRadius: "12px",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                            border: "1px solid",
                            borderColor: "grey.100",
                            py: 2
                        }}
                    >
                        <ListItemIcon>
                            <AccountCircle color="primary" fontSize="large" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Change profile details"
                            secondary="Update your name, mobile number"
                            primaryTypographyProps={{ fontWeight: 600 }}
                        />
                        <ChevronRight color="action" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding sx={{ mb: 2 }}>
                    <ListItemButton
                        onClick={() => onNavigate("country")}
                        sx={{
                            bgcolor: "white",
                            borderRadius: "12px",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                            border: "1px solid",
                            borderColor: "grey.100",
                            py: 2
                        }}
                    >
                        <ListItemIcon>
                            <Public color="primary" fontSize="large" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Change country"
                            secondary="Update country wish to ship"
                            primaryTypographyProps={{ fontWeight: 600 }}
                        />
                        <ChevronRight color="action" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => onNavigate("currency")}
                        sx={{
                            bgcolor: "white",
                            borderRadius: "12px",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                            border: "1px solid",
                            borderColor: "grey.100",
                            py: 2
                        }}
                    >
                        <ListItemIcon>
                            <CreditCard color="primary" fontSize="large" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Change currency"
                            secondary="Update currency preferences"
                            primaryTypographyProps={{ fontWeight: 600 }}
                        />
                        <ChevronRight color="action" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );
}
