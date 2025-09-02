
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import Packages from './pages/Packages';
import Dashboard from './pages/Dashboard';

import Sidebar from './components/Sidebar/Sidebar';

import { menuItems } from "./data/menuItems";

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Customers from './pages/Customers';
import ShoppingRequests from './pages/ShoppingRequests';
import MySuiteContent from './components/mySuite/MySuiteContent';
import Shipment from './pages/Shipment';
import themeConfig from './utils/themeConfig';


function App() {
  return (
    <ThemeProvider theme={themeConfig}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router>
          <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
            <Sidebar logo={'S'} menuItems={menuItems} />
            <Box component="main" sx={{ 
              flexGrow: 1, 
              p: 3, 
              width: 'calc(100vw - 72px)',
              minHeight: '100vh',
              overflow: 'auto',
              boxSizing: 'border-box'
            }}>
            <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/packages/all" element={<Packages />} />
            {/* TODO: Move this prearrivals to a separate page */}
            <Route path="/packages/pre-arrivals" element={<Packages />} />
            <Route path="/shipments" element={<Shipment />} />
            <Route path="/shipments/export" element={<Shipment />} />
            <Route path="/requests" element={<ShoppingRequests />} />
            <Route path="/suite" element={<MySuiteContent />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/reports" element={<Dashboard />} />
            <Route path="/master" element={<Dashboard />} />
          </Routes>
            </Box>
          </Box>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;