import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { getPackagesByBoxId, getShipmentExportById } from "../services/api.services";
import ShipmentHeader from "../components/ShipmentExport/ShipmentHeader";
import ShipmentActionsBar from "../components/ShipmentExport/ShipmentActionsBar";
import BoxesSection from "../components/ShipmentExport/BoxesSection";

const ViewShipmentExportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [shipment, setShipment] = useState<any | null>(null);
  const [selectedBoxId, setSelectedBoxId] = useState<number | null>(null);
  const [selectedBoxPackages, setSelectedBoxPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPackages, setLoadingPackages] = useState(false);

  const fetchShipment = useCallback(async (shipmentId: string) => {
    setLoading(true);
    try {
      const data = await getShipmentExportById(shipmentId);
      setShipment(data);
    } catch (err) {
      console.error("Error fetching shipment:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPackagesForBox = async (boxId: number) => {
    setLoadingPackages(true);
    try {
      const packages = await getPackagesByBoxId(boxId);
      setSelectedBoxPackages(packages);
    } catch (error) {
      console.error(`Error fetching packages for box ${boxId}:`, error);
      setSelectedBoxPackages([]);
    } finally {
      setLoadingPackages(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchShipment(id);
    }
  }, [id, fetchShipment]);

  useEffect(() => {
    if (selectedBoxId) {
      fetchPackagesForBox(selectedBoxId);
    } else {
      setSelectedBoxPackages([]);
    }
  }, [selectedBoxId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!shipment) {
    return <div>Shipment not found</div>;
  }

  const handleBoxAdded = () => {
    if (id) {
      fetchShipment(id);
    }
  };

  const handlePackageAdded = () => {
    if (selectedBoxId) {
      fetchPackagesForBox(selectedBoxId);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", p: 3 }}>
      <ShipmentHeader shipment={shipment} />
      
      <ShipmentActionsBar 
        selectedBoxId={selectedBoxId}
        onPackageAdded={handlePackageAdded}
        hasShipments={selectedBoxPackages.length > 0}
        exportId={shipment.id}
        status={shipment.status}
        onStatusUpdated={(newStatus) => setShipment({ ...shipment, status: newStatus })}
      />
      
      <BoxesSection 
        boxes={shipment.boxes || []} 
        onBoxAdded={handleBoxAdded}
        selectedBoxId={selectedBoxId}
        setSelectedBoxId={setSelectedBoxId}
        shipmentId={shipment.id}
        packagesInSelectedBox={selectedBoxPackages}
        loadingPackages={loadingPackages}
        refreshPackages={handlePackageAdded}
      />
    </Box>
  );
};

export default ViewShipmentExportPage;