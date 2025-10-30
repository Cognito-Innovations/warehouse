"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import SignInForm from "../../components/SignIn/SignInForm";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "@/utils/constants";

export default function Page() {
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

  if (loading || isRedirecting) {
    return (
      <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress />
          <Box sx={{ mt: 2, color: "text.secondary" }}>
            {isRedirecting 
              ? `Redirecting${callbackUrl ? ' back...' : ' to dashboard...'}`
              : "Loading..."}
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
            {`Redirecting${callbackUrl ? ' back...' : ' to dashboard...'}`}
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
        <SignInForm callbackUrl={callbackUrl} />
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