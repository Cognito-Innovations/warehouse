"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAddressAPI } from "@/hooks/useAddressAPI";
import { useAddressForm } from "@/hooks/useAddressForm";
import { AddressData } from "../../contexts/AddressContext";
import { useAuth } from "../../contexts/AuthContext";
import HeaderLogo from "../Header/HeaderLogo";
import HeaderNavigation from "../Header/HeaderNavigation";
import HeaderProfileTrigger from "../Header/HeaderProfileTrigger";
import HeaderProfileMenu from "../Header/HeaderProfileMenu";
import AddressDetailsModal from "../Modals/AddressDetailsModal/AddressDetailsModal";
import SavedAddressesModal from "../Modals/SavedAddressesModal/SavedAddressesModal";
import HeaderAddressSection from "./HeaderAddressSection";
import { ROUTES } from "@/utils/constants";

const Header = () => {
  const { updateAddress } = useAddressForm();

  const pathname = usePathname();
  const {
    selectedAddress,
    savedAddresses,
    selectAddress,
    selectCountry,
    isLoading,
    error,
  } = useAddressAPI();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSavedAddressesModalOpen, setIsSavedAddressesModalOpen] = useState(false);
  const [isAddressDetailsModalOpen, setIsAddressDetailsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const open = Boolean(anchorEl);
  
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

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    router.push(ROUTES.PROFILE);
    handleProfileMenuClose();
  };

  const handleLogoutClick = () => {
    logout();
    handleProfileMenuClose();
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        open &&
        !target.closest("#profile-menu") &&
        !target.closest('[aria-controls="profile-menu"]')
      ) {
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
      {pathname === "/assisted-shopping/start" ? null : (
        <header className="bg-purple-700 text-white sticky top-0 z-50 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">
            <HeaderLogo />

            <HeaderNavigation />

            <HeaderProfileTrigger
              currentUser={user}
              open={open}
              handleProfileMenuOpen={handleProfileMenuOpen}
            />
          </div>
        </header>
      )}

      {pathname === "/assisted-shopping/create-request" ||
        pathname.startsWith("/pickup-request/") ||
        pathname.startsWith("/assisted-shopping/") ? null : (
          <HeaderAddressSection
            addressData={selectedAddress}
            isLoading={isLoading}
            error={error}
            onOpenSavedAddressesModal={handleOpenSavedAddressesModal}
            onOpenAddressDetailsModal={handleOpenAddressDetailsModal}
          />
        )
      }

      <SavedAddressesModal
        isOpen={isSavedAddressesModalOpen}
        onClose={handleCloseSavedAddressesModal}
        onSelectAddress={handleSelectSavedAddress}
        savedAddresses={savedAddresses}
      />

      <AddressDetailsModal
        isOpen={isAddressDetailsModalOpen}
        onClose={handleCloseAddressDetailsModal}
        addressData={selectedAddress || ({} as AddressData)}
      />

      <HeaderProfileMenu
        currentUser={user}
        anchorEl={anchorEl}
        open={open}
        handleProfileMenuClose={handleProfileMenuClose}
        handleProfileClick={handleProfileClick}
        handleLogoutClick={handleLogoutClick}
      />
    </>
  );
};

export default Header;