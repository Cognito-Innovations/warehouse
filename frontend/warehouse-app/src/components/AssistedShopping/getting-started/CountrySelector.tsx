"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ReactCountryFlag from "react-country-flag";
import { Public as WorldIcon } from "@mui/icons-material";

import { useDetectUserLocation } from "@/store/useDetectUserLocation";
import { alpha3ToAlpha2 } from "@/lib/header.utils";

interface CountrySelectorProps {
  className?: string;
}

export const CountrySelector = ({ className }: CountrySelectorProps) => {
  const router = useRouter();
  const { countryCode, countryName } = useDetectUserLocation();

  const alpha2Code =
    countryCode && countryCode.length === 3
      ? alpha3ToAlpha2[countryCode]
      : countryCode;

  return (
    <div
      className={`flex items-center flex-wrap gap-2 sm:gap-3 ${className ?? ""}`}
    >
      <div className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <span>Ship from:</span>

        <div className="flex items-center gap-1.5">
          {alpha2Code ? (
            <ReactCountryFlag
              countryCode={alpha2Code}
              svg
              style={{
                width: "1.25em",
                height: "1.25em",
                borderRadius: "50%",
                objectFit: "cover",
                border: "1px solid rgba(0, 0, 0, 0.1)",
              }}
              title={countryName || countryCode}
            />
          ) : (
            <WorldIcon
              style={{
                width: "1.25em",
                height: "1.25em",
                borderRadius: "50%",
                objectFit: "cover",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                color: "gray",
              }}
              titleAccess={countryName || countryCode}
            />
          )}

          <span className="text-gray-900">{countryCode}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => router.push("/profile?view=country")}
        className="text-sm font-medium text-purple-700 hover:text-purple-600 transition-colors"
      >
        Change
      </button>
    </div>
  );
};
