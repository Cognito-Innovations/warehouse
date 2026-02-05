import JsBarcode from "jsbarcode";
import jsPDF from "jspdf";
import QRCode from 'qrcode';
import { format } from 'date-fns';
import type { PackageData } from "../../types";
import { formatDateTime } from "../../utils/formatDateTime";

interface PackageLabelPDFProps {
  data: PackageData;
}

export const usePackageLabelPDF = ({ data }: PackageLabelPDFProps) => {
  const generatePDF = async () => {
    try {
      // Create A4 size PDF
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Define the Label Dimensions
      const margin = 10;
      const labelWidth = pageWidth - (margin * 6);
      const labelHeight = 80; 
      const startX = margin;
      const startY = margin + 10; 

      // White background
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // Header Section
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      const headerDate = format(new Date(), 'dd/MM/yyyy, HH:mm');
      doc.text(headerDate, startX, startY - 3);

      // URL (top right)
      const urlText = `${window.location.origin}/packages/${data.package_id}/print`;
      doc.text(urlText, startX + labelWidth, startY - 3, { align: 'right' });


      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.rect(startX, startY, labelWidth, labelHeight);

      const padding = 6;
      const row1Y = startY + padding + 10;

      // LOGO: "Palakart"
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28); 
      doc.setTextColor(91, 33, 182); // Deep Purple (#5b21b6)
      doc.text("Palakart", startX + padding, row1Y);

      // "IN" Text
      doc.setFontSize(24);
      doc.setTextColor(0, 0, 0);
      doc.text("IN", startX + labelWidth - padding, row1Y, { align: 'right' });


      // SUITE BOX & STATUS BANNER
      const row2Y = row1Y + 3;

      // SUITE BOX (Left)
      // The Box
      const suiteBoxY = row2Y;
      const suiteBoxWidth = 55;
      const suiteBoxHeight = 16;

      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.8); // Medium-thick border
      doc.roundedRect(startX + padding, suiteBoxY, suiteBoxWidth, suiteBoxHeight, 2, 2, 'S');

      // SUITE label INSIDE box (top-left)
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("SUITE:", startX + padding + 2, suiteBoxY + 5);
      
      // Suite Number (Centered in box)
      const suiteNo = data.user?.suite_no || 'N/A';
      doc.setFontSize(22);
      doc.text(suiteNo, startX + padding + (suiteBoxWidth/2), suiteBoxY + 11, { align: 'center' });


      // PACKAGE ARRIVED (Right)
      const statusBoxWidth = 75;
      const statusBoxHeight = 10;
      const statusBoxX = startX + labelWidth - padding - statusBoxWidth;
      const statusBoxY = suiteBoxY; // Align top with suite box

      // Black Background Box
      doc.setFillColor(0, 0, 0);
      doc.rect(statusBoxX, statusBoxY, statusBoxWidth, statusBoxHeight, 'F');

      // White Text "PACKAGE ARRIVED"
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("PACKAGE ARRIVED", statusBoxX + (statusBoxWidth/2), statusBoxY + 6.5, { align: 'center' });

      // Customer Name (Below Black Box)
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const customerText = `${data.user?.name || 'Unknown'} (${suiteNo})`;
      doc.text(customerText, statusBoxX + (statusBoxWidth/2), statusBoxY + statusBoxHeight + 6, { align: 'center' });

      // SEPARATOR & DETAILS
      const dashY = suiteBoxY + suiteBoxHeight + 3;

      // Dashed Line
      doc.setLineWidth(0.3);
      doc.setLineDash([1.5, 1.5], 0); // Tight dash
      doc.line(startX + 2, dashY, startX + labelWidth - 2, dashY);
      doc.setLineDash([], 0); // Reset to solid

      // Info Text
      const detailsY = dashY + 6;
      
      // Weight
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      const weightVal = parseFloat(data.total_weight || '0').toFixed(2);
      const pcsVal = data.items?.length || 0;
      doc.text(`WEIGHT: ${weightVal} KG / PCS`, startX + padding, detailsY);

      // Reg Date
      const regDate = format(formatDateTime(Number(data.created_at)), 'dd MMM yyyy - HH:mm');
      doc.text(`REG. DATE: ${regDate}`, startX + labelWidth - padding, detailsY, { align: 'right' });

      // Solid separator line
      const solidLineY = detailsY + 4;
      doc.setLineWidth(0.5);
      doc.line(startX + padding, solidLineY, startX + labelWidth - padding, solidLineY);

      // FOOTER (ID, BARCODE, BIG BOX, QR)
      const footerStartY = solidLineY + 4;

      // "PKG ID" Label
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("PKG ID", startX + padding, footerStartY + 3);

      // BARCODE (Left)
      const barcodeY = footerStartY + 5;
      const barcodeWidth = 55;
      const barcodeHeight = 14;
      
      // Generate Barcode Image
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, data.package_id, {
        format: "CODE128",
        displayValue: false,
        height: 40,
        width: 2,
        margin: 0
      });
      const barcodeDataURL = canvas.toDataURL('image/png');
      doc.addImage(barcodeDataURL, 'PNG', startX + padding, barcodeY, barcodeWidth, barcodeHeight);

      // Manual Barcode Text (Centered under barcode)
      doc.setFontSize(9);
      doc.text(data.package_id, startX + padding + (barcodeWidth/2), barcodeY + barcodeHeight + 4, { align: 'center' });

      // QR CODE alignment
      const qrSize = 22;
      const qrX = startX + labelWidth - padding - qrSize;
      const qrY = footerStartY + 2;

      // BIG NUMBER BOX (Center) (Last 4 digits)
      const lastFour = data.package_id?.slice(-4) || '0000';
      const bigBoxWidth = 35;
      const bigBoxHeight = 16;
      
      const barcodeEndX = startX + padding + barcodeWidth;
      const qrStartX = qrX;

      const availableSpace = qrStartX - barcodeEndX;
      const bigBoxX = barcodeEndX + (availableSpace / 2) - (bigBoxWidth / 2);
      const bigBoxY = barcodeY - 1;

      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(1.0);
      doc.roundedRect(bigBoxX, bigBoxY, bigBoxWidth, bigBoxHeight, 3, 3, 'S');

      // Big Text Inside
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text(lastFour, bigBoxX + (bigBoxWidth/2), bigBoxY + 11, { align: 'center' });

      // QR Code
      const qrCodeDataURL = await QRCode.toDataURL(data.package_id, { width: 100, margin: 0 });
      doc.addImage(qrCodeDataURL, 'PNG', qrX, qrY, qrSize, qrSize);

      // Open PDF in new tab
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');

      // Clean up the URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 1000);

    } catch (error) {
      console.error("Failed to generate PDF label:", error);
      throw error;
    }
  };

  return { generatePDF };
};
