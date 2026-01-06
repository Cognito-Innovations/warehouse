import React, { useEffect } from "react";
import { Box } from "@mui/material";

export const PayPalButtonContainer: React.FC = () => {
  useEffect(() => {
    // Add global styles for PayPal buttons on mobile
    const styleId = "paypal-mobile-fix";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        #paypal-button-container iframe {
          pointer-events: auto !important;
          touch-action: manipulation !important;
          -webkit-touch-callout: none !important;
        }
        #paypal-button-container button {
          pointer-events: auto !important;
          touch-action: manipulation !important;
          -webkit-tap-highlight-color: transparent !important;
        }
        #paypal-button-container * {
          pointer-events: auto !important;
          touch-action: manipulation !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      const style = document.getElementById(styleId);
      if (style) {
        style.remove();
      }
    };
  }, []);

  return (
    <Box
      id="paypal-button-container"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: { xs: 1.5, md: 2 },
        px: { xs: 1, md: 2 },
        minHeight: "60px",
        border: "1px solid #e9ecef",
        borderRadius: 3,
        bgcolor: "white",
        width: "100%",
        position: "relative",
        zIndex: 10,
        overflow: "visible",
        "& > div": {
          width: "100%",
          position: "relative",
          zIndex: 10,
        },
      }}
    />
  );
};

