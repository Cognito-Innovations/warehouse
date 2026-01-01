import {
  Inventory2,
  LocalShipping,
  ShoppingBag,
  AssignmentReturn,
  ListAlt,
  ShoppingCart,
  Person,
  SvgIconComponent,
} from "@mui/icons-material";
import { ROUTES } from "@/utils/constants";

export interface MenuConfig {
  icon: SvgIconComponent;
  label: string;
  path: string;
  requiresAuth?: boolean;
}

export const MENUS = {
  GROUP_1: [
    {
      icon: Inventory2,
      label: "Packages",
      path: '/dashboard/packages',
      requiresAuth: true,
    },
    {
      icon: LocalShipping,
      label: "Shipments",
      path: '/dashboard/shipments',
      requiresAuth: true,
    },
    {
      icon: ShoppingBag,
      label: "Assisted Shopping",
      path: '/ecommerce/assisted-shopping',
      requiresAuth: false,
    },
    {
      icon: AssignmentReturn,
      label: "Pickup Requests",
      path: ROUTES.PICKUP_REQUEST,
      requiresAuth: true,
    },
  ],

  GROUP_2: [
    {
      icon: ListAlt,
      label: "My Orders",
      path: ROUTES.ORDER,
      requiresAuth: true,
    },
    {
      icon: ShoppingCart,
      label: "My Cart",
      path: ROUTES.CART,
      requiresAuth: false,
    },
    {
      icon: Person,
      label: "Profile",
      path: ROUTES.PROFILE,
      requiresAuth: true,
    },
  ],
};