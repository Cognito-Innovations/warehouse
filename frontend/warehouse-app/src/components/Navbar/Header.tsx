"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AddressDetailsModal from "../Modals/AddressDetailsModal/AddressDetailsModal";
import SavedAddressesModalTailwind from "../Modals/SavedAddressesModal/SavedAddressesModal";
import HeaderAddressSection from "./HeaderAddressSection";
import { AccountCircle, Logout } from "@mui/icons-material";
import { useAddressAPI } from "../../hooks/useAddressAPI";
import { useAddressForm } from "@/hooks/useAddressForm";
import { useAuth } from "../../contexts/AuthContext";
import { Avatar, Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Box, Typography, Divider, Badge } from "@mui/material";

interface AddressData {
  id?: string;
  name: string;
  address: string;
  country_name: string;
  country_code: string;
  country_phone_code: string;
  phone_number: string;
}

const Header = () => {
  const {updateAddress} = useAddressForm();

  const pathname = usePathname();
  const { 
    selectedAddress, 
    savedAddresses,
    selectAddress,
    selectCountry,
    isLoading,
    error
  } = useAddressAPI();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const navItems = [
    { name: "My Suite", path: "/dashboard" },
    { name: "Assisted Shopping", path: "/assisted-shopping" },
    { name: "Pickup Request", path: "/pickup-request" },
  ];

  const displayAddress = selectedAddress;

  // Modal state
  const [isSavedAddressesModalOpen, setIsSavedAddressesModalOpen] = useState(false);
  const [isAddressDetailsModalOpen, setIsAddressDetailsModalOpen] = useState(false);

  const handleOpenSavedAddressesModal = () => {
    setIsSavedAddressesModalOpen(true);
  };

  const handleCloseSavedAddressesModal = () => {
    setIsSavedAddressesModalOpen(false);
  };

  const handleSelectSavedAddress = (address: AddressData) => {
    updateAddress(address);
    selectAddress(address);
  };

  const handleOpenAddressDetailsModal = () => {
    setIsAddressDetailsModalOpen(true);
  };

  const handleCloseAddressDetailsModal = () => {
    setIsAddressDetailsModalOpen(false);
  };

  const [isClient, setIsClient] = useState(false);

  // Get current user data from AuthContext
  const currentUser = user;

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    router.push("/profile");
    handleProfileMenuClose();
  };

  const handleLogoutClick = () => {
    logout();
    handleProfileMenuClose();
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Check if click is outside both dropdowns
      if (open && !target.closest("#profile-menu") && !target.closest("[aria-controls=\"profile-menu\"]")) {
        setAnchorEl(null);
      }
    };

    if (typeof window !== "undefined") {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [open]);

  // Close dropdowns when window loses focus
  useEffect(() => {
    const handleWindowBlur = () => {
      if (open) {
        setAnchorEl(null);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("blur", handleWindowBlur);
      return () => {
        window.removeEventListener("blur", handleWindowBlur);
      };
    }
  }, [open]);

  useEffect(() => {
    if (isClient && typeof window !== "undefined" && selectedAddress) {
      selectCountry(selectedAddress.country_name);
    }
  }, [selectedAddress, isClient]);

  return (
    <>
      {/* Navigation Header */}
      <header className="bg-purple-700 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">
          <Link
            href="/"
            className="text-2xl font-bold text-white hover:opacity-80 transition-opacity"
          >
             <Image src="/palakart.png" alt="Palakart" width={150} height={150} />
          </Link>
          {/* Navigation Items */}
          <nav className="flex-1 flex justify-center">
            <ul className="flex space-x-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${pathname === item.path
                      ? "bg-purple-600 text-white font-semibold"
                      : "text-white hover:bg-white hover:bg-opacity-10"
                      }`}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-2">
            {/* Profile Avatar with Dropdown */}
            {currentUser ? (
              <>
                <Box>
                  <p
                    className="px-1 py-2 text-sm font-medium rounded-md transition-all duration-200"
                  >
                    Welcome, <span style={{textTransform: "capitalize"}}>{currentUser?.name || "User"}</span>
                  </p>
                </Box>

                <IconButton onClick={handleProfileMenuOpen} className="p-0" aria-controls={open ? "profile-menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined}>
                  <Avatar
                    src={currentUser.image}
                    alt={currentUser.name}
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "bold",
                      border: "2px solid rgba(255, 255, 255, 0.3)",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.3)",
                        border: "2px solid rgba(255, 255, 255, 0.5)",
                      }
                    }}
                  >
                    {currentUser.name?.charAt(0) || currentUser.email?.charAt(0) || "U"}
                  </Avatar>
                </IconButton>
              </>
            ) : (
              <div className="w-8 h-8 bg-white bg-opacity-20 text-white rounded-full flex items-center justify-center font-medium text-sm cursor-pointer hover:bg-opacity-30 transition-colors">
                ?
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Address Section */}
      {pathname === "/assisted-shopping/create-request" ||
        pathname.startsWith("/pickup-request/") ||
        pathname.startsWith("/assisted-shopping/") ? null : (
        <HeaderAddressSection
          addressData={displayAddress}
          isLoading={isLoading}
          error={error}
          onOpenSavedAddressesModal={handleOpenSavedAddressesModal}
          onOpenAddressDetailsModal={handleOpenAddressDetailsModal}
        />
      )}

      {/* Modals */}
      <SavedAddressesModalTailwind
        isOpen={isSavedAddressesModalOpen}
        onClose={handleCloseSavedAddressesModal}
        onSelectAddress={handleSelectSavedAddress}
        savedAddresses={savedAddresses}
      />

      <AddressDetailsModal
        isOpen={isAddressDetailsModalOpen}
        onClose={handleCloseAddressDetailsModal}
        addressData={selectedAddress || {} as AddressData}
      />

      {/* Profile Dropdown Menu */}
      <Menu id="profile-menu" anchorEl={anchorEl} open={open} onClose={handleProfileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            minWidth: 250,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: "\"\"",
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* User Info Section */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #e0e0e0" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "text.primary" }}>
            {currentUser?.name || "User Name"}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
            {currentUser?.email || "user@example.com"}
          </Typography>
        </Box>

        {/* Menu Options */}
        <MenuItem onClick={handleProfileClick} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogoutClick} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: "error.main" }} />
          </ListItemIcon>
          <ListItemText sx={{ color: "error.main" }}>Sign Out</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
