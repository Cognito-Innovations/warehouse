import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";

import ShipmentHeader from "../components/ShipmentExport/ShipmentHeader";
import ShipmentActionsBar from "../components/ShipmentExport/ShipmentActionsBar";
import { useParams } from "react-router-dom";
import BoxesSection from "../components/ShipmentExport/BoxesSection";
import { getPackagesByBoxId, getShipmentExportById } from "../services/api.services";

const ViewShipmentExportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [shipment, setShipment] = useState<any | null>(null);
  const [selectedBoxId, setSelectedBoxId] = useState<number | null>(null);
  const [selectedBoxPackages, setSelectedBoxPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPackages, setLoadingPackages] = useState(false);

  const fetchShipment = async (shipmentId: string) => {
    try {
      const data = await getShipmentExportById(shipmentId);
      setShipment(data);
    } catch (err) {
      console.error("Error fetching shipment:", err);
    } finally {
      setLoading(false);
    }
  };

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
  }, [id]);

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
      />
      <BoxesSection 
        boxes={shipment.boxes || []} 
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