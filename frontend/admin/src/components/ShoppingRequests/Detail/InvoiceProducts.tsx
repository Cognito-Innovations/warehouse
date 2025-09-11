import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { type InvoiceDetails } from "./InvoiceRow";

export default function InvoiceProducts({ products }: { products?: InvoiceDetails["products"] }) {
  if (!products?.length) return null;

  return (
    <>
      <Typography variant="subtitle2" gutterBottom>
        Products
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Item Name</TableCell>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((p, idx) => (
            <TableRow key={idx}>
              <TableCell>{p.name}</TableCell>
              <TableCell>${Number(p.unit_price).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
