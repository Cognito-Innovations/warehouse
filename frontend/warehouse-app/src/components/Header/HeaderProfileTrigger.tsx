"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Person, Public as WorldIcon } from "@mui/icons-material";
import ReactCountryFlag from "react-country-flag";
import { Avatar, Box, IconButton, Button } from "@mui/material";
import { alpha3ToAlpha2, fkAttention } from "@/lib/header.utils";

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
  const [showChangeCountry, setShowChangeCountry] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChangeCountry(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    const returnTo = `${window.location.pathname}${window.location.search}`;
    const callback = encodeURIComponent(returnTo);
    router.push(`/sign-in?callbackUrl=${callback}`);
  };

  const handleChangeCountryClick = () => {
    setShowChangeCountry(false);

    const targetPath = "/profile?view=country";

    if (currentUser) {
      router.push(targetPath);
    } else {
      const callback = encodeURIComponent(targetPath);
      router.push(`/sign-in?callbackUrl=${callback}`);
    }
  };

  const alpha2Code = countryCode.length === 3 ? alpha3ToAlpha2[countryCode] : countryCode;

  return (
    <div className="flex items-center space-x-2">
      <Box
        sx={{
          position: "relative",
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

            <span
              onClick={handleLocationClick || handleProfileMenuOpen}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                position: "relative",
                zIndex: 1,
              }}>
              {alpha2Code ? (
                <ReactCountryFlag
                  countryCode={alpha2Code}
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
              ) : (
                <WorldIcon
                  style={{
                    width: "1.5em",
                    height: "1.5em",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                    color: "gray",
                  }}
                  titleAccess={countryName}
                />
              )}

              {countryCode && countryName && showChangeCountry && (
                <Box
                  onClick={handleChangeCountryClick}
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: { xs: "50%", sm: "50%" },
                    transform: "translateX(-50%)",
                    mt: "8px",
                    zIndex: 1300,
                    background: "linear-gradient(180deg, #2874f0 0%, #1b5fd1 100%)",
                    color: "#fff",
                    px: { xs: 2.25, sm: 2.25 },
                    py: "4px",
                    borderRadius: "999px",
                    fontSize: { xs: "11px", sm: "12px" },
                    fontWeight: 600,
                    letterSpacing: "0.2px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    boxShadow:
                      "0 6px 12px rgba(40,116,240,0.35), inset 0 1px 0 rgba(255,255,255,0.25)",
                    animation: `${fkAttention} 1s ease-in-out`,
                    maxWidth: { xs: "calc(100vw - 32px)", sm: "none" },
                    "&:hover": {
                      animation: "none",
                      background:
                        "linear-gradient(180deg, #1b5fd1 0%, #174ea6 100%)",
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "-6px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 0,
                      height: 0,
                      borderLeft: "6px solid transparent",
                      borderRight: "6px solid transparent",
                      borderBottom: "6px solid #2874f0",
                    },
                  }}
                >
                  Change
                  {alpha2Code && (
                    <ReactCountryFlag
                      countryCode={alpha2Code}
                      svg
                      style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1px solid rgba(255,255,255,0.3)",
                      }}
                    />
                  )}
                  
                </Box>
              )}
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