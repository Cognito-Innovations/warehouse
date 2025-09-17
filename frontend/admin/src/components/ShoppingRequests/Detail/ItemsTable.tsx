import {
  Card, Typography, Table, TableBody, TableContainer,
  TableHead, TableRow, TableCell,
} from '@mui/material';
import ItemsTableRow from './ItemsTableRow';
import ItemsTableSummary from './ItemsTableSummary';
import { useMemo } from 'react';

const headers = ["Item Name", "Color/Size", "Available", "Status", "Quantity", "Price", "Total"];

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
    shopping_request_products?: ShoppingRequestProduct[];
    [key: string]: any;
  };
  onItemUpdate: (index: number, updates: Partial<ShoppingRequestProduct>) => void;
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

  const summary = useMemo(() => {
    if (products.length === 0) return { subTotal: 0, commission: 0, total: 0, currency: "US" };

    const subTotal = products.reduce((acc, p) => acc + (p.unit_price || 0) * (p.quantity || 0), 0);
    const commission = subTotal * COMMISSION_RATE;

    const currency = products[0]?.currency || "US";
    const total = subTotal + commission;

    return { subTotal, commission, total, currency };
  }, [products]);

  return (
    <Card sx={{ mt: 3 }}>
      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              {headers.map(h => <TableCell key={h} sx={{fontWeight: 600}}>{h}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? (
              products.map((item, i) => ( 
                <ItemsTableRow 
                  key={item.id} 
                  item={{...item, remarks: details.remarks }} 
                  index={i}
                  onUpdate={(updates) => onItemUpdate(i, updates)}
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
  );
}

export default ItemsTable;