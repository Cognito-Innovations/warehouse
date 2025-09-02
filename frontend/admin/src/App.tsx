
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import Packages from './pages/Packages';
import Dashboard from './pages/Dashboard';
import Shipments from './pages/Shipments';
import ShipmentExport from './pages/ShipmentExport';
import ShoppingRequests from './pages/ShoppingRequests';
import ShoppingRequestDetail from './pages/ShoppingRequestDetail';
import MySuite from './pages/MySuite';
import Customers from './pages/Customers';
import Sidebar from './components/Sidebar/Sidebar';

import { menuItems } from "./data/menuItems";

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Shipment from './pages/Shipment';
import themeConfig from './utils/themeConfig';
import { TabContext } from './contexts/TabContext';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('packages');
  const [isPageSidebarExpanded, setIsPageSidebarExpanded] = useState(true);
  
  const togglePageSidebar = () => {
    setIsPageSidebarExpanded(!isPageSidebarExpanded);
  };

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab, isPageSidebarExpanded, togglePageSidebar }}>
      <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%', overflow: 'hidden' }}>
        <Sidebar logo={'S'} menuItems={menuItems} />
        <Box component="main" 
          sx={{ 
            flex: 1,
            p: 3, 
            minHeight: '100vh', 
            overflow: 'auto',
            pl: { xs: 2, sm: 3 },
            pr: { xs: 2, sm: 3 },
            boxSizing: 'border-box',
            bgcolor: '#f8fafc'
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/packages/all" element={<Packages />} />
            {/* TODO: Move this prearrivals to a separate page */}
            <Route path="/packages/pre-arrivals" element={<Packages />} />
            <Route path="/shipments" element={<Shipment />} />
            <Route path="/shipments/export" element={<Shipment />} />
            <Route path="/requests" element={<Dashboard />} />
            <Route path="/suite" element={<Dashboard />} />
            <Route path="/customers" element={<Dashboard />} />
            <Route path="/reports" element={<Dashboard />} />
            <Route path="/master" element={<Dashboard />} />
          </Routes>
        </Box>
      </Box>
    </TabContext.Provider>
  );
};

function App() {
  return (
    <ThemeProvider theme={themeConfig}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router>
          <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar expanded={sidebarExpanded} logo={'S'} name={'ShopMe'} menuItems={menuItems} />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <Routes>
                <Route path="/" element={<Dashboard onToggleSidebar={handleSidebarToggle} />} />
                <Route path="/packages" element={<Packages onToggleSidebar={handleSidebarToggle} />} />
                <Route path="/shipments" element={<Shipments onToggleSidebar={handleSidebarToggle} />} />
                <Route path="/shipment-export" element={<ShipmentExport onToggleSidebar={handleSidebarToggle} />} />
                <Route path="/requests" element={<ShoppingRequests onToggleSidebar={handleSidebarToggle} />} />
                <Route path="/requests/:id" element={<ShoppingRequestDetail onToggleSidebar={handleSidebarToggle} />} />
                <Route path="/suite" element={<MySuite />} />
                <Route path="/customers" element={<Customers onToggleSidebar={handleSidebarToggle} />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;