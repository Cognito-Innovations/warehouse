import { keyframes } from "@mui/material/styles";

export const alpha3ToAlpha2: Record<string, string> = {
  MYS: "MY",
  ARE: "AE",
  USA: "US",
  IND: "IN",
};


export const fkAttention = keyframes`
  0% { transform: translate(-50%, 0); }
  10% { transform: translate(-50%, -2px); }
  20% { transform: translate(-50%, 0); }
  30% { transform: translate(-52%, 0); }
  40% { transform: translate(-48%, 0); }
  50% { transform: translate(-50%, 0); }
  100% { transform: translate(-50%, 0); }
  `;
