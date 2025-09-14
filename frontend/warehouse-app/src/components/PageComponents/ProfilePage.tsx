'use client';

import React, { useState } from 'react';
import {Edit,Add,} from '@mui/icons-material';
import EditProfileModal from '../Modals/EditProfileModal';
import {Box,Typography,Button,Card,CardContent,Grid,Switch } from '@mui/material';

export default function ProfilePage() {
  const [editModalOpen, setEditModalOpen] = useState(false);

  const profileData = {
    identifier: '',
    name: '',
    email: '',
    contact: '',
    alternativeContact: '',
    gender: '',
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'grey.900' }}>
          Profile
        </Typography>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => setEditModalOpen(true)}
          size="small"
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            textTransform: 'none',
            borderRadius: '6px',
            px: 2,
            py: 0.5,
            fontSize: '0.875rem',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
          }}
        >
          Edit Profile
        </Button>
      </Box>

      <Card sx={{ mb: 2, borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 2.5 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: 'black.500', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Identifier
                </Typography>
                <Typography variant="body2" sx={{ color: 'black.900', fontWeight: 500, mt: 0.5 }}>
                  {profileData.identifier || '-'}
                </Typography>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: 'black.500', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Name
                </Typography>
                <Typography variant="body2" sx={{ color: 'black.900', fontWeight: 500, mt: 0.5 }}>
                  {profileData.name}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: 'black.500', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Email
                </Typography>
                <Typography variant="body2" sx={{ color: 'black.900', fontWeight: 500, mt: 0.5 }}>
                  {profileData.email}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: 'black.500', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Contact
                </Typography>
                <Typography variant="body2" sx={{ color: 'black.900', fontWeight: 500, mt: 0.5 }}>
                  {profileData.contact || '-'}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: 'black.500', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Alternative Contact
                </Typography>
                <Typography variant="body2" sx={{ color: 'black.900', fontWeight: 500, mt: 0.5 }}>
                  {profileData.alternativeContact || '-'}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: 'black.500', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Gender
                </Typography>
                <Typography variant="body2" sx={{ color: 'black.900', fontWeight: 500, mt: 0.5 }}>
                  {profileData.gender || '-'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <EditProfileModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        profileData={profileData}
      />
    </Box>
  );
}