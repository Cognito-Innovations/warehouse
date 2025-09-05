
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';

import Packages from './pages/Packages';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerDetailPage from './pages/CustomerDetailPage';
import ShoppingRequests from './pages/ShoppingRequests';
import ShoppingRequestDetail from './pages/ShoppingRequestDetail';
import MySuiteContent from './components/mySuite/MySuiteContent';
import Shipments from './pages/Shipments';
import ShipmentExport from './pages/ShipmentExport';

import Sidebar from './components/Sidebar/Sidebar';

import { menuItems } from "./data/menuItems";

import themeConfig from './utils/themeConfig';
import PreArrivals from './pages/PreArrivals';
import PackageDetail from './pages/PackageDetail';
import { Toaster } from 'sonner';
import PickupRequests from './pages/PickupRequests';
import PickupRequestDetail from './pages/PickupRequestDetail';
import ShipmentDetail from './pages/ShipmentDetail';


function App() {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  return (
    <ThemeProvider theme={themeConfig}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router>
          <Sidebar 
            logo={'S'} 
            menuItems={menuItems} 
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
            <Route path="/shipments/:id" element={<ShipmentDetail />} />
            <Route path="/shipments/export" element={<ShipmentExport />} />
            <Route path="/requests" element={<ShoppingRequests />} />
            <Route path="/requests/:id" element={<ShoppingRequestDetail />} />
            <Route path="/pickups" element={<PickupRequests />} />
            <Route path="/pickups/:id" element={<PickupRequestDetail />} />
            <Route path="/suite" element={<MySuiteContent />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<CustomerDetailPage />} />
            <Route path="/reports" element={<Dashboard />} />
            <Route path="/master" element={<Dashboard />} />
          </Routes>
          </Box>
        </Router>
      </LocalizationProvider>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}

export default App;