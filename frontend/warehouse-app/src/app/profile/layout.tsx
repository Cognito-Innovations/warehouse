import type { Metadata } from "next";
import { Box } from "@mui/material";

export const metadata: Metadata = {
  title: "Profile - Palakart Dashboard",
  description: "Manage your profile settings",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
      <Box sx={{ flex: 1, p: 3, pt: 0, overflow: "auto" }}>
        {children}
      </Box>
    </Box>
  );
}