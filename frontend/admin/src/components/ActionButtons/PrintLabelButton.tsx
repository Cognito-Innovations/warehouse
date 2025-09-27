import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import JsBarcode from "jsbarcode";
import jsPDF from "jspdf";
import QRCode from 'qrcode';
import { format } from 'date-fns';
import { toast } from "sonner";

interface PrintLabelButtonProps {
  data: any;
}

const PrintLabelButton: React.FC<PrintLabelButtonProps> = ({ data }) => {
    const [isPrinting, setIsPrinting] = useState(false);
    
    const handlePrintLabel = async () => {
        setIsPrinting(true);
        try {
            const doc = new jsPDF({
              orientation: 'landscape',
              unit: 'mm',
              format: [100, 75]
            });
        
           // Palakart Logo
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor('#6d28d9');
            doc.text("palakart", 5, 12);
        
           // IN Box
            doc.setFillColor(255, 255, 255);
            doc.rect(80, 5, 15, 8, 'F');
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("IN", 87.5, 10.5, { align: 'center' });
        
           // Suite Box
            doc.setDrawColor(0, 0, 0);
            doc.setTextColor(0, 0, 0);
            doc.roundedRect(5, 18, 32, 18, 1.5, 1.5, 'S'); 
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            doc.text("SUITE:", 8, 22.5);
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.text(data.suite, 21, 31, { align: 'center' });
        
           // Package Arrived Box
            doc.setFillColor(0, 0, 0);
            doc.rect(40, 18, 55, 8, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.setFont("helvetica", "bold");
            doc.text("PACKAGE ARRIVED", 67.5, 23.5, { align: 'center' });
            
            // Customer Info & Date
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(8);
            doc.setFont("helvetica", "bold");
            doc.text(`${data.customer} (${data.suite})`, 40, 30);
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            const formattedDate = format(new Date(data.createdAt), 'dd MMM yyyy - HH:mm');
            doc.text(`REG. DATE: ${formattedDate}`, 40, 34);
        
           // Weight and Pieces
            const weightText = `WEIGHT: ${parseFloat(data.weight).toFixed(1)} KG / ${data.items.length} PCS`;
            doc.text(weightText, 5, 40);
        
           doc.setDrawColor(0, 0, 0);
            doc.line(5, 44, 95, 44);
        
           // PKG ID Label
            doc.setFontSize(7);
            doc.text("PKG ID", 5, 49);
        
           // Barcode
            const canvas = document.createElement('canvas');
            JsBarcode(canvas, data.id, {
              format: "CODE128",
              displayValue: false,
              height: 40,
              width: 1.5,
              margin: 0
            });
            const barcodeDataURL = canvas.toDataURL('image/png');
            doc.addImage(barcodeDataURL, 'PNG', 5, 51, 65, 15);
        
           doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.text(data.id, 37.5, 70, { align: 'center' });
        
           // Last 4 digits Box
            const lastFourDigits = data.id.slice(-4);
            doc.roundedRect(72, 51, 15, 10, 1.5, 1.5, 'S');
            doc.setFontSize(14).setFont("helvetica", "bold");
            doc.text(lastFourDigits, 79.5, 58, { align: 'center' });
        
           // QR Code
            const qrCodeUrl = `${window.location.origin}/packages/${data.id}`;
            const qrCodeDataURL = await QRCode.toDataURL(qrCodeUrl, { width: 100, margin: 1 });
            doc.addImage(qrCodeDataURL, 'PNG', 88, 51, 12, 12);
        
           doc.save(`label-${data.id}.pdf`);
            toast.success("Label downloaded successfully!");
        } catch (error) {
            console.error("Failed to generate PDF label:", error);
            toast.error("Failed to generate PDF. Please try again.");
        }finally {
            setIsPrinting(false);
        }    
    }

    return (
        <Button
            variant="contained"
            startIcon={isPrinting ? <CircularProgress size={20} color="inherit" /> : null}
            onClick={handlePrintLabel}
            disabled={isPrinting}
            sx={{ textTransform: 'none' }}
        >
            {isPrinting ? 'Printing...' : 'Print  Label'}
        </Button>
    )
}

export default PrintLabelButton;