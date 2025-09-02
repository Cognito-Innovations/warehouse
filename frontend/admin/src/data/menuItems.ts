import {
    Dashboard as DashboardIcon,
    Inventory2 as PackagesIcon,
    LocalShipping as ShipmentsIcon,
    Assignment as RequestsIcon,
    Business as SuiteIcon,
    People as CustomersIcon,
    Assessment as ReportsIcon,
    AdminPanelSettings as MasterIcon,
    FileDownload as ExportIcon,
} from '@mui/icons-material';

export interface MenuItem {
  text: string;
  icon: React.ElementType;
  defaultPath?: string;
  path?: string;
  subMenu?: MenuItem[];
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
  { text: 'Requests', icon: RequestsIcon, path: '/requests' },
  { text: 'My Suite', icon: SuiteIcon, path: '/suite' },
  { text: 'Customers', icon: CustomersIcon, path: '/customers' },
  { text: 'Reports', icon: ReportsIcon, path: '/reports' },
  { text: 'Master', icon: MasterIcon, path: '/master' },
];