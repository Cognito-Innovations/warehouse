import type React from "react";
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

import { useShipmentDetail } from "../../../contexts/ShipmentDetailContext";
import PackageRow from "../PackageRow";

const PackagesSection: React.FC = () => {
  const { shipment, isDiscarded, fetchShipments } = useShipmentDetail();

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: '#374151',
          mb: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        Packages ({shipment.packages.length})
      </Typography>
        
      <Box sx={{ 
        bgcolor: 'white', 
        borderRadius: 2, 
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        width: '100%'
      }}>
        <Table
          size="small"
          sx={{
            tableLayout: "auto",
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            '& td, & th': {
              paddingY: 1,
              paddingX: 1.5,
            }
          }}>
          <TableHead>
            <TableRow sx={{ 
              bgcolor: '#f1f5f9',
              '& > *': { 
                border: 'none',
                fontWeight: 600,
                color: "#6b7280",
                fontSize: '0.875rem',
                py: 1.5
              } 
            }}>
              <TableCell sx={{ fontWeight: 600, color: "#6b7280",width: 200, textAlign: "center" }}>Package No.</TableCell>
              <TableCell>Rack</TableCell>
              <TableCell>Tracking No.</TableCell>
              <TableCell>Received At</TableCell>
              <TableCell>Weight</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#6b7280", width: 100 }}>Vol. Weight</TableCell>
              <TableCell sx={{ width: 80 }} />
            </TableRow>
          </TableHead>

          <TableBody>
            {shipment.packages.map((pkg, i) => (
              <PackageRow 
                key={pkg.id} 
                item={pkg} 
                index={i}
                showCancel
                shipmentId={shipment.id}
                onPackageRemoved={fetchShipments}
                isDiscarded={isDiscarded}
              />
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  )
}

export default PackagesSection;