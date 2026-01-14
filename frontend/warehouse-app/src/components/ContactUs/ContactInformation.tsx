"use client";

import {
  Box,
  Typography,
  Link as MuiLink,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  WhatsApp as WhatsAppIcon,
} from "@mui/icons-material";

export default function ContactInformation() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: "#ffffff",
        borderRadius: 2,
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        p: { xs: 3, md: 3.5 },
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Email */}
      <Box sx={{ mb: 4, pb: 3, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 1 }}>
          <EmailIcon sx={{ color: "primary.main", fontSize: 24, mt: 0.5 }} />
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>
              Email Address
            </Typography>
            <MuiLink
              href="https://mail.google.com/mail/?view=cm&fs=1&to= team.palakart@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
               sx={{
                color: "primary.main",
                fontWeight: 600,
                fontSize: "1.1rem",
                display: "inline-block",
                px: 0.5,
                borderRadius: 0.5,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  color: "primary.dark",
                },
              }}
            >
              team.palakart@gmail.com
            </MuiLink>
          </Box>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ ml: 4, fontStyle: "italic" }}>
          We'll respond within 24 hours
        </Typography>
      </Box>

      {/* Phone */}
      <Box sx={{ mb: 4, pb: 3, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 1 }}>
          <PhoneIcon sx={{ color: "primary.main", fontSize: 24, mt: 0.5 }} />
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>
              Phone Number
            </Typography>
            <MuiLink
              href="https://wa.me/919994126566"
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              sx={{
                fontWeight: 600,
                fontSize: "1.1rem",
                color: "#1a1a1a",
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                px: 0.5,
                borderRadius: 0.5,
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: alpha("#25D366", 0.12),
                  color: "#128C7E",
                },
              }}
            >
              +91 99941 26566
            </MuiLink>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 4 }}>
          <WhatsAppIcon sx={{ color: "#25D366", fontSize: 18 }} />
          <Typography variant="caption" color="text.secondary">
            WhatsApp available
          </Typography>
        </Box>
      </Box>

      {/* Address */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
          <LocationIcon sx={{ color: "primary.main", fontSize: 24, mt: 0.5 }} />
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>
              Our Location
            </Typography>
            <Typography sx={{ fontWeight: 500, lineHeight: 1.6, fontSize: "0.95rem" }}>
              Building No./Flat No. 4/224,<br />
              Perumagoundampatti, Moolakkadai,<br />
              Elampillai Post, Salem Taluk,<br />
              Ilampillai, Salem,<br />
              Tamil Nadu 637502, India
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Business Hours */}
      <Box>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, mb: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}
        >
          <TimeIcon fontSize="small" />
          Business Hours
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
            p: 1.5,
            borderRadius: 1,
            background: alpha(theme.palette.primary.main, 0.03),
          }}
        >
          <Typography color="text.secondary">Monday - Friday</Typography>
          <Typography sx={{ fontWeight: 600, color: "primary.main" }}>
            9:00 AM - 6:00 PM
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: 1.5,
            borderRadius: 1,
            background: alpha(theme.palette.grey[300], 0.3),
          }}
        >
          <Typography color="text.secondary">Saturday - Sunday</Typography>
          <Typography sx={{ fontWeight: 600, color: "text.secondary" }}>
            Closed
          </Typography>
        </Box>
      </Box>

      {/* CTA */}
      <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid rgba(0,0,0,0.06)", textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Have an urgent issue?
        </Typography>
        <MuiLink
          href="tel:+919994126566"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "primary.main",
            color: "white",
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textDecoration: "none",
            fontWeight: 600,
            "&:hover": {
              bgcolor: "primary.dark",
              boxShadow: "0 4px 12px rgba(33,150,243,0.3)",
            },
          }}
        >
          <PhoneIcon fontSize="small" />
          Call Us Now
        </MuiLink>
      </Box>
    </Box>
  );
}
