import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import jsPDF from "jspdf";
import autoTable, { type UserOptions } from 'jspdf-autotable';
import { toast } from "sonner";

interface AutoTableFinalY {
  finalY: number;
}

interface jsPDFWithAutoTable extends jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
    lastAutoTable?: AutoTableFinalY;
}

interface InvoiceItem {
    name: string;
    quantity: number;
    unit_price: string;
    total_price: string;
}

interface InvoiceData {
    id: string;
    user: string;
    phone?: string;
    suite?: string;
    updatedAt?: string;
    to_address?: {
        line1?: string;
        zip_code?: string;
    };
    items: InvoiceItem[];
}

interface CommercialInvoiceButtonProps {
    data: InvoiceData;
}

const CommercialInvoiceButton: React.FC<CommercialInvoiceButtonProps> = ({ data }) => {
    const [isPrinting, setIsPrinting] = useState(false);

    const handleCommercialInvoiceButton = async () => {
        setIsPrinting(true);
        try {
            if (!data || !data.id || !data.user || !data.items) {
                toast.error("Required data for the invoice is missing.");
                return;
            }

            const doc = new jsPDF() as jsPDFWithAutoTable;
            const pageW = doc.internal.pageSize.getWidth();
            const margin = 14;
            const purpleColor = [104, 38, 128];

            // --- 2. Header Section ---
            let yPos = 20;
            // Left-side: Sender Information
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.text("PALAKART INTERNATIONAL COURIER", margin, yPos);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            yPos += 6;
            doc.text("support@palakart.com", margin, yPos);
            yPos += 5;
            doc.text("6/454, Palakart Nagar, Amman Kovil Road, Perumagoundampatti, Elampillai", margin, yPos);
            yPos += 5;
            doc.text("India", margin, yPos);

            // Right-side: "palakart" Logo and "INVOICE" box
            doc.setFont("helvetica", "bold");
            doc.setFontSize(28);
            doc.setTextColor(purpleColor[0], purpleColor[1], purpleColor[2]);
            doc.text("palakart", pageW - margin, 28, { align: "right" });

            const invoiceBoxY = 35;
            const invoiceBoxW = 40;
            const invoiceBoxH = 12;
            doc.setDrawColor(purpleColor[0], purpleColor[1], purpleColor[2]);
            doc.setLineWidth(0.5);
            doc.roundedRect(pageW - margin - invoiceBoxW, invoiceBoxY, invoiceBoxW, invoiceBoxH, 2, 2, 'S');
            doc.setFontSize(22);
            doc.text("INVOICE", pageW - margin - (invoiceBoxW / 2), invoiceBoxY + 8.5, { align: "center" });
            doc.setTextColor(0, 0, 0); // Reset color
            
            yPos = 65; // Set start Y for the next section

            // --- 3. Address & Details Section (Manual Drawing for Precision) ---
            const boxWidth = (pageW - margin * 2) / 3;
            const boxHeaderH = 8;
            const boxBodyH = 25;

            const drawInfoBox = (x: number, y: number, title: string, content: string[]) => {
                // Header
                doc.setFillColor(purpleColor[0], purpleColor[1], purpleColor[2]);
                doc.rect(x, y, boxWidth, boxHeaderH, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(10);
                doc.text(title, x + 4, y + 5.5);

                // Body
                doc.setDrawColor(200, 200, 200);
                doc.rect(x, y + boxHeaderH, boxWidth, boxBodyH, 'S');
                doc.setTextColor(0, 0, 0);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(9);
                doc.text(content, x + 4, y + boxHeaderH + 6);
            };

            // Ship To Box
            const shipToContent = [
                data.user || 'Maryam Maana',
                data.to_address?.line1 || "G. Fun, 3rd Floor, Male' City Kaafu",
                data.to_address?.zip_code ? `${data.to_address.zip_code} MV` : '20131 MV',
                data.phone || '9834396'
            ];
            drawInfoBox(margin, yPos, 'Ship To', shipToContent);
            
            // Bill To Box
            const billToContent = [
                data.user || 'Maryam Maana',
                data.to_address?.line1 || "G. Fun, 3rd Floor, Male' City",
                data.to_address?.zip_code ? `${data.to_address.zip_code} MV` : '20131 MV',
                data.phone || '9834396'
            ];
            drawInfoBox(margin + boxWidth + 6, yPos, 'Bill To', billToContent);
            
            // Invoice Details Box
            const invoiceDetailsContent = [
                `Suite ID: ${data.suite || '714-881'}`,
                `Invoice Number: ${data.id || 'S2025236IN'}`,
                `Invoice Date: ${data.updatedAt || '2025-09-22'}`,
                'Currency: USD'
            ];
            drawInfoBox(margin + (boxWidth + 6) * 2, yPos, 'Invoice Details', invoiceDetailsContent);

            // --- 4. Items Table ---
            const tableColumns = ["Description", "Qty", "Amount", "Total"];
            const tableRows = data.items.map((item: {name: string, quantity: number, unit_price: string, total_price: string}) => [
                `${item.name || 'N/A'}`,
                item.quantity,
                parseFloat(item.unit_price).toFixed(2),
                `USD ${parseFloat(item.total_price).toFixed(2)}`
            ]);
            
            const grandTotal = data.items.reduce((sum: number, item: {total_price: string}) => sum + parseFloat(item.total_price), 0);
            
            autoTable(doc, {
                startY: yPos + boxHeaderH + boxBodyH + 10,
                head: [tableColumns],
                body: tableRows,
                theme: 'grid',
                headStyles: {
                    fillColor: [purpleColor[0], purpleColor[1], purpleColor[2]],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    fontSize: 10,
                    cellPadding: 3,
                },
                styles: {
                    lineColor: [220, 220, 220],
                    lineWidth: 0.2,
                    font: 'helvetica',
                    fontSize: 9,
                    valign: 'middle'
                },
                columnStyles: {
                    0: { cellWidth: 95, halign: 'left' },
                    1: { halign: 'center' },
                    2: { halign: 'right' },
                    3: { halign: 'right' },
                },
                didDrawCell: (data) => {
                    // Custom draw the "Brand:, Model:" text in a smaller, grey font
                    if (data.column.index === 0 && data.cell.text[0].includes('Brand:')) {
                        const [mainText, brandText] = data.cell.text[0].split('\n');
                        const textPos = data.cell.getTextPos();
                        
                        // Erase the default text
                        doc.setFillColor(data.cell.styles.fillColor as string);
                        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                        
                        // Draw main text
                        doc.setTextColor(0, 0, 0);
                        doc.text(mainText, textPos.x, textPos.y);

                        // Draw brand text
                        doc.setFontSize(8);
                        doc.setTextColor(120, 120, 120);
                        doc.text(brandText, textPos.x, textPos.y + 5);
                        doc.setFontSize(9); // Reset
                        doc.setTextColor(0,0,0); // Reset
                    }
                },
                margin: { left: margin, right: margin },
            });

             // --- 5. Total Section ---
             autoTable(doc, {
                startY: doc.lastAutoTable?.finalY || yPos + boxHeaderH + boxBodyH + 10,
                body: [
                    [
                        { content: 'TOTAL', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 } },
                        { content: `USD ${grandTotal.toFixed(2)}`, styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 } }
                    ]
                ],
                theme: 'grid',
                styles: {
                    fillColor: [240, 240, 240],
                    lineColor: [220, 220, 220],
                    lineWidth: 0.2,
                },
                margin: { left: margin, right: margin },
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