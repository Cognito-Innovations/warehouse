"use client";

import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import MapSection from "./MapSection";
import ContactInformation from "./ContactInformation";

export default function ContactUsContent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ minHeight: "calc(100vh - 64px)", background: "#ffffff", py: { xs: 3, md: 4 } }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 4, md: 6 },
            mt: 2,
          }}
        >
          <Box sx={{ flex: { md: 0.6 }, display: "flex", flexDirection: "column" }}>
            <MapSection />
          </Box>

          <Box sx={{ flex: { md: 0.4 }, display: "flex", flexDirection: "column" }}>
            <ContactInformation />
          </Box>
        </Box>

        {isMobile && (
          <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid rgba(0,0,0,0.06)", textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              We typically respond to emails within 24 hours and phone calls immediately during business hours.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
