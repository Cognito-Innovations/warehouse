"use client";

import { Box } from "@mui/material";

export default function MapSection() {
  return (
    <Box
      sx={{
        width: "100%",
        height: {
          xs: 280,
          sm: 360,
          md: 500,
        },
        background: "#f8f9fa",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <iframe
        title="Google Maps Location"
        src="https://www.google.com/maps?q=4/224%20Perumagoundampatti%20Moolakkadai%20Elampillai%20Salem%20Tamil%20Nadu%20637502&output=embed"
        style={{
          width: "100%",
          height: "100%",
          border: 0,
        }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </Box>
  );
}
