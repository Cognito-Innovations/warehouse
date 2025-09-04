'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Paper,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import { getPickupRequestsByUser } from '@/lib/api.service';
import { useSession } from 'next-auth/react';
import { formatDateTime } from '@/lib/utils';
import { statusConfig } from '@/lib/pickupStatus';

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index } = props;
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function PickupRequestPage() {
  const { data: session, status } = useSession();  
  const [activeTab, setActiveTab] = useState(0);
  const [pickupRequests, setPickupRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const user_id = (session?.user as any)?.user_id;

  const fetchData = async () => {
    try {
      const data = await getPickupRequestsByUser(user_id);
      setPickupRequests(data);
    } catch (err) {
      console.error('Failed to fetch pickup requests:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (!user_id || status === "loading") return; 
    setLoading(true);
    fetchData();
  }, [user_id, status]);

  const tabs = [
    { label: "Pickup Requests", icon: <ReceiptLongIcon />, index: 0 },
    { label: "History", icon: <HistoryIcon />, index: 1 },
  ];
  
  const renderEmptyState = (icon: React.ReactNode, message: string) => (
    <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
      <Box sx={{ fontSize: '4rem', mb: 2, color: 'grey.300' }}>{icon}</Box>
      <Typography variant="h6">{message}</Typography>
    </Box>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-purple-700 rounded-lg p-1 mb-3">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                className={`flex items-center justify-center gap-2 py-1 text-sm font-bold transition-all duration-300 rounded-md flex-1 ${
                  activeTab === tab.index
                    ? "bg-white text-purple-700 shadow-sm"
                    : "bg-transparent text-white hover:bg-purple-600"
                }`}
                onClick={() => setActiveTab(tab.index)}
              >
                <span className={`text-lg ${activeTab === tab.index ? "text-purple-700" : "text-white"}`}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <TabPanel value={activeTab} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <TextField
              variant="outlined"
              placeholder="Search by pkg details"
              size="small"
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }}
              sx={{ bgcolor: 'white', '.MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
            <Link href="/pickup-request/create-request" passHref>
              <Button
                component="a"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  bgcolor: '#6D28D9', textTransform: 'none', fontWeight: 'bold', borderRadius: '8px', px: 3,
                  '&:hover': { bgcolor: '#5B21B6' },
                }}
              >
                Pickup Request
              </Button>
            </Link>
          </Box>

          {loading && <Box sx={{ textAlign: 'center', py: 6 }}><CircularProgress /></Box>}

          {!loading && pickupRequests.length > 0 ? (
            pickupRequests.map((req) => {
              const statusKey = (req.status || "REQUESTED").toUpperCase();
              const { color, icon } = statusConfig[statusKey] || statusConfig.REQUESTED;

              return (
                <Link href={`/pickup-request/${req.id}`} passHref>
                  <Paper key={req.id} variant="outlined" sx={{ p: 2, borderRadius: '8px', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%', gap: 3 }}>

                      <Box sx={{ flexShrink: 0, width: '15%' }}>
                        <Typography variant="body2" sx={{color: 'text.primary'}}>{req.request_no || "PR/IN/2025006"}</Typography>
                        <Typography variant="caption" color="text.secondary">{formatDateTime(req.created_at)}</Typography>
                      </Box>

                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="caption" color="text.secondary">Pickup Location</Typography>
                        <Typography variant="body2" sx={{color: 'text.primary' }}>{req.pickup_address}</Typography>
                      </Box>

                      <Box sx={{ flexShrink: 0, width: '18%' }}>
                        <Typography variant="caption" color="text.secondary">Supplier</Typography>
                        <Typography variant="body2" sx={{color: 'text.primary' }}>{req.supplier_name}</Typography>
                      </Box>

                      <Box sx={{
                        flexShrink: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '8%'
                      }}>
                        {icon}
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color }}>
                          {req.status}
                        </Typography>
                      </Box>
                    
                    </Box>
                  </Paper>
                </Link>
              );
            })
          ) : (
            !loading && renderEmptyState(<ReceiptLongIcon sx={{ fontSize: 'inherit' }} />, 'No Pickup Requests Found')
          )}
          </TabPanel>

          <Paper elevation={1} sx={{ p: 1.5, borderRadius: '8px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>Showing 1 to 1 of 1 Requests</Typography>
              <Box>
                <Button variant="outlined" size="small" sx={{ mr: 1, textTransform: 'none' }}>Previous</Button>
                <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>Next</Button>
              </Box>
            </Box>
          </Paper>

        <TabPanel value={activeTab} index={1}>
          {renderEmptyState(<HistoryIcon sx={{ fontSize: 'inherit' }} />, 'No History Available')}
        </TabPanel>
      </div>
    </div>
  );
}