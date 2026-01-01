import React from "react";
import { Drawer, Box, Typography, Divider, Avatar, Button } from "@mui/material";
import { AccountCircle, Login } from "@mui/icons-material";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import SidebarMenu, { MenuItem } from "./SidebarMenu";
import { MenuConfig, MENUS } from "@/utils/menus";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { user } = useAuth();
  const router = useRouter();

  const handleNavigation = (path: string, requiresAuth: boolean = true) => {
    let targetPath = path;

    if (requiresAuth && !user) {
      const callbackUrl = encodeURIComponent(targetPath);
      router.push(`/sign-in?callbackUrl=${callbackUrl}`);
    } else {
      router.push(targetPath);
    }
    onClose();
  };

  const mapMenus = (menus: MenuConfig[]): MenuItem[] =>
    menus.map((menu) => ({
      icon: <menu.icon />,
      label: menu.label,
      onClick: () => handleNavigation(menu.path, menu.requiresAuth),
    }));

  const menuGroup1 = mapMenus(MENUS.GROUP_1);
  const menuGroup2 = mapMenus(MENUS.GROUP_2);

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: 280, borderTopRightRadius: 0, borderBottomRightRadius: 0 }
      }}
    >
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mt={1}>
          <Avatar 
            sx={{ 
                bgcolor: "white", 
                color: "primary.main", 
                width: 50, 
                height: 50 
            }}
          >
            {user ? user.name?.[0]?.toUpperCase() : <AccountCircle />}
          </Avatar>
          <Box>
            {user ? (
              <>
                <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2}>
                  Hello, {user.name || "User"}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2}>
                  Welcome Guest
                </Typography>
                <Button 
                    variant="text" 
                    size="small" 
                    onClick={() => router.push("/sign-in")}
                    startIcon={<Login fontSize="small" />}
                    sx={{ 
                        color: "inherit", 
                        p: 0, 
                        minWidth: 0, 
                        mt: 0.5,
                        "&:hover": { bgcolor: "transparent", textDecoration: "underline" }
                    }}
                >
                  Login & Signup
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={{ py: 1 }}>
        <SidebarMenu items={menuGroup1} />
        <Divider sx={{ my: 1 }} />
        <SidebarMenu items={menuGroup2} />
      </Box>
    </Drawer>
  );
};

export default Sidebar;