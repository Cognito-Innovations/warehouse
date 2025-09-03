import React, { useState } from 'react';
import { Box } from '@mui/material';

import TopNavbar from '../components/Layout/TopNavbar';
import ShipmentExportTable from '../components/ShipmentExport/ShipmentExportTable';
import ViewShipmentExport from '../components/ShipmentExport/ViewShipmentExport';
import { shipmentExports } from '../data/shipmentExports';

const ShipmentExport: React.FC = () => {
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
            pageTitle="Shipment" 
            pageSubtitle="Export / View" 
          />
          <ViewShipmentExport shipment={selectedShipment} />
        </>
      ) : (
        <>
          <TopNavbar pageTitle="Shipment" pageSubtitle="Export" />
          <ShipmentExportTable onViewShipment={handleViewShipment} />
        </>
      )}
    </Box>
  );
};

export default ShipmentExport;