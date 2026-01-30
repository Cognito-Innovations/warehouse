import {
    Dashboard as DashboardIcon,
    Inventory2 as PackagesIcon,
    LocalShipping as ShipmentsIcon,
    Assignment as RequestsIcon,
    Business as SuiteIcon,
    People as CustomersIcon,
    FileDownload as ExportIcon,
    Settings as SettingsIcon,
    Flag as CountriesIcon,
    AttachMoney as CurrenciesIcon,
  } from '@mui/icons-material';
import CouriersIcon from '@mui/icons-material/LocalShipping';
import StoreIcon from '@mui/icons-material/Store';
import CategoryIcon from '@mui/icons-material/Category';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import ViewListIcon from '@mui/icons-material/ViewList';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export type UserRole = 'super_admin' | 'admin' | 'user';

export interface MenuItem {
  text: string;
  icon: React.ElementType;
  defaultPath?: string;
  path?: string;
  subMenu?: MenuItem[];
  roles?: UserRole[];
}

export const menuItems: MenuItem[] = [
  { text: 'Dashboard', icon: DashboardIcon, path: '/' },
  {
    text: 'Packages',
    icon: PackagesIcon,
    defaultPath: '/packages/all',
    subMenu: [
      { text: 'All', icon: PackagesIcon, path: '/packages/all' },
      { text: 'Pre Arrivals', icon: PackagesIcon, path: '/packages/pre-arrivals' },
    ],
  },
  {
    text: 'Shipments',
    icon: ShipmentsIcon,
    defaultPath: '/shipments',
    subMenu: [
      { text: 'Shipments', icon: ExportIcon, path: '/shipments' },
      { text: 'Shipment Export', icon: ExportIcon, path: '/shipments/export' },
    ],
  },
  { 
    text: 'Requests', 
    icon: RequestsIcon, 
    defaultPath: '/requests' ,
    subMenu: [
      { text: 'Shopping Requests', icon: ExportIcon, path: '/requests' },
      { text: 'Pickup Requests', icon: ExportIcon, path: '/pickups' },
    ],
  },
  
  { 
    text: 'Ecommerce', 
    icon: StoreIcon, 
    defaultPath: '/category' ,
    subMenu: [
      { text: 'Categories', icon: CategoryIcon, path: '/category' },
      { text: 'Sub Categories', icon: TurnedInIcon, path: '/sub-category' },
      { text: 'Products', icon: ViewListIcon, path: '/products' },
      { text: 'Orders', icon: ShoppingCartIcon, path: '/orders' },
    ],
  },
  { text: 'My Suite', icon: SuiteIcon, path: '/suite' },
  {
    text: 'Customers',
    icon: CustomersIcon,
    path: '/customers',
    roles: ['super_admin'],
  },
  {
    text: 'Settings',
    icon: SettingsIcon,
    defaultPath: '/settings/countries',
    roles: ['super_admin'],
    subMenu: [
        { text: 'Countries', icon: CountriesIcon, path: '/settings/countries' },
        { text: 'Currencies', icon: CurrenciesIcon, path: '/settings/currencies' },
        { text: 'Couriers', icon: CouriersIcon, path: '/settings/couriers' },
        { text: 'Users', icon: CustomersIcon, path: '/settings/users' },
    ],
  },
];