"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import SignInForm from "../../components/SignIn/SignInForm";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "@/utils/constants";

function SignInContent() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") ?? ROUTES.ROOT;

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(callbackUrl);
    }
  }, [isAuthenticated, callbackUrl, router]);

  if (isAuthenticated) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
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