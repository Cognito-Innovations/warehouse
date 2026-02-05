import React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { usePathname } from "next/navigation";

export interface MenuItem {
  icon?: React.ReactNode;
  label: string;
  path?: string;
  onClick?: () => void;
  children?: MenuItem[];
}

interface SidebarMenuProps {
  items: MenuItem[];
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ items }) => {
  const pathname = usePathname();
  const theme = useTheme();

  const fontStyle = {
    fontWeight: 500,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  };

  return (
    <List disablePadding>
      {items.map((item, index) => {
        const isActive = pathname === item.path;

        return (
          <React.Fragment key={index}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={item.onClick}
                sx={{
                  py: 1.5,
                  ...(isActive && {
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                  }),
                  "&:hover": {
                    bgcolor: isActive ? "primary.main" : theme.palette.action.hover,
                    color: isActive ? "primary.contrastText" : "text.primary",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? "inherit" : "text.secondary",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={fontStyle}>
                      {item.label}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
            
            {item.children && (
              <List disablePadding sx={{ pl: 4 }}>
                {item.children.map((child, idx) => {
                  const childActive = pathname === child.path;
                  return (
                    <ListItem key={idx} disablePadding>
                      <ListItemButton
                        onClick={child.onClick}
                        sx={{
                          py: 1,
                          ...(childActive && {
                            bgcolor: "primary.light",
                            color: "primary.contrastText",
                          }),
                          "&:hover": {
                            bgcolor: childActive ? "primary.main" : theme.palette.action.hover,
                            color: childActive ? "primary.contrastText" : "text.primary",
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 40,
                            color: childActive ? "inherit" : "text.secondary",
                          }}
                        >
                          {child.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={fontStyle}>
                              {child.label}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            )}
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default SidebarMenu;