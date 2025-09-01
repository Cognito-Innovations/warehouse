
import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Packages from './pages/Packages';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar/Sidebar';
import PageSidebar from './components/Sidebar/PageSidebar';

import { menuItems } from "./data/menuItems";
import Shipment from './pages/Shipment';

// Context for managing active tab state and sidebar expansion
interface TabContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isPageSidebarExpanded: boolean;
  togglePageSidebar: () => void;
}

const TabContext = createContext<TabContextType>({
  activeTab: 'packages',
  setActiveTab: () => {},
  isPageSidebarExpanded: true,
  togglePageSidebar: () => {}
});

export const useTabContext = () => useContext(TabContext);

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
    },
    secondary: {
      main: '#ec4899',
    },
    background: {
      default: '#f8fafc',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('packages');
  const [isPageSidebarExpanded, setIsPageSidebarExpanded] = useState(true);
  
  const getPageSidebarConfig = () => {
    if (location.pathname === '/') {
      return null; 
    } else if (location.pathname === '/packages') {
      return {
        title: 'Packages',
        items: [
          { label: 'All Packages', value: 'packages', path: '/packages' },
          { label: 'Pre Arrivals', value: 'pre-arrivals', path: '/packages/pre-arrivals' }
        ],
        activeItem: activeTab
      };
    } else if (location.pathname === '/shipments') {
      return {
        title: 'Shipments',
        items: [
          { label: 'All Shipments', value: 'shipments', path: '/Shipments' },
          // { label: 'Pre Arrivals', value: 'pre-arrivals', path: '/packages/pre-arrivals' }
        ],
        activeItem: activeTab
      };
    }
    
    return null;
  };

  const handlePageSidebarChange = (value: string) => {
    if (value === 'packages' || value === 'pre-arrivals') {
      navigate('/packages');
      setActiveTab(value);
    }
  };

  const togglePageSidebar = () => {
    setIsPageSidebarExpanded(!isPageSidebarExpanded);
  };

  const pageSidebarConfig = getPageSidebarConfig();
  const showPageSidebar = pageSidebarConfig !== null;

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab, isPageSidebarExpanded, togglePageSidebar }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '72px auto 1fr', minHeight: '100vh', width: '100%', overflow: 'hidden' }}>
        {/* Main Sidebar - Always closed (72px) */}
        <Sidebar logo={'S'} menuItems={menuItems} />
        
        {/* Page Sidebar - Only show for pages with navigation items */}
        {showPageSidebar && (
          <PageSidebar
            title={pageSidebarConfig!.title}
            items={pageSidebarConfig!.items}
            activeItem={pageSidebarConfig!.activeItem}
            onItemChange={handlePageSidebarChange}
            expanded={isPageSidebarExpanded}
          />
        )}
        
        {/* Main Content Area - Responsive layout that adapts to sidebar state */}
        <Box component="main" 
          sx={{ p: 3, minHeight: '100vh', overflow: 'auto',
            // Responsive padding that adapts to sidebar state
            pl: { xs: 2, sm: 3 },
            pr: { xs: 2, sm: 3 },
            // Ensure content is always visible and properly spaced
            width: '100%',
            boxSizing: 'border-box',
            border: '3px solid orange', // Debug border
            backgroundColor: 'rgba(255,165,0,0.1)' // Debug background
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/shipments" element={<Shipment />} />

          </Routes>
        </Box>
      </Box>
    </TabContext.Provider>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;