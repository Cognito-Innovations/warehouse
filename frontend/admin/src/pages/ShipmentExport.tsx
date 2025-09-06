import React from 'react';
import { Box } from '@mui/material';

import TopNavbar from '../components/Layout/TopNavbar';
import ShipmentExportTable from '../components/ShipmentExport/ShipmentExportTable';

const ShipmentExport: React.FC = () => {

  return (
    <Box>
      <TopNavbar pageTitle="Shipment" pageSubtitle="Export" />
      <ShipmentExportTable />
    </Box>
  );
};

export default ShipmentExport;