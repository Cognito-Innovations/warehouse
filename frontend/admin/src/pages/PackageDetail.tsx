import React, { useState, useEffect } from 'react';
import { Box, Grid, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button as MuiButton, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import TopNavbar from '../components/Layout/TopNavbar';
import UploadModal from '../components/PackageDetail/UploadModal';
import AddItemModal from '../components/PackageDetail/AddItemModal';
import PackageHeader from '../components/PackageDetail/PackageHeader';
import ActionLogsSection from '../components/PackageDetail/ActionLogsSection';
import PackageItemsSection from '../components/PackageDetail/PackageItemsSection';
import PackageDetailsSection from '../components/PackageDetail/PackageDetailsSection';
import PackageChargesSection from '../components/PackageDetail/PackageChargesSection';
import PhotosDocumentsSection from '../components/PackageDetail/PhotosDocumentsSection';
import { getPackageById, updatePackageStatus, addPackageItem, updatePackageItem, deletePackageItem, bulkUploadPackageItems, uploadPackageDocuments, getPackageDocuments, deletePackageDocument } from '../services/api.services';

const PackageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State for package data
  const [packageData, setPackageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for upload modal and documents
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<Array<{ id: string, name: string, url: string, type: string }>>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Action Log status management
  const [actionLogStatus, setActionLogStatus] = useState<'Action Required' | 'In Review' | 'Ready to Send' | 'Request Ship' | 'Shipped' | 'Discarded' | 'Draft'>('Action Required');

  // State for Package Items
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [packageItems, setPackageItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 1,
    amount: '',
    total: ''
  });

  // State for discard confirmation
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);

  // Fetch documents
  const fetchDocuments = async () => {
    if (!id) return;
    
    try {
      const documents = await getPackageDocuments(id);
      const formattedDocuments = documents.map((doc: any) => ({
        id: doc.id,
        name: doc.document_name,
        url: doc.document_url,
        type: doc.document_type
      }));
      setUploadedDocuments(formattedDocuments);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  // Fetch package data
  useEffect(() => {
    const fetchPackageData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getPackageById(id);
        setPackageData(data);
        setActionLogStatus(data.status as any);
        setPackageItems(data.items || []);
        // Load documents separately
        await fetchDocuments();
      } catch (err) {
        console.error('Failed to fetch package data:', err);
        setError('Failed to load package details');
      } finally {
        setLoading(false);
      }
    };

    fetchPackageData();
  }, [id]);

  // Handler functions
  const handleOpenUploadModal = () => {
    setUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setUploadModalOpen(false);
    setSelectedFiles([]);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleDirectFileSelect = async (files: FileList) => {
    if (!id || files.length === 0) return;
    
    try {
      const fileArray = Array.from(files);
      const response = await uploadPackageDocuments(id, fileArray);
      
      // Transform the response to match our UI format
      const newDocuments = response.documents?.map((doc: any) => ({
        id: doc.id,
        name: doc.document_name,
        url: doc.document_url,
        type: doc.document_type
      })) || [];
      
      setUploadedDocuments(prev => [...prev, ...newDocuments]);
    } catch (err) {
      console.error('Failed to upload documents:', err);
    }
  };

  const handleUpload = async () => {
    if (!id || selectedFiles.length === 0) return;
    
    setIsUploading(true);
    try {
      const response = await uploadPackageDocuments(id, selectedFiles);
      
      // Transform the response to match our UI format
      const newDocuments = response.documents?.map((doc: any) => ({
        id: doc.id,
        name: doc.document_name,
        url: doc.document_url,
        type: doc.document_type
      })) || [];
      
      setUploadedDocuments(prev => [...prev, ...newDocuments]);
      setSelectedFiles([]);
      setUploadModalOpen(false);
    } catch (err) {
      console.error('Failed to upload documents:', err);
      setError('Failed to upload documents');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDiscard = () => {
    setDiscardDialogOpen(true);
  };

  const handleConfirmDiscard = async () => {
    if (!id) return;
    
    try {
      await updatePackageStatus(id, 'Discarded');
      setActionLogStatus('Discarded');
      setDiscardDialogOpen(false);
      // Navigate back to packages page after successful discard
      navigate('/packages');
    } catch (err) {
      console.error('Failed to discard package:', err);
      setError('Failed to discard package');
    }
  };

  const handleCancelDiscard = () => {
    setDiscardDialogOpen(false);
  };

  const handlePrintLabel = () => {
    // TODO: Implement print label functionality
    console.log('Print label functionality coming soon');
  };

  const handleRemoveDocument = async (documentId: string) => {
    if (!id) return;
    
    try {
      await deletePackageDocument(id, documentId);
      setUploadedDocuments(prev => prev.filter(doc => doc.id !== documentId));
    } catch (err) {
      console.error('Failed to delete document:', err);
      setError('Failed to delete document');
    }
  };

  // Package Items handlers
  const handleOpenAddItemModal = () => {
    setNewItem({ name: '', quantity: 1, amount: '', total: '' });
    setEditingItem(null);
    setAddItemModalOpen(true);
  };

  const handleCloseAddItemModal = () => {
    setAddItemModalOpen(false);
    setEditingItem(null);
    setNewItem({ name: '', quantity: 1, amount: '', total: '' });
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setNewItem({ ...item });
    setAddItemModalOpen(true);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!id) return;
    
    try {
      await deletePackageItem(id, itemId);
      setPackageItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Failed to delete item:', err);
      setError('Failed to delete item');
    }
  };

  const handleSaveItem = async () => {
    if (!id) return;
    
    try {
      const itemData = {
        name: newItem.name,
        quantity: newItem.quantity,
        unit_price: parseFloat(newItem.amount.replace('$', '')) || 0,
        total_price: parseFloat(newItem.total.replace('$', '')) || 0
      };

      if (editingItem) {
        // Update existing item
        await updatePackageItem(id, editingItem.id, itemData);
        setPackageItems(prev => prev.map(item =>
          item.id === editingItem.id ? { ...newItem, id: editingItem.id } : item
        ));
      } else {
        // Add new item
        const response = await addPackageItem(id, itemData);
        const newItemWithId = {
          ...newItem,
          id: response.id || Date.now().toString()
        };
        setPackageItems(prev => [...prev, newItemWithId]);
      }
      handleCloseAddItemModal();
    } catch (err) {
      console.error('Failed to save item:', err);
      setError('Failed to save item');
    }
  };

  const handleItemInputChange = (field: string, value: string | number) => {
    setNewItem(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-calculate total when quantity or amount changes
      if (field === 'quantity' || field === 'amount') {
        const quantity = field === 'quantity' ? Number(value) : prev.quantity;
        const amount = field === 'amount' ? value : prev.amount;
        const amountValue = parseFloat(amount.toString().replace('$', '')) || 0;
        updated.total = `$${(quantity * amountValue).toFixed(2)}`;
      }
      return updated;
    });
  };

  const handleDownloadFormat = () => {
    // Create Excel-like CSV content
    const csvContent = "Name,Quantity,Amount,Total";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'package_items_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };


  // Fix this make it actual data 
  const handleBulkUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && id) {
        try {
          // For now, we'll use mock data. In production, you'd parse the CSV/Excel file
          // using libraries like xlsx or papaparse
          const mockBulkData = [
            { name: 'Coffee Mug', quantity: 2, unit_price: 15.00, total_price: 30.00 },
            { name: 'Water Bottle', quantity: 1, unit_price: 25.00, total_price: 25.00 }
          ];
          
          const response = await bulkUploadPackageItems(id, mockBulkData);
          
          // Update local state with the new items
          const newItems = response.items?.map((item: any) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            amount: `$${item.unit_price.toFixed(2)}`,
            total: `$${item.total_price.toFixed(2)}`
          })) || [];
          
          setPackageItems(prev => [...prev, ...newItems]);
        } catch (err) {
          console.error('Failed to bulk upload items:', err);
          setError('Failed to upload items');
        }
      }
    };
    input.click();
  };

  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    
    try {
      await updatePackageStatus(id, newStatus);
      setActionLogStatus(newStatus as any);
      // Update package data with new status
      setPackageData((prev: any) => ({
        ...prev,
        status: newStatus
      }));
    } catch (err) {
      console.error('Failed to update package status:', err);
      setError('Failed to update package status');
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ p: 1 }}>
        <TopNavbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  // Error state
  if (error || !packageData) {
    return (
      <Box sx={{ p: 1 }}>
        <TopNavbar />
        <Alert severity="error" sx={{ mt: 2 }}>
          {error || 'Package not found'}
        </Alert>
      </Box>
    );
  }

  // Transform package data for display
  const displayPackageData = {
    id: packageData.custom_package_id || packageData.id,
    status: packageData.status,
    customer: packageData.customer?.name || 'Unknown',
    suite: packageData.customer?.suite_no || 'N/A',
    email: packageData.customer?.email || 'N/A',
    phone: packageData.customer?.phone_number || 'N/A',
    phone2: packageData.customer?.phone_number_2 || 'N/A',
    trackingNo: packageData.tracking_no || 'N/A',
    weight: `${packageData.total_weight || 0}Kg`,
    volumetricWeight: packageData.total_volumetric_weight ? `${packageData.total_volumetric_weight}Kg` : '-',
    dangerousGood: packageData.dangerous_good ? 'Yes' : 'No',
    rack: packageData.rack_slot?.label ? `${packageData.rack_slot.label}` : 'N/A',
    count: packageData.rack_slot?.count ? packageData.rack_slot.count : 0,
    createdBy: packageData.creator?.name || 'Unknown',
    createdAt: new Date(packageData.created_at).toLocaleString(),
    vendor: packageData.vendor?.supplier_name || 'Unknown',
    remarks: packageData.remarks || 'No remarks',
    allowCustomerItems: packageData.allow_customer_items || false,
    shopInvoiceReceived: packageData.shop_invoice_received || false,
    items: packageItems,
    // Transform measurements data for display
    measurements: packageData.measurements?.map((measurement: any) => ({
      pieceNumber: measurement.piece_number,
      weight: `${measurement.weight || 0}Kg`,
      volumetricWeight: measurement.volumetric_weight ? `${measurement.volumetric_weight}Kg` : '-',
      hasMeasurements: measurement.has_measurements || false,
      length: measurement.length,
      width: measurement.width,
      height: measurement.height
    })) || []
  };

  return (
    <Box sx={{ p: 1 }}>
      <TopNavbar />
      {/* Package Header - Full Width */}
              <PackageHeader 
          packageData={displayPackageData} 
          actionLogStatus={actionLogStatus}
          onDiscard={handleDiscard}
          onPrintLabel={handlePrintLabel}
        />

      <Grid container spacing={2}>
        {/* Left Column - Main Content */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Package Details */}
          <PackageDetailsSection packageData={displayPackageData} />

          {/* Package Items */}
          <PackageItemsSection
            packageItems={packageItems}
            onDownloadFormat={handleDownloadFormat}
            onBulkUpload={handleBulkUpload}
            onOpenAddItemModal={handleOpenAddItemModal}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
          />
        </Grid>

        {/* Right Column - Sidebar */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Action Logs */}
          <ActionLogsSection
            actionLogStatus={actionLogStatus}
            uploadedDocuments={uploadedDocuments}
            packageData={displayPackageData}
            onStatusChange={handleStatusChange}
            onOpenUploadModal={handleOpenUploadModal}
            onRemoveDocument={handleRemoveDocument}
            onFileSelect={handleDirectFileSelect}
          />

          {/* Photos / Documents */}
          <PhotosDocumentsSection />

          {/* Package Charges */}
          <PackageChargesSection />
        </Grid>
      </Grid>

      {/* Upload Modal */}
      <UploadModal
        open={uploadModalOpen}
        selectedFiles={selectedFiles}
        onClose={handleCloseUploadModal}
        onFileSelect={handleFileSelect}
        onUpload={handleUpload}
        onRemoveFile={handleRemoveFile}
        isUploading={isUploading}
      />

      {/* Add Item Modal */}
      <AddItemModal
        open={addItemModalOpen}
        editingItem={editingItem}
        newItem={newItem}
        onClose={handleCloseAddItemModal}
        onSave={handleSaveItem}
        onInputChange={handleItemInputChange}
      />

      {/* Discard Confirmation Dialog */}
      <Dialog
        open={discardDialogOpen}
        onClose={handleCancelDiscard}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: '#1e293b' }}>
          Discard Package
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: '#64748b', mb: 2 }}>
            Are you sure you want to discard this package? This action will change the package status to "Discarded" and cannot be undone.
          </Typography>
          <Typography variant="body2" sx={{ color: '#ef4444', fontWeight: 500 }}>
            Package ID: {packageData?.custom_package_id || packageData?.id}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <MuiButton
            variant="outlined"
            onClick={handleCancelDiscard}
            sx={{ textTransform: 'none', borderRadius: 1 }}
          >
            Cancel
          </MuiButton>
          <MuiButton
            variant="contained"
            onClick={handleConfirmDiscard}
            sx={{
              bgcolor: '#ef4444',
              '&:hover': { bgcolor: '#dc2626' },
              textTransform: 'none',
              borderRadius: 1
            }}
          >
            Discard Package
          </MuiButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PackageDetail;
