import React, { useState, useEffect, useCallback } from 'react';
import { Box, Grid, CircularProgress, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { getPackageById, updatePackageStatus, getPackageDocuments, getPaymentSlips, getShipmentDocuments } from '../services/api.services';
import TopNavbar from '../components/Layout/TopNavbar';
import PackageHeader from '../components/PackageDetail/PackageHeader';
import ActionLogsSection from '../components/PackageDetail/ActionLogsSection';
import PackageItemsSection from '../components/PackageDetail/PackageItemsSection';
import PackageDetailsSection from '../components/PackageDetail/PackageDetailsSection';
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
  const [shipmentDocuments, setShipmentDocuments] = useState<any[]>([]);
  const [packageItems, setPackageItems] = useState<any[]>([]);
  const [isApprovingPayment, setIsApprovingPayment] = useState(false);
  const [paymentSlips, setPaymentSlips] = useState<any[]>([]);

  const fetchDocuments = async (id: string) => {
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

  const fetchShipmentDocuments = async (package_uuid: string) => {
    if (!package_uuid) {
      setShipmentDocuments([]);
      return;
    }
    try {
     const docs = await getShipmentDocuments(package_uuid);
     setShipmentDocuments(docs);
    } catch (err) {
      console.error('Failed to fetch shipment documents:', err);
      toast.error('Failed to load shipment documents.');
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
      const data = await getPackageById(id) as any; //TODO: Remove any
      setPackageData(data);
      setPackageItems(data.items || []);
      await Promise.allSettled([
        fetchPaymentSlips(data.shipment_uuid),
        fetchDocuments(data.id),
        fetchShipmentDocuments(data.id)
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
      const data = await getPackageById(id) as any; //TODO: Remove any
      setPackageData(data);
      setPackageItems(data.items || []);
      await fetchPaymentSlips(data.shipment_uuid);
      await fetchDocuments(data.id);
      await fetchShipmentDocuments(data.id);
    } catch (err) {
      console.error('Failed to refetch package data:', err);
      toast.error('Failed to refresh package details');
    }
  };

  const getInvoice = (packageData: any) => {
    const invoice = packageData.invoice;
    if (invoice > 0) {
      return invoice;
    } else if (packageData.charges.length > 0) {
      const charges = packageData.charges[0];
      return {id: "charges", invoice_no: "Package Charges", amount: charges.amount, total: charges.amount, status: "UNPAID"};
    } else {
      return {id: "temp", invoice_no: "-", amount: 0, total: 0, status: "UNPAID"};
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

  const showInvoiceTable = 
    ['Payment Pending', 'Payment Approved', 'Ready To Ship', 'Departed']
      .includes(packageData.status.value);

  return (
    <Box sx={{ p: 1 }}>
      <TopNavbar 
        pageTitle="Packages"
        pageSubtitle={packageData.package_id}
      />
      {showDiscardedMessage}

        <PackageHeader 
          packageData={packageData}
          onRefresh={async () => {
            const updated = await getPackageById(packageData.package_id);
            setPackageData(updated);
          }}
          isDiscarded={isDiscarded}
        />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <PackageDetailsSection 
            packageData={packageData}
            isRefreshing={isRefreshing}
            onRefresh={handleRefresh}
            isDiscarded={isDiscarded}
          />

          <PackageItemsSection
            id={packageData.package_id}
            packageItems={packageItems}
            setPackageItems={setPackageItems}
            isDiscarded={isDiscarded}
          />

          {showInvoiceTable && (
            <InvoiceTable 
              id={packageData.id}
              invoice={getInvoice(packageData)}
              payment_slips={paymentSlips}
              status={packageData.status.value}
              isApprovingPayment={isApprovingPayment}
              onApprovePayment={handleApprovePayment}
              onStatusUpdated={async () => {
                const updated = await getPackageById(packageData.package_id);
                setPackageData(updated);
                await fetchPaymentSlips(updated.shipment_uuid);
              }}
              isDiscarded={isDiscarded}
            />
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <ActionLogsSection
            packageId={packageData.id}
            initialStatus={packageData.status}
            initialDocuments={uploadedDocuments}
            packageCreationData={{
              createdBy: packageData.created_by?.name,
              createdAt: formatDateTime(Number(packageData.created_at)),
            }}
            onActionLogUpdate={handleActionLogUpdate}
            isDiscarded={isDiscarded}
          />

          <PhotosDocumentsSection 
            packageData={packageData}
            documents={shipmentDocuments}
            onUploadSuccess={handleActionLogUpdate}
            isDiscarded={isDiscarded}
          />

        </Grid>
      </Grid>
    </Box>
  );
};

export default PackageDetail;
