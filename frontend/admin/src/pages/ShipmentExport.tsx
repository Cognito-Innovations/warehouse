import React, { useState } from 'react';
import { Box } from '@mui/material';
import TopNavbar from '../components/Layout/TopNavbar';
import ShipmentExportTable from '../components/ShipmentExport/ShipmentExportTable';
import { shipmentExports } from '../data/shipmentExports';
import ViewShipmentExport from '../components/ShipmentExport/ViewShipmentExport';

interface ShipmentExportProps {
  onToggleSidebar: () => void;
}

const ShipmentExport: React.FC<ShipmentExportProps> = ({ onToggleSidebar }) => {
  const [viewShipmentId, setViewShipmentId] = useState<string | null>(null);

  const handleViewShipment = (id: string) => {
    setViewShipmentId(id);
  };

  const selectedShipment = shipmentExports.find(s => s.id === viewShipmentId);

  return (
    <Box>
      {viewShipmentId && selectedShipment ? (
        <>
          <TopNavbar 
            title="Shipment" 
            subtitle="/ Export / View" 
            onToggleSidebar={onToggleSidebar} 
          />
          <ViewShipmentExport shipment={selectedShipment} />
        </>
      ) : (
        <>
          <TopNavbar title="Shipment" subtitle="/ Export" onToggleSidebar={onToggleSidebar} />
          <ShipmentExportTable onViewShipment={handleViewShipment} />
        </>
      )}
    </Box>
  );
};

export default ShipmentExport;