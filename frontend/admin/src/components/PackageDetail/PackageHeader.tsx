import React, { useState } from 'react';
import { Box, Typography, Chip, Stack, Button, Card, CardContent, CircularProgress } from '@mui/material';
import { Print as PrintIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Person as PersonIcon, Email as EmailIcon, Phone as PhoneIcon } from '@mui/icons-material';
import jsPDF from "jspdf";
import { updatePackageStatus } from '../../services/api.services';

interface PackageHeaderProps {
  packageData: {
    id: string;
    status: string;
    customer: string;
    suite: string; 
    email: string;
    phone: string;
    phone2: string;
  };
  actionLogStatus: string;
  showRaiseInvoiceButton: boolean;
  showPrintCarrierLabelButton: boolean;
  showApprovePaymentButton: boolean;
  isApprovingPayment: boolean;
  onDiscard?: () => void;
  onPrintLabel?: () => void;
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
  onPrintLabel,
  onRaiseInvoice,
  onApprovePayment,
  onRefresh,
}) => {
  const [isPrintingHold, setIsPrintingHold] = useState(false);
  const [isPrintingCarrier, setIsPrintingCarrier] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

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
              startIcon={<PrintIcon />}
              onClick={onPrintLabel}
              sx={{
                bgcolor: '#8b5cf6',
                '&:hover': { bgcolor: '#7c3aed' },
                textTransform: 'none',
                borderRadius: 1,
              }}
            >
              Print Label
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
