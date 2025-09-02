import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Packages from './pages/Packages';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar/Sidebar';

import { menuItems } from "./data/menuItems";

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

function App() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const handleSidebarToggle = () => { setSidebarExpanded(!sidebarExpanded) };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar expanded={sidebarExpanded} logo={'S'} name={'ShopMe'} menuItems={menuItems} />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
              <Route path="/" element={<Dashboard onToggleSidebar={handleSidebarToggle} />} />
              <Route path="/packages" element={<Packages onToggleSidebar={handleSidebarToggle} />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;