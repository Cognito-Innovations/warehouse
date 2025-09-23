import React, { useState, useEffect, useCallback } from 'react';
import { Box, Grid, CircularProgress, Alert, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { getPackageById, updatePackageStatus, getPackageDocuments, getPaymentSlips } from '../services/api.services';
import TopNavbar from '../components/Layout/TopNavbar';
import PackageHeader from '../components/PackageDetail/PackageHeader';
import ActionLogsSection from '../components/PackageDetail/ActionLogsSection';
import PackageItemsSection from '../components/PackageDetail/PackageItemsSection';
import PackageDetailsSection from '../components/PackageDetail/PackageDetailsSection';
import PackageChargesSection from '../components/PackageDetail/PackageChargesSection';
import PhotosDocumentsSection from '../components/PackageDetail/PhotosDocumentsSection';
import InvoiceTable from '../components/ShoppingRequests/Detail/InvoiceTable';
import { formatDateTime } from '../utils/formatDateTime';

const PackageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [packageData, setPackageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<Array<{ id: string, name: string, url: string, type: string }>>([]);
  const [packageItems, setPackageItems] = useState<any[]>([]);
  const [isApprovingPayment, setIsApprovingPayment] = useState(false);
  const [paymentSlips, setPaymentSlips] = useState<any[]>([]);

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

  const fetchPaymentSlips = async (shipment_uuid: string) => {
    try {
      const slips = await getPaymentSlips(shipment_uuid);
      setPaymentSlips(slips);
    } catch (err) {
      console.error('Failed to fetch payment slips:', err);
      toast.error('Failed to load payment slips.');
    }
  };

  const fetchPackageData = async (initialLoad = false) => {
    if (!id) return;

    if (initialLoad) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }
    
    setError(null);

    try {
      const data = await getPackageById(id);
      setPackageData(data);
      setPackageItems(data.items || []);
      
      await Promise.all([
        fetchPaymentSlips(data.shipment_uuid),
        fetchDocuments()
      ]);
    } catch (err) {
      console.error('Failed to fetch package data:', err);
      setError('Failed to load package details');
    } finally {
      if (initialLoad) {
        setLoading(false);
      } else {
        setIsRefreshing(false);
      }
    }
  };

  const handleRefresh = useCallback(() => {
    fetchPackageData(false);
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchPackageData(true);
    }
  }, [id]);

  const handleActionLogUpdate = async () => {
    if (!id) return;

    try {
      const data = await getPackageById(id);
      setPackageData(data);
      setPackageItems(data.items || []);
      
      await fetchPaymentSlips(data.shipment_uuid);
      await fetchDocuments();
    } catch (err) {
      console.error('Failed to refetch package data:', err);
      toast.error('Failed to refresh package details');
    }
  };

  const handleApprovePayment = async () => {
    if (!id) return;
    setIsApprovingPayment(true);
    try {
      await updatePackageStatus(id, 'Payment Approved');
      const updatedData = await getPackageById(id);
      setPackageData(updatedData);
      toast.success('Payment approved successfully!');
    } catch (err) {
      console.error('Failed to approve payment:', err);
      toast.error('Failed to approve payment.');
    } finally {
      setIsApprovingPayment(false);
    }
  };

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

  const isDiscarded = packageData.status.value === 'Discarded';
  const showDiscardedMessage = isDiscarded && (
    <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
      This package has been discarded. No further actions can be taken.
    </Alert>
  );

  const displayPackageData = {
    id: packageData.package_id || packageData.id,
    actual_id: packageData.id,
    shipment_id: packageData.shipment_id,
    shipment_uuid: packageData.shipment_uuid,
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
    rackColor: packageData.rack_slot?.color ? `${packageData.rack_slot.color}` : 'N/A',
    count: packageData.rack_slot?.count ? packageData.rack_slot.count : 0,
    createdBy: packageData.created_by?.name || 'Unknown',
    createdAt: formatDateTime(Number(packageData.created_at) * 1000),
    vendor: packageData.vendor?.supplier_name || 'Unknown',
    remarks: packageData.remarks || 'No remarks',
    allowCustomerItems: packageData.allow_customer_items || false,
    shopInvoiceReceived: packageData.shop_invoice_received || false,
    items: packageItems,
    measurements: packageData.measurements?.map((measurement: any) => {
      let volumetricWeight = '-';
      if (measurement.volumetric_weight) {
        volumetricWeight = `${measurement.volumetric_weight}Kg`;
      } else if (measurement.has_measurements && measurement.length && measurement.width && measurement.height) {
        // Calculate volumetric weight: (L × W × H) / 5000 (for cm to kg)
        const calculatedVolWeight = (parseFloat(measurement.length) * parseFloat(measurement.width) * parseFloat(measurement.height)) / 5000;
        volumetricWeight = `${calculatedVolWeight.toFixed(3)}Kg`;
      }
      
      return {
        pieceNumber: measurement.piece_number,
        weight: `${measurement.weight || 0}Kg`,
        volumetricWeight: volumetricWeight,
        hasMeasurements: measurement.has_measurements || false,
        length: measurement.length,
        width: measurement.width,
        height: measurement.height
      };
    }) || []
  };

  const showInvoiceTable = 
    ['Payment Pending', 'Payment Approved', 'Ready To Ship', 'Departed']
      .includes(packageData.status.value);

  return (
    <Box sx={{ p: 1 }}>
      <TopNavbar 
        pageTitle="Packages"
        pageSubtitle={packageData.id}
      />
      {showDiscardedMessage}
      {packageItems.length === 0 && (
        <Box
          sx={{
            mb: 2,
            p: 2,
            bgcolor: '#fee2e2',
            borderRadius: 1
          }}
        >
          <Typography sx={{ color: '#b91c1c', fontWeight: 500 }}>
            Please enter package items below.
          </Typography>
        </Box>
      )}

        <PackageHeader 
          packageData={displayPackageData}
          onRefresh={async () => {
            const updated = await getPackageById(displayPackageData.id);
            setPackageData(updated);
          }}
          isDiscarded={isDiscarded}
        />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <PackageDetailsSection 
            packageData={displayPackageData}
            isRefreshing={isRefreshing}
            onRefresh={handleRefresh}
            isDiscarded={isDiscarded}
          />

          <PackageItemsSection
            packageItems={packageItems}
            setPackageItems={setPackageItems}
            isDiscarded={isDiscarded}
          />

          {showInvoiceTable && (
            <InvoiceTable 
              id={displayPackageData.actual_id}
              invoice={packageData.invoice || {id: "temp", invoice_no: "-", amount: 0, total: 0, status: "UNPAID"}}
              payment_slips={paymentSlips}
              status={packageData.status.value}
              isApprovingPayment={isApprovingPayment}
              onApprovePayment={handleApprovePayment}
              onStatusUpdated={async () => {
                const updated = await getPackageById(displayPackageData.id);
                setPackageData(updated);
                await fetchPaymentSlips(updated.shipment_uuid);
              }}
              isDiscarded={isDiscarded}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <ActionLogsSection
            packageId={displayPackageData.actual_id}
            initialStatus={displayPackageData.status}
            initialDocuments={uploadedDocuments}
            packageItems={packageItems}
            packageCreationData={{
              createdBy: displayPackageData.createdBy,
              createdAt: displayPackageData.createdAt,
            }}
            onActionLogUpdate={handleActionLogUpdate}
            isDiscarded={isDiscarded}
          />

          <PhotosDocumentsSection 
            packageData={displayPackageData}
            onUploadSuccess={handleActionLogUpdate}
            isDiscarded={isDiscarded}
          />

          <PackageChargesSection isDiscarded={isDiscarded} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PackageDetail;
