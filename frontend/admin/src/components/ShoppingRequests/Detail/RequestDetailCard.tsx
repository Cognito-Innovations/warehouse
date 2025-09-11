import { Box, Card, Typography, Button, Chip, Divider, Grid, Link, CircularProgress } from '@mui/material';
import { LocalPhoneOutlined, MailOutline, PersonOutline } from '@mui/icons-material';
import { getDisplayStatus, getRequestStatusColor } from '../../../data/shoppingRequests';
import { updateShoppingRequestStatus } from '../../../services/api.services';
import { useState } from 'react';

const RequestDetailCard = ({ request, onStatusUpdated }: { request: any, onStatusUpdated: () => void }) => {
  const [loading, setLoading] = useState(false);

  const normalizeStatus = (status: string) => {
    switch (status.toUpperCase()) {
      case "QUOTED":
        return "QUOTATION_READY";
      default:
        return status.toUpperCase();
    }
  };

  const latestStatus = normalizeStatus(request.status);
  const status = getRequestStatusColor(latestStatus);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      await updateShoppingRequestStatus(request.id, newStatus);
      onStatusUpdated();
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderActionButton = () => {
    if (latestStatus === "REQUESTED") {
      return (
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 1, textTransform: 'none' }}
          onClick={() => handleStatusChange("QUOTATION_READY")}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Send Quotation"}
        </Button>
      );
    }

    if (latestStatus === "QUOTATION_READY") {
      return (
        <Button
          variant="contained"
          sx={{
            bgcolor: '#FEE2E2',
            color: '#EF4444',
            '&:hover': { bgcolor: '#FECACA' },
            textTransform: 'none'
          }}
          onClick={() => handleStatusChange("REJECTED")}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Reject"}
        </Button>
      );
    }

    if (latestStatus === "PAYMENT_APPROVED") {
      return (
        <Button
          variant="contained"
          sx={{ textTransform: 'none' }}
          onClick={() => handleStatusChange("ORDER_PLACED")}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Complete"}
        </Button>
      );
    }

    return null;
  };

  return (
    <Card sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            Shopping Request #: {request.request_code}
          </Typography>
          <Chip
            label={getDisplayStatus(latestStatus)}
            size="small"
            sx={{ ml: 2, color: status.color, bgcolor: status.bgColor, fontWeight: 600 }}
          />
        </Box>

        <Box>
          {renderActionButton()}
        </Box>
      </Box>

      <Box sx={{ mb: 1 }}>
        <Grid container alignItems="flex-start" rowSpacing={1} columnSpacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PersonOutline fontSize="small" color="action" />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {request.user.name}({request.user.suite_no})
              </Typography>
            </Box>

            {request.user.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalPhoneOutlined fontSize="small" color="action" />
              <Box sx={{ ml: 1 }}>
                <Link href={`tel:${request.user.phone}`} variant="body2">
                  {request.user.phone}
                </Link>
                {request.user.alt_phone && (
                  <>
                    <Typography variant="body2" component="span">, </Typography>
                    <Link href={`tel:${request.user.alt_phone}`} variant="body2">
                      {request.user.alt_phone}
                    </Link>
                  </>
                )}
              </Box>
            </Box>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MailOutline fontSize="small" color="action" />
              <Link
                href={`mailto:${request.user.email}`}
                variant="body2"
                sx={{
                  ml: 1,
                  wordBreak: "break-word",
                  textDecoration: "none",
                  color: "text.primary",
                  fontWeight: 500,
                  "&:hover": {
                    color: "primary.main",
                    textDecoration: "none",
                  }
                }}
              >
                {request.user.email}
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {request.remarks && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            Customer Remarks
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {request.remarks}
          </Typography>
        </>
      )}
    </Card>
  );
};

export default RequestDetailCard;