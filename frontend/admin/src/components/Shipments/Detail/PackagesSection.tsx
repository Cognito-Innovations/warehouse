import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import PackageRow from "../PackageRow";
import type React from "react";

interface PackagesSectionProps {
    packages: any[];
}

const PackagesSection: React.FC<PackagesSectionProps> = ({ packages }) => {
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
              Packages ({packages.length})
            </Typography>
            
            <Box sx={{ 
              bgcolor: 'white', 
              borderRadius: 2, 
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              width: '100%'
            }}>
              <Table size="small" sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow sx={{ 
                    bgcolor: '#f1f5f9',
                    '& > *': { 
                      border: 'none',
                      fontWeight: 600,
                      color: '#374151',
                      fontSize: '0.875rem',
                      py: 1.5
                    } 
                  }}>
                    <TableCell sx={{ width: 40 }} />
                    <TableCell sx={{ width: 40 }} />
                    <TableCell>Package No.</TableCell>
                    <TableCell>Rack</TableCell>
                    <TableCell>Tracking No.</TableCell>
                    <TableCell>Received At</TableCell>
                    <TableCell align="right">Weight</TableCell>
                    <TableCell align="right">Vol. Weight</TableCell>
                    <TableCell sx={{ width: 80 }} />
                  </TableRow>
                </TableHead>

                <TableBody>
                  {packages.map((pkg, i) => (
                    <PackageRow 
                      key={pkg.id} 
                      item={pkg} 
                      index={i} 
                      isLast={i === packages.length - 1}
                    />
                  ))}
                </TableBody>
              </Table>
            </Box>
        </Box>
    )
}

export default PackagesSection;