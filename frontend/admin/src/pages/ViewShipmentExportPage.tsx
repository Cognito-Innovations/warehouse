import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { getShipmentExportById, getShipmentsByBoxIds } from "../services/api.services";
import ShipmentHeader from "../components/ShipmentExport/ShipmentHeader";
import ShipmentActionsBar from "../components/ShipmentExport/ShipmentActionsBar";
import BoxesSection from "../components/ShipmentExport/BoxesSection";
import {
  addBoxToShipment,
  updateBoxInShipment,
  removeBoxFromShipment,
  addShipmentToBox,
  removeShipmentFromBox,
  updateExportStatusWithDepartedShipments,
} from "../utils/shipmentExportStateTransforms";

const ViewShipmentExportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [shipment, setShipment] = useState<any | null>(null);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const [selectedBoxShipments, setSelectedBoxShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingShipments, setLoadingShipments] = useState(false);

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

  const fetchShipmentsForBox = async (boxId: string) => {
    setLoadingShipments(true);
    try {
      const shipments = await getShipmentsByBoxIds([boxId]);
      setSelectedBoxShipments(shipments);
    } catch (error) {
      console.error(`Error fetching shipments for box ${boxId}:`, error);
      setSelectedBoxShipments([]);
    } finally {
      setLoadingShipments(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchShipment(id);
    }
  }, [id, fetchShipment]);

  useEffect(() => {
    if (selectedBoxId) {
      fetchShipmentsForBox(selectedBoxId);
    } else {
      setSelectedBoxShipments([]);
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

  const handleBoxCreated = (newBox: any) => {
    setShipment((prev: any) => addBoxToShipment(prev, newBox));
  };

  const handleBoxUpdated = (updatedBox: any) => {
    setShipment((prev: any) => updateBoxInShipment(prev, updatedBox));
  };

  const handleBoxDeleted = (boxId: string) => {
    setShipment((prev: any) => removeBoxFromShipment(prev, boxId));

    if (selectedBoxId === boxId) {
      setSelectedBoxId(null);
      setSelectedBoxShipments([]);
    }
  };

  const handlePackageAdded = (newShipment: any) => {
    setSelectedBoxShipments((prev) => [...prev, newShipment]);

    setShipment((prev: any) =>
      addShipmentToBox(prev, selectedBoxId, newShipment)
    );
  };

  const handleStatusUpdated = (newStatus: string) => {
    setShipment((prev: any) =>
      updateExportStatusWithDepartedShipments(prev, newStatus)
    );
  };

  const handleShipmentRemoved = (shipmentId: string) => {
    setSelectedBoxShipments((prev) =>
      prev.filter((s) => s.id !== shipmentId)
    );

    setShipment((prev: any) =>
      removeShipmentFromBox(prev, selectedBoxId, shipmentId)
    );
  };

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", p: 3 }}>
      <ShipmentHeader shipment={shipment} />
      
      <ShipmentActionsBar 
        selectedBoxId={selectedBoxId}
        onPackageAdded={handlePackageAdded}
        exportId={shipment.id}
        status={shipment.status}
        onStatusUpdated={handleStatusUpdated}
        selectedBoxShipments={selectedBoxShipments}
        boxes={shipment.boxes || []}
      />
      
      <BoxesSection 
        boxes={shipment.boxes || []} 
        onBoxCreated={handleBoxCreated}
        onBoxUpdated={handleBoxUpdated}
        onBoxDeleted={handleBoxDeleted}
        selectedBoxId={selectedBoxId}
        setSelectedBoxId={setSelectedBoxId}
        shipmentId={shipment.id}
        shipmentsInSelectedBox={selectedBoxShipments}
        loadingShipments={loadingShipments}
        onShipmentRemoved={handleShipmentRemoved}
        status={shipment.status}
      />
    </Box>
  );
};

export default ViewShipmentExportPage;