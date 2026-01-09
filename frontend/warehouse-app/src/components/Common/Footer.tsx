import { Box, Container, Typography, Link as MuiLink } from "@mui/material";
import NextLink from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 3, sm: 2 },
        px: { xs: 2, sm: 3 },
        mt: "auto",
        bgcolor: "grey.100",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            textAlign: { xs: "center", sm: "left" },
            flexWrap: "wrap",
            gap: { xs: 2, sm: 1 },
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Policies:{" "}
            <MuiLink component={NextLink} href="/returns-policy" color="inherit" underline="hover">
              Returns Policy
            </MuiLink>{" "}
            |{" "}
            <MuiLink component={NextLink} href="/terms-conditions" color="inherit" underline="hover">
              Terms & Conditions
            </MuiLink>{" "}
            |{" "}
            <MuiLink component={NextLink} href="/security" color="inherit" underline="hover">
              Security
            </MuiLink>{" "}
            |{" "}
            <MuiLink component={NextLink} href="/privacy-policy" color="inherit" underline="hover">
              Privacy
            </MuiLink>{" "}
            | © 2025–{currentYear} Palakart.com
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Need help?{" "}
            <MuiLink component={NextLink} href="/contact-us" color="inherit" underline="always">
              Contact Us
            </MuiLink>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}