"use client";

import { ROUTES } from "@/utils/constants";
import { useAuth } from "../contexts/AuthContext";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

//TODO P0: Need to wrap address layout only required routes not in root
export default function AddressLayout({ children }: { children: ReactNode }) {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push(ROUTES.SIGN_IN);
        }
    }, [user, authLoading, router]);

    if (authLoading || !user) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    gap: 2,
                }}
            >
                <CircularProgress />
                <Typography variant="body1">Loading...</Typography>
            </Box>
        );
    }

    return <>{children}</>;
}
