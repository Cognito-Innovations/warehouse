import { createTheme } from '@mui/material/styles';

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

export default theme;