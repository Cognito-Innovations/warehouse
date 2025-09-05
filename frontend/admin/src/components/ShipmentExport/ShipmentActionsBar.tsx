import React from "react";
import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

interface ShipmentActionsBarProps {
  selectedBoxId: number | null;
}

const ShipmentActionsBar: React.FC<ShipmentActionsBarProps> = ({ selectedBoxId }) => {
  return (
    <Box sx={{ mb: 3 }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 1.5,
      }}
    >
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search shipment"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
        sx={{ width: 475 }}
      />

      {selectedBoxId && (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" sx={{ bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" } }}>
            Update to Departed
          </Button>
          <Button variant="contained" startIcon={<FileDownloadIcon />} sx={{ bgcolor: "#8b5cf6", "&:hover": { bgcolor: "#7c3aed" } }}>
            Export
          </Button>
          <Button variant="contained" startIcon={<FileDownloadIcon />} sx={{ bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" } }}>
            RB Export
          </Button>
          <Button variant="contained" startIcon={<FileDownloadIcon />} sx={{ bgcolor: "#8b5cf6", "&:hover": { bgcolor: "#7c3aed" } }}>
            Packing List
          </Button>
        </Box>
      )}
    </Box>
      <Typography variant="body2" color="text.secondary">
        Only the shipments under tracking status (Ready to ship) can be added here
      </Typography>
    </Box>
  );
};

export default ShipmentActionsBar;