"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
    Menu,
    Typography,
    Box,
    Button,
    Divider,
} from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import { ROUTES } from "@/utils/constants";
import useLocationStore from "@/store/locationStore";


interface HeaderLocationMenuProps {
    locationAnchorEl: null | HTMLElement;
    isLocationMenuOpen: boolean;
    handleLocationClose: () => void;
    selectedAddress: any;
    countryCode: string;
}

const HeaderLocationMenu: React.FC<HeaderLocationMenuProps> = ({
    locationAnchorEl,
    isLocationMenuOpen,
    handleLocationClose,
    selectedAddress,
    countryCode,
}) => {
    const router = useRouter();
    const { userLocation } = useLocationStore();

    const handleChangeLocation = () => {
        router.push(`${ROUTES.PROFILE}?view=country`);
        handleLocationClose();
    };

    const login = () => {
        router.push(`${ROUTES.SIGN_IN}`);
    };

    const displayCountry = selectedAddress?.country_name || countryCode || userLocation.countryName || "None";

    return (
        <Menu
            id="location-menu"
            anchorEl={locationAnchorEl}
            open={isLocationMenuOpen}
            onClose={handleLocationClose}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    minWidth: 320,
                    "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        left: { xs: "63%", md: "50%" },
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) translateX(-50%) rotate(45deg)",
                        zIndex: 0,
                    },
                },
            }}
            transformOrigin={{ horizontal: "center", vertical: "top" }}
            anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        >
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <LocationOn fontSize="small" color="primary" />
                    <Typography variant="subtitle1" fontWeight="bold">
                        Shipping from
                    </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />

                {selectedAddress?.id ? (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                            {selectedAddress.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {selectedAddress.address}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {selectedAddress.country_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {selectedAddress.phone_number}
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Currently selected country: <span className="font-bold">{displayCountry}</span>
                        </Typography>
                    </Box>
                )}

               { selectedAddress ? <Button
                    variant="outlined"
                    fullWidth
                    size="small"
                    onClick={handleChangeLocation}
                    sx={{ textTransform: "none" }}
                >
                    Change Location
                </Button> : <Button
                    variant="outlined"
                    fullWidth
                    size="small"
                    onClick={login}
                    sx={{ textTransform: "none" }}
                >
                    Login
                </Button>}
            </Box>
        </Menu>
    );
};

export default HeaderLocationMenu;
