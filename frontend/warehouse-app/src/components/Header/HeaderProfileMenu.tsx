"use client";

import React from "react";
import { AccountCircle, Logout } from "@mui/icons-material";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from "@mui/material";

interface HeaderProfileMenuProps {
  currentUser: any;
  anchorEl: null | HTMLElement;
  open: boolean;
  handleProfileMenuClose: () => void;
  handleProfileClick: () => void;
  handleLogoutClick: () => void;
}

const HeaderProfileMenu = ({
  currentUser,
  anchorEl,
  open,
  handleProfileMenuClose,
  handleProfileClick,
  handleLogoutClick,
}: HeaderProfileMenuProps) => {
  return (
    <Menu
      id="profile-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleProfileMenuClose}
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
            content: '""',
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
      <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #e0e0e0" }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: "bold", color: "text.primary" }}
        >
          {currentUser?.name || "User Name"}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontSize: "0.875rem" }}
        >
          {currentUser?.email || "user@example.com"}
        </Typography>
      </Box>

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
  );
};

export default HeaderProfileMenu;