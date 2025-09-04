import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import TopNavbar from '../components/Layout/TopNavbar';
import UploadModal from '../components/PackageDetail/UploadModal';
import AddItemModal from '../components/PackageDetail/AddItemModal';
import PackageHeader from '../components/PackageDetail/PackageHeader';
import ActionLogsSection from '../components/PackageDetail/ActionLogsSection';
import PackageItemsSection from '../components/PackageDetail/PackageItemsSection';
import PackageDetailsSection from '../components/PackageDetail/PackageDetailsSection';
import PackageChargesSection from '../components/PackageDetail/PackageChargesSection';
import PhotosDocumentsSection from '../components/PackageDetail/PhotosDocumentsSection';

const PackageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // State for upload modal and documents
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<Array<{ id: string, name: string, url: string, type: string }>>([]);

  // Action Log status management
  const [actionLogStatus, setActionLogStatus] = useState<'Action Required' | 'In Review' | 'Ready to Send' | 'Request Ship' | 'Shipped' | 'Discarded' | 'Draft'>('Action Required');

  // State for Package Items
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [packageItems, setPackageItems] = useState([
    {
      id: '1',
      name: 'Dinner plate set',
      quantity: 1,
      amount: '$60.00',
      total: '$60.00'
    }
  ]);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 1,
    amount: '',
    total: ''
  });

  // Mock data - replace with actual API call
  const packageData = {
    id: id || 'IN2025635',
    status: actionLogStatus.toUpperCase().replace(' ', '_'),
    customer: 'Hussain Munaz',
    suite: "212-426",
    email: 'munattey@gmail.com',
    phone: '9199185',
    phone2: '9821065, 9199185',
    trackingNo: 'DLAP1000216978',
    weight: '0.75Kg',
    volumetricWeight: '-',
    dangerousGood: 'No',
    slotInfo: 'Slot has 292 pkgs',
    createdBy: 'Udhaya (UGf)',
    createdAt: 'Sep 2, 2025, 5:08:45 PM',
    items: [
      {
        name: 'Dinner plate set',
        quantity: 1,
        amount: '$60.00',
        total: '$60.00'
      }
    ]
  };

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

  const handleUpload = () => {
    // Simulate upload process
    const newDocuments = selectedFiles.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'pdf'
    }));

    setUploadedDocuments(prev => [...prev, ...newDocuments]);

    // Don't change status automatically - wait for checkbox
    setSelectedFiles([]);
    setUploadModalOpen(false);
  };

  const handleRemoveDocument = (documentId: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== documentId));
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

  const handleDeleteItem = (itemId: string) => {
    setPackageItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleSaveItem = () => {
    if (editingItem) {
      // Update existing item
      setPackageItems(prev => prev.map(item =>
        item.id === editingItem.id ? { ...newItem, id: editingItem.id } : item
      ));
    } else {
      // Add new item
      const item = {
        ...newItem,
        id: Date.now().toString()
      };
      setPackageItems(prev => [...prev, item]);
    }
    handleCloseAddItemModal();
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
    const csvContent = "Name,Quantity,Amount,Total\nDinner plate set,1,$60.00,$60.00";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'package_items_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleBulkUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Simulate reading the file and parsing data
        // In real implementation, you would use a library like xlsx to parse the file
        const mockBulkData = [
          { id: '2', name: 'Coffee Mug', quantity: 2, amount: '$15.00', total: '$30.00' },
          { id: '3', name: 'Water Bottle', quantity: 1, amount: '$25.00', total: '$25.00' }
        ];
        setPackageItems(prev => [...prev, ...mockBulkData]);
      }
    };
    input.click();
  };

  return (
    <Box sx={{ p: 1 }}>
      <TopNavbar />
      {/* Package Header - Full Width */}
      <PackageHeader packageData={packageData} actionLogStatus={actionLogStatus} />

      <Grid container spacing={2}>
        {/* Left Column - Main Content */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Package Details */}
          <PackageDetailsSection packageData={packageData} />

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
            packageData={packageData}
            onStatusChange={(status) => setActionLogStatus(status as typeof actionLogStatus)}
            onOpenUploadModal={handleOpenUploadModal}
            onRemoveDocument={handleRemoveDocument}
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
    </Box>
  );
};

export default PackageDetail;
