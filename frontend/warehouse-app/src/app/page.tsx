"use client";

import { Box } from "@mui/material";
import SignInForm from "../components/SignIn/SignInForm";

export default function SignInPage() {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        sx={{
          flex: { xs: "1 1 100%", sm: "1 1 50%", md: "1 1 30%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 4 }
        }}
      >
        <SignInForm />
      </Box>

      <Box
        sx={{
          flex: { xs: "0 0 0%", sm: "1 1 50%", md: "1 1 70%" },
          backgroundImage: "url(/shopme-background.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#000000"
        }}
      />
    </Box>
  );
}