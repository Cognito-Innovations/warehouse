import React, { useState } from 'react';
import { Box, Typography, Button, Tabs, Tab, Stack, IconButton, Divider, Paper } from '@mui/material';
import { Visibility, Edit, Delete, Add } from '@mui/icons-material';
import { initialRacks, type Rack } from '../../data/mySuiteData';
import Modal from '../common/Modal';
import AddRackForm from './AddRackForm';

const MySuiteContent = () => {
  const [racks, setRacks] = useState<Rack[]>(initialRacks);
  const [tabValue, setTabValue] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddRack = (label: string, color: string) => {
    const newRack: Rack = { id: racks.length ? Math.max(...racks.map(r => r.id)) + 1 : 1, label, color, count: 0 };
    setRacks([...racks, newRack]); setIsModalOpen(false);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tab label="Racks" sx={{ textTransform: 'none' }} />
        <Tab label="Tariffs & Charges" sx={{ textTransform: 'none' }} />
        <Tab label="Users" sx={{ textTransform: 'none' }} />
      </Tabs>
      {tabValue === 0 && (
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>{racks.length} Racks</Typography>
            <Button variant="contained" startIcon={<Add />} sx={{ textTransform: 'none', boxShadow: 'none' }} onClick={() => setIsModalOpen(true)}>Add New Rack</Button>
          </Stack>
          <Box>
            {racks.map((rack, i) => (
              <React.Fragment key={rack.id}>
                <Stack direction="row" alignItems="center" sx={{ py: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ flexGrow: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: rack.color }} />
                    <Typography fontWeight={500} flexGrow={1}>{rack.label}</Typography>
                    <Typography color="text.secondary" fontWeight={500}>{rack.count}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} ml={3}>
                    <IconButton size="small" sx={{ bgcolor: '#e0e7ff', color: '#4f46e5', '&:hover': { bgcolor: '#c7d2fe' } }}><Visibility fontSize="inherit" /></IconButton>
                    <IconButton size="small" sx={{ bgcolor: '#ffe4e6', color: '#e11d48', '&:hover': { bgcolor: '#fecdd3' } }}><Edit fontSize="inherit" /></IconButton>
                    <IconButton size="small" sx={{ bgcolor: '#dcfce7', color: '#16a34a', '&:hover': { bgcolor: '#bbf7d0' } }}><Delete fontSize="inherit" /></IconButton>
                  </Stack>
                </Stack>
                {i < racks.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Box>
        </Box>
      )}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Rack">
        <AddRackForm onAdd={handleAddRack} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </Paper>
  );
};

export default MySuiteContent;