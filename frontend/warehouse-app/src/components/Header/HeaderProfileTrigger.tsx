"use client";

import React from "react";
import { Avatar, Box, IconButton } from "@mui/material";

interface HeaderProfileTriggerProps {
  currentUser: any;
  open: boolean;
  handleProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
}

const HeaderProfileTrigger = ({
  currentUser,
  open,
  handleProfileMenuOpen,
}: HeaderProfileTriggerProps) => {
  return (
    <div className="flex items-center space-x-2">
      {currentUser ? (
        <>
          <Box>
            <p className="px-1 py-2 text-sm font-medium rounded-md transition-all duration-200">
              Welcome,{" "}
              <span style={{ textTransform: "capitalize" }}>
                {currentUser?.name || "User"}
              </span>
            </p>
          </Box>

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
                },
              }}
            >
              {currentUser.name?.charAt(0) ||
                currentUser.email?.charAt(0) ||
                "U"}
            </Avatar>
          </IconButton>
        </>
      ) : (
        <div className="w-8 h-8 bg-white bg-opacity-20 text-white rounded-full flex items-center justify-center font-medium text-sm cursor-pointer hover:bg-opacity-30 transition-colors">
          ?
        </div>
      )}
    </div>
  );
};

export default HeaderProfileTrigger;