import { AssessmentOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { formatDateTime } from "../../utils/formatDateTime";

interface ShipReportButtonProps {
    shipments: any[];
}

const ShipReportButton: React.FC<ShipReportButtonProps> = ({ shipments }) => {
    const generateReport = () => {
        if (!shipments || shipments.length === 0) {
            toast.error("No shipments data available to export.");
            return;
        }

        const data: any[] = []
        let serial = 1;

        shipments.forEach((shipment) => {
            const { tracking_no, user, created_at, packages = [] } = shipment
            const customerName = user?.name || '';
            const suiteId = user?.suite_no || '';
            const requestedAt = created_at ? formatDateTime(created_at) : '';
            const carrier = 'REDBOX (air)';
            const noOfItems = packages.length;
            const extraCharges = '';

            packages.forEach((pkg: any, index: number) => {
                const row: any = {};

                if (index === 0) {
                    row["#"] = serial++;
                    row["Tracking ID"] = tracking_no;
                    row["Customer Name"] = customerName;
                    row["Suite ID"] = suiteId;
                    row["Requested At"] = requestedAt;
                    row["Carrier"] = carrier;
                    row["No of Items"] = noOfItems;
                    row["Extra Charges"] = extraCharges;
                }

                row['Rack'] = pkg.rack_slot?.label || '';
                row['Package ID'] = pkg.package_id || '';

                data.push(row);
            });
        });

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Shipments');

        // Generate file name with today's date
        const today = new Date().toISOString().split('T')[0];
        const fileName = `ship-requested-report-${today}.xlsx`

        // Download File
        XLSX.writeFile(wb, fileName);
    };

    return (
        <Button
          variant="contained"
          startIcon={<AssessmentOutlined />}
          onClick={generateReport}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            backgroundColor: '#7360F2',
            '&:hover': {
                backgroundColor: '#5b48d8',
            },
          }}
        >
           Ship Requested Report 
        </Button>
    )
}

export default ShipReportButton;