import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import jsPDF from "jspdf";
import QRCode from 'qrcode';
import JsBarcode from "jsbarcode";
import { toast } from "sonner";

interface Measurement {
  length: number;
  width: number;
  height: number;
}

interface HoldLabelData {
    shipment_id: string;
    shipment_uuid?: string;
    user: string;
    suite?: string;
    weight?: string;
    measurements: Measurement[];
    createdAt?: string;
}

interface PrintHoldLabelButtonProps {
  data: HoldLabelData;
}

const PrintHoldLabelButton: React.FC<PrintHoldLabelButtonProps> = ({ data }) => {
    const [isPrintingHold, setIsPrintingHold] = useState(false);
  
    const handlePrintHoldLabel = async () => {
        setIsPrintingHold(true);
        try {
            if (!data || !data.shipment_id || !data.user || !data.measurements) {
                toast.error("Required data for hold label is missing.");
                console.error("Missing data for hold label:", data);
                return;
            }

            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: [150, 100] // 15cm x 10cm, similar to a 6x4 inch label
            });

            // 1. MASTER Box (Top-Left)
            doc.setFillColor(0, 0, 0);
            doc.rect(5, 5, 30, 10, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text("MASTER", 8, 12);

            // SHIPMENT text outside the box
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("SHIPMENT", 40, 12);

            // 2. QR Code (Top-Right)
            const qrCodeUrl = data.shipment_uuid ? `${window.location.origin}/shipments/${data.shipment_uuid}` : 'No shipment UUID';
            const qrCodeDataURL = await QRCode.toDataURL(qrCodeUrl, { width: 100, margin: 1, errorCorrectionLevel: 'H' });
            doc.addImage(qrCodeDataURL, 'PNG', 125, 5, 20, 20);

            // 3. Barcode with "ONHOLD" overlay
            const canvas = document.createElement('canvas');
            const shipmentId = data.shipment_id;
            JsBarcode(canvas, shipmentId, {
                format: "CODE128",
                displayValue: false,
                height: 50,
                width: 2,
                margin: 0
            });
            const barcodeDataURL = canvas.toDataURL('image/png');
            doc.addImage(barcodeDataURL, 'PNG', 5, 20, 90, 25);
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text("ON HOLD", 50, 32, { align: 'center' });
            
            // Barcode Text (Below Barcode)
            const barcodeText = shipmentId;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.text(barcodeText, 5, 50);

            // 4. Suite Box (Right)
            const suiteNo = data.suite || '';
            doc.setDrawColor(0, 0, 0);
            doc.setTextColor(0, 0, 0);
            doc.roundedRect(100, 28, 45, 15, 1.5, 1.5, 'S'); 
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.text("SUITE:", 103, 33);
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.text(suiteNo, 122.5, 40, { align: 'center' });

            // 5. User Name (Right)
            const userName = data.user|| '';
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.text(`${userName} (${suiteNo})`, 100, 50);

            // 6. Dashed Separator Line
            doc.setLineDashPattern([1, 1], 0);
            doc.line(5, 58, 145, 58);
            doc.setLineDashPattern([], 0); // Reset dash pattern

            // 7. Weight / Pcs (Bottom-Left)
            const weight = parseFloat(data.weight || '0').toFixed(2);
            const pieces = data.measurements.length || 0;
            const weightText = `WEIGHT: ${weight} KG / ${pieces} PCS`;
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.text(weightText, 5, 65);

            // 8. REG. DATE (Bottom-Right)
            doc.text(`REG. DATE: ${data.createdAt}`, 100, 65);

            // 9. REDBOX Box (Footer-Left)
            doc.setFillColor(0, 0, 0);
            doc.rect(5, 75, 30, 10, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("REDBOX", 7, 82);

            // 10. MV (Footer-Right) - Static as per image template
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text("MV", 135, 85);

            doc.save(`hold-label-${shipmentId}.pdf`);
            toast.success("Hold Label downloaded successfully!");

        } catch (error) {
            console.error("Failed to generate PDF hold label:", error);
            toast.error("Failed to generate PDF. Please try again.");
        } finally {
            setIsPrintingHold(false);
        }
    }
    
    return (
        <Button
            variant="contained"
            startIcon={isPrintingHold ? <CircularProgress size={20} color="inherit" /> : null}
            onClick={handlePrintHoldLabel}
            disabled={isPrintingHold}
            sx={{ textTransform: 'none' }}
        >
            {isPrintingHold ? 'Printing...' : 'Print Hold Label'}
        </Button>
    )
}

export default PrintHoldLabelButton;