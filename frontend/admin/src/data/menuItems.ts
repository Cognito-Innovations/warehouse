import {
    Dashboard as DashboardIcon,
    Inventory2 as PackagesIcon,
    LocalShipping as ShipmentsIcon,
    Assignment as RequestsIcon,
    Business as SuiteIcon,
    People as CustomersIcon,
    Assessment as ReportsIcon,
    AdminPanelSettings as MasterIcon,
} from '@mui/icons-material';

export const menuItems = [
    { text: 'Dashboard', icon: DashboardIcon, path: '/' },
    { text: 'Packages', icon: PackagesIcon, path: '/packages' },
    { text: 'Shipments', icon: ShipmentsIcon, path: '/shipments' },
    { text: 'Requests', icon: RequestsIcon, path: '/requests' },
    { text: 'My Suite', icon: SuiteIcon, path: '/suite' },
    { text: 'Customers', icon: CustomersIcon, path: '/customers' },
    { text: 'Reports', icon: ReportsIcon, path: '/reports' },
    { text: 'Master', icon: MasterIcon, path: '/master' },
  ];