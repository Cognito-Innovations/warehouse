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


interface HeaderLocationMenuProps {
    user: any;
    locationAnchorEl: null | HTMLElement;
    isLocationMenuOpen: boolean;
    handleLocationClose: () => void;
    countryCode: string;
}

const HeaderLocationMenu: React.FC<HeaderLocationMenuProps> = ({
    user,
    locationAnchorEl,
    isLocationMenuOpen,
    handleLocationClose,
    countryCode,
}) => {
    const router = useRouter();

    const handleChangeLocation = () => {
      const returnTo = `${ROUTES.PROFILE}?view=country`;
      const callbackUrl = encodeURIComponent(returnTo);

      if (!user?.id) {
        router.push(`${ROUTES.SIGN_IN}?callbackUrl=${callbackUrl}`);
      } else {
        router.push(returnTo);
      }

      handleLocationClose();
    };

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

                
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Currently selected country: <span className="font-bold">{countryCode === "AE" ? "UAE" : countryCode}</span>
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    fullWidth
                    size="small"
                    onClick={handleChangeLocation}
                    sx={{ textTransform: "none" }}
                >
                    Change Location or Currency
                </Button>
            </Box>
        </Menu>
    );
};

export default HeaderLocationMenu;
