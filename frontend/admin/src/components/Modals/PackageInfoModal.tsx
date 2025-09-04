import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Divider,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import {
  Close as CloseIcon,
  Print as PrintIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Add as AddIcon,
} from '@mui/icons-material';

interface PackageInfoModalProps {
  open: boolean;
  onClose: () => void;
  packageData?: {
    id: string;
    status: string;
    customer: string;
    email: string;
    phone: string;
    trackingNo: string;
    weight: string;
    volumetricWeight: string;
    dangerousGood: boolean;
    slotInfo: string;
    createdBy: string;
    createdAt: string;
    items: Array<{
      name: string;
      quantity: number;
      amount: string;
      total: string;
    }>;
  };
}

const PackageInfoModal: React.FC<PackageInfoModalProps> = ({ open, onClose, packageData }) => {
  const defaultPackageData = {
    id: 'IN2025638',
    status: 'READY TO SEND',
    customer: 'Sahaaf (809-346)',
    email: 'leosahaaf@gmail.com',
    phone: '9609670949',
    trackingNo: 'AMAZON INDIA Tracking No. 363058597466',
    weight: '0.2Kg',
    volumetricWeight: '-',
    dangerousGood: false,
    slotInfo: 'PACKAGE ARRIVED → Slot has 292 pkgs',
    createdBy: 'Udhaya (UGf)',
    createdAt: 'Sep 2, 2025, 5:16:26 PM',
    items: [
      {
        name: 'Far cry ps4 game',
        quantity: 1,
        amount: '$15.08',
        total: '$15.08'
      }
    ]
  };

  // Map package data from packages table to modal format
  const mapPackageData = (pkg: any) => {
    if (!pkg) return defaultPackageData;
    
    return {
      id: pkg.packageNo || pkg.id,
      status: pkg.statusType || 'READY TO SEND',
      customer: `${pkg.customer} (${pkg.customerCode})`,
      email: 'customer@example.com', // Default since not in packages data
      phone: '000-000-0000', // Default since not in packages data
      trackingNo: `${pkg.carrier} Tracking No. ${pkg.trackingNo}`,
      weight: '0.2Kg', // Default since not in packages data
      volumetricWeight: '-',
      dangerousGood: false,
      slotInfo: `${pkg.status} → Slot has 292 pkgs`,
      createdBy: 'System User',
      createdAt: `${pkg.receivedAt}, ${pkg.time}`,
      items: [
        {
          name: 'Sample Item',
          quantity: 1,
          amount: '$15.08',
          total: '$15.08'
        }
      ]
    };
  };

  const data = mapPackageData(packageData);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, maxHeight: '90vh' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Package Information
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          {/* Left Column - Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Package Header */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                      Package #: {data.id}
                    </Typography>
                    <Chip 
                      label={data.status} 
                      sx={{ 
                        bgcolor: '#dcfce7', 
                        color: '#166534',
                        fontWeight: 600
                      }} 
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<PrintIcon />}
                      sx={{ 
                        bgcolor: '#8b5cf6',
                        '&:hover': { bgcolor: '#7c3aed' },
                        textTransform: 'none'
                      }}
                    >
                      Print Label
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<DeleteIcon />}
                      sx={{ 
                        bgcolor: '#f97316',
                        '&:hover': { bgcolor: '#ea580c' },
                        textTransform: 'none'
                      }}
                    >
                      Discard
                    </Button>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {data.customer}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {data.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {data.phone}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Package Details */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Package Details
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    sx={{ 
                      bgcolor: '#3b82f6',
                      '&:hover': { bgcolor: '#2563eb' },
                      textTransform: 'none'
                    }}
                  >
                    Update Information
                  </Button>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Tracking:</strong> {data.trackingNo}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Weight:</strong> {data.weight}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Volumetric Weight:</strong> {data.volumetricWeight}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Dangerous Good:</strong> {data.dangerousGood ? 'Yes' : 'No'}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  bgcolor: '#dcfce7', 
                  p: 2, 
                  borderRadius: 2,
                  border: '1px solid #bbf7d0'
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#166534' }}>
                    {data.slotInfo}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Measurements Table */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  1 Piece Measurements
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Weight</TableCell>
                        <TableCell>Volumetric Weight (LxWxH)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>{data.weight}</TableCell>
                        <TableCell>- (No measurements)</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Created By {data.createdBy} on {data.createdAt}
                </Typography>
              </CardContent>
            </Card>

            {/* Package Items */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Package Items
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      size="small"
                      sx={{ 
                        bgcolor: '#8b5cf6',
                        '&:hover': { bgcolor: '#7c3aed' },
                        textTransform: 'none'
                      }}
                    >
                      Download format
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<UploadIcon />}
                      size="small"
                      sx={{ 
                        bgcolor: '#3b82f6',
                        '&:hover': { bgcolor: '#2563eb' },
                        textTransform: 'none'
                      }}
                    >
                      Bulk Upload
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      size="small"
                      sx={{ 
                        bgcolor: '#3b82f6',
                        '&:hover': { bgcolor: '#2563eb' },
                        textTransform: 'none'
                      }}
                    >
                      Add Item
                    </Button>
                  </Box>
                </Box>
                
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.amount}</TableCell>
                          <TableCell>{item.total}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton size="small">
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small">
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            {/* Action Logs */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Action Logs
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    size="small"
                    sx={{ 
                      bgcolor: '#3b82f6',
                      '&:hover': { bgcolor: '#2563eb' },
                      textTransform: 'none'
                    }}
                  >
                    Add
                  </Button>
                </Box>
                
                <Box sx={{ 
                  bgcolor: '#f0f9ff', 
                  p: 2, 
                  borderRadius: 2,
                  border: '1px solid #bae6fd'
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Missing Documents
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Please upload item invoice
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <IconButton size="small" sx={{ color: '#ef4444' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#10b981' }}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {data.createdBy} {data.createdAt}
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Photos / Documents */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Photos / Documents
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<UploadIcon />}
                    size="small"
                    sx={{ 
                      bgcolor: '#3b82f6',
                      '&:hover': { bgcolor: '#2563eb' },
                      textTransform: 'none'
                    }}
                  >
                    Upload
                  </Button>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  No photo / document found
                </Typography>
              </CardContent>
            </Card>

            {/* Package Charges */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Package Charges
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    size="small"
                    sx={{ 
                      bgcolor: '#3b82f6',
                      '&:hover': { bgcolor: '#2563eb' },
                      textTransform: 'none'
                    }}
                  >
                    Add New Charge
                  </Button>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  No charges
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PackageInfoModal;
