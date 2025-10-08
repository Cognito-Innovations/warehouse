import JsBarcode from "jsbarcode";
import jsPDF from "jspdf";
import QRCode from 'qrcode';
import { format } from 'date-fns';
import type { PackageData } from "../../types";

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
      const margin = 15;

      // White background
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // Header Section
      const headerY = margin + 8;
      
      // Date and Time (top left)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      const currentDate = format(new Date(), 'dd/MM/yyyy, HH:mm');
      doc.text(currentDate, margin + 8, headerY);

      // URL (top right)
      const urlText = `${window.location.origin}/api/packages/${data.id}/print`;
      doc.text(urlText, pageWidth - margin - 8, headerY, { align: 'right' });

      // Palakart Logo
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(109, 40, 217); // Purple color
      doc.text("Palakart", margin + 8, headerY + 6);

      // IN Status Box
      const statusBoxWidth = 12;
      const statusBoxHeight = 6;
      const statusBoxX = pageWidth - margin - statusBoxWidth - 8;
      
      doc.setFillColor(0, 0, 0);
      doc.roundedRect(statusBoxX, headerY + 2, statusBoxWidth, statusBoxHeight, 1, 1, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("IN", statusBoxX + (statusBoxWidth / 2), headerY + 5.5, { align: 'center' });

      // Package Arrived Section - Make it narrower like expected
      const arrivedY = headerY + 10;
      const arrivedBoxWidth = 60; // Much narrower
      const arrivedBoxHeight = 8;
      const arrivedBoxX = margin + 8;
      
      doc.setFillColor(0, 0, 0);
      doc.roundedRect(arrivedBoxX, arrivedY, arrivedBoxWidth, arrivedBoxHeight, 1, 1, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("PACKAGE ARRIVED", arrivedBoxX + (arrivedBoxWidth / 2), arrivedY + 5.5, { align: 'center' });

      // Customer Information
      const customerY = arrivedY + 12;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(`${data.customer || 'N/A'} (${data.suite || 'N/A'})`, margin + 8, customerY);

      // Suite Information - Position it better
      const suiteY = customerY + 8;
      const suiteBoxWidth = 35;
      const suiteBoxHeight = 12;
      
      // Suite label
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text("SUITE:", margin + 8, suiteY);
      
      // Suite box
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.roundedRect(margin + 8, suiteY + 1.5, suiteBoxWidth, suiteBoxHeight, 1, 1, 'S');
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(data.suite || 'N/A', margin + 8 + (suiteBoxWidth / 2), suiteY + 8, { align: 'center' });

      // Dashed separator line
      const dashY = suiteY + 15;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      // Create dashed line
      for (let x = margin + 8; x < pageWidth - margin - 8; x += 2) {
        doc.line(x, dashY, x + 1, dashY);
      }

      // Weight and Registration Date - Side by side
      const detailsY = dashY + 8;
      const weightText = `WEIGHT: ${parseFloat(data.weight || '0').toFixed(1)} KG / ${data.items?.length || 0} PCS`;
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text(weightText, margin + 8, detailsY);

      // Registration Date - Right aligned
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      const formattedDate = format(new Date(data.createdAt), 'dd MMM yyyy - HH:mm');
      doc.text(`REG. DATE: ${formattedDate}`, pageWidth - margin - 8, detailsY, { align: 'right' });

      // Solid separator line
      const separatorY = detailsY + 6;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(margin + 8, separatorY, pageWidth - margin - 8, separatorY);

      // Package ID Section
      const pkgIdY = separatorY + 8;
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text("PKG ID", margin + 8, pkgIdY);

      // Barcode - Better positioned with proper spacing
      const barcodeY = pkgIdY + 4;
      const barcodeWidth = 50;
      const barcodeHeight = 10;
      
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, data.id, {
        format: "CODE128",
        displayValue: false,
        height: 30,
        width: 1.2,
        margin: 0
      });
      const barcodeDataURL = canvas.toDataURL('image/png');
      doc.addImage(barcodeDataURL, 'PNG', margin + 8, barcodeY, barcodeWidth, barcodeHeight);

      // Package ID below barcode - Centered under barcode
      const pkgIdTextY = barcodeY + barcodeHeight + 3;
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(data.id, margin + 8 + (barcodeWidth / 2), pkgIdTextY, { align: 'center' });

      // Last 4 digits box - Positioned to the right of barcode
      const lastFourDigits = data.id?.slice(-4) || '0000';
      const digitsBoxWidth = 16;
      const digitsBoxHeight = 8;
      const digitsBoxX = margin + 8 + barcodeWidth + 8; // 8mm gap from barcode
      const digitsBoxY = barcodeY + 1;
      
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.roundedRect(digitsBoxX, digitsBoxY, digitsBoxWidth, digitsBoxHeight, 1, 1, 'S');
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(lastFourDigits, digitsBoxX + (digitsBoxWidth / 2), digitsBoxY + 5.5, { align: 'center' });

      // QR Code - Positioned to the right of the digits box
      const qrCodeUrl = `${window.location.origin}/packages/${data.id}`;
      const qrCodeDataURL = await QRCode.toDataURL(qrCodeUrl, { width: 60, margin: 1 });
      const qrCodeSize = 10;
      const qrCodeX = digitsBoxX + digitsBoxWidth + 8; // 8mm gap from digits box
      const qrCodeY = barcodeY + 1;
      doc.addImage(qrCodeDataURL, 'PNG', qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);

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
