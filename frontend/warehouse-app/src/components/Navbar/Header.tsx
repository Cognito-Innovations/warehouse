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
  const pathname = usePathname();

  const navItems = [
    { name: "My Suite", path: "/dashboard" },
    { name: "Assisted Shopping", path: "/assisted-shopping" },
    { name: "Pickup Request", path: "/pickup-request" },
    { name: "Stores", path: "/stores" },
    { name: "Rate Calculator", path: "/rate-calculator" },
  ];

  // Address state
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [isSavedAddressesModalOpen, setIsSavedAddressesModalOpen] = useState(false);
  const [isAddressDetailsModalOpen, setIsAddressDetailsModalOpen] = useState(false);
  const [addressData, setAddressData] = useState<AddressData>({} as AddressData);

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

  const fetchSavedAddresses = async () => {
    const savedAddresses = await getCourierCompanies();
    if(!Object.keys(addressData).length ){
      handleSelectSavedAddress(savedAddresses[0]);
    }
    setAddresses(savedAddresses);
  };

  useEffect(() => {
    fetchSavedAddresses();
  }, []);


  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const savedAddress = localStorage.getItem('selectedAddress');
      if (savedAddress) {
        try {
          const parsedAddress = JSON.parse(savedAddress);
          setAddressData(parsedAddress);
          setSelectedCountry(parsedAddress.country_name);
        } catch (error) {
          console.error('Error parsing saved address from localStorage:', error);
        }
      }
    }
  }, []);
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      localStorage.setItem('selectedAddress', JSON.stringify(addressData));
      setSelectedCountry(addressData.country_name);
    }
  }, [addressData, isClient]);

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
        savedAddresses={addresses}
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
