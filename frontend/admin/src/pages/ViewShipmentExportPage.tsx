import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";

import ShipmentHeader from "../components/ShipmentExport/ShipmentHeader";
import ShipmentActionsBar from "../components/ShipmentExport/ShipmentActionsBar";
import { useParams } from "react-router-dom";
import BoxesSection from "../components/ShipmentExport/BoxesSection";
import { getShipmentExportById } from "../services/api.services";

const ViewShipmentExportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [shipment, setShipment] = useState<any | null>(null);
  const [selectedBoxId, setSelectedBoxId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (id) {
      fetchShipment(id);
    }
  }, [id]);

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

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", p: 3 }}>
      <ShipmentHeader shipment={shipment} />
      <ShipmentActionsBar selectedBoxId={selectedBoxId} />
      <BoxesSection 
        boxes={shipment.boxes || []} 
        selectedBoxId={selectedBoxId}
        setSelectedBoxId={setSelectedBoxId}
        shipmentId={shipment.id}
      />
    </Box>
  );
};

export default ViewShipmentExportPage;