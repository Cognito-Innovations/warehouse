import { useEffect, useState } from 'react';
import { Box, Typography, Button, Tabs, Tab, Stack, Paper, CircularProgress } from '@mui/material';
import { Add } from '@mui/icons-material';

import { deleteRack, getRacks } from '../../services/api.services';
import RackList from './RackList';
import RackModal from './RackModal';
import type { Rack } from '../../types';
import { toast } from 'sonner';

const MySuiteContent = () => {
  const [racks, setRacks] = useState<Rack[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRack, setEditingRack] = useState<Rack | null>(null);
  const [deletingRackId, setDeletingRackId] = useState<string | null>(null);
  const [loadingRacks, setLoadingRacks] = useState(false);
  
  useEffect(() => {
    fetchRacks();
  }, []);

  const fetchRacks = async () => {
    setLoadingRacks(true);
    try {
      const data = await getRacks();
      setRacks(data);
    } catch (err) {
      toast.error('Failed to fetch racks');
    } finally {
      setLoadingRacks(false);
    }
  };

  const handleDeleteRack = async (id: string) => {
    setDeletingRackId(id);
    try {
      await deleteRack(id);
      setRacks(prev => prev.filter(rack => rack.id !== id));
      toast.success('Rack deleted successfully');
    } catch (err) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        error?.response?.data?.message || error?.message || 'Failed to delete rack';
      toast.error(message);
    } finally {
      setDeletingRackId(null);
    }
  };

  const handleEditRack = (rack: Rack) => {
    setEditingRack(rack);
    setIsModalOpen(true);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <Tabs value={tabValue} onChange={(_, value) => setTabValue(value)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tab label="Racks" sx={{ textTransform: 'none' }} />
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

          {loadingRacks ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress />
            </Box>
          ) : racks.length === 0 ? (
            <Typography align="center" color="text.secondary" sx={{ py: 5 }}>
              No racks available. Add your first rack.
            </Typography>
          ) : (
            <RackList 
              racks={racks} 
              onEdit={handleEditRack} 
              onDelete={handleDeleteRack}
              deletingRackId={deletingRackId}
            />
          )}
        </Box>
      )}

      <RackModal 
        open={isModalOpen} 
        rack={editingRack} 
        onClose={() => { setEditingRack(null); setIsModalOpen(false); }}
        onSuccess={(rack) => {
          setRacks(prev => {
            const exists = prev.find(r => r.id === rack.id);
            if (exists) {
              return prev.map(r => r.id === rack.id ? rack : r);
            } else {
              return [...prev, rack];
            }
          });
        }}
      />
    </Paper>
  );
};

export default MySuiteContent;