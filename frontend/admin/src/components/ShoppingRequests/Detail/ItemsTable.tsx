import {
  Card, Typography, Table, TableBody, TableContainer,
  TableHead, TableRow, TableCell, Box,
} from '@mui/material';
import ItemsTableRow from './ItemsTableRow';
import ItemsTableSummary from './ItemsTableSummary';
import { useMemo } from 'react';

const headers = [
  { key: "select", label: "" },
  { key: "name", label: "Item Name" },
  { key: "colorSize", label: "Color/Size" },
  { key: "available", label: "Available" },
  { key: "status", label: "Status" },
  { key: "quantity", label: "Quantity" },
  { key: "price", label: "Price" },
  { key: "total", label: "Total" },
  { key: "actions", label: "" },
];

interface ShoppingRequestProduct {
  id?: string;
  name?: string;
  quantity: number;
  unit_price?: number | null;
  currency?: string;
  available?: boolean;
  [key: string]: any;
}

interface ItemsTableProps {
  details: {
    status: string;
    shopping_request_products?: ShoppingRequestProduct[];
    [key: string]: any;
  };
  onItemUpdate: (itemId: string, updates: Partial<ShoppingRequestProduct>) => void;
  onSelectionChange: (itemId: string, isSelected: boolean) => void;
}

const COMMISSION_RATE = 0.08;

const currencySymbols: Record<string, string> = {
  IN: "₹",
  US: "$",
  EU: "€",
  UK: "£",
};

const ItemsTable: React.FC<ItemsTableProps> = ({ details, onItemUpdate, onSelectionChange }) => {
  const products = details.shopping_request_products ?? [];

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => (a.id && b.id ? a.id.localeCompare(b.id) : 0));
  }, [products]);

  const summary = useMemo(() => {
    if (products.length === 0) return { subTotal: 0, commission: 0, total: 0, currency: "US" };

    const subTotal = products.reduce((acc, p) => acc + (p.unit_price || 0) * (p.quantity || 0), 0);
    const commission = subTotal * COMMISSION_RATE;

    const currency = products[0]?.currency || "US";
    const total = subTotal + commission;

    return { subTotal, commission, total, currency };
  }, [products]);

  return (
    <Box sx={{ p: 0 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Links / Items
        </Typography>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                {headers.map((header) => (
                  <TableCell
                    key={header.key}
                    sx={{ fontWeight: 600, color: 'text.secondary' }}
                  >
                    {header.label || null}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedProducts.length > 0 ? (
                sortedProducts.map((item, i) => ( 
                  <ItemsTableRow 
                    key={item.id} 
                    item={{...item, remarks: details.remarks }} 
                    index={i}
                    requestStatus={details.status}
                    onUpdate={(updates) => {
                      if (item.id) {
                        onItemUpdate(item.id, updates)
                      }
                    }}
                    onSelectionChange={onSelectionChange}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No items found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <ItemsTableSummary summary={summary} currencySymbol={currencySymbols[summary.currency] || "$"} />
      </Card>
    </Box>
  );
}

export default ItemsTable;