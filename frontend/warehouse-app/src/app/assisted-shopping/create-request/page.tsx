"use client";

import React from "react";
import AddressLayout from "@/providers/AddressLayout";
import AddressSection from "../../../components/Navbar/AddressSection";
import ShoppingRequestForm from "@/components/ShoppingRequest/ShoppingRequestForm";
import Breadcrumb from "@/components/Common/Breadcrumb";

function CreateShoppingRequestContent() {
  return (
    <div
      className="min-h-screen bg-gray-100 antialiased"
      style={{
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      <AddressSection/>

      <Breadcrumb
        items={[
          { label: "Shopping Requests", href: "/assisted-shopping" },
          { label: "Create Request" },
        ]} 
      />

      <div className="max-w-7xl mx-auto px-4 py-4">
        <h2 className="text-lg font-extrabold text-gray-800 tracking-tight">
          Fill up details, Let us Shop for You
        </h2>
        <p className="text-gray-700 mb-5 leading-relaxed">
          Enter link(s) of items to purchase.
        </p>

        <ShoppingRequestForm />
      </div>
    </div>
  );
}

export default function CreateShoppingRequest() {
  return (
    <AddressLayout>
      <CreateShoppingRequestContent />
    </AddressLayout>
  );
}
