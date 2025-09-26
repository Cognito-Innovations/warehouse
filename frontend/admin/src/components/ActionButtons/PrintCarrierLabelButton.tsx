import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import jsPDF from "jspdf";
import QRCode from 'qrcode';
import JsBarcode from "jsbarcode";
import { toast } from "sonner";
import { updatePackageStatus } from "../../services/api.services";

const topRoundedRect = (doc: jsPDF, x: number, y: number, w: number, h: number, r: number) => {
    doc.roundedRect(x, y, w, h, r, r, 'S'); // Stroke only
};

interface PrintCarrierLabelButtonProps {
    data: any;
    onRefresh: () => void;
}

const PrintCarrierLabelButton: React.FC<PrintCarrierLabelButtonProps> = ({ data, onRefresh }) => {
    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrintCarrierLabel = async () => {
        setIsPrinting(true);
        try {
            // --- 1. Data Validation
            if (!data) {
                toast.error("Required data for carrier label is missing.");
                console.error("Missing data for carrier label:", data);
                return;
            }

            // --- 2. PDF Document Initialization (4x6 inch standard label size)
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [101.6, 152.4] // 4 x 6 inches
            });

            const pageW = doc.internal.pageSize.getWidth();
            const margin = 4;

            // --- 3. Header Section
            // Redbox Logo
            doc.setFillColor(220, 38, 38); // Red color
            doc.rect(margin, margin, 28, 9, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text("REDBOX", margin + 2, margin + 6.5);

            // IN | MV | 6238 Box
            const pieceInfo = data.piece_info || '6238';
            const headerBoxText = `${data.origin_country_code || 'IN'} | ${data.destination_country_code || 'MV'} | ${pieceInfo}`;
            doc.setFillColor(0, 0, 0);
            doc.rect(margin + 30, margin, 38, 9, 'F');
            doc.setFontSize(12);
            doc.text(headerBoxText, margin + 32, margin + 6.5);

            // QR Code
            const qrCodeData = data.trackingNo; // Use tracking number for QR
            const qrCodeDataURL = await QRCode.toDataURL(qrCodeData, { width: 80, margin: 1 });
            doc.addImage(qrCodeDataURL, 'PNG', pageW - margin - 20, margin, 20, 20);
            
            // Vertical Date
            const dateText = data.createdAt;
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            doc.text(dateText, pageW - margin - 22, margin + 19, { angle: 270 });
            
            // --- 4. Shipment Details Table
            let yPos = margin + 15;
            doc.setDrawColor(180, 180, 180);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(7);
            
            // Box containing details
            doc.rect(margin, yPos, 70, 22, 'S');
            doc.line(margin + 23, yPos, margin + 23, yPos + 22); // Vertical line
            doc.line(margin, yPos + 7, margin + 70, yPos + 7); // Horizontal line 1
            doc.line(margin, yPos + 14, margin + 70, yPos + 14); // Horizontal line 2
            
            // Column 1 Titles
            doc.text("ORIGIN", margin + 2, yPos + 4);
            doc.text("DESTINATION", margin + 2, yPos + 11);
            doc.text("NO. OF PIECES", margin + 2, yPos + 18);

            // Column 2 Titles
            doc.text("WEIGHT (KG)", margin + 25, yPos + 4);
            doc.text("DIMENSION (CM)", margin + 25, yPos + 11);
            doc.text("VALUE ($)", margin + 25, yPos + 18);
            
            // Dynamic Data
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.text(data.origin_country || 'INDIA', margin + 18, yPos + 4, { align: 'right' });
            doc.text(data.destination_country || 'MALDIVES', margin + 18, yPos + 11, { align: 'right' });
            doc.text(data.num_pieces || '1 PCS', margin + 18, yPos + 18, { align: 'right' });
            
            doc.text(data.weight || '15.03 KG', margin + 68, yPos + 4, { align: 'right' });
            doc.text(data.dimensions_cm || '39 X 40 X 39', margin + 68, yPos + 11, { align: 'right' });
            doc.text(data.value_usd || '396.88', margin + 68, yPos + 18, { align: 'right' });
            
            // --- 5. Tracking Number & Barcode
            yPos += 24;
            doc.setFillColor(0, 0, 0);
            doc.rect(margin, yPos, pageW - (margin * 2), 1, 'F');
            yPos += 3;
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.text("TRACKING NUMBER", pageW / 2, yPos, { align: 'center' });
            yPos += 1;
            
            // Barcode generation
            const canvas = document.createElement('canvas');
            JsBarcode(canvas, data.trackingNo, {
                format: "CODE128", displayValue: true, fontOptions: "bold",
                fontSize: 16, height: 50, width: 2, margin: 0
            });
            const barcodeDataURL = canvas.toDataURL('image/png');
            doc.addImage(barcodeDataURL, 'PNG', margin + 5, yPos, pageW - (margin * 2) - 10, 20);
            yPos += 22;

            // --- 6. FROM / TO Address Section
            doc.setDrawColor(0,0,0);
            topRoundedRect(doc, margin, yPos, pageW - (margin * 2), 40, 3);
            doc.line(pageW / 2, yPos, pageW / 2, yPos + 40); // Vertical separator

            // FROM
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("FROM", margin + 3, yPos + 6);
            // Shopme Logo Placeholder
            doc.setFont("helvetica", "italic");
            doc.setFontSize(14);
            doc.text("shopme", margin + 25, yPos + 6);
            // From Address
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.5);
            const fromAddressLines = doc.splitTextToSize(
              Array.isArray(data.from_address?.lines) ? data.from_address.lines.join('\n') : '', 
              40
            );
            doc.text(fromAddressLines, margin + 3, yPos + 12);
            doc.text(data.from_address?.phone || '', margin + 3, yPos + 35);
            
            // TO
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("TO", (pageW / 2) + 3, yPos + 6);
            doc.setFontSize(9);
            doc.text(data.to_address?.name || '', (pageW / 2) + 3, yPos + 12);
            // To Address
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            const toAddressLines = doc.splitTextToSize(
              Array.isArray(data.to_address?.lines) ? data.to_address.lines.join('\n') : '', 
              40
            );
            doc.text(toAddressLines, (pageW / 2) + 3, yPos + 18);
            doc.text(`Contact: ${(Array.isArray(data.to_address?.contact_numbers) ? data.to_address.contact_numbers : []).join(', ')}`, 
                (pageW / 2) + 3, yPos + 35);
            yPos += 42;

            // --- 7. Reference / Piece ID Section
            doc.rect(margin, yPos, pageW - (margin * 2), 15, 'S');
            doc.line(pageW / 2, yPos, pageW / 2, yPos + 15);
            
            // Reference
            doc.setFontSize(7);
            doc.setFont("helvetica", "bold");
            doc.text("REFERENCE", margin + 2, yPos + 4);
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(data.reference || '', margin + 2, yPos + 10);
            
            // Piece ID
            doc.setFontSize(7);
            doc.setFont("helvetica", "bold");
            doc.text("PIECE ID", (pageW / 2) + 2, yPos + 4);
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(data.piece_id || '', (pageW / 2) + 2, yPos + 10);

            // Small Barcode
            const pieceIdCanvas = document.createElement('canvas');
            JsBarcode(pieceIdCanvas, (data.piece_id || '1234').replace(/\s/g, ''), {
                format: "CODE128", displayValue: false, height: 30, width: 1.5, margin: 0
            });
            const pieceIdBarcodeURL = pieceIdCanvas.toDataURL('image/png');
            doc.addImage(pieceIdBarcodeURL, 'PNG', pageW - margin - 32, yPos + 2, 30, 11);
            yPos += 17;

            // --- 8. Contents Section
            doc.rect(margin, yPos, pageW - (margin * 2), 18, 'S');
            doc.setFontSize(7);
            doc.setFont("helvetica", "bold");
            doc.text("CONTENTS:", margin + 2, yPos + 4);
            doc.setFont("helvetica", "normal");
            const contentLines = doc.splitTextToSize(data.contents || '', 88);
            doc.text(contentLines, margin + 2, yPos + 8);
            
            // --- 9. Save PDF and Update Status
            doc.save(`carrier-label-${data.trackingNo}.pdf`);
            toast.success("Carrier Label downloaded successfully!");

            if (data.status?.value === "Payment Approved") {
                await updatePackageStatus(data.id, "Ready To Ship");
                await onRefresh();
            }

        } catch (error) {
            console.error("Failed to generate PDF carrier label:", error);
            toast.error("Failed to generate PDF. Please try again.");
        } finally {
            setIsPrinting(false);
        }
    };

    return (
        <Button
            variant="contained"
            startIcon={isPrinting ? <CircularProgress size={20} color="inherit" /> : null}
            onClick={handlePrintCarrierLabel}
            disabled={isPrinting}
            sx={{
                textTransform: 'none',
                bgcolor: "#a855f7",
                "&:hover": { bgcolor: "#9333ea" },
            }}
        >
            {isPrinting ? 'Printing...' : 'Print Carrier Label'}
        </Button>
    )
}

export default PrintCarrierLabelButton;