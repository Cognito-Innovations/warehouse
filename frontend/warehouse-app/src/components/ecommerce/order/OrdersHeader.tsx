"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Container } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { ecommerceData } from "@/data/ecommerceData";

interface OrdersHeaderProps {
  title?: string;
}

export default function OrdersHeader({ title = "My Orders" }: OrdersHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push('/ecommerce');
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <Container
        maxWidth="xl"
        sx={{
          maxWidth: {
            xs: "100%",
            sm: "100%",
            md: "100%",
            lg: "100%",
            xl: ecommerceData.ui.spacing.containerMaxWidth,
          },
          mx: "auto",
        }}
      >
        <div className="flex items-center py-4">
          <button
            onClick={handleBack}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <ArrowBackIcon className="w-5 h-5" />
          </button>
          <h1 className="ml-3 text-xl font-bold text-gray-900">{title}</h1>
        </div>
      </Container>
    </div>
  );
}