"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Radio,
    Paper,
    TextField,
    InputAdornment,
    IconButton,
    CircularProgress,
    Avatar
} from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Public, ArrowBack, LocationOn } from "@mui/icons-material";
import { getCourierCompanies, updatePreferences, getUserPreferences } from "@/lib/api.service";
import { toast } from "sonner";
import { useDetectUserLocation } from "@/store/useDetectUserLocation";

interface CourierCompany {
    id: string;
    name: string;
    address: string;
    country_id: string;
    country_name: string;
    country_code: string;
}

interface CountrySelectionViewProps {
    onBack?: () => void;
    showBackButton?: boolean;
}

export default function CountrySelectionView({ onBack, showBackButton }: CountrySelectionViewProps) {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [couriers, setCouriers] = useState<CourierCompany[]>([]);
    const [currentCourierId, setCurrentCourierId] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCourierCompanies();
                setCouriers(response);

                if (user?.id) {
                    const prefs = await getUserPreferences(user.id);
                    if (prefs?.courier_id) {
                        setCurrentCourierId(prefs.courier_id);
                    } else if (prefs?.courier?.id) {
                        setCurrentCourierId(prefs.courier.id);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch couriers or preferences", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.id]);

    const filteredCouriers = couriers.filter(courier =>
        courier.country_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courier.country_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courier.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCourierSelect = async (courier: CourierCompany) => {
        if (updatingId || courier.id === currentCourierId) return;

        setUpdatingId(courier.id);
        try {
            if (user?.id) {
                await updatePreferences({
                    user_id: user.id,
                    courier_id: courier.id
                });
            }

            useDetectUserLocation.setState({
                countryName: courier.country_name,
                countryCode: courier.country_code,
                isLoaded: true
            });

            setCurrentCourierId(courier.id);
            toast.success(`Active location updated to ${courier.country_name}`);
        } catch (error) {
            console.error("Failed to update location preference", error);
            toast.error("Failed to update location preference");
        } finally {
            setUpdatingId(null);
        }
    };

    const getFlagUrl = (code: string) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                {showBackButton && (
                    <IconButton onClick={onBack} size="small" edge="start" sx={{ mr: 1, color: "grey.700" }}>
                        <ArrowBack />
                    </IconButton>
                )}
                <Typography variant="h5" sx={{ fontWeight: 700, color: "grey.900" }}>
                    Change Country
                </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: "grey.600", mb: 3 }}>
                Select your preferred shipping country and courier location. This updates available products and shipping options.
            </Typography>

            <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: "12px", bgcolor: "grey.50" }}>
                <TextField
                    fullWidth
                    placeholder="Search country or location..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search sx={{ color: "grey.500" }} />
                            </InputAdornment>
                        ),
                        sx: { bgcolor: "white" }
                    }}
                />
            </Paper>

            <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden", mb: 4 }}>
                {loading ? (
                    <Box sx={{ p: 4, textAlign: "center" }}>
                        <CircularProgress size={32} />
                    </Box>
                ) : (
                    <List disablePadding>
                        {filteredCouriers.map((courier, index) => {
                            const isSelected = currentCourierId === courier.id;
                            const isUpdating = updatingId === courier.id;

                            return (
                                <ListItem key={courier.id} disablePadding divider={index !== filteredCouriers.length - 1}>
                                    <ListItemButton
                                        selected={isSelected}
                                        onClick={() => handleCourierSelect(courier)}
                                        disabled={!!updatingId}
                                        sx={{
                                            py: 2,
                                            px: 3,
                                            "&.Mui-selected": {
                                                bgcolor: "primary.50",
                                                "&:hover": { bgcolor: "primary.100" }
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 50 }}>
                                            <Avatar
                                                src={getFlagUrl(courier.country_code || "")}
                                                sx={{
                                                    width: 28,
                                                    height: 28,
                                                    border: "1px solid rgba(0,0,0,0.1)",
                                                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                                                }}
                                            >
                                                <Public fontSize="small" />
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <Typography sx={{ fontWeight: isSelected ? 600 : 500 }}>
                                                        {courier.country_name}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: "grey.500" }}>
                                                        ({courier.name})
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5, mt: 0.5 }}>
                                                    <LocationOn sx={{ fontSize: "0.875rem", color: "grey.400", mt: 0.2 }} />
                                                    <Typography variant="body2" sx={{ fontSize: "0.75rem", color: "grey.600" }}>
                                                        {courier.address}
                                                    </Typography>
                                                </Box>
                                            }
                                            primaryTypographyProps={{ component: "div" }}
                                            secondaryTypographyProps={{ component: "div" }}
                                        />
                                        <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                                            {isUpdating ? (
                                                <CircularProgress size={20} thickness={5} />
                                            ) : isSelected ? (
                                                <Radio checked={true} size="small" />
                                            ) : (
                                                <Radio checked={false} size="small" />
                                            )}
                                        </Box>
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                        {filteredCouriers.length === 0 && (
                            <Box sx={{ p: 4, textAlign: "center" }}>
                                <Typography variant="body2" color="text.secondary">
                                    No results found matching "{searchTerm}"
                                </Typography>
                            </Box>
                        )}
                    </List>
                )}
            </Paper>
        </Box>
    );
}
