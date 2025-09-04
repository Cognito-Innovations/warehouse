'use client';

import { createPickupRequest } from '@/lib/api.service';
import {
  Box,
  Typography,
  TextField,
  Button,
  Breadcrumbs,
  Paper,
} from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { useSession } from "next-auth/react"; 
import { useRouter } from 'next/navigation';

const FormLabel = ({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) => (
  <Typography
    variant="body2"
    component="label"
    htmlFor={htmlFor}
    sx={{ fontWeight: 500, mb: 0.5, display: 'block', fontSize: '0.875rem', color: '#4B5563' }}
  >
    {children}
  </Typography>
);

export default function CreatePickupRequestPage() {
  const { data: session } = useSession();  
  const router = useRouter();

  const [form, setForm] = useState({
    pickup_address: '',
    supplier_name: '',
    supplier_phone: '',
    alt_phone: '',
    pcs_box: '',
    est_weight: '',
    pkg_details: '',
    remarks: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.id.replace('-', '_')]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user_id = (session?.user as any)?.user_id;

      if (!user_id) {
        console.error("User not logged in");
        return;
      }

      await createPickupRequest({
        user_id,
        pickup_address: form.pickup_address,
        supplier_name: form.supplier_name,
        supplier_phone: form.supplier_phone,
        alt_phone: form.alt_phone,
        pcs_box: Number(form.pcs_box),
        est_weight: Number(form.est_weight),
        pkg_details: form.pkg_details,
        remarks: form.remarks,
      });

      setForm({
        pickup_address: '',
        supplier_name: '',
        supplier_phone: '',
        alt_phone: '',
        pcs_box: '',
        est_weight: '',
        pkg_details: '',
        remarks: '',
      });
      router.push('/pickup-request');
    } catch (err: any) {
      console.error(err);
    }
  };

  const isFormValid =
    form.pickup_address.trim() &&
    form.supplier_name.trim() &&
    form.supplier_phone.trim() &&
    form.pcs_box.trim() &&
    form.est_weight.trim() &&
    form.pkg_details.trim();

  return (
    <Box sx={{ bgcolor: '#F9FAFB', p: { xs: 2, sm: 3 }, minHeight: '100vh' }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2, mt: 2 }}>
        <Link href="/pickup-request" passHref>
          <Typography
            component="a"
            sx={{
              textDecoration: 'none',
              color: '#6B7280',
              '&:hover': { textDecoration: 'underline' },
              fontSize: '0.875rem',
            }}
          >
            Pickup Requests
          </Typography>
        </Link>
        <Typography color="text.primary" sx={{ fontSize: '0.875rem' }}>
          Create Request
        </Typography>
      </Breadcrumbs>

      <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1F2937' }}>
          Fill up details, Let us Pickup for You
        </Typography>

        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <FormLabel htmlFor="pickup-address">Pickup Address *</FormLabel>
            <TextField
              id="pickup_address"
              value={form.pickup_address}
              onChange={handleChange}
              fullWidth
              placeholder="Enter full address"
              size="small"
              required
            />
            <Typography
              variant="caption"
              color="#6B7280"
              sx={{ mt: 0.5, display: 'block', fontSize: '0.75rem' }}
            >
              Please enter full address where you want pickup
            </Typography>
          </Box>

          <Box>
            <FormLabel htmlFor="supplier-name">Supplier Name *</FormLabel>
            <TextField
              id="supplier_name"
              value={form.supplier_name}
              onChange={handleChange}
              fullWidth
              placeholder="Enter supplier/shop name"
              size="small"
              required
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <FormLabel htmlFor="supplier-phone">Supplier Phone Number *</FormLabel>
              <TextField
                id="supplier_phone"
                value={form.supplier_phone}
                onChange={handleChange}
                fullWidth
                placeholder="Enter supplier contact number"
                size="small"
                required
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <FormLabel htmlFor="alt-phone">Alternative Phone Number (Optional)</FormLabel>
              <TextField
                id="alt_phone"
                value={form.alt_phone}
                onChange={handleChange}
                fullWidth
                placeholder="Enter supplier alternative contact number"
                size="small"
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <FormLabel htmlFor="pcs-box">No. of Pcs/Box *</FormLabel>
              <TextField
                id="pcs_box"
                value={form.pcs_box}
                onChange={handleChange}
                fullWidth
                placeholder="Enter number of pcs/box to pickup"
                size="small"
                required
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <FormLabel htmlFor="est-weight">Estimate weight (Kg) *</FormLabel>
              <TextField
                id="est_weight"
                value={form.est_weight}
                onChange={handleChange}
                fullWidth
                placeholder="Enter Estimate weight in Kg"
                size="small"
                required
              />
            </Box>
          </Box>

          <Box>
            <FormLabel htmlFor="pkg-details">Package Details *</FormLabel>
            <TextField
              id="pkg_details"
              value={form.pkg_details}
              onChange={handleChange}
              fullWidth
              placeholder="Enter package details"
              size="small"
              multiline
              rows={4}
              required
            />
            <Typography
              variant="caption"
              color="#6B7280"
              sx={{ mt: 0.5, display: 'block', fontSize: '0.75rem' }}
            >
              Write about package details or item details
            </Typography>
          </Box>

          <Box>
            <FormLabel htmlFor="remarks">Remarks (optional)</FormLabel>
            <TextField
              id="remarks"
              value={form.remarks}
              onChange={handleChange}
              fullWidth
              placeholder="Enter any remark or request"
              size="small"
              multiline
              rows={4}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              type="submit"
              onClick={handleSubmit}
              disabled={!isFormValid} 
              sx={{
                bgcolor: '#7C3AED',
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: '8px',
                px: 3,
                py: 1.25,
                fontSize: '0.875rem',
                '&:hover': { bgcolor: '#6D28D9' },
              }}
            >
              Submit Pickup Request
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}