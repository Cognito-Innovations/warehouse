'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getPickupRequestById, updatePickupRequestStatus } from '@/lib/api.service';
import TrackingStatus from '@/components/Pickup-Request/TrackingStatus';
import RequestDetails from '@/components/Pickup-Request/RequestDetails';
import Link from 'next/link';
import QuotedPriceCard from '@/components/Pickup-Request/QuotedPriceCard';

export default function ViewRequestPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getPickupRequestById(id as string);
      setDetails(data);
    } catch (err) {
      console.error('Failed to fetch request details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleConfirm = async () => {
    try {
      await updatePickupRequestStatus(details.id, "CONFIRMED");
      await fetchData();
    } catch (err) {
      console.error("Failed to confirm:", err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!details) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h6">Request not found</Typography>
        <Button onClick={() => router.push('/pickup-request')} sx={{ mt: 2 }}>
          Back to Requests
        </Button>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gray-100">
      <Box className="max-w-7xl mx-auto px-4 py-6">

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          <Link href="/pickup-request" style={{ textDecoration: 'none', color: '#3B82F6', fontWeight: 500 }}>
            Pickup Requests
          </Link>{" "}
          / <strong>View Request</strong>
        </Typography>

        <Paper sx={{ p: 2, mb: 2, borderRadius: 2, backgroundColor: '#E8F0FE' }} elevation={0}>
          <Typography variant="body2" color="text.primary">
            Your request has been received. We will get back to you shortly.
          </Typography>
        </Paper>

        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <RequestDetails details={details} />

            {details.status === "QUOTED" && (
              <QuotedPriceCard price={details.price} />
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                Delete Request
              </Button>

              {details.status === "QUOTED" && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleConfirm}
                  sx={{ borderRadius: 2, textTransform: "none" }}
                >
                  Confirm
                </Button>
              )}
            </Box>
          </Box>

          <Box sx={{ width: 300 }}>
            <TrackingStatus details={details} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
