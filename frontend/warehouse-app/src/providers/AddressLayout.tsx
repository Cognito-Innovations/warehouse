"use client";

import { useAuth } from "../contexts/AuthContext";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

export default function AddressLayout({ children }: { children: ReactNode }) {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/");
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
