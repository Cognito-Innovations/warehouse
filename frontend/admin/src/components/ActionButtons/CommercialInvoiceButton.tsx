import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import jsPDF from "jspdf";
import autoTable, { type UserOptions } from 'jspdf-autotable';
import { toast } from "sonner";
import { formatDateTime } from "../../utils/formatDateTime";

interface AutoTableFinalY {
  finalY: number;
}

interface jsPDFWithAutoTable extends jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
    lastAutoTable?: AutoTableFinalY;
}

interface Packages {
    items: Item[];
}

interface Item {
    name: string;
    quantity: number;
    unit_price: string;
    total_price: string;
}

interface InvoiceData {
    id: string;
    shipment_no: string;
    user?: {
        name: string;
        phone?: string;
        suite_no?: string;
        address?: string;
    }
    to_address?: {
        line1?: string;
        zip_code?: string;
    };
    packages: Packages[];
    created_at: number;
}

interface CommercialInvoiceButtonProps {
    data: InvoiceData;
}

const CommercialInvoiceButton: React.FC<CommercialInvoiceButtonProps> = ({ data }) => {
    const [isPrinting, setIsPrinting] = useState(false);

    const handleCommercialInvoiceButton = async () => {
        setIsPrinting(true);
        try {
            if (!data || !data.id || !data.user?.name) {
                toast.error("Required data for the invoice is missing.");
                return;
            }

            const allItems = data.packages
              ?.flatMap((pkg) => pkg.items) ?? [];

            const grandTotal = allItems.reduce(
              (sum, item) => sum + parseFloat(item.total_price || "0"), 
              0
            );

            const doc = new jsPDF() as jsPDFWithAutoTable;
            const pageW = doc.internal.pageSize.getWidth();
            const margin = 14;
            const purpleColor = [104, 38, 128];
            const lightGray = [240, 240, 240];

            // Header Section
            let yPos = 20;
            // Left Side: Sender Info
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text("PALAKART INTERNATIONAL COURIER", margin, yPos);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            yPos += 5;
            doc.text("support@palakart.com", margin, yPos);
            yPos += 4;
            doc.text("6/454, Palakart Nagar, Amman Kovil Road, Perumagoundampatti, Elampillai", margin, yPos);
            yPos += 4;
            doc.text("India", margin, yPos);

            // Right-side: "palakart" Logo and "INVOICE" box
            const rightX = pageW - margin;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(24);
            doc.setTextColor(purpleColor[0], purpleColor[1], purpleColor[2]);
            doc.text("palakart", rightX, 22, { align: "right" });

            // Invoice Badge
            const badgeY = 26;
            const badgeWidth = 40;
            const badgeHeight = 10;
            const badgeX = rightX - badgeWidth;
            doc.setDrawColor(purpleColor[0], purpleColor[1], purpleColor[2]);
            doc.setLineWidth(0.5);
            doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 2, 2, 'S');
            doc.setFontSize(14);
            doc.setTextColor(purpleColor[0], purpleColor[1], purpleColor[2]);
            doc.text("INVOICE", badgeX + (badgeWidth / 2), badgeY + 7, { align: "center" });

            // Address & Details Boxes
            const gap = 5;
            const usableWidth = pageW - (margin * 2);

            // Custom Widths (approximated ratios)
            const wDetails = 45; 
            const wBill = 60;
            const wShip = usableWidth - wDetails - wBill - (gap * 2);

            // Start Y position
            const boxStartY = 38;
            const boxHeaderHeight = 8;
            const boxContentHeight = 25;

            const drawBox = (x: number, width: number, title: string, lines: string[]) => {
              doc.setFillColor(purpleColor[0], purpleColor[1], purpleColor[2]);
              doc.rect(x, boxStartY, width, boxHeaderHeight, 'F');
            
              // Header Text
              doc.setTextColor(255, 255, 255);
              doc.setFont("helvetica", "bold");
              doc.setFontSize(9);
              doc.text(title, x + 3, boxStartY + 5.5);
            
            // Body
            doc.setDrawColor(purpleColor[0], purpleColor[1], purpleColor[2]);
            doc.setLineWidth(0.1);
            doc.rect(x, boxStartY + boxHeaderHeight, width, boxContentHeight, 'S');
                
            // Body Text
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
        
            let textY = boxStartY + boxHeaderHeight + 5;
            lines.forEach(line => {
                doc.text(line, x + 3, textY);
                textY += 4;
              });
            };

            // Ship To Data
            drawBox(margin, wShip, "Ship To", [
              data.user?.name || 'Maryam Maana',
              data.to_address?.line1 || "G. Fun, 3rd Floor, Male' City Kaafu",
              data.to_address?.zip_code ? `${data.to_address.zip_code} MV` : '20131 MV',
              data.user?.phone || '9834396'
            ]);

            // Bill To Data
            drawBox(margin + wShip + gap, wBill, "Bill To", [
              data.user?.name || 'Maryam Maana',
              data.to_address?.line1 || "G. Fun, 3rd Floor, Male' City",
              data.to_address?.zip_code ? `${data.to_address.zip_code} MV` : '20131 MV',
              data.user?.phone || '9834396'
            ]);

            // Invoice Details Data
            drawBox(margin + wShip + gap + wBill + gap, wDetails, "Invoice Details", [
              `Suite ID: ${data.user?.suite_no || '714-881'}`,
              `Invoice Number: ${data.shipment_no || 'N/A'}`,
              `Invoice Date: ${formatDateTime(data.created_at)
                  ?.split(',')
                  .slice(0, 2)
                  .join(',')
                  .trim() || 'Dec 29, 2025'}`,
              `Currency: USD`
            ]);

            // --- 3. Items Table ---
            const tableStartY = boxStartY + boxHeaderHeight + boxContentHeight + 8;
            const tableBody = allItems.map(item => [
              item.name,
              item.quantity,
              parseFloat(item.unit_price).toFixed(2),
              `USD ${parseFloat(item.total_price).toFixed(2)}`
            ]);

            autoTable(doc, {
              startY: tableStartY,
              head: [["Description", "Qty", "Amount", "Total"]],
              body: tableBody,
              foot: [
                  ["TOTAL", "", "", `USD ${grandTotal.toFixed(2)}`]
              ],
              theme: 'grid',
              styles: {
                  font: 'helvetica',
                  fontSize: 9,
                  cellPadding: 3,
                  lineColor: [220, 220, 220],
                  lineWidth: 0.1,
                  textColor: [0, 0, 0]
              },
              headStyles: {
                  fillColor: purpleColor,
                  textColor: [255, 255, 255],
                  fontStyle: 'bold',
                  halign: 'left'
              },
              columnStyles: {
                  0: { halign: 'left', cellWidth: 'auto' }, // Description
                  1: { halign: 'center', cellWidth: 20 },   // Qty
                  2: { halign: 'right', cellWidth: 30 },    // Amount
                  3: { halign: 'right', cellWidth: 35 }     // Total
              },
              footStyles: {
                  fillColor: lightGray,
                  textColor: [0, 0, 0],
                  fontStyle: 'bold',
                  halign: 'right'
              },
              didParseCell: function (data) {
                  // Merge the first 3 columns of the footer for the "TOTAL" label
                  if (data.section === 'foot' && data.column.index === 0) {
                      data.cell.colSpan = 3;
                      data.cell.styles.halign = 'right';
                  }
              },
              margin: { left: margin, right: margin }
            });

              doc.save(`commercial-invoice-${data.id}.pdf`);
              toast.success("Commercial Invoice downloaded successfully!");

            } catch (error) {
              console.error("Failed to generate PDF invoice:", error);
              toast.error("Failed to generate PDF. Please try again.");
            } finally {
              setIsPrinting(false);
            }
        };

    return (
        <Button
            variant="contained"
            startIcon={isPrinting ? <CircularProgress size={20} color="inherit" /> : null}
            onClick={handleCommercialInvoiceButton}
            disabled={isPrinting}
            sx={{
                textTransform: 'none',
                bgcolor: "#a855f7",
                "&:hover": { bgcolor: "#9333ea" },
            }}
        >
            {isPrinting ? 'Printing...' : 'Commercial Invoice'}
        </Button>
    );
};

export default CommercialInvoiceButton;