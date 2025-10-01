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
    text: 'Shipments Export',
    icon: ShipmentsIcon,
    defaultPath: '/shipments/export',
    subMenu: [
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
  { text: 'My Suite', icon: SuiteIcon, path: '/suite' },
  { text: 'Customers', icon: CustomersIcon, path: '/customers' },
  {
    text: 'Settings',
    icon: SettingsIcon,
    defaultPath: '/settings/countries',
    roles: ['super_admin'],
    subMenu: [
        { text: 'Countries', icon: CountriesIcon, path: '/settings/countries' },
        { text: 'Currencies', icon: CurrenciesIcon, path: '/settings/currencies' },
        { text: 'Couriers', icon: CouriersIcon, path: '/settings/couriers' },
    ],
  },
];