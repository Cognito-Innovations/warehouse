import { ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import type { MenuItem } from "../../data/menuItems";

interface MenuItemProps {
  item: MenuItem;
  isActive: boolean;
  onClick: () => void;
}

const MenuItemComponent: React.FC<MenuItemProps> = ({ item, isActive: isParentActive, onClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isCurrentPathActive = item.path ? location.pathname === item.path : false;
  const isDefaultPathActive = item.defaultPath ? location.pathname === item.defaultPath : false;
  const isActive = isCurrentPathActive || isDefaultPathActive || isParentActive;
  const hasSubMenu = !!item.subMenu;

  const handleClick = () => {
    if (hasSubMenu) {
      // If it has a defaultPath, navigate to it first
      if (item.defaultPath) {
        navigate(item.defaultPath);
      }
      onClick();
    } else if (item.path) {
      navigate(item.path);
      onClick(); // Close any open sub-menus
    }
  };

  return (
    <ListItemButton 
      onClick={handleClick}
      sx={{ 
        borderRadius: 2, 
        bgcolor: isActive ? '#f1f5f9' : 'transparent', 
        color: isActive ? '#6366f1' : '#64748b', 
        minHeight: 48, 
        justifyContent: 'center', 
        px: 1.5, 
        mb: 0.5,
        '&:hover': { 
          bgcolor: isActive ? '#f1f5f9' : '#f8fafc' 
        },
        border: isActive ? '1px solid #e2e8f0' : 'none',
      }}
    >
      <Tooltip title={item.text} placement="right">
        <ListItemIcon sx={{ 
          color: 'inherit', 
          minWidth: 'auto', 
          justifyContent: 'center' 
        }}>
          <item.icon fontSize="small" />
        </ListItemIcon>
      </Tooltip>
    </ListItemButton>
  );
};
 
export default MenuItemComponent;