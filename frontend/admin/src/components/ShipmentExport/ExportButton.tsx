import React from "react";
import { Button } from "@mui/material";
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";
import * as XLSX from 'xlsx';

interface ExportButtonProps {
  data: any[];
  filename: string;
  className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ data, filename, className }) => {
  const generateReport = () => {
    if (!data || data.length === 0) {
      // Optionally add toast.error("No data available to export.");
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
      startIcon={<FileDownloadIcon />}
      onClick={generateReport}
      className={className}
      sx={{ bgcolor: "#8b5cf6", "&:hover": { bgcolor: "#7c3aed" }, textTransform: "none" }}
    >
      Export
    </Button>
  );
};

export default ExportButton;