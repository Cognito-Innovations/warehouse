"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import SignInForm from "../../components/SignIn/SignInForm";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "@/utils/constants";

function SignInContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const callbackUrl = searchParams.get('callbackUrl') 
    ? decodeURIComponent(searchParams.get('callbackUrl')!) 
    : undefined;

  useEffect(() => {
    if (!loading && user && !isRedirecting) {
      setIsRedirecting(true);
      router.replace(callbackUrl || ROUTES.DASHBOARD);
    }
  }, [user, loading, router, isRedirecting, callbackUrl]);

  if (loading || isRedirecting || user) {
    return (
      <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", bgcolor: "#fff" }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={40} thickness={4} sx={{ color: "#7C3AED" }} />
          <Box sx={{ mt: 3, color: "text.secondary", fontWeight: 500 }}>
            {isRedirecting || user 
              ? `Taking you ${callbackUrl ? 'back' : 'to dashboard'}...`
              : "Loading..."}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#fff" }}>
      <Box
        sx={{
          flex: { xs: "1 1 100%", md: "1 1 40%", lg: "1 1 35%" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, sm: 6 },
          zIndex: 1,
          bgcolor: "#fff"
        }}
      >
        <SignInForm callbackUrl={callbackUrl} />
      </Box>

      <Box
        sx={{
          flex: { xs: "0 0 0%", md: "1 1 60%", lg: "1 1 65%" },
          display: { xs: "none", md: "block" },
          backgroundImage: "url(/palakart-login.png)",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      />
    </Box>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      }
    >
      <SignInContent />
    </Suspense>
  );
}