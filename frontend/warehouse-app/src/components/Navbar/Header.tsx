"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ReactCountryFlag from "react-country-flag";
import AddressDetailsModal from "../Modals/AddressDetailsModal/AddressDetailsModal";
import SavedAddressesModalTailwind from "../Modals/SavedAddressesModal/SavedAddressesModal";
import HeaderAddressSection from "./HeaderAddressSection";
import AddressSection from "./AddressSection";
import { Notifications as NotificationsIcon } from "@mui/icons-material";

interface AddressData {
  id?: string;
  companyName: string;
  suite: string;
  address: string;
  country: string;
  phone: string;
}

const Header = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "My Suite", path: "/dashboard" },
    { name: "Assisted Shopping", path: "/assisted-shopping" },
    { name: "Pickup Request", path: "/pickup-request" },
    { name: "Stores", path: "/stores" },
    { name: "Rate Calculator", path: "/rate-calculator" },
  ];

  // Address state
  const [isSavedAddressesModalOpen, setIsSavedAddressesModalOpen] =
    useState(false);
  const [isAddressDetailsModalOpen, setIsAddressDetailsModalOpen] =
    useState(false);
  const [addressData, setAddressData] = useState<AddressData>({
    companyName: "India Tech Hub",
    suite: "SUITE 500-600",
    address: "123 Tech Park, Bangalore",
    country: "India",
    phone: "+91 98765 43210",
  });

  // Sample saved addresses
  const defaultSavedAddresses: AddressData[] = [
    {
      id: "1",
      companyName: "India Tech Hub",
      suite: "SUITE 500-600",
      address: "123 Tech Park, Bangalore",
      country: "India",
      phone: "+91 98765 43210",
    },
    {
      id: "2",
      companyName: "Tech Corp",
      suite: "SUITE 100-200",
      address: "123 Business Ave, Downtown",
      country: "United States",
      phone: "+1 555-0123",
    },
    {
      id: "3",
      companyName: "Global Ltd",
      suite: "SUITE 50-75",
      address: "456 Commerce St, City Center",
      country: "United Kingdom",
      phone: "+44 20 7946 0958",
    },
    {
      id: "4",
      companyName: "Asia Pacific",
      suite: "SUITE 300-400",
      address: "789 Innovation Rd, Tech District",
      country: "Singapore",
      phone: "+65 6123 4567",
    },
    {
      id: "5",
      companyName: "Neurs HQ",
      suite: "SUITE 880-476",
      address: "204ho, 10-5, Siheung-daero 149ga-gil",
      country: "South Korea",
      phone: "+82 1026708860",
    },
  ];

  const finalSavedAddresses = defaultSavedAddresses;

  const handleOpenSavedAddressesModal = () => {
    setIsSavedAddressesModalOpen(true);
  };

  const handleCloseSavedAddressesModal = () => {
    setIsSavedAddressesModalOpen(false);
  };

  const handleSelectSavedAddress = (selectedAddress: AddressData) => {
    setAddressData(selectedAddress);
  };

  const handleOpenAddressDetailsModal = () => {
    setIsAddressDetailsModalOpen(true);
  };

  const handleCloseAddressDetailsModal = () => {
    setIsAddressDetailsModalOpen(false);
  };

  const [selectedCountry, setSelectedCountry] = useState("India");
  const [isClient, setIsClient] = useState(false);

  // FIX THISSS

  // // Set client flag and load from localStorage on mount
  // useEffect(() => {
  //   setIsClient(true);
  //   if (typeof window !== 'undefined') {
  //     const savedCountry = localStorage.getItem('selectedLocation');
  //     if (savedCountry) {
  //       setSelectedCountry(savedCountry);
  //     }
  //   }
  // }, []);

  // // Handle currentCountry prop changes
  // useEffect(() => {
  //   if (selected && currentCountry !== selectedCountry) {
  //     setSelectedCountry(addressData);
  //     // Save to localStorage when changed via prop
  //     if (typeof window !== 'undefined') {
  //       localStorage.setItem('selectedLocation', currentCountry);
  //     }
  //   }
  // }, [addressData, selectedCountry]);

  return (
    <>
      {/* Navigation Header */}
      <header className="bg-purple-700 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">
          {/* Logo */}
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
          addressData={addressData}
          onOpenSavedAddressesModal={handleOpenSavedAddressesModal}
          onOpenAddressDetailsModal={handleOpenAddressDetailsModal}
        />
      )}

      {/* Modals */}
      <SavedAddressesModalTailwind
        isOpen={isSavedAddressesModalOpen}
        onClose={handleCloseSavedAddressesModal}
        onSelectAddress={handleSelectSavedAddress}
        savedAddresses={finalSavedAddresses}
      />

      <AddressDetailsModal
        isOpen={isAddressDetailsModalOpen}
        onClose={handleCloseAddressDetailsModal}
        addressData={addressData}
      />
    </>
  );
};

export default Header;
