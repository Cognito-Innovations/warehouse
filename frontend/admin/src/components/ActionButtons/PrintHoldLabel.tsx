import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import jsPDF from "jspdf";
import QRCode from 'qrcode';
import JsBarcode from "jsbarcode";
import { toast } from "sonner";
import { formatDateTime } from "../../utils/formatDateTime";

interface HoldLabelData {
    id: string;
    shipment_no: string;
    packages?: any;
    user?: {
        name: string;
        suite_no?: string;
    }
    total_weight?: string;
    length: number;
    width: number;
    height: number;
    created_at?: string;
}

interface PrintHoldLabelButtonProps {
  data: HoldLabelData;
}

const PrintHoldLabelButton: React.FC<PrintHoldLabelButtonProps> = ({ data }) => {
    const [isPrintingHold, setIsPrintingHold] = useState(false);
  
    const handlePrintHoldLabel = async () => {
        setIsPrintingHold(true);
        try {
            if (!data?.id || !data.user?.name) {
                toast.error("Required data for hold label is missing.");
                return;
            }

      const shipmentNo = data.shipment_no;
      const suiteNo = data.user.suite_no || "";
      const userName = data.user.name;

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [150, 100],
      });

      const startY = 8;

      // 1. MASTER Box (Top-Left)
      const masterY = startY + 5;

      doc.setFillColor(0, 0, 0);
      doc.rect(5, masterY, 35, 11, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("MASTER", 8, masterY + 7.5);

      // QR Code
      const qrSize = 20;
      const qrX = 120;
      const qrY = startY + 5;

      const qrCodeDataURL = await QRCode.toDataURL(shipmentNo, {
        width: 80,
        margin: 0,
        errorCorrectionLevel: "M",
      });

      doc.addImage(qrCodeDataURL, "PNG", qrX, qrY, qrSize, qrSize);

      // Barcode
      const canvas = document.createElement("canvas");
      JsBarcode(canvas, shipmentNo, {
        format: "CODE128",
        displayValue: false,
        height: 50,
        width: 2,
        margin: 0,
      });
      const barcodeDataURL = canvas.toDataURL("image/png");

      const gapBelowMaster = 3;
      const barcodeY = masterY + 11 + gapBelowMaster;

      doc.addImage(barcodeDataURL, "PNG", 5, barcodeY, 75, 20);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(18);
      doc.text(shipmentNo, 5, barcodeY + 26);

      // Suite box
      const suiteBoxY = qrY + qrSize + 2;

      doc.setLineWidth(0.5);
      doc.roundedRect(108, suiteBoxY, 34, 15, 2, 2);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("SUITE:", 110, suiteBoxY + 5);

      doc.setFontSize(18);
      doc.text(suiteNo, 125, suiteBoxY + 12, { align: "center" });

      // User name
      const userNameY = suiteBoxY + 20;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`${userName} (${suiteNo})`, 142, userNameY, {
        align: "right",
      });

      // Separator
      const separatorY = userNameY + 4;

      doc.setLineDashPattern([2, 2], 0);
      doc.line(5, separatorY, 145, separatorY);
      doc.setLineDashPattern([], 0);

      // Weight & Date 
      const weight = parseFloat(data.total_weight || "0").toFixed(2);
      const pieces = data.packages?.length || 0;

      const formattedDate =
        formatDateTime(data.created_at)
          ?.split(",")
          .slice(0, 2)
          .join(",")
          .trim() || "";

      const textY = separatorY + 7;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`WEIGHT: ${weight} KG / ${pieces} PCS`, 5, textY);
      doc.text(`REG. DATE: ${formattedDate}`, 145, textY, {
        align: "right",
      });

      // Footer Line
      doc.setLineWidth(1);
      doc.line(5, textY + 3, 145, textY + 3);

      // Footer Content
      const footerY = textY + 6;

      const redboxHeight = 16;
      const redboxWidth = 42;

      doc.setFillColor(0, 0, 0);
      doc.roundedRect(5, footerY, redboxWidth, redboxHeight, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("UGFLASH", 8, footerY + redboxHeight / 2 + 3);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(24);
      doc.text("MV", 145, footerY + redboxHeight / 2 + 4, { align: "right" });

      // Outer Border
      const contentBottomY = footerY + redboxHeight;
      const borderPadding = 3;

      doc.setLineWidth(0.5);
      doc.rect(
        2,
        startY,
        146,
        contentBottomY - startY + borderPadding
      );

            doc.save(`hold-label-${shipmentNo}.pdf`);
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