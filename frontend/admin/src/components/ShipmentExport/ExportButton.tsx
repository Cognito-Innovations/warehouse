import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";
import * as XLSX from 'xlsx';

interface ExportButtonProps {
  data: any[];
  filename: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({ 
  data, 
  filename, 
  className, 
  disabled = false, 
  loading = false 
}) => {
  const generateReport = () => {
    if (loading || disabled || !data || data.length === 0) {
      return;
    }

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Export');

    // Download File
    XLSX.writeFile(wb, filename);
  };

  return (
    <Button
      variant="contained"
      startIcon={
        loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <FileDownloadIcon />
        )
      }
      onClick={generateReport}
      disabled={loading || disabled}
      className={className}
      sx={{ bgcolor: "#8b5cf6", "&:hover": { bgcolor: "#7c3aed" }, textTransform: "none" }}
    >
      {loading ? "Loading..." : "Export"}
    </Button>
  );
};

export default ExportButton;