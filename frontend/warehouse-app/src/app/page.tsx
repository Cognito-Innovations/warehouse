"use client";

import { Box, CircularProgress } from "@mui/material";
import SignInForm from "../components/SignIn/SignInForm";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  // Don't render login form if user is authenticated
  if (user) {
    return (
       <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
       </Box>
    );
  }
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        sx={{
          flex: { xs: "1 1 100%", sm: "1 1 50%", md: "1 1 30%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 4 },
          overflow: "visible",
        }}
      >
        <SignInForm />
      </Box>

      <Box
        sx={{
          flex: { xs: "0 0 0%", sm: "1 1 50%", md: "1 1 70%" },
          backgroundImage: "url(/palakart-background.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#000000"
        }}
      />
    </Box>
  );
}