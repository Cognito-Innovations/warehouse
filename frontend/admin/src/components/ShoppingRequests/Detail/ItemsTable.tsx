import {
  Card, Typography, Table, TableBody, TableContainer,
  TableHead, TableRow, TableCell,
} from '@mui/material';
import ItemsTableRow from './ItemsTableRow';
import ItemsTableSummary from './ItemsTableSummary';
import { useMemo, useState } from 'react';

const headers = ["Item Name", "Color/Size", "Available", "Status", "Quantity", "Unit Price", "Total"];

interface ShoppingRequestProduct {
  id?: number;
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
}

const COMMISSION_RATE = 0.08;
const GST_RATE = 0.08;

const currencySymbols: Record<string, string> = {
  IN: "₹",
  US: "$",
  EU: "€",
  UK: "£",
};

const ItemsTable: React.FC<ItemsTableProps> = ({ details }) => {
  const [products, setProducts] = useState<ShoppingRequestProduct[]>(details.shopping_request_products ?? []);

  const handleUpdate = (index: number, updates: Partial<ShoppingRequestProduct>) => {
    setProducts(prev => {
      const newProducts = [...prev];
      newProducts[index] = { ...newProducts[index], ...updates };
      return newProducts;
    });
  };

  const summary = useMemo(() => {
    if (products.length === 0) return { subTotal: 0, commission: 0, gst: 0, total: 0, currency: "US" };

    const subTotal = products.reduce((acc, p) => acc + (p.unit_price || 0) * (p.quantity || 0), 0);
    const commission = subTotal * COMMISSION_RATE;

    const currency = products[0]?.currency || "US";
    const gst = currency === "IN" ? subTotal * GST_RATE : 0;
    const total = subTotal + commission + gst;

    return { subTotal, commission, gst, total, currency };
  }, [products]);

  return (
    <Card sx={{ mt: 3 }}>
      {/* TODO: Uncomment when functionality implemented */}
      {/* <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={600}>Links / Items</Typography>
        <Button variant="contained" size="small" sx={{textTransform: 'none'}}>Map Items</Button>
      </Box> */}
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
                  key={i} 
                  item={{...item, remarks: details.remarks }} 
                  index={i}
                  onUpdate={(updates) => handleUpdate(i, updates)}
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