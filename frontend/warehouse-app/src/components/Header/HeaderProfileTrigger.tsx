"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Person } from "@mui/icons-material";
import ReactCountryFlag from "react-country-flag";
import { Avatar, Box, IconButton, Button } from "@mui/material";
import { getUserPreferences } from "@/lib/api.service";

interface HeaderProfileTriggerProps {
  countryName: string;
  countryCode: string;
  currentUser: any;
  open: boolean;
  handleProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleLocationClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const HeaderProfileTrigger = ({
  countryName,
  countryCode,
  currentUser,
  open,
  handleProfileMenuOpen,
  handleLocationClick,
}: HeaderProfileTriggerProps) => {

  const router = useRouter();

  const handleLogin = () => {
    const returnTo = `${window.location.pathname}${window.location.search}`;
    const callback = encodeURIComponent(returnTo);
    router.push(`/sign-in?callbackUrl=${callback}`);
  };


  return (
    <div className="flex items-center space-x-2">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          mr: { xs: 0.5, sm: 1 },
        }}
      >

        {countryCode && countryName && (
          <>
            <span className="text-gray-900 text-sm opacity-80">
              Ship from:
            </span>

            <span onClick={handleLocationClick || handleProfileMenuOpen} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
              <ReactCountryFlag
                countryCode={countryCode}
                svg
                style={{
                  width: "1.5em",
                  height: "1.5em",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                }}
                title={countryName}
              />
            </span>
          </>
        )}
        <span className="hidden md:block text-gray-900 text-sm font-medium ml-1">
          {countryCode === "AE" ? "UAE" : countryCode}
        </span>
      </Box>

      {currentUser ? (
        <IconButton
          onClick={handleProfileMenuOpen}
          className="p-0"
          aria-controls={open ? "profile-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            src={currentUser.image}
            alt={currentUser.name}
            imgProps={{ referrerPolicy: "no-referrer" }}
            sx={{
              width: 32,
              height: 32,
              bgcolor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
              border: "2px solid rgba(255, 255, 255, 0)",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.3)",
                border: "2px solid rgba(255, 255, 255, 0.5)",
              },
            }}
          >
            <Person sx={{ color: "Black" }} />
          </Avatar>
        </IconButton>
      ) : (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={handleLogin}
          sx={{
            textTransform: "none",
            borderRadius: 20,
            px: 2,
            py: 0.5,
            borderColor: "primary.main",
            color: "primary.main",
            "&:hover": {
              borderColor: "primary.dark",
              bgcolor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          Login
        </Button>
      )}
    </div>
  );
};

export default HeaderProfileTrigger;