import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#7c3aec", // Purple color matching the design
      light: "#a78bfa",
      dark: "#5b21b6",
    },
    secondary: {
      main: "#6b21a8",
    },
    background: {
      default: "#f3f4f6",
      paper: "#ffffff",
    },
    error: {
      main: "#F44336",
    },
    warning: {
      main: "#FF9800",
    },
  },
  typography: {
    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
  },
});
