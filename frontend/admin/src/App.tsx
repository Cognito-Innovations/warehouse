import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Toaster } from 'sonner';

import Packages from './pages/Packages';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerDetailPage from './pages/CustomerDetailPage';
import ShoppingRequests from './pages/ShoppingRequests';
import ShoppingRequestDetail from './pages/ShoppingRequestDetail';
import MySuiteContent from './components/mySuite/MySuiteContent';
import Shipments from './pages/Shipments';
import ShipmentExport from './pages/ShipmentExport';
import Login from './pages/Login';

import Sidebar from './components/Sidebar/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

import { menuItems, type MenuItem, type UserRole } from "./data/menuItems";

import themeConfig from './utils/themeConfig';
import PreArrivals from './pages/PreArrivals';
import PackageDetail from './pages/PackageDetail';
import PickupRequests from './pages/PickupRequests';
import PickupRequestDetail from './pages/PickupRequestDetail';
import ViewShipmentExportPage from './pages/ViewShipmentExportPage';
import CountriesPage from './pages/CountriesPage';
import CurrenciesPage from './pages/CurrenciesPage';

function App() {
  const { user } = useAuth()
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const visibleMenuItems = menuItems
    .map(item => {
      const newItem: MenuItem = { ...item };

      if (item.subMenu) {
        newItem.subMenu = item.subMenu.filter(subItem =>
          !subItem.roles || subItem.roles.includes(user?.role as UserRole)
        );
      }
      return newItem;
    })
    .filter(item => {
      const isParentVisible = !item.roles || item.roles.includes(user?.role as UserRole);
      const hasVisibleChildren = item.subMenu && item.subMenu.length > 0;
      return isParentVisible || hasVisibleChildren;
    });

  return (
    <ThemeProvider theme={themeConfig}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          {/* Protected routes */}
          <Route path="/*" element={
            <ProtectedRoute>
              <Sidebar 
                logo={'S'} 
                menuItems={visibleMenuItems}
                onSubMenuToggle={setIsSubMenuOpen}
              />
              <Box component="main" sx={{ 
                flexGrow: 1, 
                p: 3, 
                marginLeft: isSubMenuOpen ? '352px' : '72px', // 72px (main sidebar) + 280px (submenu) when open
                minHeight: '100vh',
                overflow: 'auto',
                boxSizing: 'border-box',
                width: isSubMenuOpen ? 'calc(100vw - 352px)' : 'calc(100vw - 72px)',
                transition: 'margin-left 0.3s ease, width 0.3s ease'
              }}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/packages" element={<Packages />} />
                  <Route path="/packages/all" element={<Packages />} />
                  <Route path="/packages/:id" element={<PackageDetail />} />
                  {/* TODO: Move this prearrivals to a separate page */}
                  <Route path="/packages/pre-arrivals" element={<PreArrivals />} />
                  <Route path="/shipments" element={<Shipments />} />
                  {/* <Route path="/shipments/:id" element={<ShipmentDetail />} /> */}
                  <Route path="/shipments/export" element={<ShipmentExport />} />
                  <Route path="/shipment/export/:id" element={<ViewShipmentExportPage />} />
                  <Route path="/requests" element={<ShoppingRequests />} />
                  <Route path="/requests/:id" element={<ShoppingRequestDetail />} />
                  <Route path="/pickups" element={<PickupRequests />} />
                  <Route path="/pickups/:id" element={<PickupRequestDetail />} />
                  <Route path="/suite" element={<MySuiteContent />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/customers/:id" element={<CustomerDetailPage />} />
                  {/* these routes should be in super user able to access these pages */}
                  <Route path="/settings/countries" element={<CountriesPage />} />
                  <Route path="/settings/currencies" element={<CurrenciesPage />} />
                </Routes>
              </Box>
            </ProtectedRoute>
          } />
        </Routes>
      </LocalizationProvider>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}

export default App;