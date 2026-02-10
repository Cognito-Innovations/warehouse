import { AssessmentOutlined } from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import { toast } from "sonner";
import { buildShipmentReportRows, downloadExcelReport } from "../../utils/shipmentReport.utils";

interface ShipReportButtonProps {
    shipments: any[];
    loading: boolean;
}

const ShipReportButton: React.FC<ShipReportButtonProps> = ({ shipments, loading }) => {
    const generateReport = () => {
        if (!shipments || shipments.length === 0) {
            toast.error("No shipments data available to export.");
            return;
        }

        const reportRows = buildShipmentReportRows(shipments);
        downloadExcelReport(reportRows);
    };

    return (
        <Button
          variant="contained"
          startIcon={
            loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <AssessmentOutlined />
            )
          }
          onClick={generateReport}
          disabled={loading}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            backgroundColor: '#7360F2',
            '&:hover': {
                backgroundColor: '#5b48d8',
            },
          }}
        >
           {loading ? "Loading..." : "Ship Requested Report"} 
        </Button>
    )
}

export default ShipReportButton;