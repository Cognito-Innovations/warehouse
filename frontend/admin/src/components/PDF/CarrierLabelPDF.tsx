import jsPDF from "jspdf";
import QRCode from 'qrcode';
import JsBarcode from "jsbarcode";
import type { CarrierLabelData } from "../ActionButtons/PrintCarrierLabelButton";

const topRoundedRect = (doc: jsPDF, x: number, y: number, w: number, h: number, r: number) => {
    doc.roundedRect(x, y, w, h, r, r, 'S'); // Stroke only
};

export const generateCarrierLabelPDF = async (data: CarrierLabelData): Promise<void> => {
    // --- 1. Data Validation
    if (!data) {
        throw new Error("Required data for carrier label is missing.");
    }

    // --- 2. PDF Document Initialization (Much larger size to prevent cutting)
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [130, 200] // Much larger size to prevent cutting and overlap
    });

    const pageW = doc.internal.pageSize.getWidth();
    const margin = 8; // Much increased margin for better spacing

    // --- 3. Header Section - Much better spaced layout to prevent corner overlap
    // REDBOX Logo - Better positioned
    doc.setFillColor(220, 38, 38); // Red color
    doc.rect(margin, margin, 35, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("REDBOX", margin + 4, margin + 8);

    // IN → MV Box (with arrow) - Much better positioned
    doc.setFillColor(0, 0, 0);
    doc.roundedRect(margin + 37, margin, 35, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text("IN", margin + 41, margin + 8);
    doc.text("→", margin + 47, margin + 8); // Proper arrow character
    doc.text("MV", margin + 53, margin + 8);

    // 6238 Box (white background) - Much better positioned
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(0, 0, 0);
    doc.roundedRect(margin + 74, margin, 20, 12, 2, 2, 'FD');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text("6238", margin + 81, margin + 8);

    // QR Code - Much better positioned to avoid any overlap
    const qrCodeData = data.trackingNo;
    const qrCodeDataURL = await QRCode.toDataURL(qrCodeData, { width: 120, margin: 1 });
    doc.addImage(qrCodeDataURL, 'PNG', pageW - margin - 25, margin + 1, 22, 22);
    
    // Vertical Date - Positioned much further from QR code
    const dateText = data.createdAt || new Date().toLocaleDateString();
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(dateText, pageW - margin - 30, margin + 50, { angle: 270 });
    
    // --- 4. Shipment Details Table - Much better spacing and layout
    let yPos = margin + 18; // Much more space from header
    doc.setDrawColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    
    // Box containing details - Much better spacing and layout
    const tableWidth = pageW - (margin * 2);
    const col1Width = 42; // Much increased width for first column
    const col2Width = 50; // Much increased width for second column
    
    doc.rect(margin, yPos, tableWidth, 40, 'S'); // Much increased height for better spacing
    doc.line(margin + col1Width, yPos, margin + col1Width, yPos + 40); // Vertical line 1
    doc.line(margin + col1Width + col2Width, yPos, margin + col1Width + col2Width, yPos + 40); // Vertical line 2
    doc.line(margin, yPos + 20, pageW - margin, yPos + 20); // Horizontal line
    
    // Row 1 Titles - Much better positioned with proper spacing
    doc.text("ORIGIN", margin + 5, yPos + 14);
    doc.text("WEIGHT (KG)", margin + col1Width + 5, yPos + 14);
    doc.text("NO. OF PIECES", margin + col1Width + col2Width + 5, yPos + 14);

    // Row 2 Titles - Much better positioned with proper spacing
    doc.text("DESTINATION", margin + 5, yPos + 34);
    doc.text("DIMENSION (CM)", margin + col1Width + 5, yPos + 34);
    doc.text("VALUE ($)", margin + col1Width + col2Width + 5, yPos + 34);
    
    // Dynamic Data - Much better spacing to prevent overlap
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    
    // Row 1 Data - Properly spaced with adequate margins
    doc.text(data.origin_country || 'INDIA', margin + col1Width - 8, yPos + 14, { align: 'right' });
    doc.text(data.weight || '15.03 KG', margin + col1Width + col2Width - 8, yPos + 14, { align: 'right' });
    doc.setFont("helvetica", "bold");
    doc.text(data.num_pieces || '1 PCS', pageW - margin - 8, yPos + 14, { align: 'right' });
    
    // Row 2 Data - Properly spaced with adequate margins
    doc.setFont("helvetica", "normal");
    doc.text(data.destination_country || 'MALDIVES', margin + col1Width - 8, yPos + 34, { align: 'right' });
    doc.text(data.dimensions_cm || '39 X 40 X 39', margin + col1Width + col2Width - 8, yPos + 34, { align: 'right' });
    doc.text(data.value_usd || '396.88', pageW - margin - 8, yPos + 34, { align: 'right' });
    
    // --- 5. Tracking Number & Barcode - Much better spacing
    yPos += 45; // Much more space from table to prevent overlap
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("TRACKING NUMBER", pageW / 2, yPos, { align: 'center' });
    yPos += 8; // More space between label and barcode
    
    // Barcode generation - Better sized and positioned
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, data.trackingNo, {
        format: "CODE128", 
        displayValue: false, // Hide the number below barcode
        fontOptions: "bold",
        fontSize: 20, 
        height: 70, 
        width: 3, 
        margin: 0
    });
    const barcodeDataURL = canvas.toDataURL('image/png');
    doc.addImage(barcodeDataURL, 'PNG', margin + 15, yPos, pageW - (margin * 2) - 30, 30);
    yPos += 35; // More space between barcode and tracking number
    
    // Tracking number below barcode - Better positioned
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(data.trackingNo, pageW / 2, yPos, { align: 'center' });
    yPos += 15; // More space before next section

    // --- 6. FROM / TO Address Section - Much better spacing
    doc.setDrawColor(0,0,0);
    topRoundedRect(doc, margin, yPos, pageW - (margin * 2), 60, 3); // Much increased height
    doc.line(pageW / 2, yPos, pageW / 2, yPos + 60); // Vertical separator

    // FROM
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("FROM", margin + 5, yPos + 10);
    
    // Palakart Logo Placeholder
    doc.setFont("helvetica", "italic");
    doc.setFontSize(18);
    doc.text("palakart", margin + 35, yPos + 10);
    
    // From Address - Better positioned
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const fromAddressText = Array.isArray(data.from_address?.lines) 
        ? data.from_address.lines.join('\n') 
        : (data.from_address?.address || '');
    const fromAddressLines = doc.splitTextToSize(fromAddressText, 50);
    doc.text(fromAddressLines, margin + 5, yPos + 20);
    doc.text(data.from_address?.phone || '', margin + 5, yPos + 55);
    
    // TO
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("TO", (pageW / 2) + 5, yPos + 10);
    
    doc.setFontSize(11);
    doc.text(data.to_address?.name || '', (pageW / 2) + 5, yPos + 20);
    
    // To Address - Better positioned
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const toAddressText = Array.isArray(data.to_address?.lines) 
        ? data.to_address.lines.join('\n') 
        : (data.to_address?.address || '');
    const toAddressLines = doc.splitTextToSize(toAddressText, 50);
    doc.text(toAddressLines, (pageW / 2) + 5, yPos + 30);
    
    const contactNumbers = Array.isArray(data.to_address?.contact_numbers) 
        ? data.to_address.contact_numbers.join(', ') 
        : (data.to_address?.phone || '');
    doc.text(`Contact: ${contactNumbers}`, (pageW / 2) + 5, yPos + 55);
    yPos += 62;

    // --- 7. Reference / Piece ID Section - Much better spacing
    doc.rect(margin, yPos, pageW - (margin * 2), 25, 'S'); // Much increased height
    doc.line(pageW / 2, yPos, pageW / 2, yPos + 25);
    
    // Reference
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("REFERENCE", margin + 4, yPos + 8);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(data.reference || '', margin + 4, yPos + 18);
    
    // Piece ID
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("PIECE ID", (pageW / 2) + 4, yPos + 8);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(data.piece_id || '', (pageW / 2) + 4, yPos + 18);

    // Small Barcode - Better positioned
    const pieceIdCanvas = document.createElement('canvas');
    JsBarcode(pieceIdCanvas, (data.piece_id || '1234').replace(/\s/g, ''), {
        format: "CODE128", 
        displayValue: false, 
        height: 40, 
        width: 2.5, 
        margin: 0
    });
    const pieceIdBarcodeURL = pieceIdCanvas.toDataURL('image/png');
    doc.addImage(pieceIdBarcodeURL, 'PNG', pageW - margin - 45, yPos + 3, 40, 18);
    yPos += 27;

    // --- 8. Contents Section - Much better spacing
    doc.rect(margin, yPos, pageW - (margin * 2), 30, 'S'); // Much increased height
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("CONTENTS:", margin + 4, yPos + 8);
    doc.setFont("helvetica", "normal");
    const contentLines = doc.splitTextToSize(data.contents || '', pageW - (margin * 2) - 8);
    doc.text(contentLines, margin + 4, yPos + 15);
    
    // --- 9. Save PDF
    doc.save(`carrier-label-${data.trackingNo}.pdf`);
};
