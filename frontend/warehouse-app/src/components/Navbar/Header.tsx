"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ReactCountryFlag from "react-country-flag";
import AddressDetailsModal from "../Modals/AddressDetailsModal/AddressDetailsModal";
import SavedAddressesModalTailwind from "../Modals/SavedAddressesModal/SavedAddressesModal";
import HeaderAddressSection from "./HeaderAddressSection";
import AddressSection from "./AddressSection";
import { Notifications as NotificationsIcon, AccountCircle, Logout } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { Avatar, Menu, MenuItem, IconButton, ListItemIcon, ListItemText, Box, Typography, Divider, Badge } from "@mui/material";

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
  const router = useRouter();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const notificationOpen = Boolean(notificationAnchorEl);

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

  // Get current user data from AuthContext
  const currentUser = user;

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleProfileClick = () => {
    router.push('/profile');
    handleProfileMenuClose();
  };

  const handleLogoutClick = () => {
    logout();
    handleProfileMenuClose();
  };

  const handleNotificationsClick = () => {
    router.push('/notifications');
    handleProfileMenuClose();
  };

  const handleNotificationItemClick = (notificationId: string) => {
    // Handle individual notification click
    console.log('Notification clicked:', notificationId);
    handleNotificationMenuClose();
  };


  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const savedAddress = localStorage.getItem('selectedAddress');
      if (savedAddress) {
        try {
          const parsedAddress = JSON.parse(savedAddress);
          setAddressData(parsedAddress);
          setSelectedCountry(parsedAddress.country);
        } catch (error) {
          console.error('Error parsing saved address from localStorage:', error);
        }
      }
    }
  }, []);

  // Close dropdowns on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (open) {
        setAnchorEl(null);
      }
      if (notificationOpen) {
        setNotificationAnchorEl(null);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [open, notificationOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Check if click is outside both dropdowns
      if (open && !target.closest('#profile-menu') && !target.closest('[aria-controls="profile-menu"]')) {
        setAnchorEl(null);
      }
      
      if (notificationOpen && !target.closest('#notification-menu') && !target.closest('[aria-controls="notification-menu"]')) {
        setNotificationAnchorEl(null);
      }
    };

    if (typeof window !== 'undefined') {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [open, notificationOpen]);

  // Close dropdowns when window loses focus
  useEffect(() => {
    const handleWindowBlur = () => {
      if (open) {
        setAnchorEl(null);
      }
      if (notificationOpen) {
        setNotificationAnchorEl(null);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('blur', handleWindowBlur);
      return () => {
        window.removeEventListener('blur', handleWindowBlur);
      };
    }
  }, [open, notificationOpen]);
  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      localStorage.setItem('selectedAddress', JSON.stringify(addressData));
      setSelectedCountry(addressData.country);
    }
  }, [addressData, isClient]);

  return (
    <>
      {/* Navigation Header */}
      <header className="bg-purple-700 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-white hover:opacity-80 transition-opacity">
            shopme
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
                  <Typography variant="h6" component="div">
                    Welcome, {currentUser?.name || "User"}
                  </Typography>
                </Box>
                <IconButton 
                  onClick={handleNotificationMenuOpen}
                  className="p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
                  aria-controls={notificationOpen ? 'notification-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={notificationOpen ? 'true' : undefined}
                >
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon className="w-6 h-6" />
                  </Badge>
                </IconButton>
                <IconButton onClick={handleProfileMenuOpen} className="p-0" aria-controls={open ? 'profile-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined}>
                  <Avatar
                    src={currentUser.image}
                    alt={currentUser.name}
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                        border: '2px solid rgba(255, 255, 255, 0.5)',
                      }
                    }}
                  >
                    {currentUser.name?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
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

      {/* Profile Dropdown Menu */}
      <Menu id="profile-menu" anchorEl={anchorEl} open={open} onClose={handleProfileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            minWidth: 250,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* User Info Section */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            {currentUser?.name || 'User Name'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            {currentUser?.email || 'user@example.com'}
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
            <Logout fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Sign Out</ListItemText>
        </MenuItem>
      </Menu>

      {/* Notifications Dropdown Menu */}
      <Menu id="notification-menu" anchorEl={notificationAnchorEl} open={notificationOpen} onClose={handleNotificationMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            minWidth: 300,
            maxHeight: 400,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Notifications Header */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Notifications
          </Typography>
        </Box>

        {/* Sample Notifications */}
        <MenuItem onClick={() => handleNotificationItemClick('1')} sx={{ py: 1.5 }}>
          <ListItemText 
            primary="New package arrived"
            secondary="Your package from Amazon has been delivered to your suite."
            primaryTypographyProps={{ fontSize: '0.875rem' }}
            secondaryTypographyProps={{ fontSize: '0.75rem' }}
          />
        </MenuItem>

        <MenuItem onClick={() => handleNotificationItemClick('2')} sx={{ py: 1.5 }}>
          <ListItemText 
            primary="Pickup request confirmed"
            secondary="Your pickup request #12345 has been confirmed for tomorrow."
            primaryTypographyProps={{ fontSize: '0.875rem' }}
            secondaryTypographyProps={{ fontSize: '0.75rem' }}
          />
        </MenuItem>

        <MenuItem onClick={() => handleNotificationItemClick('3')} sx={{ py: 1.5 }}>
          <ListItemText 
            primary="Rate calculation ready"
            secondary="Your shipping rate calculation is now available."
            primaryTypographyProps={{ fontSize: '0.875rem' }}
            secondaryTypographyProps={{ fontSize: '0.75rem' }}
          />
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleNotificationsClick} sx={{ py: 1.5, textAlign: 'center' }}>
          <ListItemText primary="View All Notifications" sx={{ textAlign: 'center' }} />
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
