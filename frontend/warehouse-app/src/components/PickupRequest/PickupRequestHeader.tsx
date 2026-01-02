import React from "react";
import Link from "next/link";
import { Box, TextField, InputAdornment, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { ROUTES } from "@/utils/constants";

interface PickupRequestHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const PickupRequestHeader: React.FC<PickupRequestHeaderProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "stretch", sm: "center" },
        gap: 2,
        mb: 3,
      }}
    >
      <TextField
        variant="outlined"
        placeholder="Search by request no, location, or supplier..."
        size="small"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{
          flexGrow: { xs: 1, sm: 0 },
          bgcolor: "white",
          ".MuiOutlinedInput-root": {
            borderRadius: 2,
          },
          minWidth: { xs: "100%", sm: 300 },
        }}
      />
      <Link href={ROUTES.DASHBOARD + ROUTES.CREATE_PICKUP_REQUEST} passHref>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: "#6D28D9",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            whiteSpace: "nowrap",
            mr: { xs: 0, sm: 2 },
            "&:hover": { bgcolor: "#5B21B6" },
          }}
        >
          Pickup Request
        </Button>
      </Link>
    </Box>
  );
};

export default PickupRequestHeader;

