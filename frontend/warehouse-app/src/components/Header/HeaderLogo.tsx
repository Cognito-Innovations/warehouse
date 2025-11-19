"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

const HeaderLogo = () => {
  return (
    <Link
      href="/"
      className="text-2xl font-bold text-white hover:opacity-80 transition-opacity"
    >
      <Image src="/palakart.png" alt="Palakart" width={150} height={150} />
    </Link>
  );
};

export default HeaderLogo;