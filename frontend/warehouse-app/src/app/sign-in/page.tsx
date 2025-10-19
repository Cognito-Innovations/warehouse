"use client";

import { Box, CircularProgress } from "@mui/material";
import SignInForm from "../../components/SignIn/SignInForm";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && user && !isRedirecting) {
      setIsRedirecting(true);
      router.replace("/dashboard");
    }
  }, [user, loading, router, isRedirecting]);

  if (loading || isRedirecting) {
    return (
      <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress />
          <Box sx={{ mt: 2, color: "text.secondary" }}>
            {isRedirecting ? "Redirecting to dashboard..." : "Loading..."}
          </Box>
        </Box>
      </Box>
    );
  }

  if (user) {
    return (
       <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress />
          <Box sx={{ mt: 2, color: "text.secondary" }}>
            Redirecting to dashboard...
          </Box>
        </Box>
       </Box>
    );
  }
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        sx={{
          flex: { xs: "1 1 100%", sm: "1 1 50%", md: "1 1 30%" },
          display: "flex",
          flexDirection: "column",
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