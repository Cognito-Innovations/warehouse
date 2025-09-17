import React, { useState } from 'react';
import { Box, Typography, Chip, Stack, Button, Card, CardContent, CircularProgress } from '@mui/material';
import { Print as PrintIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Person as PersonIcon, Email as EmailIcon, Phone as PhoneIcon } from '@mui/icons-material';
import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";
import QRCode from 'qrcode';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { updatePackageStatus } from '../../services/api.services';

interface PackageData {
  id: string;
  status: string;
  customer: string;
  suite: string;
  email: string;
  phone: string;
  phone2: string;
  weight: string;
  items: any[];
  createdAt: string;
}

interface PackageHeaderProps {
  packageData: PackageData;
  actionLogStatus: string;
  showRaiseInvoiceButton: boolean;
  showPrintCarrierLabelButton: boolean;
  showApprovePaymentButton: boolean;
  isApprovingPayment: boolean;
  onDiscard?: () => void;
  onRaiseInvoice?: () => void;
  onApprovePayment?: () => void;
  onRefresh?: () => void;
}

const PackageHeader: React.FC<PackageHeaderProps> = ({ 
  packageData,
  actionLogStatus,
  showRaiseInvoiceButton,
  showApprovePaymentButton,
  showPrintCarrierLabelButton,
  isApprovingPayment,
  onDiscard,
  onRaiseInvoice,
  onApprovePayment,
  onRefresh,
}) => {
  const [isPrintingLabel, setIsPrintingLabel] = useState(false);
  const [isPrintingHold, setIsPrintingHold] = useState(false);
  const [isPrintingCarrier, setIsPrintingCarrier] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

   const handlePrintLabel = async () => {
    setIsPrintingLabel(true);
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [100, 75]
      });

      // Shopme Logo
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor('#6d28d9');
      doc.text("shopme", 5, 12);

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
      doc.text(packageData.suite, 21, 31, { align: 'center' });

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
      doc.text(`${packageData.customer} (${packageData.suite})`, 40, 30);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      const formattedDate = format(new Date(packageData.createdAt), 'dd MMM yyyy - HH:mm');
      doc.text(`REG. DATE: ${formattedDate}`, 40, 34);

      // Weight and Pieces
      const weightText = `WEIGHT: ${parseFloat(packageData.weight).toFixed(1)} KG / ${packageData.items.length} PCS`;
      doc.text(weightText, 5, 40);

      doc.setDrawColor(0, 0, 0);
      doc.line(5, 44, 95, 44);

      // PKG ID Label
      doc.setFontSize(7);
      doc.text("PKG ID", 5, 49);

      // Barcode
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, packageData.id, {
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
      doc.text(packageData.id, 37.5, 70, { align: 'center' });

      // Last 4 digits Box
      const lastFourDigits = packageData.id.slice(-4);
      doc.roundedRect(72, 51, 15, 10, 1.5, 1.5, 'S');
      doc.setFontSize(14).setFont("helvetica", "bold");
      doc.text(lastFourDigits, 79.5, 58, { align: 'center' });

      // QR Code
      const qrCodeUrl = `${window.location.origin}/packages/${packageData.id}`;
      const qrCodeDataURL = await QRCode.toDataURL(qrCodeUrl, { width: 100, margin: 1 });
      doc.addImage(qrCodeDataURL, 'PNG', 88, 51, 12, 12);

      doc.save(`label-${packageData.id}.pdf`);
      toast.success("Label downloaded successfully!");
    } catch (error) {
      console.error("Failed to generate PDF label:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsPrintingLabel(false);
    }
  };

  const handlePrintHoldLabel = () => {
    try{
      setIsPrintingHold(true);
      const doc = new jsPDF();
      doc.text("Hold Label", 20, 20);
      doc.save("hold-label.pdf");
    } finally {
      setIsPrintingHold(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      setIsUpdatingStatus(true);
      await updatePackageStatus(packageData.id, newStatus);
      onRefresh?.();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

   const handlePrintCarrierLabel = async () => {
    try {
      setIsPrintingCarrier(true);

      const doc = new jsPDF();
      doc.text("Carrier Label", 20, 20);
      doc.save("carrier-label.pdf");

      await handleUpdateStatus("Ready To Ship");
    } finally {
      setIsPrintingCarrier(false);
    }
  };

  const handleUpdateToDepart = async () => {
    await handleUpdateStatus("Departed");
  };
  
  return (
    <Card sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent sx={{ px: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', fontSize: '1.5rem' }}>
                Package #: {packageData.id}
              </Typography>
              <Chip
                label={packageData.status}
                size="small"
                sx={{
                  bgcolor: actionLogStatus === 'Action Required' ? '#f18d8d91' :
                    actionLogStatus === 'In Review' ? '#dbeafe' :
                      actionLogStatus === 'Ready To Send' ? '#dcfce7' : '#f18d8d91',
                  color: actionLogStatus === 'Action Required' ? '#ff4b41' :
                    actionLogStatus === 'In Review' ? '#1e40af' :
                      actionLogStatus === 'Ready To Send' ? '#166534' : '#ff4b41',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 28,
                  borderRadius: 1
                }}
              />
            </Box>

            {/* Contact Information with Icons */}
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {packageData.customer && <Stack direction="row" alignItems="center" spacing={1}>
                <PersonIcon sx={{ fontSize: 14, color: '#64748b' }} />
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                  {packageData.customer} ({packageData.suite})
                </Typography>
              </Stack>}
              {packageData.email && packageData.email !== 'N/A' && <Stack direction="row" alignItems="center" spacing={1}>
                <EmailIcon sx={{ fontSize: 14, color: '#64748b' }} />
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                  {packageData.email}
                </Typography>
              </Stack>}
              {packageData.phone && packageData.phone !== 'N/A' && <Stack direction="row" alignItems="center" spacing={1}>
                <PhoneIcon sx={{ fontSize: 14, color: '#64748b' }} />
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                  {packageData.phone}
                </Typography>
              </Stack>}
              {packageData.phone2 && packageData.phone2 !== 'N/A' && <Stack direction="row" alignItems="center" spacing={1}>
                <PhoneIcon sx={{ fontSize: 14, color: '#64748b' }} />
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                  {packageData.phone2}
                </Typography>
              </Stack>}
            </Stack>
          </Box>

          {/* Action Buttons - Stacked Vertically */}
          <Stack direction="row" spacing={1}>
            {showApprovePaymentButton && (
              <Button
                variant="contained"
                startIcon={isApprovingPayment ? <CircularProgress size={20} color="inherit" /> : null }
                onClick={onApprovePayment}
                disabled={isApprovingPayment}
                sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' }, textTransform: 'none' }}
              >
                {isApprovingPayment ? 'Approving...' : 'Approve Payment'}
              </Button>
            )}

            {packageData.status === 'Payment Pending' || packageData.status === 'Payment Approved' && (
              <Button
                variant="contained"
                startIcon={isPrintingHold ? <CircularProgress size={20} color="inherit" /> : null }
                onClick={handlePrintHoldLabel}
                disabled={isPrintingHold}
                sx={{ textTransform: 'none' }}
              >
                {isPrintingHold ? 'Printing...' : 'Print Hold Label'}
              </Button>
            )}

            {packageData.status === "Ready To Ship" && (
              <Button
                variant="contained"
                onClick={handleUpdateToDepart}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? 'Updating...' : 'Update To Departed'}
              </Button>
            )}

            {showPrintCarrierLabelButton && (
              <Button
                variant="contained"
                startIcon={isPrintingCarrier ? <CircularProgress size={20} color="inherit" /> : null }
                onClick={handlePrintCarrierLabel}
                sx={{ textTransform: 'none' }}
              >
                Print Carrier Label
              </Button>
            )}

             {showRaiseInvoiceButton && (
              <Button
                variant="contained"
                onClick={onRaiseInvoice}
                sx={{
                  bgcolor: '#3b82f6',
                  '&:hover': { bgcolor: '#2563eb' },
                  textTransform: 'none',
                  borderRadius: 1,
                }}
              >
                Raise Invoice
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={isPrintingLabel ? <CircularProgress size={20} color="inherit" /> : <PrintIcon />}
              onClick={handlePrintLabel}
              disabled={isPrintingLabel}
              sx={{
                bgcolor: '#8b5cf6',
                '&:hover': { bgcolor: '#7c3aed' },
                textTransform: 'none',
                borderRadius: 1,
              }}
            >
              {isPrintingLabel ? 'Printing...' : 'Print Label'}
            </Button>
            <Button
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={onDiscard}
              sx={{
                bgcolor: '#ef4444',
                '&:hover': { bgcolor: '#dc2626' },
                textTransform: 'none',
                borderRadius: 1,
              }}
            >
              Discard
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PackageHeader;
