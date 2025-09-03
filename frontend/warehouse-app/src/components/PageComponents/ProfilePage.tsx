'use client';

import React, { useState } from 'react';
import {Edit,Add,} from '@mui/icons-material';
import EditProfileModal from '../Modals/EditProfileModal';
import {Box,Typography,Button,Card,CardContent,Grid,Switch } from '@mui/material';

export default function ProfilePage() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const profileData = {
    identifier: '',
    name: 'Neurs HQ',
    email: 'hqneurs@gmail.com',
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

      <Card sx={{ mb: 2, borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5, color: 'grey.900' }}>
            User Photos / Documents
          </Typography>
          <Box
            sx={{
              border: '2px dashed',
              borderColor: 'grey.300',
              borderRadius: '8px',
              p: 3,
              textAlign: 'center',
              bgcolor: 'grey.50',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'rgba(139, 92, 246, 0.05)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            <Add sx={{ fontSize: 24, color: 'grey.400', mb: 1 }} />
            <Typography variant="body2" sx={{ color: 'grey.500', fontWeight: 500 }}>
              Click to upload documents
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'grey.900' }}>
            Notification Settings
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              p: 1.5,
              borderRadius: '8px',
              bgcolor: 'grey.50',
              transition: 'background-color 0.2s ease',
              '&:hover': {
                bgcolor: 'grey.100',
              }
            }}>
              <Typography variant="body2" sx={{ color: 'grey.900', fontWeight: 500 }}>
                SMS Notifications
              </Typography>
              <Switch
                checked={smsNotifications}
                onChange={(e) => setSmsNotifications(e.target.checked)}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: 'primary.main',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: 'primary.main',
                  },
                }}
              />
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              p: 1.5,
              borderRadius: '8px',
              bgcolor: 'grey.50',
              transition: 'background-color 0.2s ease',
              '&:hover': {
                bgcolor: 'grey.100',
              }
            }}>
              <Typography variant="body2" sx={{ color: 'grey.900', fontWeight: 500 }}>
                Email Notifications
              </Typography>
              <Switch
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: 'primary.main',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: 'primary.main',
                  },
                }}
              />
            </Box>
          </Box>
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