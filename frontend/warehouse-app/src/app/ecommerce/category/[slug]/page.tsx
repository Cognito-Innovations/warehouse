"use client";

import React from "react";
import { useParams } from "next/navigation";
import EcommerceContent from "@/components/ecommerce/EcommerceContent";

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  return <EcommerceContent slug={slug} />;
}