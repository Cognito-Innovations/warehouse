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
    CircularProgress
} from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { Search, ArrowBack } from "@mui/icons-material";
import { getCurrencies, updatePreferences, getUserPreferences } from "@/lib/api.service";
import { toast } from "sonner";
import { useDetectUserLocation } from "@/hooks/useEffectiveUserLocation";

interface Currency {
    id: string;
    name: string;
    currency_symbol: string;
    code?: string;
}

interface CurrencySelectionViewProps {
    onBack?: () => void;
    showBackButton?: boolean;
}

export default function CurrencySelectionView({ onBack, showBackButton }: CurrencySelectionViewProps) {
    const { currencyCode } = useDetectUserLocation();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [currentCurrencyId, setCurrentCurrencyId] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currenciesPromise = getCurrencies();
                
                const prefsPromise = user?.id 
                    ? getUserPreferences(user.id) 
                    : Promise.resolve(null);

                const [currenciesData, prefsData] = await Promise.all([
                    currenciesPromise,
                    prefsPromise
                ]);

                setCurrencies(currenciesData);

                let selectedId = "";

                if (prefsData?.currency?.id) {
                    selectedId = prefsData.currency.id;
                } 
                else if (currencyCode) {
                    const localMatch = currenciesData.find(
                        (c: Currency) => c.code === currencyCode
                    );
                    if (localMatch) selectedId = localMatch.id;
                }
                if (selectedId) {
                    setCurrentCurrencyId(selectedId);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.id, currencyCode]);

    const filteredCurrencies = currencies.filter(currency =>
        currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        currency.currency_symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCurrencySelect = async (currency: Currency) => {
        if (updatingId || currency.id === currentCurrencyId) return;

        setUpdatingId(currency.id);
        const previousId = currentCurrencyId;
        setCurrentCurrencyId(currency.id);

        try {
            //TODO P0: Uncomment this when the currency selection view is implemented
            // setUserLocation({
            //     ...userLocation,
            //     currency: currency.currency_symbol 
            // });

            if (user?.id) {
                await updatePreferences({
                    user_id: user.id,
                    currency_id: currency.id
                });
            }
            toast.success(`Currency updated to ${currency.name}`);
        } catch (error) {
            console.error("Failed to update currency preference", error);
            toast.error("Failed to update currency preference");
            setCurrentCurrencyId(previousId);
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                {showBackButton && (
                    <IconButton onClick={onBack} size="small" edge="start" sx={{ mr: 1, color: "grey.700" }}>
                        <ArrowBack />
                    </IconButton>
                )}
                <Typography variant="h5" sx={{ fontWeight: 700, color: "grey.900" }}>
                    Change Currency
                </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: "grey.600", mb: 3 }}>
                Select your preferred currency for browsing prices across the store.
            </Typography>

            <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: "12px", bgcolor: "grey.50" }}>
                <TextField
                    fullWidth
                    placeholder="Search currency..."
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
                        {filteredCurrencies.map((currency, index) => {
                            const isSelected = currentCurrencyId === currency.id;
                            const isUpdating = updatingId === currency.id;

                            return (
                                <ListItem key={currency.id} disablePadding divider={index !== filteredCurrencies.length - 1}>
                                    <ListItemButton
                                        selected={isSelected}
                                        onClick={() => handleCurrencySelect(currency)}
                                        disabled={!!updatingId}
                                        sx={{
                                            py: 1.5,
                                            "&.Mui-selected": {
                                                bgcolor: "primary.50",
                                                "&:hover": { bgcolor: "primary.100" }
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            <Box sx={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: "50%",
                                                bgcolor: isSelected ? "primary.main" : "grey.200",
                                                color: isSelected ? "white" : "grey.600",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "1rem",
                                                fontWeight: "bold",
                                                boxShadow: isSelected ? "0 2px 4px rgba(0,0,0,0.1)" : "none"
                                            }}>
                                                {currency.currency_symbol}
                                            </Box>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={currency.name}
                                            secondary={""}
                                            primaryTypographyProps={{
                                                fontWeight: isSelected ? 600 : 500,
                                                color: isSelected ? "primary.main" : "text.primary"
                                            }}
                                            secondaryTypographyProps={{
                                                fontSize: "0.75rem"
                                            }}
                                        />
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            {isUpdating ? (
                                                <CircularProgress size={20} thickness={5} />
                                            ) : isSelected ? (
                                                <Radio checked={true} size="small" />
                                            ) : null}
                                        </Box>
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                        {filteredCurrencies.length === 0 && (
                            <Box sx={{ p: 4, textAlign: "center" }}>
                                <Typography variant="body2" color="text.secondary">
                                    No currencies found matching "{searchTerm}"
                                </Typography>
                            </Box>
                        )}
                    </List>
                )}
            </Paper>
        </Box>
    );
}
