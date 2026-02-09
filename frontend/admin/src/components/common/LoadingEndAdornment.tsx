import { CircularProgress, InputAdornment } from "@mui/material";
import type { InputAdornmentProps } from "@mui/material";

interface LoadingAdornmentProps {
  loading: boolean;
  size?: number;
  position?: InputAdornmentProps["position"];
}

export const LoadingEndAdornment = ({
  loading,
  size = 18,
  position = "end",
}: LoadingAdornmentProps) => {
  if (!loading) return undefined;

  return (
    <InputAdornment position={position}>
      <CircularProgress size={size} />
    </InputAdornment>
  );
};
