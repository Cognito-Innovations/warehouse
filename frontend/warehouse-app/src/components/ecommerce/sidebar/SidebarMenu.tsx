import React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

export interface MenuItem {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

interface SidebarMenuProps {
  items: MenuItem[];
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ items }) => {
  return (
    <List disablePadding>
      {items.map((item, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton onClick={item.onClick} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40, color: "text.secondary" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={
                <Typography variant="body2" fontWeight={500} color="text.primary">
                  {item.label}
                </Typography>
              } 
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default SidebarMenu;