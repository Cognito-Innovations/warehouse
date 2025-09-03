'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add,
} from '@mui/icons-material';
import AddAddressModal from '../Modals/AddAddressModal';

export default function AddressesPage() {
  const [addModalOpen, setAddModalOpen] = useState(false);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'grey.900' }}>
          Addresses
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setAddModalOpen(true)}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            textTransform: 'none',
            borderRadius: '8px',
            px: 3,
            py: 1,
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          Add Address
        </Button>
      </Box>

      <Card sx={{ minHeight: 400 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 350,
              textAlign: 'center',
              gap: 2
            }}
          >
            <Typography variant="h6" sx={{ color: 'grey.600', fontWeight: 500 }}>
              No Addresses Available
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.500', maxWidth: 300 }}>
              Add your first address to start managing your delivery locations.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <AddAddressModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </Box>
  );
}