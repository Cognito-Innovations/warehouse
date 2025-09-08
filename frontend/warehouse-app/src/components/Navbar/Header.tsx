"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AddressDetailsModal from "../Modals/AddressDetailsModal/AddressDetailsModal";
import SavedAddressesModalTailwind from "../Modals/SavedAddressesModal/SavedAddressesModal";
import HeaderAddressSection from "./HeaderAddressSection";
import AddressSection from "./AddressSection";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import { getCourierCompanies } from "@/lib/api.service";
import { useAddressAPI } from "../../hooks/useAddressAPI";
import { useAddressForm } from "@/hooks/useAddressForm";

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
    selectedCountry,
    selectAddress,
    selectCountry 
  } = useAddressAPI();

  const navItems = [
    { name: "My Suite", path: "/dashboard" },
    { name: "Assisted Shopping", path: "/assisted-shopping" },
    { name: "Pickup Request", path: "/pickup-request" },
    { name: "Stores", path: "/stores" },
    { name: "Rate Calculator", path: "/rate-calculator" },
  ];

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


  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {/* Navigation Header */}
      <header className="bg-purple-700 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">
          <Link
            href="/"
            className="text-2xl font-bold text-white hover:opacity-80 transition-opacity"
          >
            shopme
          </Link>

          {/* Navigation Items */}
          <nav className="flex-1 flex justify-center">
            <ul className="flex space-x-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      pathname === item.path
                        ? "bg-purple-600 text-white font-semibold"
                        : "text-white hover:bg-white hover:bg-opacity-10"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-full transition-colors">
              <NotificationsIcon className="w-6 h-6" />
            </button>
            <div className="w-8 h-8 bg-white bg-opacity-20 text-white rounded-full flex items-center justify-center font-medium text-sm cursor-pointer hover:bg-opacity-30 transition-colors">
              N
            </div>
          </div>
        </div>
      </header>

      {/* Address Section */}
      {pathname === "/assisted-shopping" ||
      pathname === "/pickup-request" ||
      pathname === "/pickup-request/create-request" ? (
        <AddressSection />
      ) : pathname === "/assisted-shopping/create-request" ||
        pathname.startsWith("/pickup-request/") ||
        pathname.startsWith("/assisted-shopping/") ? null : (
        <HeaderAddressSection
          addressData={selectedAddress || {} as AddressData}
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
    </>
  );
};

export default Header;
