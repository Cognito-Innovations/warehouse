"use client";

import { Box } from "@mui/material";

export default function MapSection() {
  return (
    <Box
      sx={{
        flex: 1,
        background: "#f8f9fa",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        border: "1px solid rgba(0,0,0,0.08)",
        minHeight: 500,
      }}
    >
      <iframe
        title="Google Maps Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.307383574738!2d78.002414975819!3d11.597270087694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDM1JzUwLjIiTiA3OMKwMDAnMTcuOSJF!5e0!3m2!1sen!2sin!4v1704792060567!5m2!1sen!2sin"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </Box>
  );
}
