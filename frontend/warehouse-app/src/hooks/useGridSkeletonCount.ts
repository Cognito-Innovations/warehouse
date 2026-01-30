import { useState, useEffect } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { ecommerceData } from "@/data/ecommerceData";
import { debounce } from "@/utils/debounce";

interface UseGridSkeletonCountProps {
  itemHeight?: number;
  offsetY?: number;
  minCount?: number;
  singleRow?: boolean;
}

export const useGridSkeletonCount = ({
  itemHeight = 320,
  offsetY = 0,
  minCount = 4,
  singleRow = false,
}: UseGridSkeletonCountProps = {}) => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.up("sm"));
  const isMd = useMediaQuery(theme.breakpoints.up("md"));
  const isLg = useMediaQuery(theme.breakpoints.up("lg"));

  const [count, setCount] = useState(minCount);

  const calculateSkeletonCount = () => {
    let columns;
    if (isLg) columns = ecommerceData.ui.grid.columns.lg;
    else if (isMd) columns = ecommerceData.ui.grid.columns.md;
    else if (isSm) columns = ecommerceData.ui.grid.columns.sm;
    else columns = ecommerceData.ui.grid.columns.xs;

    if (singleRow) {
      setCount(columns);
      return;
    }

    if (typeof window !== "undefined") {
      const availableHeight = window.innerHeight - offsetY;
      const rows = Math.max(1, Math.ceil(availableHeight / itemHeight));
      
      setCount(Math.max(columns * rows, minCount));
    }
  };

  useEffect(() => {
    calculateSkeletonCount();

    const handleResize = debounce(calculateSkeletonCount, 200);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      handleResize.cancel?.();
    };
  }, [isSm, isMd, isLg, itemHeight, offsetY, minCount, singleRow]);

  return count;
};