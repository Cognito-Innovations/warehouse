import jsPDF from "jspdf";
import QRCode from 'qrcode';
import JsBarcode from "jsbarcode";
import type { CarrierLabelData } from "../ActionButtons/PrintCarrierLabelButton";

export const generateCarrierLabelPDF = async (data: CarrierLabelData): Promise<void> => {
    if (!data) {
        throw new Error("Required data for carrier label is missing.");
    }

    // Page Setup - A6 size (105mm x 148mm)
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [105, 210]
    });

    const pageW = 105;
    const margin = 5;
    const contentW = pageW - (margin * 2);
    let y = margin;

    const wrapperX = margin;
    const wrapperY = y;
    const wrapperW = contentW;

    let wrapperHeight = 0;

    // ========== HEADER SECTION ==========
    const headerH = 12;
    
    // REDBOX Logo - Red background with white text
    doc.setFillColor(220, 38, 38); // Red color
    doc.rect(margin, y, 35, headerH, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text("REDBOX", margin + 17.5, y + 8, { align: 'center' });

    // IN/MV Box - Black background with white divider
    const inMvX = margin + 36;
    doc.setFillColor(0, 0, 0);
    doc.rect(inMvX, y, 25, headerH, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("IN", inMvX + 6, y + 8);
    doc.text("MV", inMvX + 16, y + 8);
    // White vertical divider
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.line(inMvX + 12.5, y + 2, inMvX + 12.5, y + headerH - 2);

    // 6238 Box - White background with border
    const numBoxX = margin + 62;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(numBoxX, y, 18, headerH, 'FD');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("6238", numBoxX + 9, y + 8, { align: 'center' });

    y += headerH + 3;

    // ========== SHIPMENT DETAILS TABLE WITH QR CODE ==========
    const tableH = 11;
    const tableW = 68;
    
    // QR Code on the right
    const qrSize = 22;
    const qrX = pageW - margin - qrSize - 3;
    const qrY = y;
    const qrCodeDataURL = await QRCode.toDataURL(data.created_at!, { 
        width: 150, 
        margin: 0,
        color: { dark: '#000000', light: '#FFFFFF' }
    });
    doc.addImage(qrCodeDataURL, 'PNG', qrX, qrY, qrSize, qrSize);
    
    // Rotated date text
    const dateText = data.created_at!;
    const dateX = qrX + qrSize + 11;  // a little right of QR code
    const dateY = qrY + qrSize / 11;  // vertical center of QR code

    doc.setFont("helvetica", "normal");
    doc.setFontSize(5);
    doc.setTextColor(0, 0, 0);
    doc.text(dateText, dateX, dateY, { angle: 270, align: 'center' });

    // Shipment Details Table
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    
    // Table structure - 2 rows, 3 columns
    const col1W = 22;
    const col2W = 24;

    // Add left spacing inside the wrapper
    const tableOffsetX = 1; 
    
    // Draw outer rectangle
    doc.rect(margin + tableOffsetX, y, tableW, tableH * 2);
    
    // Horizontal divider
    doc.line(margin + tableOffsetX, y + tableH, margin + tableOffsetX + tableW, y + tableH);
    
    // Vertical dividers
    doc.line(margin + tableOffsetX + col1W, y, margin + tableOffsetX + col1W, y + tableH * 2);
    doc.line(margin + tableOffsetX + col1W + col2W, y, margin + tableOffsetX + col1W + col2W, y + tableH * 2);

    // Table Headers and Data
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 100, 100);
    
    // Row 1
    doc.text("ORIGIN", margin + tableOffsetX + 1, y + 3);
    doc.text("WEIGHT (KG)", margin + tableOffsetX + col1W + 1, y + 3);
    doc.text("NO. OF PIECES", margin + tableOffsetX + col1W + col2W + 1, y + 3);

    // Row 1 Data
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(0, 0, 0);
    doc.text(data.origin_country || "INDIA", margin + tableOffsetX + 1, y + 8);
    doc.text(data.total_weight || "-", margin + tableOffsetX + col1W + 1, y + 8);
    doc.text(data.num_pieces || "1 PCS", margin + tableOffsetX + col1W + col2W + 1, y + 8);

    // Row 2
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 100, 100);
    doc.text("DESTINATION", margin + tableOffsetX + 1, y + tableH + 3);
    doc.text("DIMENSION (CM)", margin + tableOffsetX + col1W + 1, y + tableH + 3);
    doc.text("VALUE ($)", margin + tableOffsetX + col1W + col2W + 1, y + tableH + 3);

    // Row 2 Data
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(0, 0, 0);

    doc.text(data.user?.address?.country || "MALDIVES", margin + tableOffsetX + 1, y + tableH + 8);

    // Dimensions
    const length = data.length ? Math.floor(Number(data.length)) : null;
    const height = data.height ? Math.floor(Number(data.height)) : null;
    const width  = data.width  ? Math.floor(Number(data.width))  : null;

    const dimensionText = length && height && width ? `${length} X ${height} X ${width}` : "-";

    doc.text(dimensionText, margin + tableOffsetX + col1W + 1, y + tableH + 8);
    
    const valueText =
        data.value_usd && !isNaN(Number(data.value_usd))
          ? Math.floor(Number(data.value_usd)).toString()
          : "-";
    doc.text(valueText, margin + tableOffsetX + col1W + col2W + 1, y + tableH + 8);

    y += (tableH * 2) + 3;

    // ========== BLACK SEPARATOR BAR ==========
    doc.setFillColor(0, 0, 0);
    doc.rect(margin, y, contentW, 2, 'F');
    y += 10;

    // ========== TRACKING NUMBER SECTION ==========
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text("TRACKING NUMBER", pageW / 2, y, { align: 'center' });
    
    y += 3;
    
    // Barcode
    const barcodeCanvas = document.createElement('canvas');
    JsBarcode(barcodeCanvas, data.tracking_no || 'RB3562366238', {
        format: "CODE128",
        displayValue: false,
        height: 100,
        width: 2,
        margin: 0
    });
    doc.addImage(barcodeCanvas.toDataURL('image/png'), 'PNG', margin + 10, y, contentW - 20, 18);
    
    y += 25;
    
    // Tracking number text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(data.tracking_no || 'RB3562366238', pageW / 2, y, { align: 'center' });
    
    y += 6;

    // ========== FROM SECTION ==========
    const fromH = 32;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, contentW, fromH);
    
    // FROM label box
    doc.setFillColor(0, 0, 0);
    doc.rect(margin, y, 18, 7, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("FROM", margin + 9, y + 5, { align: 'center' });
    
    // palakart logo/text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(138, 43, 226); // Purple color
    doc.text("palakart", margin + 2, y + 20);
    
    // From address
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(0, 0, 0);

    // Split courier_address into lines of ~40 characters
    const address = data.user?.preference?.courier?.address || "";
    const addressLines = doc.splitTextToSize(address, contentW - 45); // leave space for logo
    const fromLines = [...addressLines, data.user?.preference?.courier?.phone_number || "-"];
    
    let fromLineY = y + 4;
    for (let i = 0; i < fromLines.length; i++) {
        if (i === 0) {
            doc.setFont("helvetica", "bold");
        } else {
            doc.setFont("helvetica", "normal");
        }
        doc.text(fromLines[i], margin + 40, fromLineY);
        fromLineY += 4;
    }
    
    y += fromH + 1;

    // ========== TO SECTION ==========
    const toH = 22;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, contentW, toH);
    
    // TO label box
    doc.setFillColor(0, 0, 0);
    doc.rect(margin, y, 12, 7, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("TO", margin + 6, y + 5, { align: 'center' });
    
    // Three small checkbox squares
    const checkboxY = y + 10;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.rect(margin + 2, checkboxY, 4, 4);
    doc.rect(margin + 7, checkboxY, 4, 4);
    doc.rect(margin + 12, checkboxY, 4, 4);
    
    // To Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(0, 0, 0);
    doc.text(data.user?.name ?? "-", margin + 22, y + 5);

    // To Address
    const toAddressObj = data.user?.address?.[0];
    let toAddressLines: string[] = [];
    
    if(toAddressObj){
    // Construct the address line by line
    const addressLine1 = toAddressObj?.address;
    const addressLine2 = [toAddressObj?.city, toAddressObj?.state, toAddressObj?.zip_code]
      .filter(Boolean)
      .join(", ");
    const addressLine3 = toAddressObj?.country;

    toAddressLines = [addressLine1, addressLine2, addressLine3];
    let toLineY = y + 9;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    for (const line of toAddressLines) {
        doc.text(line, margin + 22, toLineY);
        toLineY += 4;
    }
  }
    
    // Contact Numbers
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.text("CONTACT", pageW - margin - 25, y + 9);
    doc.text("NUMBERS:", pageW - margin - 25, y + 12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);

    const contactNumbers = [data.user?.phone_number, data.user?.phone_number_2].filter(Boolean).join(", ");
    doc.text(contactNumbers || "-", pageW - margin - 25, y + 16, { align: 'left' });

    y += toH + 1;

    // ========== REFERENCE & PIECE ID SECTION ==========
    const refH = 12;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, contentW, refH);
    
    // Vertical divider
    doc.line(margin + 35, y, margin + 35, y + refH);
    
    // Reference
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 100, 100);
    doc.text("REFERENCE", margin + 1, y + 3);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(0, 0, 0);
    doc.text(data.shipment_no!, margin + 1, y + 8);
    
    // TODO: When we have Piece ID then uncomment
    // Piece ID
    // doc.setFont("helvetica", "normal");
    // doc.setFontSize(6.5);
    // doc.setTextColor(100, 100, 100);
    // doc.text("PIECE ID", margin + 36, y + 3);
    // doc.setFont("helvetica", "bold");
    // doc.setFontSize(8.5);
    // doc.setTextColor(0, 0, 0);
    // doc.text(data.piece_id || "6238 - 1A", margin + 36, y + 8);
    
    // // Piece ID Barcode
    // const pieceCanvas = document.createElement('canvas');
    // JsBarcode(pieceCanvas, (data.piece_id || '62381A').replace(/[\s-]/g, ''), {
    //     format: "CODE128",
    //     displayValue: false,
    //     height: 50,
    //     width: 1.2,
    //     margin: 0
    // });
    // doc.addImage(pieceCanvas.toDataURL('image/png'), 'PNG', pageW - margin - 28, y + 2, 26, 8);
    
    y += refH + 1;

    // ========== CONTENTS SECTION ==========
    const contentsH = 18;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, contentW, contentsH);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 100, 100);
    doc.text("CONTENTS:", margin + 1, y + 3);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(0, 0, 0);
    let contents = "No items found";

    const items = data.packages?.flatMap((pkg) => pkg.items) || [];
    if (items.length > 0) {
      contents = items
        .map((item) => `${item.quantity || 1}x ${(item.name || "").toUpperCase()}`)
        .join(", ");
    }

    // Split text into lines that fit the box width
    let contentLines = doc.splitTextToSize(contents, contentW - 3);

    // Approximate number of lines that can fit vertically (with 3mm top gap)
    const maxLines = Math.floor((contentsH - 5) / 3.5);

    // If lines exceed box height, truncate and append "..."
    if (contentLines.length > maxLines) {
      const visibleLines = contentLines.slice(0, maxLines);
      let lastLine = visibleLines[visibleLines.length - 1];

      // Ensure ellipsis fits nicely
      if (!lastLine.endsWith("...")) {
        lastLine = lastLine.slice(0, -3) + "...";
      }
      visibleLines[visibleLines.length - 1] = lastLine;
      contentLines = visibleLines;
    }

    doc.text(contentLines, margin + 1, y + 7);

    // Calculate total wrapper height
    wrapperHeight = y - wrapperY;

    // Draw single outer rectangle
    doc.setDrawColor(0,0,0);
    doc.setLineWidth(0.3);
    doc.rect(wrapperX, wrapperY, wrapperW, wrapperHeight);

    // Save PDF
    doc.save(`carrier-label-${data.tracking_no || 'RB3562366238'}.pdf`);
};