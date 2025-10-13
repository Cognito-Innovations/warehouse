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

      // Wrapper box
      const wrapperX = margin + 5;
      const wrapperY = headerY + 12;
      const wrapperWidth = pageWidth - 2 * wrapperX;
      const wrapperHeight = 120;

      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.8);
      doc.roundedRect(wrapperX, wrapperY, wrapperWidth, wrapperHeight, 2, 2, 'S');

      // Inner padding
      const padding = 5;
      const contentStartX = wrapperX + padding;
      let currentY = wrapperY + padding;

      // Palakart Logo
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(109, 40, 217);
      doc.text("Palakart", contentStartX, currentY);

      // IN Text (right top inside wrapper)
      const statusText = "IN";
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const statusX = wrapperX + wrapperWidth - padding;
      const statusY = currentY;
      doc.text(statusText, statusX, statusY, { align: 'right' });

      // Y position for Suite and Package Arrived
      currentY += 10;

      // SUITE (Left)
      const suiteBoxWidth = 35;
      const suiteBoxHeight = 12;
      const suiteX = contentStartX;
      const suiteY = currentY;

      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text("SUITE:", suiteX, suiteY);

      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.roundedRect(suiteX, suiteY + 1.5, suiteBoxWidth, suiteBoxHeight, 1, 1, 'S');
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(data.suite_no || 'N/A', suiteX + (suiteBoxWidth / 2), suiteY + 8, { align: 'center' });

      // PACKAGE ARRIVED (Right)
      const arrivedBoxWidth = 60;
      const arrivedBoxHeight = 8;
      const arrivedX = wrapperX + wrapperWidth - padding - arrivedBoxWidth;

      doc.setFillColor(0, 0, 0);
      doc.roundedRect(arrivedX, suiteY, arrivedBoxWidth, arrivedBoxHeight, 1, 1, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("PACKAGE ARRIVED", arrivedX + (arrivedBoxWidth / 2), suiteY + 5.5, { align: 'center' });

      currentY = suiteY + Math.max(suiteBoxHeight, arrivedBoxHeight) + 6;

      // User Information
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      const userInfoX = wrapperX + wrapperWidth - padding;
      doc.text(`${data.name || 'N/A'} (${data.suite_no || 'N/A'})`, userInfoX, currentY, { align: 'right' });

      // Dashed separator
      const dashY = currentY + 8;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      for (let x = contentStartX; x < wrapperX + wrapperWidth - padding; x += 2) {
        doc.line(x, dashY, x + 1, dashY);
      }

      // Weight and Registration Date
      const detailsY = dashY + 8;
      const weightText = `WEIGHT: ${parseFloat(data.weight || '0').toFixed(1)} KG / ${data.items?.length || 0} PCS`;
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text(weightText, contentStartX, detailsY);

      doc.setFont("helvetica", "normal");
      const formattedDate = format(new Date(data.createdAt), 'dd MMM yyyy - HH:mm');
      doc.text(`REG. DATE: ${formattedDate}`, wrapperX + wrapperWidth - padding, detailsY, { align: 'right' });

      // Solid separator line
      const separatorY = detailsY + 6;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(contentStartX, separatorY, wrapperX + wrapperWidth - padding, separatorY);

      // Package ID Section
      const pkgIdY = separatorY + 8;
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text("PKG ID", contentStartX, pkgIdY);

      // Barcode
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
      doc.addImage(barcodeDataURL, 'PNG', contentStartX, barcodeY, barcodeWidth, barcodeHeight);

      // Package ID text
      const pkgIdTextY = barcodeY + barcodeHeight + 3;
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(data.id, contentStartX + (barcodeWidth / 2), pkgIdTextY, { align: 'center' });

      // Last 4 digits
      const lastFourDigits = data.id?.slice(-4) || '0000';
      const digitsBoxWidth = 16;
      const digitsBoxHeight = 8;
      const digitsBoxX = contentStartX + barcodeWidth + 8;
      const digitsBoxY = barcodeY + 1;

      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.roundedRect(digitsBoxX, digitsBoxY, digitsBoxWidth, digitsBoxHeight, 1, 1, 'S');
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(lastFourDigits, digitsBoxX + (digitsBoxWidth / 2), digitsBoxY + 5.5, { align: 'center' });

      // QR Code
      const qrCodeUrl = `${window.location.origin}/packages/${data.id}`;
      const qrCodeDataURL = await QRCode.toDataURL(qrCodeUrl, { width: 60, margin: 1 });
      const qrCodeSize = 10;
      const qrCodeX = digitsBoxX + digitsBoxWidth + 8;
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
