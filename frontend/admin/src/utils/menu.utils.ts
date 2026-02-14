import type { MenuItem, UserRole } from '../data/menuItems';

export const isRoleAllowed = (
  roles: UserRole[] | undefined,
  userRole?: UserRole
): boolean => {
  return !roles || roles.includes(userRole as UserRole);
};

export const filterSubMenuByRole = (
  subMenu: MenuItem['subMenu'],
  userRole?: UserRole
) => {
  if (!subMenu) return undefined;

  return subMenu.filter(subItem =>
    isRoleAllowed(subItem.roles, userRole)
  );
};

export const isMenuItemVisible = (
  item: MenuItem,
  userRole?: UserRole
): boolean => {
  if (!isRoleAllowed(item.roles, userRole)) {
    return false;
  }

  const hasVisibleChildren = item.subMenu && item.subMenu.length > 0;
  return Boolean(item.path || hasVisibleChildren);
};

export const getVisibleMenuItems = (
  menuItems: MenuItem[],
  userRole?: UserRole
): MenuItem[] => {
  return menuItems
    .map(item => ({
      ...item,
      subMenu: filterSubMenuByRole(item.subMenu, userRole),
    }))
    .filter(item => isMenuItemVisible(item, userRole));
};