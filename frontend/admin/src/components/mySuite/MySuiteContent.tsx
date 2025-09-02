import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Tabs, Tab, Stack, IconButton, Divider, Paper } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

import { createRack, deleteRack, getRacks, updateRack } from '../../services/api.services';
import Modal from '../common/Modal';
import AddRackForm from './AddRackForm';
import CopyButton from './CopyButton';
import type { Rack } from '../../types';

const MySuiteContent = () => {
  const [racks, setRacks] = useState<Rack[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRack, setEditingRack] = useState<Rack | null>(null);
  
  useEffect(() => {
    fetchRacks();
  }, []);

  const fetchRacks = async () => {
    try {
      const data = await getRacks();
      setRacks(data);
    } catch (err) {
      console.error('Failed to fetch racks', err);
    }
  };

  const handleAddRack = async (label: string, color: string) => {
    try {
      const response = await createRack({ label, color, count: 0 });
      const newRack = Array.isArray(response) ? response[0] : response;
      setRacks(prev => [...prev, newRack]);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create rack', err);
    }
  };

  const handleUpdateRack = async (id: string, label: string, color: string) => {
    try {
      const updated = await updateRack(id, { label, color });
      setRacks(prev => prev.map(result => (result.id === id ? updated : result)));
      setEditingRack(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to update rack', err);
    }
  };

  const handleDeleteRack = async (id: string) => {
    try {
      await deleteRack(id);
      setRacks(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to delete rack', err);
    }
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
            <Button 
              variant="contained" 
              startIcon={<Add />} 
              sx={{ textTransform: 'none', boxShadow: 'none' }} 
              onClick={() => { setEditingRack(null); setIsModalOpen(true); }}
            >
              Add New Rack
            </Button>
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
                    <CopyButton text={rack.label} />

                    <IconButton 
                      size="small" 
                      sx={{ bgcolor: '#e0e7ff', color: '#4f46e5', '&:hover': { bgcolor: '#c7d2fe' } }}
                      onClick={() => { setEditingRack(rack); setIsModalOpen(true); }}
                    >
                      <Edit fontSize="inherit" />
                    </IconButton>

                    <IconButton 
                      size="small" 
                      sx={{ bgcolor: '#ffe4e6', color: '#e11d48', '&:hover': { bgcolor: '#fecdd3' } }}
                      onClick={() => handleDeleteRack(rack.id!)}
                    >
                      <Delete fontSize="inherit" />
                    </IconButton>
                  </Stack>
                </Stack>
                {i < racks.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Box>
        </Box>
      )}

      <Modal 
        open={isModalOpen} 
        onClose={() => { setEditingRack(null); setIsModalOpen(false); }}
        title={editingRack ? "Edit Rack" : "Add Rack"}
      >
        <AddRackForm
          mode={editingRack ? "edit" : "add"}
          initialLabel={editingRack?.label}
          initialColor={editingRack?.color}
          onCancel={() => { setEditingRack(null); setIsModalOpen(false); }}
          onSubmit={(label, color) => {
            if (editingRack) {
              handleUpdateRack(editingRack.id!, label, color);
            } else {
              handleAddRack(label, color);
            }
          }}
        />
      </Modal>
    </Paper>
  );
};

export default MySuiteContent;